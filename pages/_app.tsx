
import type { AppProps} from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material';

import { lightTheme } from '../themes';
import { SWRConfig } from 'swr';
import { UiProvider } from '../context';

function MyApp({Component, pageProps}:AppProps ){
    return (
        <SWRConfig
            value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}>
            <UiProvider>
                <ThemeProvider theme={lightTheme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </UiProvider>
        </SWRConfig>
    )
}

export default MyApp;