// @flow

import React from "react";
import bem from "bem-cn";

import Footer from "./Footer";

import "./Page.css";

const b = bem("Page");

function Page(props: {children: Array<React.Element<any>>}): React.Element<any> {
  return (
    <div className={b}>
      <div className={b("content")}>{props.children}</div>
      <div className={b("footer")}><Footer /></div>
    </div>
  );
}

export default Page;
