import Head from "next/head";
import React from "react";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <Head>
          <script src="/powerup.js"></script>
        </Head>

        <div>Welcome to Tomato!</div>
      </>
    );
  }
}

export default HomePage;
