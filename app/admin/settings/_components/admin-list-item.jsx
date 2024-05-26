import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Redo2 } from 'lucide-react'
import React from 'react'

export const AdminListItem = ({imageUrl, email, onClick }) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50/5">
                    <div className="flex items-center gap-4">
                <Avatar className='size-8'>
                 <AvatarImage src={imageUrl} />
                 <AvatarFallback>XX</AvatarFallback>
                </Avatar>
                <p>{email}</p>
                </div>
                <Redo2 className="cursor-pointer" onClick={onClick}/>
                </div>
  )
}
