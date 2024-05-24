'use client'
import { useConvexAuth } from "convex/react"
import { Sidebar } from "./_components/sidebar"
import { Loader2 } from "lucide-react"

function AdminLayout({ children }) {
  const { isLoading } = useConvexAuth()

  if(isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin size-10" />
    </div>
  )

  return (
    <div className="h-screen grid grid-cols-[250px_1fr]">
      <Sidebar />
      { children }
    </div>
  )
}
export default AdminLayout