import { SchemaRoot } from "fusefx-modeldescription";
import { IDataSource, IDataStore } from "ushell-modulebase";
import { CustomDataSource } from "./CustomDataSource";

export class CustomDataStore implements IDataStore {
  private _SchemaRoot: SchemaRoot | null = null;
  private _GetSchemaRootUrl: string;

  constructor(getSchemaRootUrl: string) {
    this._GetSchemaRootUrl = getSchemaRootUrl;
  }

  init(): Promise<void> {
    return fetch(this._GetSchemaRootUrl, {
      method: "POST",
      headers: undefined,
      body: null,
    })
      .then((r) => r.json())
      .then((r) => r.return)
      .catch((e) => null)
      .then((sr) => {
        if (!sr) {
          throw "no SchemaRoot";
        }
        this._SchemaRoot = sr;
      });
  }
  getSchemaRoot(): SchemaRoot {
    if (this._SchemaRoot) {
      return this._SchemaRoot;
    }
    throw "no SchemaRoot";
  }
  tryGetDataSource(enityName: string): IDataSource | null {
    return new CustomDataSource();
  }
}
