
import { Settings } from 'lucide-react'
import { ManageAdminsDialog } from './_components/manage-admins-dialog'
import { clerkClient } from '@clerk/nextjs/server'

export const dynamic = "force-dynamic"

async function SettingsPage() {

  const clerkUsers = await clerkClient.users.getUserList()
  
  const users = clerkUsers.data.map(user => ({
    id: user.id,
    email: user.emailAddresses[0].emailAddress,
    imageUrl: user.imageUrl
  }))
  return (
    <div className="px-10">
      <div className="flex gap-4 items-center justify-center my-10">
        <h1 className="font-bold text-6xl text-center">Settings </h1>
        <Settings className="size-16" />
      </div>

      <div>
        <ManageAdminsDialog users={users} />
      </div>
    </div>
  )
}
export default SettingsPage
