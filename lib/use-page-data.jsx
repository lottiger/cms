'use client'

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

const usePageData = (name) => {

  const page = useQuery(api.pages.getPage, { name })

  if(!page) return null
  const pageData = JSON.parse(page?.content)

  return { name: page.name, ...pageData }
}
export default usePageData