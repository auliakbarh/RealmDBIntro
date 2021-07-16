import Realm, {BaseConfiguration, Results} from 'realm';
import {
  UsersScheme,
  TasksSchemeName,
  TasksScheme,
  UsersSchemeName,
  CustomersScheme,
  CustomersSchemeName,
} from 'models';

export const schemeNames = [
  TasksSchemeName,
  UsersSchemeName,
  CustomersSchemeName,
];

export const dbName: string = 'RealmDBIntro.realm';
export const dbVersion: number = 0;

export const databaseOptions: BaseConfiguration = {
  path: dbName,
  schema: [UsersScheme, TasksScheme, CustomersScheme],
  schemaVersion: dbVersion,
};

type Response = {
  error: boolean;
  message?: any;
  data?: Results<Object> | {[key: string]: any};
};

export type BulkInsertResponse = Response;
export type DeleteResponse = Response;
export type TruncateResponse = Response;
export type TruncateAllResponse = Response;
export type GetSizeResponse = Response;
export type FetchAllResponse = Response;

export default class Services {
  private readonly db: Realm;
  private readonly schemeNames: string[];
  constructor() {
    this.db = new Realm(databaseOptions);
    this.schemeNames = schemeNames;
  }

  async bulkInsert({
    name,
    data,
  }: {
    name: string;
    data: any[];
  }): Promise<BulkInsertResponse> {
    let result: BulkInsertResponse = {error: true, message: ''};
    try {
      this.db.write(() => {
        data.forEach(item => {
          // @ts-ignore
          this.db.create(name, item, 'modified');
        });
        result = {
          error: false,
          data: this.db.objects(name),
        };
      });
      return result;
    } catch (e) {
      return {
        error: true,
        message: e,
      };
    }
  }

  realm() {
    return this.db;
  }

  allSchemeNames() {
    return this.schemeNames;
  }

  async delete({
    name,
    filterQuery,
  }: {
    name: string;
    filterQuery: string;
  }): Promise<DeleteResponse> {
    try {
      this.db.write(() => {
        const obj = this.db.objects(name).filtered(filterQuery);
        this.db.delete(obj);
      });
      return {
        error: false,
      };
    } catch (e) {
      return {
        error: true,
        message: e,
      };
    }
  }

  async truncate(name: string): Promise<TruncateResponse> {
    try {
      this.db.write(() => {
        this.db.delete(this.db.objects(name));
        // this.db.deleteModel(name);
      });
      return {error: false};
    } catch (e) {
      return {
        error: true,
        message: e,
      };
    }
  }

  async deleteModal(name: string): Promise<TruncateResponse> {
    try {
      this.db.write(() => {
        this.db.deleteModel(name);
      });
      return {error: false};
    } catch (e) {
      return {
        error: true,
        message: e,
      };
    }
  }

  async truncateAll(): Promise<TruncateAllResponse> {
    let result: TruncateAllResponse = {error: true, message: ''};
    try {
      this.db.write(() => {
        this.db.deleteAll();

        let data: {[key: string]: any} = {};
        this.schemeNames.forEach(name => {
          data[name] = this.db.objects(name);
        });

        result = {error: false, data};
      });
      return result;
    } catch (e) {
      return {error: true, message: e};
    }
  }

  async getSize(): Promise<GetSizeResponse> {
    let result: GetSizeResponse = {error: true, message: ''};
    try {
      this.db.write(() => {
        let data: {[key: string]: any} = {};
        this.schemeNames.forEach(item => {
          data[item] = this.db.objects(item).length;
        });
        result = {error: false, data};
      });
      return result;
    } catch (e) {
      return {
        error: true,
        message: e,
      };
    }
  }

  fetchAll(name: string): FetchAllResponse {
    let result: FetchAllResponse = {error: true, message: '', data: []};
    try {
      const data = this.db.objects(name);
      result = {
        error: false,
        data,
      };
    } catch (e) {
      return {
        error: true,
        message: e,
        data: [],
      };
    }
    return result;
  }
}
