import React from "react";

export class ComponentResolverRegister {
  resolversByIdentifer = {};

  register(componentIdentifer, reslover) {
    this.resolversByIdentifer[componentIdentifer] = reslover;
  }

  resolve(componentIdentifer, inputData) {
    if (!componentIdentifer) {
      return null;
    }
    console.log("componentIdentifer", componentIdentifer);
    console.log("resolversByIdentifer", this);
    console.log("resolversByIdentifer1", this.resolversByIdentifer);
    console.log("resolversByIdentifer2", this.resolversByIdentifer[componentIdentifer]);
    // return null;
    return this.resolversByIdentifer[componentIdentifer](inputData);
  }
}

export const ComponentResolverContext = React.createContext(
  new ComponentResolverRegister()
);
export const ComponetResloverProvider = ComponentResolverContext.Provider;
