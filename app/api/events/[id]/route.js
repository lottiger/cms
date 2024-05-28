import { api } from "@/convex/_generated/api";
import { clerkClient } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {

  console.log(params)
  const event = await fetchQuery(api.events.getById, { eventId: params.id })

  return NextResponse.json(event, { status: 200 })
}





// Endpoint for booking a seat

export async function POST(request, { params }) {
  const {userId} = await request.json()
  try {
    // Hämta användarlistan från Clerk
    const {data} = await clerkClient.users.getUserList();

    
    // Kontrollera om användaren finns
    if (!data.some(user => user.id == userId)){
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hämta eventet baserat på params.eventId
    const event = await fetchQuery(api.events.getById, { eventId: params.id });
    
    // Kontrollera om eventet finns och har tillgängliga platser
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const booking = await fetchQuery(api.bookings.getByEventId_userId, { eventId: params.id, userId });

    if (booking) {
      await fetchMutation(api.bookings.cancelBooking, { eventId: params.id, userId });
      return NextResponse.json({ status: 'Booking cancelled' }, { status: 200 });
    }

    if (event.seats > 0) {
     
      await fetchMutation(api.bookings.bookSeat, {userId, eventId: params.id})

      return NextResponse.json({ status: 'Seat booked' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No seats available' }, { status: 400 });
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
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