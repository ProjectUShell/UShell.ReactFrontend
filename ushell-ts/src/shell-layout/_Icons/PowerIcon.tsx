import React from "react";

const PowerIcon: React.FC<{
  rotate?: number;
  size?: number;
  strokeWidth?: number;
}> = ({ size = 1.5, strokeWidth = 1.5 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      style={{ width: `${size}rem`, height: `${size}rem` }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
      />
    </svg>
  );
};

export default PowerIcon;
