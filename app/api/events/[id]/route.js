import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {

  console.log(params)
  const event = await fetchQuery(api.events.getById, { eventId: params.id })

  return NextResponse.json(event, { status: 200 })
}

// plats för att avboka en biljett