import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// import "antd/dist/antd.css";
import "./index.css";
import "./App.css";
import "./styles/main.less";

import UShell from "./components/UShell";

const pickBasePath = ()=>{
  let baseHref = (document.getElementsByTagName('base')[0] || {href:'/'}).href;

  //Because of some strange magic, the browser automatically prepends the
  //hostname to the base-href. Also when reading the base-tag directly
  //from the html-head! So we need to remove the host to get the plain
  //configured value (a directory-url, relative to the root of the webserver)
  baseHref = baseHref.replace("://","");
  let pos = baseHref.indexOf("/");
  if(pos < 0){
    baseHref = "/";
  }
  else{
    baseHref = baseHref.substring(pos);
  }
 
  return baseHref;
}

const App = () => {
  return (
      <BrowserRouter basename={ pickBasePath() }>
      <UShell></UShell>
    </BrowserRouter>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
