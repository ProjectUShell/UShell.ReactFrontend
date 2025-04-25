import React, { useEffect, useState } from "react";
import { PortfolioConnector } from "../PortfolioConnector";
import { PortfolioEntry } from "../PortfolioEntry";
import { PortfolioDescription } from "ushell-portfoliodescription";
import DropdownSelect from "ushell-common-components/dist/cjs/_Atoms/DropdownSelect";

const PortfolioSelector: React.FC<{
  url: string;
  onPortfolioSelected: (portfolioUrl: string) => void;
}> = ({ url, onPortfolioSelected }) => {
  const [portfolioEntries, setPortfolioEntries] = useState<PortfolioEntry[]>(
    []
  );
  const [tags, setTags] = useState<{ [tagName: string]: string[] }>({});
  const [selectedByTag, setSelectedByTag] = useState<{
    [tagName: string]: string;
  }>({});

  useEffect(() => {
    PortfolioConnector.getPortfolioIndex(url).then((pi) => {
      setPortfolioEntries(pi);
      const tags1: { [tagName: string]: string[] } = {};
      pi.forEach((pe: PortfolioEntry) => {
        Object.keys(pe.tags).forEach((tn: string) => {
          if (Object.keys(tags1).find((tk) => tk == tn) == undefined) {
            tags1[tn] = [];
          }
          if (tags1[tn].find((t) => t == pe.tags[tn]) == undefined) {
            tags1[tn].push(pe.tags[tn]);
          }
        });
      });
      const selectedByTag1: { [tagName: string]: string } = {};
      Object.keys(tags1).forEach((t) => {
        selectedByTag1[t] = tags1[t][0];
      });
      setSelectedByTag(selectedByTag1);
      setTags(tags1);
    });
  }, [url]);

  function updateSelected(tagName: string, tagValue: string) {
    const selectedByTag1: { [tagName: string]: string } = { ...selectedByTag };
    selectedByTag1[tagName] = tagValue;
    const indexOfTagName = Object.keys(selectedByTag1).indexOf(tagName);
    for (
      let i = indexOfTagName + 1;
      i < Object.keys(selectedByTag1).length;
      i++
    ) {
      const nextTagName: string = Object.keys(selectedByTag1)[i];
      selectedByTag1[nextTagName] = "";
    }
    setSelectedByTag(selectedByTag1);
  }

  function getFilteredEntries(highestTagIndex: number): PortfolioEntry[] {
    const result: PortfolioEntry[] = [];
    portfolioEntries.forEach((pe) => {
      let match: boolean = true;
      Object.keys(pe.tags).forEach((tn: string, i) => {
        if (
          highestTagIndex >= 0 &&
          i <= highestTagIndex &&
          selectedByTag[tn] != pe.tags[tn]
        ) {
          match = false;
        }
      });
      if (match) {
        result.push(pe);
      }
    });
    return result;
  }

  function getTagOptions(
    tagKey: string,
    index: number
  ): { label: string; value: any }[] {
    if (index == 0) {
      return tags[tagKey].map((tv: string) => {
        return { label: tv, value: tv };
      });
    }
    const matchingEntries: PortfolioEntry[] = getFilteredEntries(index - 1);
    const matchingTags: { [tagName: string]: string[] } = {};
    matchingEntries.forEach((pe: PortfolioEntry) => {
      Object.keys(pe.tags).forEach((tn: string) => {
        if (Object.keys(matchingTags).find((tk) => tk == tn) == undefined) {
          matchingTags[tn] = [];
        }
        if (matchingTags[tn].find((t) => t == pe.tags[tn]) == undefined) {
          matchingTags[tn].push(pe.tags[tn]);
        }
      });
    });

    if (!(tagKey in matchingTags)) return [];
    return matchingTags[tagKey].map((tv: string) => {
      return { label: tv, value: tv };
    });
  }

  return (
    <div className="flex h-screen w-screen  overflow-auto m-auto">
      <div className="flex flex-col mx-auto my-20 bg-bg4 dark:bg-bg8dark p-2 rounded-md min-w-96 overflow-auto">
        <h1 className="text-lg border-b">Select a portfolio</h1>
        {Object.keys(tags).map((t, i) => (
          <div key={t} className="p-1 mx-auto w-full">
            <label>{t}</label>
            <DropdownSelect
              classNameBg="bg-bg-6 dark:bg-bg6dark text-center"
              options={getTagOptions(t, i).sort((a, b) => {
                if (a.label < b.label) {
                  return -1;
                }
                if (a.label > b.label) {
                  return 1;
                }
                return 0;
              })}
              initialOption={{
                label: selectedByTag[t],
                value: selectedByTag[t],
              }}
              onOptionSet={(o: any) => {
                console.log("option set", o);
                updateSelected(t, o.value);
              }}
            ></DropdownSelect>
          </div>
        ))}
        <div className="p-2">
          {getFilteredEntries(Object.keys(tags).length).map((pe) => (
            <div
              onClick={(e) => onPortfolioSelected(pe.portfolioUrl)}
              key={pe.portfolioUrl}
              className="m-1 bg-bg7 hover:bg-bg8 dark:bg-bg3dark dark:hover:bg-bg5dark p-2 rounded-md text-center hover:cursor-pointer"
            >
              {pe.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSelector;
