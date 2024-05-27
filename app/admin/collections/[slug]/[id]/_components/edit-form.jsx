'use client'



import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { ImagePicker } from "@/app/admin/_components/image-picker";







export default function Edit({event}) {

   

const router = useRouter()

    const generateUploadUrl = useMutation(api.images.generateUploadUrl)
    const updateEvent = useMutation(api.events.updateEvent)
    const deleteEvent = useAction(api.events.deleteEvent)
    const deleteImage = useMutation(api.images.deleteImage)

    const [imageSrc, setImageSrc] = useState(event?.image || null)
   
    const [selectedImage, setSelectedImage] = useState(null)
    const [title, setTitle] = useState(event.title)
    const [description, setDescription] = useState(event.description)
    const [date, setDate] = useState(event.date)
    const [location, setLocation] = useState(event.location)
    const [price, setPrice] = useState(event.price)
    const [seats,setSeats] = useState(event.seats)

    

   
    const handleSubmit = async e => {
        e.preventDefault()

        if(title.trim() == '' || description.trim() == '' || date.trim() == '' || location.trim() == '' || price == 0 || seats == 0) 
            return
       
            let imgData

            if(selectedImage !== null) {

                try {
                    await deleteImage ({storageId: event.imageId})

                } catch (error) {
                    console.log(error.message)
                }

                const postUrl = await generateUploadUrl()
                const result = await fetch(postUrl, {
                    method: 'POST',
                    headers: {'Content-Type': selectedImage.type},
                    body: selectedImage,
                })

                imgData = await result.json()

            }

            await updateEvent({
                id: event._id,
                title: title,
                description: description,
                date: date,
                location: location,
                price: +price,
                seats: +seats,
                imageId: imgData?.storageId ? imgData.storageId : event.imageId
            })

            setTitle('')
            setDescription('')
            setDate('')
            setLocation('')
            setPrice('')
            setSeats('')
            router.push('/admin/collections/events')

        }

        const handleDelete = async () => {
             deleteEvent({id: event._id})
            router.replace('/admin/collections/events')
        }


        if(!event) return null
    return (

        <div>
          <ImagePicker imgSrc={imageSrc} setSelectedImage={setSelectedImage} setImageSrc={setImageSrc} />
         

          <form onSubmit={handleSubmit} className="mt-6">
            <div>
                <Label htmlFor="title">Title:</Label>
                <Input id="title" value={title} onChange={ e => setTitle(e.target.value)} />
                
                <Label htmlFor="description">Description:</Label>
                <Input id="description" value={description} onChange={ e => setDescription(e.target.value)} />

                <Label htmlFor="date">Date:</Label>
                <Input id="date" type="date" value={date} onChange={ e => setDate(e.target.value)} />

                <Label htmlFor="location">Location:</Label>
                <Input id="location" value={location} onChange={ e => setLocation(e.target.value)} />

                <Label htmlFor="price">Price:</Label>
                <Input id="price" type="number" value={price} onChange={ e => setPrice(e.target.value)} />

                <Label htmlFor="seats">Seats:</Label>
                <Input id="seats" type="number" value={seats} onChange={ e => setSeats(e.target.value)} />

            </div>
            <div className="flex justify-between">
            <Button className="mt-6">Update Event</Button>
            <Button variant="destructive" onClick={handleDelete} className="mt-6">Delete Event</Button>
            </div>
          </form>
        </div>
    )
}
