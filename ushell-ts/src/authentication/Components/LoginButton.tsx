import React from "react";

const LoginButton: React.FC<{ text: string; onClick: () => void }> = ({
  text,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="p-4 px-16 rounded-md bg-backgroundfour hover:bg-backgroundthree dark:bg-backgroundfourdark dark:hover:bg-backgroundthreedark"
    >
      {text}
    </button>
  );
};

export default LoginButton;
