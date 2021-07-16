export const name = 'USERS';
export type Users = {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  gender?: string;
  address?: string;
};

const schema = {
  name,
  primaryKey: 'id',
  properties: {
    id: 'int',
    first_name: 'string',
    last_name: 'string?',
    email: 'string?',
    gender: 'string?',
    address: 'string?',
  },
};

export default schema;
