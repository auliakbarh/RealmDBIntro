import Realm, {BaseConfiguration, Results} from 'realm';
import {UsersScheme, TasksScheme} from 'models';

export const databaseOptions: BaseConfiguration = {
  path: 'MyRealm.realm',
  schema: [UsersScheme, TasksScheme],
  schemaVersion: 0,
};

type BulkInsertResponse = {
  error: boolean;
  message?: any;
  data?: Results<Object>;
};

export default class Services {
  private db: Realm;
  constructor() {
    this.db = new Realm(databaseOptions);
  }

  async bulkInsert({
    name,
    data,
    primaryKey,
  }: {
    name: string;
    data: any[];
    primaryKey: string;
  }): Promise<BulkInsertResponse> {
    let result: BulkInsertResponse = {error: true, message: ''};
    try {
      this.db.write(() => {
        data.forEach(item => {
          if (
            this.db.objects(name).filtered(`${primaryKey}==${item[primaryKey]}`)
              .length === 0
          ) {
            this.db.create(name, item);
          }
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
        message: e.message,
      };
    }
  }
}
