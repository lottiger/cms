import { ConvexError, v } from "convex/values";
import { mutation, query, action, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { checkIfAdmin } from "./admins";



export const createEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        date: v.string(),
        location: v.string(),
        price: v.number(),
        seats: v.number(),
        imageId: v.id ("_storage"),
        
    },

    
    handler: async (ctx, {title, description, date, location, price, seats, imageId}) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) 
            throw new ConvexError("Unauthenticated")
        
        await ctx.db.insert("events", { imageId, title, description, date, location, price, seats})
      

    }
})

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        
        const events = await ctx.db.query("events").collect()

        const eventsImageUrls = await Promise.all(events.map(async (event) => {
            let imageUrl = null;
            try {
                imageUrl = await ctx.storage.getUrl(event.imageId);
            } catch (error) {
                console.error(`Failed to get image URL for imageId ${event.imageId}: ${error}`);
            }

            return {
                ...event,
                image: imageUrl
            };
        }))

        const eventsWithBookings = await Promise.all(eventsImageUrls.map(async (event) => {
            const bookings = await ctx.db.query("bookings").filter(q => q.eq(q.field("eventId"), event._id)).collect()
            return {
                ...event,
                bookings: bookings.length
            }
        }))

        return eventsWithBookings
    }
})

export const getBooked = query({
  args: {
      userId: v.string()
  },
  handler: async (ctx, {userId}) => {
      try {
          const bookings = await ctx.db.query("bookings").filter(q => q.eq(q.field("userId"), userId)).collect()

          const events = await Promise.all(bookings.map(async (booking) => {
              const event = await ctx.db.get(booking.eventId)
              console.log(event)
              if (!event) {
                  throw new Error(`Event with id ${booking.eventId} not found`);
              }

              const imageUrl = event.imageId ? await ctx.storage.getUrl(event.imageId) : null

              return {
                  ...event,
                  image: imageUrl
              }
          }))

          return events
      } catch (error) {
          console.error(`Failed to fetch events for user ${userId}: ${error}`);
          throw new ConvexError(error.message);
      }
  }
})


// Hämtar enskillt event + om användaren är bokad
export const getById = query({
    args: {
      eventId: v.id("events"),
      userId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
  
      const event = await ctx.db.get(args.eventId)

      let eventsWithBookings


      if(args.userId) {
        const booking = await ctx.db.query("bookings").filter(q => q.and(q.eq(q.field("eventId"), args.eventId), q.eq(q.field("userId"), args.userId))).first()
  
        eventsWithBookings = {
          ...event,
          image: event.imageId ? await ctx.storage.getUrl(event.imageId) : undefined,
          booked: !!booking
        }
      }
      else {
        eventsWithBookings = {
          ...event,
          image: event.imageId ? await ctx.storage.getUrl(event.imageId) : undefined
        }
      }

      const bookings = await ctx.db.query("bookings").filter(q => q.eq(q.field("eventId"), args.eventId)).collect()
      return {
        ...eventsWithBookings,
        bookings: bookings.length
      }
  
    }
  })

  export const updateEvent = mutation({
    args: {
      id: v.id('events'),
      title: v.string(),
      description: v.string(),
      date: v.string(),
      location: v.string(),
      price: v.number(),
      seats: v.number(),
      imageId: v.id ("_storage"),
    },


    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity()
      if(!identity) throw new ConvexError('Unauthorized')
  

      return await ctx.db.patch(args.id, {
        title: args.title,
        description: args.description,
        date: args.date,
        location: args.location,
        price: args.price,
        seats: args.seats,
        imageId: args.imageId ? args.imageId : undefined
      })
    }
  })

  export const deleteEvent = action({
    args: {
      id: v.id("events")
  
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity()
      if(!identity) throw new ConvexError('Unauthorized')

      const event = await ctx.runQuery(api.events.getById, { eventId: args.id })
  
      await ctx.runMutation(internal.events.deleteForReal, { eventId: event._id, imageId: event.imageId })
    }
  })
  
  export const deleteForReal = internalMutation({
    args: {
        eventId: v.id('events'),
        imageId: v.id ("_storage"),
    },
    handler: async (ctx, args) => {
    const bookings = await ctx.db.query("bookings").filter(q => q.eq(q.field("eventId"), args.eventId)).collect()
    Promise.all(bookings.map(async booking => {
      await ctx.db.delete(booking._id)
    }
    ))
      await ctx.db.delete(args.eventId)
      await ctx.storage.delete(args.imageId)
    }
  })




 export const removeBooking = mutation({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        // const identity = await ctx.auth.getUserIdentity()
        // if (!identity) throw new ConvexError("Unauthenticated")

        const bookings = await ctx.db.query("bookings").filter(q => q.eq(q.field("eventId"), args.eventId)).collect()

        // await ctx.db.delete(booking._id)
        await Promise.all(bookings.map(async booking => {
            await ctx.db.delete(booking._id)
        }))
    }
})