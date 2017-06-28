// @flow

import React from "react";
import bem from "bem-cn";

import "./Footer.css";

const b = bem("Footer");

function Footer(): React.Element<any> {
  return (
    <div className={b}>
      <div className={b("about")}>
        Skapad av <a href="http://christiann.se">Christian Nilsson</a> och släppt som öppen källkod. <a href="https://github.com/klambycom/Skissa-och-gissa">Källkoden finns på Github</a>, där du även kan <a href="https://github.com/klambycom/Skissa-och-gissa/issues/new">rapportera fel eller komma med förbättringsförslag</a>.
      </div>
    </div>
  );
}

export default Footer;
