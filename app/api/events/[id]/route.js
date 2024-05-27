import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {

  console.log(params)
  const event = await fetchQuery(api.events.getById, { eventId: params.id })

  return NextResponse.json(event, { status: 200 })
}
// Endpoint for booking a seat
export async function POST(request, { params }) {
  const user = await fetchQuery(api.users.getById, { userId: params.userId });
  const event = await fetchQuery(api.events.getById, { eventId: params.eventId });

  if (event.seats > 0) {
    const updatedEvent = { ...event, seats: event.seats - 1 };
    user.bookedEvents.push(event.id);
    await fetchQuery(api.users.update, user);
    await fetchQuery(api.events.update, updatedEvent);
  }

  return NextResponse.json({ status: 'Seat booked' }, { status: 200 });
}

// Endpoint for cancelling a booking
export async function DELETE(request, { params }) {
  const user = await fetchQuery(api.users.getById, { userId: params.userId });
  const event = await fetchQuery(api.events.getById, { eventId: params.eventId });

  const index = user.bookedEvents.indexOf(event.id);
  if (index > -1) {
    user.bookedEvents.splice(index, 1);
    const updatedEvent = { ...event, seats: event.seats + 1 };
    await fetchQuery(api.users.update, user);
    await fetchQuery(api.events.update, updatedEvent);
  }

  return NextResponse.json({ status: 'Booking cancelled' }, { status: 200 });
}