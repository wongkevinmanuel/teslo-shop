import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { jwt } from './utils';
import { getToken } from 'next-auth/jwt';
 
/* Se ejecuta primero antes de mostrar las 
paginas address.ts o summary */

//lado del servidor
export async function middleware(req: NextRequest, ev: NextFetchEvent){
    let session:any;
    
    try{
        session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    }catch(error){
        session = null;
    } 

    if(!session){
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${ requestedPage}`;

        return NextResponse.redirect(url);
        /*
        return new Response (JSON.stringify({ message:"No autorizado"}),{
            status: 401,
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        */
    }   

    const validRoles = ['admin', 'super-user', 'SEO'];

    if(!validRoles.includes(session.user.role)){
        const url = req.nextUrl.clone()
        url.pathname = '/'
        /*
        return new Response (JSON.stringify({ message:"No autorizado"}),{
            status: 401,
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        */
        
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/checkout/address', '/checkout/summary', '/admin/' , '/api/admin/dashboard'],
}