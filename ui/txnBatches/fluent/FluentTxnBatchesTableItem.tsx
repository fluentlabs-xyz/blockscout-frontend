import React from 'react';

import type { VerifierBatch } from 'types/api/verifier';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import FluentVerifierBatchStatus from './FluentVerifierBatchStatus';

type Props = {
  item: VerifierBatch;
  isLoading?: boolean;
};

const FluentTxnBatchesTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">#{ item.index.toLocaleString() }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <FluentVerifierBatchStatus status={ item.status } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle" minW="220px">
        <Skeleton loading={ isLoading } display="inline-block">
          <HashStringShortenDynamic hash={ item.batch_root } noTooltip/>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" minW="220px">
        <Skeleton loading={ isLoading } display="inline-block">
          <HashStringShortenDynamic hash={ item.from_block_hash } noTooltip/>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" minW="220px">
        <Skeleton loading={ isLoading } display="inline-block">
          <HashStringShortenDynamic hash={ item.to_block_hash } noTooltip/>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ item.start_block.toLocaleString() }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ item.end_block.toLocaleString() }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ item.block_count.toLocaleString() }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ item.l1_event_block.toLocaleString() }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.interval_resolved ? 'Yes' : 'No' }</Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(FluentTxnBatchesTableItem);
