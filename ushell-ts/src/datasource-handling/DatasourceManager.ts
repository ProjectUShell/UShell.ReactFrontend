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

export class DatasourceManager implements IDataSourceManager {
  private static _Instance: DatasourceManager | null = null;

  public static Instance(): DatasourceManager {
    if (!this._Instance) {
      this._Instance = new DatasourceManager();
    }
    return this._Instance;
  }

  private _Stores: IDataStore[] = [];
  private _SchemaRoot: SchemaRoot | null = null;

  tryGetDataSourceByUid(uid: string): Promise<IDataSource | null> {
    throw new Error("Method not implemented.");
  }
  init(): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log(
        "init DatasourceManager",
        PortfolioManager.GetModule().datastores
      );
      this._Stores = [];
      PortfolioManager.GetModule().datastores?.forEach((ds) => {
        const dataStore: IDataStore | null =
          DatasourceManager.tryCreateDataStore(ds);
        if (dataStore) {
          console.log("adding dataStore", dataStore);

          this._Stores.push(dataStore);
        }
      });
      FuseDataStore.getTokenMethod = (tokenSourceUid: string) => {
        console.log("getTokenMethod", {
          tokenSourceUid: tokenSourceUid,
          tokenService: TokenService,
        });
        return TokenService.getToken(tokenSourceUid)!;
      };
      this.initDataStores(0).then(() => {
        console.log("finish init", this._SchemaRoot);
        return resolve();
      });
    });
  }
  initDataStores(i: number): Promise<void> {
    if (i > this._Stores.length - 1) {
      return new Promise<void>((resolve) => resolve());
    }
    return this._Stores[i]
      .init()
      .then(() => {
        const ds: IDataStore = this._Stores[i];
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
    console.log("appending SchemaRoot", {
      current: this._SchemaRoot,
      appending: sr,
    });
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
          for (let dimension in PortfolioManager.GetPortfolio()
            .applicationScope) {
            additionalBodyArgs["_"][dimension] =
              PortfolioManager.GetPortfolio().applicationScope![dimension];
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
            console.log(
              "additionalHeaderArgs before " + headerKey,
              ds.providerArguments["additionalHeaderArgs"][headerKey]
            );
            additionalHeaderArgs[headerKey] =
              ArgumentMapper.resolveDynamicMapping(
                ds.providerArguments["additionalHeaderArgs"][headerKey],
                {},
                true
              );
            console.log(
              "additionalHeaderArgs after " + headerKey,
              additionalHeaderArgs[headerKey]
            );
          }
        }
        console.log("additionalHeaderArgs", additionalHeaderArgs);
        return new FuseDataStore(
          ds.providerArguments["url"],
          ds.providerArguments["routePattern"],
          ds.providerArguments["entitySchemaUrl"],
          ds.providerArguments["tokenSourceUid"],
          additionalBodyArgs,
          ds.providerArguments["getSchemaMethod"],
          additionalHeaderArgs
        );
    }
    return null;
  }
  tryGetDataSource(
    entityName: string,
    storeName?: string | undefined
  ): IDataSource | null {
    console.log("tryGetDataSource", entityName);
    for (let dataStore of this._Stores) {
      console.log("trying tryGetDataSource", dataStore);
      const result = dataStore.tryGetDataSource(entityName);
      console.log("result of tryGetDataSource", result);
      if (result) return result;
    }
    return null;
  }
  getSchemaRoot(): SchemaRoot {
    console.log("getSchemaRoot", this._Stores);
    if (this._Stores.length == 0) return new SchemaRoot();
    return this._SchemaRoot!;
  }
}
