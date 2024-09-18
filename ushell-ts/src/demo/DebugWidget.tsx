import React from "react";
import { IWidget } from "ushell-modulebase";

const DebugWidget: React.FC<{ widget: IWidget }> = ({ widget }) => {
  return (
    <div>
      <h1>DebugWidget</h1>
      <div className="flex">
        <p>usecaseKey:</p>
        <p>{widget.state.usecaseKey}</p>
      </div>
    </div>
  );
};

export default DebugWidget;
