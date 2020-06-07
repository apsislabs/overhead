import App from "next/app";
import Head from "next/head";
import React from "react";

import "../src/styles/main.scss";

export default class MyApp extends App {
  state = { trello: null };

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    this.setState({ trello: TrelloPowerUp });
  }

  render() {
    const { Component, pageProps } = this.props;
    const { trello } = this.state;

    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://p.trellocdn.com/power-up.min.css"
          />
          <script src="https://p.trellocdn.com/power-up.min.js"></script>
        </Head>

        <Component {...pageProps} trello={trello} />
      </>
    );
  }
}
