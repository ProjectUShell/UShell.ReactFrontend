import React, { useState } from "react";
import { Radio } from "antd";

import darkVars from "./dark.json";
import lightVars from "./light.json";

const Settings = () => {
  const [value, setValue] = useState(1);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    if (e.target.value == 2) {     
      window.less.modifyVars(darkVars).catch((error) => {
        console.log(`Failed to reset theme`);
      });
    } else {
      window.less.modifyVars(lightVars).catch((error) => {
        console.log(`Failed to reset theme`);
      });
    }
    // for(var b in window) { 
    //   if(window.hasOwnProperty(b)) console.log(b); 
    // }
    console.log(window.less);
  };

  return (
    <div>
      <h3>Theme</h3>
      <Radio.Group onChange={onChange} value={value}>
        <Radio value={1}>Light</Radio>
        <Radio value={2}>Dark</Radio>
      </Radio.Group>
    </div>
  );
};

export default Settings;
