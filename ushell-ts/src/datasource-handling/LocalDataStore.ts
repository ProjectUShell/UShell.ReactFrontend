import { IDataStore, IDataSource } from "ushell-modulebase";
import { SchemaRoot } from "fusefx-modeldescription";
import { LocalStoreDataSource } from "ushell-common-components/dist/cjs/data/LocalStoreDataSource";

export class LocalDataStore implements IDataStore {
  private schemaRoot: SchemaRoot | null = null;
  private schemaSource: string | SchemaRoot;
  private dataSources: Map<string, IDataSource> = new Map();

  /**
   * Takes a URL to a JSON file that contains the schema root or a SchemaRoot object directly.
   * Uses the LocalStoreDataSource to fetch the data.
   */
  constructor(schema: string | SchemaRoot) {
    this.schemaSource = schema;
  }

  /**
   * Loads the schema if needed and prepares LocalStoreDataSource instances for each entity.
   */
  async init(): Promise<void> {
    if (typeof this.schemaSource === "string") {
      const response = await fetch(this.schemaSource);
      this.schemaRoot = await response.json();
    } else {
      this.schemaRoot = this.schemaSource;
    }

    // Prepare a LocalStoreDataSource for each entity in the schema
    if (this.schemaRoot && this.schemaRoot.entities) {
      for (const entity of this.schemaRoot.entities) {
        this.dataSources.set(
          entity.name,
          new LocalStoreDataSource(entity.name, entity)
        );
      }
    }
  }

  getSchemaRoot(): SchemaRoot {
    if (!this.schemaRoot) {
      throw new Error("SchemaRoot not initialized. Call init() first.");
    }
    return this.schemaRoot;
  }

  tryGetDataSource(entityName: string): IDataSource | null {
    return this.dataSources.get(entityName) || null;
  }
}
