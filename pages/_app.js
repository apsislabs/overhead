import App, { Container } from "next/app";
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

  componentDidMount() {
    this.setState({ trello: window.TrelloPowerUp.iframe() });
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const { trello } = this.state;

    return (
      <>
        <Head>
          <script src="https://p.trellocdn.com/power-up.min.js"></script>
        </Head>

        <Container>
          <TrelloContext.Provider value={trello}>
            <Component {...pageProps} key={router.route} trello={trello} />
          </TrelloContext.Provider>
        </Container>
      </>
    );
  }
}
