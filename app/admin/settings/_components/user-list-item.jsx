import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import React from 'react'

export const UserListItem = ({imageUrl, email, isSelected, onClick }) => {
  return (
    <div onClick={onClick} className={cn("flex items-center gap-4 p-2 hover:bg-slate-50/5 cursor-pointer",
      isSelected && "bg-slate-50/5 "
    )}>
                   
                <Avatar className='size-8'>
                 <AvatarImage src={imageUrl} />
                 <AvatarFallback>XX</AvatarFallback>
                </Avatar>
                <p>{email}</p>
              
                </div>
  )
}
