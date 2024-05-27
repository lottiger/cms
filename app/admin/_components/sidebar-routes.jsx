'use client'

import { cn } from "@/lib/utils"
import { LayoutDashboard, List, PanelsTopLeft, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const SidebarRoutes = () => {

  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <Link href="/admin/pages" className={cn("flex items-center justify-between p-4 hover:bg-slate-50/10 border-r-4 border-transparent",
        pathname.startsWith("/admin/pages") && "bg-slate-50/5 border-slate-500"
      )}>
       
        <p>Pages</p>
        <PanelsTopLeft className="size-5" />
      </Link>
      <Link href="/admin/collections" className={cn("flex items-center justify-between p-4 hover:bg-slate-50/10 border-r-4 border-transparent",
        pathname.startsWith("/admin/collections") && "bg-slate-50/5 border-slate-500"
      )}>
        <p>Collections</p>
        <List className="size-5" />





      </Link>
      <Link href="/admin/settings" className={cn("mt-auto flex items-center justify-between p-4 hover:bg-slate-50/10 border-r-4 border-transparent",
        pathname.startsWith("/admin/settings") && "bg-slate-50/5 border-slate-500"
      )}>
        <p>Settings</p>
        <Settings className="size-5" />
      </Link>
    </div>
  )
}