import { Toaster } from "react-hot-toast";

import Create from "./_components/create-form";




export default function CreatePage() {

   
    return (

       <div className="mx-10">
        <h1 className="text-6xl font-semibold text-center mb-10">Create Event</h1>
       <Create />
       <Toaster />
       
       </div>
    )
}