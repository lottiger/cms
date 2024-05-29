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
    console.error(error);
    return NextResponse.json({ message: 'An error occurred while fetching the events.' }, { status: 500 });
  }
}