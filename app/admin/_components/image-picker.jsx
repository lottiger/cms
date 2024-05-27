
import { Button } from "@/components/ui/button"
import { ImageUp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"


export const ImagePicker = ({imgSrc, setSelectedImage, setImageSrc}) => {

 

    const setImage = (e) => {
        if (!e.target.files || !e.target.files [0]) {
          return
        }

        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = (x) => {
            setImageSrc(x.target.result)
        }
        setSelectedImage(e.target.files[0])
    }
  
  
    return(
       
    <>
    {
         imgSrc ? (
            <div className="w-fit mx-auto">
            <div className="border rounded aspect-square max-w-[400px] mx-auto overflow-hidden">
              <Image
               alt="event image"
               src={imgSrc}
               width={200}
               height={200}
               className="object-cover w-full h-full"
               />
            </div>
            <Button className="mt-4" size="sm" asChild><label htmlFor="image">Change image</label></Button>
            </div>
          )
            : (
                

        <div className="felx flex col justify-center border-2 border-dashed rounded hover:bg-slate-50/10 cursor-pointer">
        <label htmlFor="image">
        <ImageUp className="size-20 text-muted-foreground" />
        <p>Add image</p>
        </label>
        </div>
      
    )
    }
    <input type="file" id="image" className="hidden" onChange={setImage} />
    </>
   ) 
}