import React from "react";
import { UsecaseState } from "ushell-modulebase";
import { WorkspaceManager } from "../WorkspaceManager";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { WidgetHost } from "../../portfolio-handling/WidgetHost";
import Modal3 from "ushell-common-components/dist/cjs/_Atoms/Modal3";
import XMark from "../../shell-layout/_Icons/XMark";

const UsecaseModal: React.FC<{
  usecaseState: UsecaseState;
  terminate: () => void;
}> = ({ usecaseState, terminate }) => {
  return (
    <Modal3
      title={usecaseState.title}
      // top="10px"
      // bottom="10%"
      // left="15%"
      // right="15%"
      terminate={terminate}
    >
      <div style={{ minWidth: "400px", minHeight: "400px" }}>
        {PortfolioManager.GetWorkspaceManager().renderUsecase(usecaseState, {
          state: usecaseState,
          widgetHost: new WidgetHost(),
        })}
      </div>
    </Modal3>
  );
};

export default UsecaseModal;
