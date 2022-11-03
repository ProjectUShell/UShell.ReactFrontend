import React, { Suspense } from "react";
import useDynamicScript from "./DynamicScript";

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    console.log("loadComponent module", module);
    console.log("loadComponent Module", Module);
    // console.log("loadComponente Module()", await Module.DefineElement());
    return Module;
  };
}

export function loadComponent2(scope, module, url) {
  const { ready, failed } = useDynamicScript({
    url: module && url,
  });
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    if (!container) {
      return;
    }
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    // console.log("loadComponent module", module);
    // console.log("loadComponent Module", Module);
    console.log("loadComponente Module()", await Module.DefineElement());
    // return Module;
  };
}

function ModuleLoader(props) {
  console.log("useDynamicScript start");
  const { ready, failed } = useDynamicScript({
    url: props.module && props.url,
  });
  console.log("useDynamicScript failed", failed);


  if (!props.module) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.url}</h2>;
  }

  const Component = React.lazy(loadComponent(props.scope, props.module));

  return (
    <Suspense fallback="Loading Module">
      <Component inputData={props.inputData} />
    </Suspense>
  );
}

export default ModuleLoader;
