export const name = 'CUSTOMERS';
export type Customers = {
  about: 'string';
  address: 'string';
  age: 'number';
  balance: 'string';
  company: 'string';
  email: 'string';
  eyeColor: 'string';
  favoriteFruit: 'string';
  gender: 'string';
  greeting: 'string';
  guid: 'string';
  index: 'number';
  isActive: 'boolean';
  latitude: 'number';
  longitude: 'number';
  name: 'string';
  phone: 'string';
  picture: 'string';
  registered: 'string';
  _id: 'string';
};

const schema = {
  name,
  primaryKey: '_id',
  properties: {
    about: 'string',
    address: 'string',
    age: 'int',
    balance: 'string',
    company: 'string',
    email: 'string',
    eyeColor: 'string',
    favoriteFruit: 'string',
    gender: 'string',
    greeting: 'string',
    guid: 'string',
    index: 'int',
    isActive: 'bool',
    latitude: 'float',
    longitude: 'float',
    name: 'string',
    phone: 'string',
    picture: 'string',
    registered: 'string',
    _id: 'string',
  },
};

export default schema;
