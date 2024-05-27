import { Schema } from 'redis-om';
import { AbstractTokensSchema } from '../../schemas/base/base.abstract.tokens.schema';

export const UserRefreshTokensSchema = new Schema(
  'user:refresh',
  AbstractTokensSchema,
  {
    dataStructure: 'HASH',
  },
);
