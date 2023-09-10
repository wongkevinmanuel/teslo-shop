
import type { AppProps} from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material';

import { lightTheme } from '../themes';
import { SWRConfig } from 'swr';
import { UiProvider } from '../context';
import CartProvider from '../context/cart/CartProvider';

function MyApp({Component, pageProps}:AppProps ){
    return (
    <SWRConfig
        value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())}}>
        <CartProvider>
            <UiProvider>
                <ThemeProvider theme={lightTheme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </UiProvider>
        </CartProvider>
    </SWRConfig>
    )
}

export default MyApp;