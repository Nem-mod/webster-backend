import { SchemaDefinition } from 'redis-om';

export const AbstractTokensSchema: SchemaDefinition = {
  uuids: { type: 'string[]' },
};
