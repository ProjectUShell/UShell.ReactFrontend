import { v4 as uuidv4 } from "uuid";
import { PortfolioManager } from "./PortfolioManager";

export class ArgumentMapper {
  public static resolveDynamicMapping(
    argumentObject: any,
    sourceUseCaseUow: object,
    forceClone: boolean,
    commandArgs?: object
  ): any {
    if (!argumentObject) {
      return {};
    }
    if (!argumentObject["mapDynamic"]) {
      console.debug("no 'mapDynamic'");
      if (forceClone) {
        let clone: object = {};
        ArgumentMapper.copyRecursive(argumentObject, clone);
        return clone;
      } else {
        return argumentObject;
      }
    }

    // let settingsGetter: Observable<Object[]>;
    // if(this.settings){
    //     settingsGetter = this.settings.getRecords()
    // }
    // else{
    //     settingsGetter = of([] as Object[]);
    // }

    // return settingsGetter.pipe(map((allSettingsObjects)=>{

    console.debug("resolveDynamicMapping is using sourceUseCaseUow:");
    console.debug(sourceUseCaseUow);

    let mappingEntries = argumentObject["mapDynamic"] as {
      use: string;
      for: string;
    }[];

    let clone: object = {};
    this.copyRecursive(argumentObject, clone);

    for (var mappingEntry of mappingEntries) {
      let value: any = null;
      let error: string | null = null;
      let sourcePath: string = mappingEntry.use.substring(
        mappingEntry.use.indexOf("://") + 3
      );
      if (mappingEntry.use.startsWith("setting://")) {
        // if(this.settings){
        //     let settingsObjectKey = sourcePath.substring(0, sourcePath.indexOf("."));
        //     let settingsPropertyName = sourcePath.substring(sourcePath.indexOf(".") + 1);
        //     let settingsObj = allSettingsObjects.filter((obj,idx,arr)=>obj['settingsKey']==settingsObjectKey)[0];
        //     if(settingsObj){
        //         value = ArgumentMapper.pickValue(settingsObj, settingsPropertyName);
        //     }
        //     else{
        //         error = "There is no record in the Settings-DataSource with key '" + settingsObjectKey + "'";
        //     }
        // }
        // else{
        //     error = "Settings-DataSource not found";
        // }
      } else if (mappingEntry.use.startsWith("commandArgs://")) {
        if (commandArgs) {
          value = ArgumentMapper.pickValue(commandArgs, sourcePath);
        }
      } else if (mappingEntry.use.startsWith("factory://")) {
        if (sourcePath == "uuid") {
          value = (uuidv4() as string).toLowerCase();
        } else if (sourcePath == "UUID") {
          value = (uuidv4() as string).toUpperCase();
        } else if (sourcePath == "now") {
          value = Date.now();
        } else {
          error = "there is no known factory for: " + sourcePath;
        }
      } else if (mappingEntry.use.startsWith("unitOfWork://")) {
        if (sourceUseCaseUow) {
          value = ArgumentMapper.pickValue(sourceUseCaseUow, sourcePath);
        }
      } else if (mappingEntry.use.startsWith("applicationScope://")) {
        const applicationScope: any =
          PortfolioManager.GetPortfolio().applicationScope;
        value = ArgumentMapper.pickValue(applicationScope, sourcePath);
      } else if (mappingEntry.use.startsWith("userInput://")) {
        error = "this channel is under construction!";
      } else {
        error = "dont know the channel for: " + mappingEntry.use;
      }

      if (value == undefined) {
        error = "value for " + mappingEntry.use + " is UNDEFINED!!!";
      }

      if (error) {
        console.error("resolveArgumentMapping failed: " + error);
      } else {
        console.debug(
          "resolveArgumentMapping: using '" +
            value +
            "' for '" +
            mappingEntry.for +
            "'"
        );
        ArgumentMapper.applyValue(value, clone, mappingEntry.for);
      }
    }

    return clone;
    // }));
  }

  // private getValueFromSettings(sourcePath: string): Observable<object>
  // {
  //     let settingsObjectKey = sourcePath.substring(0, sourcePath.indexOf("."));
  //     let settingsPropertyName = sourcePath.substring(sourcePath.indexOf(".") + 1);
  //     return this.settings.getRecord({settingsKey: settingsObjectKey}).pipe(map((settingsObj)=> {
  //         return ArgumentMapper.pickValue(settingsObj, settingsPropertyName);
  //     }))
  // }

  public static copyRecursive(source: object, target: any): void {
    for (const [key, value] of Object.entries(source)) {
      if (key == "mapDynamic") {
      } else if (value == null) {
        target[key] = null;
      } else if (Array.isArray(value)) {
        if (!target[key]) {
          target[key] = [];
        }
        for (var arrayItem of value) {
          if (arrayItem == null) {
            target[key].push(null);
          } else if (typeof arrayItem === "object") {
            let clone = {};
            this.copyRecursive(arrayItem, clone);
            target[key].push(clone);
          } else {
            target[key].push(arrayItem);
          }
        }
      } else if (typeof value === "object") {
        if (!target[key]) {
          target[key] = {};
        }
        this.copyRecursive(value, target[key]);
      } else {
        target[key] = value;
      }
    }
  }

  public static pickValue(sourceObject: any, path: string): any {
    let idx = path.indexOf(".");
    if (idx < 0) {
      // return sourceObject;
      return sourceObject[path];
    }
    let propName: string = path.substring(0, idx);
    if (propName) {
      if (sourceObject[propName]) {
        return this.pickValue(sourceObject[propName], path.substring(idx + 1));
      }
    }
    return null;
  }

  private static applyValue(value: any, targetObject: any, targetPath: string) {
    let idx = targetPath.indexOf(".");
    if (idx < 0) {
      targetObject[targetPath] = value;
    } else {
      let propName: string = targetPath.substring(0, idx);
      if (propName) {
        if (!targetObject[propName]) {
          targetObject[propName] = {};
        }
        ArgumentMapper.applyValue(
          value,
          targetObject[propName],
          targetPath.substring(idx + 1)
        );
      }
    }
  }

  // public static resolvePlaceholders(input: string, startToken: string, endToken: string, getter: (name:string)=> string|null ): string {
  //     let brStartIdx: number = -1;
  //     brStartIdx = input.indexOf(startToken);
  //     let loopProtector: number = 0;
  //     while (brStartIdx >= 0){
  //         loopProtector++;
  //         let brEndIdx: number = input.indexOf(endToken, brStartIdx + 1);
  //         if(brEndIdx == -1 || loopProtector > 5){
  //             return input;
  //         }
  //         let keyPath: string = input.substring(brStartIdx + 1, brEndIdx);
  //         let value = getter(keyPath);

  //         if(value == undefined || value == null){
  //             input = input.replace(startToken + keyPath + endToken, "");
  //         }
  //         else{
  //             input = input.replace(startToken + keyPath + endToken, value?.toString());
  //         }
  //         input = input.replace("''", "").trim();
  //         //next
  //         brStartIdx = input.indexOf(startToken);
  //     }
  //     return input;
  // }
}
