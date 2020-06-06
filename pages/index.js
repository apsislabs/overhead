import Head from "next/head";
import React from "react";

class HomePage extends React.Component {
  render() {
    const { NEXT_PUBLIC_ASSET_PREFIX } = process.env;
    return (
      <>
        <Head>
          <script src={`${NEXT_PUBLIC_ASSET_PREFIX}/powerup.js`}></script>
        </Head>

        <div>Welcome to Tomato!</div>
      </>
    );
  }
}

export default HomePage;
