import React, { Suspense } from "react";
import useDynamicScript from "../DynamicScript";
import { loadModule } from "../ModuleLoader";

function FederatedComponentProxy(props: {
  module: any;
  url: any;
  scope: any;
  inputData: any;
}) {
  const { ready, failed } = useDynamicScript({
    url: props.module && props.url,
  });

  if (!props.module) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.url}</h2>;
  }

  const Component = React.lazy(loadModule(props.scope, props.module));

  return (
    <Suspense fallback="Loading Module">
      <Component inputData={props.inputData} />
    </Suspense>
  );
}

export default FederatedComponentProxy;
