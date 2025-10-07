import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Tag } from 'toolkit/chakra/tag';
export interface Props extends BadgeProps {
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER: Array<TransactionType> = [
  'blob_transaction',
  'rootstock_remasc',
  'rootstock_bridge',
  'token_creation',
  'contract_creation',
  'token_transfer',
  'contract_call',
  'coin_transfer',
];

const TxType = ({ types, isLoading }: Props) => {
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;

  switch (typeToShow) {
    case 'contract_call':
      label = 'Contract call';
      break;
    case 'blob_transaction':
      label = 'Blob txn';
      break;
    case 'contract_creation':
      label = 'Contract creation';
      break;
    case 'token_transfer':
      label = 'Token transfer';
      break;
    case 'token_creation':
      label = 'Token creation';
      break;
    case 'coin_transfer':
      label = 'Coin transfer';
      break;
    case 'rootstock_remasc':
      label = 'REMASC';
      break;
    case 'rootstock_bridge':
      label = 'Bridge';
      break;
    default:
      label = 'Transaction';
  }

  if (!label) {
    return null;
  }

  return (
    <Tag variant="surface" borderColor="transparent" boxShadow="none" background="transparent" p={ 0 } >
      { !isLoading ? label : '' }
    </Tag>
  );
};

export default TxType;
