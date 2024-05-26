'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { AdminListItem } from "./admin-list-item"
import { UserListItem } from "./user-list-item"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"


  
export const ManageAdminsDialog = ({ users }) => {

    const { userId } = useAuth()
  
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState([])
    const [error, setError] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const admins = useQuery(api.admins.getAll)
    const makeAdmin = useMutation(api.admins.makeAdmin)
    const removeAdmin = useMutation(api.admins.removeAdmin)
  
    if(!admins) return null
    const usersWithoutAdmins = users.filter(user => !admins.some(admin => admin.userId === user.id))
    const adminsWithoutUsers = users.filter(user => admins.some(admin => admin.userId === user.id))
  
    const filteredUsers = usersWithoutAdmins.filter(user => user.email.includes(searchValue))
  
    const handleSelect = (user) => {
      if(selected.includes(user)) {
        setSelected(sel => sel.filter(u => u.id !== user.id))
      } else {
        setSelected(sel => [...sel, user])
      }
    }
  
    const handleMakeAdmin = async () => {
      await Promise.all(selected.map(user => makeAdmin({ email: user.email, userId: user.id })))
      setSelected([])
    }
  
  
    const handleRemoveAdmin = async (id) => {
      if(admins.length <= 1) {
        setError('You must have atleast one admin')
        setTimeout(() => { setError(null) }, 5000)
        return
      }
      if(id === userId) {
        setError('You cannot remove yourself')
        setTimeout(() => { setError(null) }, 5000)
        return
      }
  
      const admin = admins.find(admin => admin.userId === id)
  
      await removeAdmin({ id: admin._id })
      setError(null)
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Manage Admins</Button>
        </DialogTrigger>
        <DialogContent className="max-w-screen-md h-[600px] flex flex-col justify-between">
          <DialogHeader>
            <DialogTitle>Manage Admins</DialogTitle>
            <DialogDescription>Click the user you want to upgrade</DialogDescription>
            {error && <p className="py-2 text-red-500">{error}</p>}
          </DialogHeader>
          <div className="flex gap-4 flex-1">
            <div className="flex-1 flex flex-col">
              <p>Admins</p>
              <ScrollArea className="border rounded-md h-full mt-2">
                {
                  adminsWithoutUsers && adminsWithoutUsers.map(admin => (
                    <AdminListItem key={admin.id} onClick={() => handleRemoveAdmin(admin.id)} imageUrl={admin.imageUrl} email={admin.email} />
                  ))
                }
  
              </ScrollArea>
            </div>
            <div className="flex-1 flex flex-col">
              <p>Users</p>
              <div className="my-2 relative">
                <Input value={searchValue} onChange={e => setSearchValue(e.target.value)} className="pl-10" placeholder="Search..." />
                <Search className="absolute top-1/2 left-2 -translate-y-1/2 size-5 text-muted-foreground" />
              </div>
  
              <ScrollArea className="border rounded-md flex-1">
                {
                  usersWithoutAdmins && filteredUsers.map(user => (
                    <UserListItem key={user.id} isSelected={selected.includes(user)} imageUrl={user.imageUrl} email={user.email} onClick={() => handleSelect(user)} />
                  ))
                }
              </ScrollArea>
            </div>
          </div>
          <Button className="self-end " disabled={selected.length === 0} onClick={handleMakeAdmin} >Make Selected Admin</Button>
        </DialogContent>
      </Dialog>
    )
  }
