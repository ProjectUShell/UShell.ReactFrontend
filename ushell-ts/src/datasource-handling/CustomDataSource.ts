import { EntitySchema } from "fusefx-modeldescription";
import {
  LogicalExpression,
  PagingParams,
  SortingField,
  PaginatedList,
} from "fusefx-repositorycontract";
import { IDataSource } from "ushell-modulebase";

export class CustomDataSource implements IDataSource {
  dataSourceUid: string = crypto.randomUUID();
  entitySchema?: EntitySchema | undefined;
  entityFactoryMethod(): any {
    return {};
  }
  entityUpdateMethod(entity: any[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  entityInsertMethod(entity: any[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  entityDeleteMethod(entity: any[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  extractIdentityFrom(entity: object): object {
    throw new Error("Method not implemented.");
  }
  containsIdentityOf(entity: object): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getRecords(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[]
  ): Promise<PaginatedList> {
    return fetch(
      "https://ecct-demo.izks-mainz.de/forum/service.php?frame=orscfconnector&apikey=em%3BtYbhN0ZRXjIDkR7KRH91XI%2AZG%5Cj%2A%26a61r6p%23T%26tOFTOGLTTH693a3bvxLf%3FuJ3i4R%3F2t5&function=getEntities",
      {
        method: "POST",
        headers: undefined,
        body: null,
      }
    )
      .then((r) => r.json())
      .then((r) => {
        return { page: r, total: 10 };
      });
  }
  getRecord(identityFields: object): Promise<object> {
    throw new Error("Method not implemented.");
  }
  getEntityRefs(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[]
  ): Promise<PaginatedList> {
    throw new Error("Method not implemented.");
  }
}
