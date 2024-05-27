import { Schema } from 'redis-om';
import { AbstractTokensSchema } from '../../schemas/base/base.abstract.tokens.schema';

export const UserAccessTokensSchema = new Schema(
  'user:access',
  AbstractTokensSchema,
  {
    dataStructure: 'HASH',
  },
);
