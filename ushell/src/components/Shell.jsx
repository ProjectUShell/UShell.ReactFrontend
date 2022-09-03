import React, { Suspense, useState } from "react";

// import DemoComponent from "demoApp/DemoComponent";

import "./Shell.css";
import ModuleLoader, { loadComponent2 } from "../federation/ModuleLoader";
import readModulePortfolio from "../../moduleportfolio";

const Shell = () => {
  const Test1 = "demo-component";
  readModulePortfolio();
  // loadComponent2("ushell_demo_app", "./DemoComponent1", "http://localhost:3001/remoteEntry.js")();
  return (
    <Suspense fallback={"Loading . . . "}>
      <ModuleLoader
        url={"http://localhost:3001/remoteEntry.js"}
        scope={"ushell_demo_app"}
        module={"./DemoComponent1"}
        inputData={{ someInput: "WTF" }}
      />
      {/* <Test1 name="asd"></Test1> */}
      {/* <demo-component1 name="asd"></demo-component1> */}
      {/* <div>test</div>) */}
    </Suspense>
  );
  // return <demo-component1 name="asd"></demo-component1>;
};

export default Shell;
