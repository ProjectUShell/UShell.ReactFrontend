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

    // return null;
    return this.resolversByIdentifer[componentIdentifer](inputData);
  }
}

export const ComponentResolverContext = React.createContext(
  new ComponentResolverRegister()
);
export const ComponetResloverProvider = ComponentResolverContext.Provider;
