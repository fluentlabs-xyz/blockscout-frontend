import {
  Tag,
  Tr,
  Td,
  Tooltip,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TransactionTag } from 'types/api/account';

import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: TransactionTag;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const AddressTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <AddressLinkWithTooltip address={ item.transaction_hash }/>
      </Td>
      <Td>
        <Tooltip label={ item.name }>
          <Tag variant="gray" lineHeight="24px">
            { item.name }
          </Tag>
        </Tooltip>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Td>
    </Tr>
  );
};

export default AddressTagTableItem;
