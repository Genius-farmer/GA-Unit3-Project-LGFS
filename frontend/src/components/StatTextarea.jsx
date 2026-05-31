import React, { useState } from "react";
import css from "../styles/HomePage.module.css";

const StatTextarea = (props) => {
  const [charCount, setCharCount] = useState(0);

  const handleOnChange = (rawStr, setValue) => {
    const finalStr = props.sanitizer ? props.sanitizer(rawStr) : rawStr;
    if (props.maxLength) setCharCount(finalStr.length);
    setValue(finalStr);
  };

  return (
    <div className={css["stat"]}>
      <div className={css["stat-label-wrapper"]}>
        <div className={css["stat-label"]}>{props.title}</div>
        {props.maxLength && <div className={css["stat-label-sub"]}>{`(${charCount}/${props.maxLength})`}</div>}
      </div>
      <div className={`${css["stat-input-base"]} ${css["stat-textarea"]} ${props.size}`}>
        <textarea
          value={props.value}
          {...(props.maxLength && { maxLength: props.maxLength })}
          onChange={(e) => handleOnChange(e.target.value, props.setValue)}
        />
      </div>
    </div>
  );
};

export default StatTextarea;
