import App from "next/app";
import Head from "next/head";
import React, { useContext } from "react";
import { useTrelloSize } from "../src/hooks/useTrelloSize";
import "../src/styles/main.scss";


const TrelloSizeContext = React.createContext({ rootEl: null, resize: null });

export const useTrelloSizer = () => useContext(TrelloSizeContext);

const TrelloSizer = ({ trello, children }) => {
  const [rootEl, resize] = useTrelloSize(trello);

  return (
    <div ref={rootEl}>
      <TrelloSizeContext.Provider value={{ rootEl, resize }}>
        {children}
      </TrelloSizeContext.Provider>
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

        {trello ? (
          <TrelloSizer trello={trello}>
            <Component {...pageProps} trello={trello} />
          </TrelloSizer>
        ) : (
          "Loading..."
        )}
      </>
    );
  }
}
