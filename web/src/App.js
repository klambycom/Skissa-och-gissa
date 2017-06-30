// @flow

import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Page from "./Page";
import Header from "./Header";
import Game from "./Game";
import Lobby from "./Lobby";

import "./App.css";

function App(): React.Element<any> {
  return (
    <BrowserRouter>
      <Page>
        <Header />
        <Route exact path="/" component={Lobby} />
        <Route path="/games/:id" component={Game} />
      </Page>
    </BrowserRouter>
  );
}

export default App;
