export const name = 'TASKS';
export type Tasks = {
  _id: number;
  name: string;
  status?: string;
};

const schema = {
  name,
  primaryKey: '_id',
  properties: {
    _id: 'int',
    name: 'string',
    status: 'string?',
  },
};

export default schema;
