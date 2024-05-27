'use client'



import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImagePicker } from "@/app/admin/_components/image-picker";





export default function Create() {

const router = useRouter()

    const generateUploadUrl = useMutation(api.images.generateUploadUrl)
    const createEvent = useMutation(api.events.createEvent)

    const [selectedImage, setSelectedImage] = useState(null)

    const [imageSrc, setImageSrc] = useState()
    
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [location, setLocation] = useState('')
    const [price, setPrice] = useState('')
    const [seats,setSeats] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()

        if(title.trim() == '' || description.trim() == '' || date.trim() == '' || location.trim() == '' || price.trim() =='' || seats.trim() == '') 
            throw new Error('All fields are required')
       
            let imageId

            console.log(typeof date)

        try {
            if (selectedImage) {
                const postUrl = await generateUploadUrl()
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers:{ "content-type": selectedImage.type },
                    body: selectedImage,
                })
                const { storageId } = await result.json()
                imageId = storageId
            } else {
                throw new Error('No image selected')
            }
        } catch (error) {
            console.error(error)
            
        }

       

        try {
            await createEvent({imageId, title, description, date, location, price: +price, seats: +seats})
            toast.success('Event created successfully')
        } catch (error) {
            toast.error('Failed to create event')
            console.error(error);
        }
        
        setTitle('')
        setDescription('')
        setDate('')
        setLocation('')
        setPrice('')
        setSeats('')
        setSelectedImage(null) //Function to clear the image after submission, does not work
        setImageSrc(null) //Function to clear the image after submission, does not work
        
    }



    return (

        <div>
          <ImagePicker setSelectedImage={setSelectedImage} imgSrc={imageSrc} setImageSrc={setImageSrc} />

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
            <Button className="mt-6">Add Event</Button>
          </form>
        </div>
    )
}


