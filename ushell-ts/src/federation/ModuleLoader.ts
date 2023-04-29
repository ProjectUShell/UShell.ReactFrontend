declare global {
  interface Window {
    __remotes__: Record<string, string>;
    init: (s: any) => void;
    get: (m: any) => () => void;
  }

  const __webpack_init_sharing__: any;
  const __webpack_share_scopes__: any;
}

export function loadModule(scope: any, module: any) {  
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module: any = factory();
    return Module;
  };
}
