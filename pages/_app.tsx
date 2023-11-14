
import type { AppProps} from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material';

import { lightTheme } from '../themes';
import { SWRConfig } from 'swr';
import { AuthProvider, UiProvider } from '../context';
import CartProvider from '../context/cart/CartProvider';

import { SessionProvider } from "next-auth/react"

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps}:AppProps ){
    //SessionProvider todo depende de la autenticacion
    //todos los componentes pueden leer la info
    //de la session
    return (
    <SessionProvider>
        <PayPalScriptProvider options={
                        {clientId:process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                        currency:'USD',
                        intent:'capture'}
                        } >
            <SWRConfig
                value={{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())}}>
                <AuthProvider>
                    <CartProvider>
                        <UiProvider>
                            <ThemeProvider theme={lightTheme}>
                                <CssBaseline />
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </UiProvider>
                    </CartProvider>
                </AuthProvider>
            </SWRConfig>
        </PayPalScriptProvider>
    </SessionProvider>
    )
}

export default MyApp;