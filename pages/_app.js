import App from "next/app";
import Head from "next/head";
import React from "react";

export const TrelloContext = React.createContext(null);

export default class MyApp extends App {
  state = { trello: null };

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <>
        <Head>
          <script src="https://p.trellocdn.com/power-up.min.js"></script>
        </Head>

        <Component {...pageProps} key={router.route} />
      </>
    );
  }
}
