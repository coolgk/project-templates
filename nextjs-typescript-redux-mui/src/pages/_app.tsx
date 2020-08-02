import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';

import { store } from 'src/redux/store';

export default function App({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>): JSX.Element {
  useEffect(() => {
    // Remove the server-side injected CSS.
    // ref: https://github.com/mui-org/material-ui/tree/master/examples/nextjs/pages
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles && jssStyles.parentElement && jssStyles.parentElement.removeChild(jssStyles);
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </Provider>
  );
}
