import React from "react";
import DropdownSelect from "ushell-common-components/dist/cjs/_Atoms/DropdownSelect";
import { PortfolioManager } from "../PortfolioManager";
import { ApplicationScopeEntry } from "ushell-portfoliodescription";

const AppScopeDropdown: React.FC<{ entry: ApplicationScopeEntry }> = ({
  entry,
}) => {
  // function getOptions() {
  //     const result: { label: string; value: string }[] = [];
  //     const runtimeTags = PortfolioManager.GetPortfolio().intialRuntimeTags || [];
  //     if (entry.knownValues) {
  //       for (let kv in entry.knownValues) {
  //         entry.dependentScopeConstraints?.forEach((dsc) => {

  //         });
  //         result.push({ label: entry.knownValues[kv], value: kv });
  //       }
  //     }
  // }

  return (
    <div className="flex gap-2 items-center content-center">
      <p>{entry.label}:</p>
      <DropdownSelect
        options={Object.keys(entry.knownValues!).map((ek) => ({
          value: ek,
          label: entry.knownValues![ek],
        }))}
        initialOption={{
          label: entry.knownValues![entry.initialValue] || "Empty",
          value: entry.initialValue || "Empty",
        }}
        onOptionSet={(option: { label: string; value: string } | null) => {
          PortfolioManager.GetWorkspaceManager().switchScope(
            entry.name || "",
            option?.value
          );
        }}
      ></DropdownSelect>
    </div>
  );
};

export default AppScopeDropdown;
