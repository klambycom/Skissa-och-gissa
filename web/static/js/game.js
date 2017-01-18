import "phoenix_html"

import React from "react";
import ReactDOM from "react-dom";

import Game from "./components/game";

import "layout/index.less";

const root = document.getElementById("game-root");

ReactDOM.render(<Game id={root.dataset.gameId} />, root);
