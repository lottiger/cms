'use client'

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Toaster } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Edit from './_components/edit-form';







     function CollectionDetailsPage({ params }) {

    const router = useRouter()
        
     const event = useQuery(api.events.getById, { eventId: params.id })
   if(!event) return(
    <div>
        <p>Event not found</p>
    </div>
   )

    return (

       <div className="mx-10">
        <h1 className="text-6xl font-semibold text-center mb-10">Edit Event</h1>
        <Toaster />
        <Edit event={event}/>
       </div>
    )
}
export default CollectionDetailsPage

// 'use client'
// import { api } from "@/convex/_generated/api"
// import { useMutation, useQuery } from "convex/react"
// import { Loader2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"
// import Edit from "./_components/edit-form"


// function CollectionDetailsPage({ params }) {

//   const router = useRouter()

//   const event = useQuery(api.events.getById, { eventId: params.id })
//   const deleteEvent = useMutation(api.events.deleteEvent)

//   const handleDeleteEvent = async () => {
//     await deleteEvent({ id: event._id })
//     router.replace('/admin/collections/events')
//   }

//   if(!event) return (
//     <div className="h-full flex items-center justify-center">
//       <Loader2 className="size-10 animate-spin" />
//     </div>
//   )
//   return (
//     <div className="px-10">
//       <h1 className="text-6xl font-bold text-center my-10">Edit event</h1>
//       <div className="flex justify-end">
//         <Button variant="destructive" onClick={handleDeleteEvent}>Delete</Button>
//       </div>
//       <Edit event={event} />
//     </div>
//   )
// }
// export default CollectionDetailsPage