import React from "react";
import { IWidget } from "ushell-modulebase";

const ReactFCModuleWidget: React.FC<{
  widget: IWidget;
}> = ({ widget }) => {
  return <div>ReactFCModule</div>;
};
export type ReactFCModule = typeof ReactFCModuleWidget;
