'use client'


import { cn } from "@/lib/utils"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const pages = [
  {
    _id: '1',
    name: 'home'
  }
]

export const PageRoutes = () => {

  const pathname = usePathname()

  return (
    <>
      <Link href="/admin/pages/add" className={cn("flex items-center justify-between p-4 hover:bg-slate-50/10 border-r-4 border-transparent",
        pathname.endsWith("pages/add") && "bg-slate-50/5 border-slate-500"
      )}>
        <p>Add Page</p>
        <PlusCircle className="size-5" />
      </Link>
      {
        pages && pages.map(page => (
          <Link key={page._id} href={`/admin/pages/${page.name}`} className={cn("capitalize flex items-center justify-between p-4 hover:bg-slate-50/10 border-r-4 border-transparent",
            pathname.endsWith(`pages/${page.name}`) && "bg-slate-50/5 border-slate-500"
          )}>
            <p>{page.name}</p>
          </Link>
        ))
      }
    </>
  )
}