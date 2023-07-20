import React, { useState } from "react";
import RadioButton from "./RadioButton";

const RadioGroup: React.FC<{
  options: React.ReactElement[];
  onChange?: (selectedIndex: number) => void;
  value?: number;
  labelText?: string;
}> = ({ options, onChange, value, labelText }) => {
  const [selectedIndex, setSelectedIndex] = useState(value);

  function onSelect(index: number) {
    setSelectedIndex(index);
    onChange && onChange(index);
  }

  return (
    <div>
      {labelText && (
        <label className="block mb-2 font-semibold">{labelText}</label>
      )}
      <div className="flex justify-evenly">
        {options.map((el, index) => {
          return (
            <RadioButton
              key={index}
              index={index}
              selectedIndex={selectedIndex}
              onSelect={(index) => onSelect(index)}
            >
              {el}
            </RadioButton>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroup;
