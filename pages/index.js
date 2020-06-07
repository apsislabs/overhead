import Head from "next/head";
import React from "react";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <Head>
          <script src="/powerup.js"></script>
        </Head>

        <div>Apsis Overhead: A Trello Power Up</div>
      </>
    );
  }
}

export default HomePage;
