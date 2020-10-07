import Head from "next/head";
import React, { useEffect, useState } from "react";
import "../src/styles/main.scss";

const MyApp = ({ Component, pageProps }) => {
  const [trello, setTrello] = useState(null);

  useEffect(() => {
    setTrello(TrelloPowerUp);
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://p.trellocdn.com/power-up.min.css"
        />
        <script src="https://p.trellocdn.com/power-up.min.js"></script>
      </Head>

      <div className="pop-over-section">
        <Component {...pageProps} trello={trello} />
      </div>
    </>
  );
};

export default MyApp;