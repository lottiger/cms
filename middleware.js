import {
    clerkMiddleware,
    createRouteMatcher
  } from '@clerk/nextjs/server';
  import { preloadQuery, preloadedQueryResult } from 'convex/nextjs';
  import { NextResponse } from 'next/server';
  import { api } from './convex/_generated/api';
  
  const allowedOrigins = ['*']
   
  const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
  
  const isProtectedRoute = createRouteMatcher([
    '/events',
  ])
  
  const isAdminRoute = createRouteMatcher([
    '/admin(.*)',
  ]);
  
  
  export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req) || isAdminRoute(req)) auth().protect();
  
    if (isAdminRoute(req)) {
      const { userId } = auth()
      const preloaded = await preloadQuery(api.admins.checkAdmin, { userId })
      const isAdmin = preloadedQueryResult(preloaded)
  
      if(!isAdmin)
        return NextResponse.redirect(new URL('/', req.url))
    }
  
    const origin = req.headers.get('origin') ?? ''
    const isAllowedOrigin = allowedOrigins.includes(origin) || allowedOrigins.includes('*')
   
    // Handle preflighted requests
    const isPreflight = req.method === 'OPTIONS'
   
    if (isPreflight) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
        ...corsOptions,
      }
      return NextResponse.json({}, { headers: preflightHeaders })
    }
   
    // Handle simple requests
    const response = NextResponse.next()
   
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
   
    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
   
    return response
  
  });
  
  export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  };