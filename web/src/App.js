// @flow

import React from "react";
import "./App.css";

import Page from "./Page";
import Header from "./Header";
import Game from "./Game";

const user = `Christian (${Math.random()})`;

function App(): React.Element<any> {
  return (
    <Page>
      <Header />
      <Game user={user} />
    </Page>
  );
}

export default App;
