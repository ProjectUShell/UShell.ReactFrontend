import React, { useState } from "react";
import { Radio } from "antd";

import { setDarkMode, setLightMode } from "./SettingsService";

const Settings = ({ setSettingsValue }) => {
  const [value, setValue] = useState(1);
  const [value2, setValue2] = useState("horizontal");

  const onChange = (e) => {    
    setValue(e.target.value);
    if (e.target.value == 2) {
      setDarkMode();
    } else {
      setLightMode();
    }    
    
  };

  return (
    <div>
      <h3>Theme</h3>
      <Radio.Group onChange={onChange} value={value}>
        <Radio value={1}>Light</Radio>
        <Radio value={2}>Dark</Radio>
      </Radio.Group>
      <Radio.Group
        onChange={(e) => {
          setSettingsValue(e.target.value);
          setValue2(e.target.value);
        }}
        value={value2}
      >
        <Radio value="horizontal">Horizontal</Radio>
        <Radio value="vertical">Vertical</Radio>
      </Radio.Group>
    </div>
  );
};

export default Settings;
