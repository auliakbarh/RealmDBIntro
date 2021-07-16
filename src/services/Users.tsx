import Service, {FetchAllResponse} from './Service';
import {UsersSchemeName, UsersType} from 'models';
import {Object, Results} from 'realm';
import MockData from '@/assets/json';

export default class Users extends Service {
  private readonly name: string;
  private readonly realmObject: Realm.Results<Realm.Object>;
  constructor() {
    super();
    this.name = UsersSchemeName;
    this.realmObject = this.realm().objects(UsersSchemeName);
  }

  obj() {
    return this.realmObject;
  }

  async setDataUsers() {
    const data: UsersType[] = MockData.MOCK_DATA_USER;
    await this.bulkInsert({name: this.name, data});
  }

  loadAllData() {
    const result: FetchAllResponse = this.fetchAll(this.name);
    return result.data;
  }

  async deleteAllData() {
    await this.truncate(this.name);
  }

  deleteById(id: number) {
    this.realm().write(() => {
      const target: (Results<Object> & Object) | undefined =
        this.realm().objectForPrimaryKey(this.name, id);
      this.realm().delete(target);
    });
  }

  sortByFirstName(sortType: 'ASC' | 'DESC') {
    const target = this.realm().objects(this.name);
    return target.sorted('first_name', sortType === 'DESC');
  }

  insert(firstName: string) {
    this.realm().write(() => {
      const reversedObj = this.realmObject.sorted('id', true);
      let id: number = 1;
      if (reversedObj.length > 0) {
        // @ts-ignore
        id = (reversedObj[0].id + 1) as number;
      }

      // @ts-ignore
      this.realm().create(this.name, {id, first_name: firstName}, 'modified');
    });
  }

  update(id: number, firstName: string) {
    this.realm().write(() => {
      // @ts-ignore
      this.realm().create(this.name, {id, first_name: firstName}, 'modified');
    });
  }
}
