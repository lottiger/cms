import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if(id) {
      const events = await fetchQuery(api.events.getBooked,{ userId: id });
      return NextResponse.json(events, { status: 200 });
    }
    else {
      const events = await fetchQuery(api.events.getAll);
      return NextResponse.json(events, { status: 200 });
    }
  } catch (error) {
    console.error(`Error fetching events for user ${id}:`, error);
    return NextResponse.json({ message: 'An error occurred while fetching the events.', details: error.message }, { status: 500 });
  }
}

// export async function POST(request) {
//   const { eventId} = await request.json();
//   try {
//     const response = await fetchMutation(api.events.removeBooking, { eventId });
//     return NextResponse.json(response, { status: 200 });
//   } catch (error) {
//     console.error(`Error creating event:`, error);
//     return NextResponse.json({ message: 'An error occurred while removing the bookings.', details: error.message }, { status: 500 });
//   }
// }