import React from "react";
import { ReactFCModule } from "../modulebase/ReactFCModule";

export const Demo: ReactFCModule = ({ widget }) => {
  const data: any = widget.state.unitOfWork;

  return (
    <div className="w-full h-full flex">
      <div className="m-auto">
        {Object.entries(data).map(([key, value], i) => (
          <div key={i} className="flex gap-2">
            <p>{key}:</p>
            <p>{(value as any).toString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
