'use server'

import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { fetchMutation } from "convex/nextjs"

export async function addPage(name, prevState, formData) {
  const { userId } = auth()
  const rawFormData = Object.fromEntries(formData)

  console.log(rawFormData)

  for (const [key, value] of Object.entries(rawFormData)) {
    if(value.trim() === '') {
      return {
        error: 'Please fill out all the fields'
      }
    }
  }

  const pageData = {
    name,
    content: JSON.stringify(rawFormData),
    userId
  }

  console.log(pageData)
  try {
    await fetchMutation(api.pages.addOrUppdatePage, pageData)
  } catch (err) {
    console.log(err.message)
    return {
      error: "There was an error saving the page"
    }
  }

  return {
    message: 'Page updated successfully'
  }
}