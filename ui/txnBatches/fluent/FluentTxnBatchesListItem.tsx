import React from 'react';

import type { VerifierBatch } from 'types/api/verifier';

import { route } from 'nextjs-routes';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import FluentHashValue from './FluentHashValue';
import FluentVerifierBatchStatus from './FluentVerifierBatchStatus';

type Props = {
  item: VerifierBatch;
  isLoading?: boolean;
};

const FluentTxnBatchesListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container gridTemplateColumns="120px auto">
      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">#{ item.index.toLocaleString() }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <FluentVerifierBatchStatus status={ item.status } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Start block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.start_block.toLocaleString() }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>End block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.end_block.toLocaleString() }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Blocks</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.block_count.toLocaleString() }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 event block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.l1_event_block.toLocaleString() }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch root</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          <FluentHashValue hash={ item.batch_root }/>
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>From hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          <FluentHashValue
            hash={ item.from_block_hash }
            href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.from_block_hash } }) }
          />
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>To hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          <FluentHashValue
            hash={ item.to_block_hash }
            href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.to_block_hash } }) }
          />
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Resolved</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.interval_resolved ? 'Yes' : 'No' }</Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(FluentTxnBatchesListItem);
