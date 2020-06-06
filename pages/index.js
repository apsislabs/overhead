import React from "react";
import Head from "next/head";

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
