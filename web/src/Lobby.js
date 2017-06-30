// @flow

import React from "react";
import {Link} from "react-router-dom";

function Lobby(): React.Element<any> {
  return (
    <div>
      <h1>Lobby</h1>
      <ul>
        <li><Link to="/games/one">Game One</Link></li>
        <li><Link to="/games/two">Game Two</Link></li>
        <li><Link to="/games/three">Game Three</Link></li>
      </ul>
    </div>
  );
}

export default Lobby;
