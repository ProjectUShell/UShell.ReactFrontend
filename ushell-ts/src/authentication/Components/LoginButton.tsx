import React from "react";

const LoginButton: React.FC<{ text: string; onClick: () => void }> = ({
  text,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="p-4 px-16 rounded-md bg-bg6 hover:bg-bg10 dark:bg-bg6dark dark:hover:bg-bg10dark"
    >
      {text}
    </button>
  );
};

export default LoginButton;
