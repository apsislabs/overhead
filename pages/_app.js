import App from "next/app";
import Head from "next/head";
import React, { useCallback, useContext } from "react";
import { useTrelloSize } from "../src/hooks/useTrelloSize";
import "../src/styles/main.scss";

const TrelloContext = React.createContext({ rootEl: null, resize: null, trello: null });

export const useTrello = () => useContext(TrelloContext);

const TrelloSizer = ({ trello, children }) => {
  if (!trello) {
    return "Waiting for Trello...";
  }

  const t = useCallback(trello.iframe, [trello]);
  const trelloFrame = t();
  const [rootEl, resize] = useTrelloSize(trelloFrame);

  return (
    <div ref={rootEl}>
      <TrelloContext.Provider value={{ rootEl, resize, trello: trelloFrame }}>
        {children}
      </TrelloContext.Provider>
    </div>
  );
};

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
        <TrelloSizer trello={trello}>
          <Component {...pageProps} />
        </TrelloSizer>
      </>
    );
  }
}
