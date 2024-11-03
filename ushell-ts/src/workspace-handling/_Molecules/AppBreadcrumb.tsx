import React from "react";

export class AppBreadcrumbItem {
  id: string = "";
  label: string = "";
  onClicked: () => void = () => {};
}

const AppBreadcrumb: React.FC<{ items: AppBreadcrumbItem[] }> = ({ items }) => {
  return (
    <div className="flex gap-1 items-center content-center">
      {items.map((bi, i) => (
        <div key={i} className="flex items-center content-center">
          <div className="hover:bg-menuHover dark:hover:bg-menuHoverDark p-1 px-2 rounded-sm cursor-pointer">
            {bi.label}
          </div>
          {i < items.length - 1 && <div>/</div>}
        </div>
      ))}
    </div>
  );
};

export default AppBreadcrumb;
