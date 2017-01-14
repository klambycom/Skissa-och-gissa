import "phoenix_html"

import React from "react";
import ReactDOM from "react-dom";

import Game from "./components/game";

//let chat = new Chat("room:lobby");
//chat.initialize();

ReactDOM.render(
  <Game />,
  document.getElementById("react-root")
);
