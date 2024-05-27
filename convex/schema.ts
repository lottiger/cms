import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  admins: defineTable({
    email: v.string(),
    userId: v.string(),
  }),
  pages: defineTable({
    name: v.string(),
    content: v.string(),
  }).index('by_name', ['name']),

  events: defineTable({
    title: v.string(),
    date: v.string(),
    description: v.string(),
    imageId: v.id("_storage"),
    location: v.string(),
    price: v.number(),
    seats: v.number(),
}),

  bookings: defineTable({
    id: v.id('bookings'),
    userId: v.id('_user'),
    eventId: v.id('events'),
}),

})