import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { jwt } from '../utils';
 
/* Se ejecuta primero antes de mostrar las 
paginas address.ts o summary */

//lado del servidor
export async function middleware(request: NextRequest, ev: NextFetchEvent){
    let token = request.cookies.get("token");

    //return new Response("Token: " );
    //return NextResponse.redirect(new URL('/',request.url))
    try{
        if(token === undefined)
            return;

        await jwt.isValidToken(token?.value);
        return NextResponse.next();
    }catch(error){
        console.log(request.page);
        const requestPage = request.page.name;
        return NextResponse.redirect(`/auth/login?p=${requestPage}`);
    }
}

// See "Matching Paths" below to learn more
//export const config = {
//    matcher: '/checkout/address.tsx',
//}