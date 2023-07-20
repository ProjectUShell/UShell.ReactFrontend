import React from "react";

const RadioButton = (options: {
  index: number;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  children: React.ReactNode;
}) => {
  const isSelected: boolean = options.index == options.selectedIndex;

  return (
    <div
      className={`flex items-center gap-2 shadow cursor-pointer 
      transition duration-300 mx-1 rounded-md px-2 py-3 flex-1 text-xs
      fount-bold hover:shadow-md ${isSelected && ""}`}
      onClick={() => options.onSelect(options.index)}
    >
      <div
        className={`rounded-full w-4 h-4 border transition ${
          isSelected && "border-4 border-sky-500"
        }`}
      ></div>
      {options.children}
    </div>
  );
};

export default RadioButton;
