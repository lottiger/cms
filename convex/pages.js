import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkIfAdmin } from "./admins";

export const addOrUppdatePage = mutation({
args:{
name: v.string(),
content: v.string(),
userId: v.string()
},
handler: async (ctx, args) => {
    

    if (!await checkIfAdmin(ctx, args.userId)) {
        throw new ConvexError('Unauthorized')
    }

    const page = await ctx.db.query('pages')
        .withIndex('by_name', q => q.eq('name', args.name))
        .first()

        if(page){
            return await ctx.db.patch(page._id, {content: args.content})
    }
    else{
        return await ctx.db.insert('pages', {
            name: args.name,
            content: args.content   
        })
    }

    
   }
})

export const getPage = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const page = await ctx.db.query('pages')
            .withIndex('by_name', q => q.eq('name', args.name))
            .first()

            return page

       
    }
})