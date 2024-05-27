'use client'

import { cn } from "@/lib/utils"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const collections = [
  {
    _id: '1',
    name: 'events'
  }
]

export const CollectionRoutes = () => {

  const pathname = usePathname()

  return (
    <>
      <Link href="/admin/collections/add" className={cn("flex items-center justify-between p-4 hover:bg-slate-50/10 border-r-4 border-transparent",
        pathname.endsWith("pages/add") && "bg-slate-50/5 border-slate-500"
      )}>
        <p>Add Collection</p>
        <PlusCircle className="size-5" />
      </Link>
      {
        collections && collections.map(collection => (
          <Link key={collection._id} href={`/admin/collections/${collection.name}`} className={cn("capitalize flex items-center justify-between p-4 hover:bg-slate-50/10 border-r-4 border-transparent",
            pathname.endsWith(`pages/${collection.name}`) && "bg-slate-50/5 border-slate-500"
          )}>
            <p>{collection.name}</p>
          </Link>
        ))
      }
    </>
  )
}