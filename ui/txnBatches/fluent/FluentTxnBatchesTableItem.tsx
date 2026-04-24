import React from 'react';

import type { VerifierBatch } from 'types/api/verifier';

import { route } from 'nextjs-routes';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';

import FluentHashValue from './FluentHashValue';
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
          <FluentHashValue hash={ item.batch_root }/>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" minW="220px">
        <Skeleton loading={ isLoading } display="inline-block">
          <FluentHashValue
            hash={ item.from_block_hash }
            href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.from_block_hash } }) }
          />
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" minW="220px">
        <Skeleton loading={ isLoading } display="inline-block">
          <FluentHashValue
            hash={ item.to_block_hash }
            href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.to_block_hash } }) }
          />
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
