import { Schema } from 'redis-om';
import { AbstractTokensSchema } from '../../schemas/base/base.abstract.tokens.schema';

export const UserVerifyTokensSchema = new Schema(
  'user:verify',
  AbstractTokensSchema,
  {
    dataStructure: 'HASH',
  },
);
