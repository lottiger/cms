import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const bookSeat = query({
    args: {
      eventId: v.id('events'),
      userId: v.id('_user') 
    },
    handler: async (ctx, { eventId, userId }) => {
        const event = await ctx.db.query("events").get(eventId);
        if (!event || event.seats <= 0) {
            throw new ConvexError("No seats available");
        }

        await ctx.db.update("events", eventId, { seats: event.seats - 1 });
        await ctx.db.insert("bookings", { eventId, userId });
    }
});

export const cancelBooking = query({
  args: { 
    eventId: v.id('events'),
    userId: v.id('_user') 
  },
  handler: async (ctx, { eventId, userId }) => {
      const event = await ctx.db.query("events").get(eventId);
      const booking = await ctx.db.query("bookings").filter({ eventId, userId }).first();

      if (!event || !booking) {
          throw new ConvexError("No booking found");
      }

      await ctx.db.update("events", eventId, { seats: event.seats + 1 });
      await ctx.db.delete("bookings", booking.id);
  }
});
  