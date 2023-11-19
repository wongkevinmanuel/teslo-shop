import {FC, ReactNode } from 'react'
import Head from 'next/head'

import { Navbar, SideMenu } from '../ui'

interface Props{
    title: string,
    pageDiscription?: string,
    imageFullUrl?: string,
    children: ReactNode
}

export const AuthLayout:FC <Props> = ({children, title, pageDiscription, imageFullUrl}) => {
  return (
        <>
            <Head>
                <title>{title}</title>
                <meta name='description' content={pageDiscription}></meta>
                <meta name='og:title' content={title} />
                <meta name='og:description' content={pageDiscription} />
                {
                    imageFullUrl && (
                        <meta name='og:image' content={imageFullUrl} />
                    )
                }
            </Head>
            <nav>
                <Navbar/>
            </nav>
            <SideMenu />
            <main style={{ 
                margin:'80px auto',
                maxWidth:'1440px',
                padding:'0px 30px'}}>
                {children}
            </main>
            <footer> 
            </footer>
        </>
  )
}
