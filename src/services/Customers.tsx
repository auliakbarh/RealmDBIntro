import Service, {FetchAllResponse} from './Service';
import {CustomersType, CustomersSchemeName} from 'models';
import {Object, Results} from 'realm';
import MockData from '@/assets/json';

export default class Customers extends Service {
  private readonly name: string;
  private readonly realmObject: Realm.Results<Realm.Object>;
  constructor() {
    super();
    this.name = CustomersSchemeName;
    this.realmObject = this.realm().objects(CustomersSchemeName);
  }

  obj() {
    return this.realmObject;
  }

  async setDataCustomers() {
    const data: CustomersType[] = MockData.MOCK_DATA_CUSTOMER;
    await this.bulkInsert({name: this.name, data});
  }

  loadAllData() {
    const result: FetchAllResponse = this.fetchAll(this.name);
    return result.data;
  }

  async deleteAllData() {
    await this.truncate(this.name);
  }

  deleteById(_id: string) {
    this.realm().write(() => {
      const target: (Results<Object> & Object) | undefined =
        this.realm().objectForPrimaryKey(this.name, _id);
      this.realm().delete(target);
    });
  }

  sortByName(sortType: 'ASC' | 'DESC') {
    const target = this.realm().objects(this.name);
    return target.sorted('name', sortType === 'DESC');
  }

  insert(customerName: string) {
    this.realm().write(() => {
      const reversedObj = this.realmObject.sorted('_id', true);
      let _id: number = 1;
      if (reversedObj.length > 0) {
        // @ts-ignore
        _id = (parseInt(reversedObj[0]._id, 10) + 1) as number;
      }

      this.realm().create(
        // @ts-ignore
        this.name,
        {_id: _id.toString(), name: customerName},
        'modified',
      );
    });
  }

  update(_id: string, customerName: string) {
    this.realm().write(() => {
      // @ts-ignore
      this.realm().create(this.name, {_id, name: customerName}, 'modified');
    });
  }
}
