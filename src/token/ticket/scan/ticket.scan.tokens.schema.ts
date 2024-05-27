import { Schema } from 'redis-om';
import { AbstractTokensSchema } from '../../schemas/base/base.abstract.tokens.schema';

export const TicketScanTokensSchema = new Schema(
  'ticket:scan',
  AbstractTokensSchema,
  {
    dataStructure: 'HASH',
  },
);
