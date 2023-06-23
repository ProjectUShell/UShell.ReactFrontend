import React, { useEffect } from "react";

const Dropdown: React.FC<{
  setIsOpen: (o: boolean) => void;
  topOffset?: number;
  rightOffset?: number;
  children: any;
}> = ({ setIsOpen, children, topOffset, rightOffset }) => {

  const handleEscape = (e: any) => {
    if (e.key == "Esc" || e.key == "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const topOffsetCss: string = topOffset ? `top-${topOffset}` : "top-0";
  const rightOffsetCss: string = rightOffset
    ? `right-${rightOffset}`
    : "right-0";
  // const rightOffsetCss: string = rightOffset ? `left-${rightOffset}` : "left-0";

  return (
    <div className="relative">
      <button
        className="fixed z-40 cursor-default inset-0 bg-black bg-opacity-0"
        onClick={() => setIsOpen(false)}
      ></button>
      <div
        className={`absolute z-40 ${rightOffsetCss} ${topOffsetCss} flex justify-center items-center w-max`}
      >
        <div className="rounded-md p-2">{children}</div>
      </div>
    </div>
  );
};

export default Dropdown;
