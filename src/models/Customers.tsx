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
    _id: 'string',
    name: 'string',
    about: 'string?',
    address: 'string?',
    age: 'int?',
    balance: 'string?',
    company: 'string?',
    email: 'string?',
    eyeColor: 'string?',
    favoriteFruit: 'string?',
    gender: 'string?',
    greeting: 'string?',
    guid: 'string?',
    index: 'int?',
    isActive: 'bool?',
    latitude: 'float?',
    longitude: 'float?',
    phone: 'string?',
    picture: 'string?',
    registered: 'string?',
  },
};

export default schema;
