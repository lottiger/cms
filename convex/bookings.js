import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const bookSeat = mutation({
    args: {
      eventId: v.id('events'),
      userId: v.string() 
    },
    handler: async (ctx, { eventId, userId }) => {
        const event = await ctx.db.get(eventId);
        if (!event || event.seats <= 0) {
            throw new ConvexError("No seats available");
        }

        await ctx.db.patch(eventId, { seats: event.seats - 1 });
        await ctx.db.insert("bookings", { eventId, userId });
    }
});


export const cancelBooking = mutation({
  args: { 
    eventId: v.id('events'),
    userId: v.string()
  },
  handler: async (ctx, { eventId, userId }) => {
      const event = await ctx.db.get(eventId);
      const booking = await ctx.db.query("bookings").filter(q => q.and(q.eq(q.field("eventId"), eventId), q.eq(q.field("userId"), userId))).first();

      if (!event || !booking) {
          throw new ConvexError("No booking found");
      }

      await ctx.db.patch(eventId, { seats: event.seats + 1 });
      await ctx.db.delete(booking._id);
  }
});
  
export const getByEventId_userId = query({
    args: {
      eventId: v.id('events'),
      userId: v.string()
    },
    handler: async (ctx, { eventId, userId }) => {
      return await ctx.db.query("bookings").filter(q => q.and(q.eq(q.field("eventId"), eventId), q.eq(q.field("userId"), userId))).first();
    }
  });
  