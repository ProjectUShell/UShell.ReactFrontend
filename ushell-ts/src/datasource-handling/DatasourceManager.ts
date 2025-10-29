import {
  SchemaRoot,
  EntitySchema,
  RelationSchema,
} from "fusefx-modeldescription";
import { IDataSource, IDataSourceManager, IDataStore } from "ushell-modulebase";
import { PortfolioManager } from "../portfolio-handling/PortfolioManager";
import { DatastoreDescription } from "ushell-portfoliodescription";
import { FuseDataStore } from "ushell-common-components";
import { TokenService } from "../authentication/TokenService";
import { ArgumentMapper } from "../portfolio-handling/ArgumentMapper";
import { PortfolioBasedMenuService } from "../portfolio-handling/PortfolioBasedMenuService";
import { LocalDataStore } from "./LocalDataStore";

export class DatasourceManager implements IDataSourceManager {
  private static _Instance: DatasourceManager | null = null;

  public static Instance(): DatasourceManager {
    if (!this._Instance) {
      this._Instance = new DatasourceManager();
    }
    return this._Instance;
  }

  private _IsInitialized: boolean = false;

  private _Stores: { [key: string]: IDataStore } = {};
  private _SchemaRoot: SchemaRoot | null = null;

  tryGetDataSourceByUid(uid: string): Promise<IDataSource | null> {
    throw new Error("Method not implemented.");
  }

  static isInitialized(): boolean {
    return this._Instance !== null && this._Instance._IsInitialized;
  }

  init(): Promise<void> {
    this._IsInitialized = false;
    return new Promise<void>((resolve) => {
      console.debug(
        "init DatasourceManager",
        PortfolioManager.GetModule().datastores
      );
      this._Stores = {};
      PortfolioManager.GetModule().datastores?.forEach((ds) => {
        const dataStore: IDataStore | null =
          DatasourceManager.tryCreateDataStore(ds);
        if (dataStore) {
          console.log("adding dataStore", ds);
          this._Stores[ds.key] = dataStore;
        }
      });
      FuseDataStore.getTokenMethod = (tokenSourceUid: string) => {
        return TokenService.getToken(tokenSourceUid)!;
      };
      this.initDataStores(0).then(() => {
        this._IsInitialized = true;
        return resolve();
      });
    });
  }
  initDataStores(i: number): Promise<void> {
    const key: string = Object.keys(this._Stores)[i];
    if (i > Object.keys(this._Stores).length - 1) {
      return new Promise<void>((resolve) => resolve());
    }
    return this._Stores[key]
      .init()
      .then(() => {
        const ds: IDataStore = this._Stores[key];
        console.debug(`DataStore initialized.`, ds);
        this.appendEntitySchema(ds.getSchemaRoot());
        return this.initDataStores(i + 1);
      })
      .catch((e) => console.error("Exception in initDataStores: " + e));
  }
  appendEntitySchema(sr: SchemaRoot) {
    if (!this._SchemaRoot) {
      this._SchemaRoot = { ...sr };
      this._SchemaRoot.entities = [...sr.entities];
      this._SchemaRoot.relations = [...sr.relations];
      return;
    }

    sr.entities.forEach((entity: EntitySchema) => {
      const existingEntity: EntitySchema | undefined =
        this._SchemaRoot?.entities.find((e) => e.name == entity.name);
      if (!existingEntity) {
        this._SchemaRoot?.entities.push(entity);
      }
    });

    sr.relations.forEach((relation: RelationSchema) => {
      const existing: RelationSchema | undefined =
        this._SchemaRoot?.relations.find(
          (e) =>
            e.primaryEntityName == relation.primaryEntityName &&
            e.foreignEntityName == relation.foreignEntityName &&
            (e.foreignKeyIndexName == relation.foreignKeyIndexName ||
              e.primaryNavigationName == relation.primaryEntityName)
        );
      if (!existing) {
        this._SchemaRoot?.relations.push(relation);
      }
    });
  }

  static pickAppScopeValueLabel(value: any): string {
    //TODO_KRN how to do this since objects are not supported as "_"-sidechannel values
    if (typeof value !== "object") return value;
    for (let p in value) {
      if (p.toLocaleLowerCase().includes("label")) return value[p];
    }
    return "object";
  }

  static tryCreateDataStore(ds: DatastoreDescription): IDataStore | null {
    switch (ds.providerClass) {
      case "fuse":
        const additionalBodyArgs: any = ArgumentMapper.resolveDynamicMapping(
          ds.providerArguments["additionalBodyArgs"],
          {},
          true
        );
        if (
          PortfolioManager.GetPortfolio().applicationScope &&
          Object.keys(PortfolioManager.GetPortfolio().applicationScope!)
            .length > 0
        ) {
          additionalBodyArgs["_"] = {};
          for (let appScopeEntry of PortfolioManager.GetPortfolio()
            .applicationScope!) {
            const appScopeValue = this.pickAppScopeValueLabel(
              appScopeEntry.initialValue
            );
            additionalBodyArgs["_"][appScopeEntry.name] = appScopeValue;
          }
        }

        const additionalHeaderArgs: any = ArgumentMapper.resolveDynamicMapping(
          ds.providerArguments["additionalHeaderArgs"],
          {},
          true
        );
        for (let headerKey in additionalHeaderArgs) {
          const originalValue =
            ds.providerArguments["additionalHeaderArgs"][headerKey];
          if (
            originalValue &&
            typeof originalValue === "object" &&
            "mapDynamic" in originalValue
          ) {
            additionalHeaderArgs[headerKey] =
              ArgumentMapper.resolveDynamicMapping(
                ds.providerArguments["additionalHeaderArgs"][headerKey],
                {},
                true
              );
          }
        }

        return new FuseDataStore(
          ds.providerArguments["url"],
          ds.providerArguments["routePattern"],
          ds.providerArguments["entitySchemaUrl"],
          ds.providerArguments["tokenSourceUid"],
          () => additionalBodyArgs,
          ds.providerArguments["getSchemaMethod"],
          () => additionalHeaderArgs
        );
      case "localstore":
        console.log("creating local data store", ds);
        return new LocalDataStore(ds.providerArguments["schema"] as string);
    }
    return null;
  }
  tryGetDataSource(
    entityName: string,
    storeName?: string | undefined
  ): IDataSource | null {
    console.log("tryGetDataSource", storeName);
    for (let dataStoreKey in this._Stores) {
      const dataStore: IDataStore = this._Stores[dataStoreKey];
      if (storeName && dataStoreKey != storeName) continue;
      const result = dataStore.tryGetDataSource(entityName);
      if (result) return result;
    }
    return null;
  }
  getSchemaRoot(): SchemaRoot {
    if (Object.keys(this._Stores).length == 0) return new SchemaRoot();
    return this._SchemaRoot!;
  }
}
