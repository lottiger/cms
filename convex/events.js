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

        return eventsImageUrls
    }
})


export const getById = query({
    args: {
      eventId: v.id("events")
    },
    handler: async (ctx, args) => {
  
      const event = await ctx.db.get(args.eventId)
  
      return {
        ...event,
        image: event.imageId ? await ctx.storage.getUrl(event.imageId) : undefined
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
      await ctx.db.delete(args.eventId)
      await ctx.storage.delete(args.imageId)
    }
  })




 