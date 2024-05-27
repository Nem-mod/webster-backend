import { Schema } from 'redis-om';
import { AbstractTokensSchema } from '../../schemas/base/base.abstract.tokens.schema';

export const UserResetPswTokensSchema = new Schema(
  'user:reset-psw',
  AbstractTokensSchema,
  {
    dataStructure: 'HASH',
  },
);
