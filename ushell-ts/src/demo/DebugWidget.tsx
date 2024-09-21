import React, { useEffect, useState } from "react";
import { IWidget } from "ushell-modulebase";

const DebugWidget: React.FC<{ widget: IWidget }> = ({ widget }) => {
  const [selectedItem, setSelectedItem] = useState("");

  function commitSelectedItem() {
    widget.widgetHost.populateChangedState({
      ...widget.state,
      unitOfWork: { ...widget.state.unitOfWork, selectedItem: selectedItem },
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <h1>DebugWidget</h1>
      <div className="flex">
        <p>usecaseKey:</p>
        <p>{widget.state.usecaseKey}</p>
      </div>
      <input
        className="bg-bg1 dark:bg-bg1dark"
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.target.value)}
        placeholder="Enter selected item"
      ></input>
      <button
        onClick={() => {
          commitSelectedItem();
        }}
      >
        Set selected item
      </button>
    </div>
  );
};

export default DebugWidget;
