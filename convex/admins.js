import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const checkIfAdmin = async (ctx, userId) => {
  const admin = await ctx.db.query('admins').filter(q => q.eq(q.field('userId'), userId)).unique()

    if(!admin) return false
    else return true
}

export const checkAdmin = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db.query('admins').filter(q => q.eq(q.field('userId'), args.userId)).unique()

    if(!admin) return false
    else return true
  }
})

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if(! await checkIfAdmin(ctx, identity.subject)) {
      throw new ConvexError('Unauthorized')
    }

    return await ctx.db.query('admins').collect()
  }
})

export const makeAdmin = mutation({
  args: {
    userId: v.string(),
    email: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if(! await checkIfAdmin(ctx, identity.subject)) {
      throw new ConvexError('Unauthorized')
    }

    await ctx.db.insert('admins', { userId: args.userId, email: args.email })
  } 
})

export const removeAdmin = mutation({
  args: { id: v.id('admins') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if(! await checkIfAdmin(ctx, identity.subject)) {
      throw new ConvexError('Unauthorized')
    }

    await ctx.db.delete(args.id)
  }
})