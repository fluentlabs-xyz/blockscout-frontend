import { Box, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type {
  FluentBridgeTransactionItem,
  FluentBridgeTransactionsResponse,
  FluentBridgeTransferType,
} from 'types/api/fluentBridge';
import type { VerifierBatchStatus } from 'types/api/verifier';
import type { PaginationParams } from 'ui/shared/pagination/types';

import config from 'configs/app';
import useFetch from 'lib/hooks/useFetch';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { nbsp, rightLineArrow } from 'toolkit/utils/htmlEntities';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import PageTitle from 'ui/shared/Page/PageTitle';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import FluentVerifierBatchStatus from 'ui/txnBatches/fluent/FluentVerifierBatchStatus';

const PAGE_LIMIT = 50;
const SKELETON_ROWS_COUNT = 10;
const FLUENT_BRIDGE_TRANSACTIONS_API = config.services.fluentBridgeTransactionsApi;

interface Props {
  transferType: FluentBridgeTransferType;
}

function makeSkeletonItem(transferType: FluentBridgeTransferType): FluentBridgeTransactionItem {
  return {
    transfer_type: transferType,
    direction: transferType === 'deposit' ? 'l1_to_l2' : 'l2_to_l1',
    status: '',
    message_hash: '',
    sender: '',
    recipient: '',
    sender_gateway: '',
    receiver_gateway: '',
    asset_type: '',
    amount: '0',
    l1_tx_hash: null,
    l2_tx_hash: null,
    sent_tx_hash: null,
    received_tx_hash: null,
    source_stream: '',
    target_stream: '',
    sent_block_number: null,
    received_block_number: null,
    l1_block_number: null,
    l2_block_number: null,
    batch_index: null,
    batch_status_code: null,
    batch_status_name: null,
    sent_at: null,
    received_at: null,
    successful_call: null,
    value: null,
    fee: null,
    chain_id: null,
    valid_until_block_number: null,
    nonce: null,
    data: null,
  };
}

const FluentBridgeTransactionsTableRow = ({ item, isLoading }: { item: FluentBridgeTransactionItem; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell><Skeleton loading display="inline-block" minW="120px">0x0</Skeleton></TableCell>
        <TableCell><Skeleton loading display="inline-block" minW="150px">0x0</Skeleton></TableCell>
        <TableCell><Skeleton loading display="inline-block" minW="150px">0x0</Skeleton></TableCell>
        <TableCell isNumeric><Skeleton loading display="inline-block" minW="90px">0</Skeleton></TableCell>
        <TableCell><Skeleton loading display="inline-block" minW="70px">#0</Skeleton></TableCell>
        <TableCell><Skeleton loading display="inline-block" minW="110px">status</Skeleton></TableCell>
        <TableCell><Skeleton loading display="inline-block" minW="120px">time</Skeleton></TableCell>
      </TableRow>
    );
  }

  const batchStatus: VerifierBatchStatus | null = item.batch_status_name ? {
    code: item.batch_status_code ?? -1,
    name: item.batch_status_name,
  } : null;

  return (
    <TableRow>
      <TableCell verticalAlign="middle" minW="220px">
        { item.message_hash ? <HashStringShortenDynamic hash={ item.message_hash } noTooltip/> : <Text color="text.secondary">-</Text> }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.l1_tx_hash ? (
          <TxEntityL1 hash={ item.l1_tx_hash } truncation="constant_long" noIcon noCopy/>
        ) : (
          <Text color="text.secondary">-</Text>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.l2_tx_hash ? (
          <TxEntity hash={ item.l2_tx_hash } truncation="constant_long" noIcon/>
        ) : (
          <Text color="text.secondary">-</Text>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Text>{ item.amount || '0' }</Text>
      </TableCell>
      <TableCell verticalAlign="middle">
        { typeof item.batch_index === 'number' ? (
          <BatchEntityL2 number={ item.batch_index } noIcon/>
        ) : (
          <Text color="text.secondary">Not included</Text>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle">
        { batchStatus ? <FluentVerifierBatchStatus status={ batchStatus }/> : <Text color="text.secondary">-</Text> }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.sent_at ? <TimeWithTooltip timestamp={ item.sent_at } color="text.secondary"/> : <Text color="text.secondary">-</Text> }
      </TableCell>
    </TableRow>
  );
};

const FluentBridgeTransactionsPage = ({ transferType }: Props) => {
  const apiFetch = useFetch();
  const [ page, setPage ] = React.useState(1);
  const offset = (page - 1) * PAGE_LIMIT;

  const query = useQuery({
    queryKey: [ 'fluent-bridge-transactions', transferType, page, PAGE_LIMIT ],
    queryFn: async({ signal }) => {
      const url = new URL(FLUENT_BRIDGE_TRANSACTIONS_API);
      url.searchParams.set('transfer_type', transferType);
      url.searchParams.set('limit', String(PAGE_LIMIT));
      url.searchParams.set('offset', String(offset));

      return apiFetch<FluentBridgeTransactionsResponse, unknown>(
        url.toString(),
        { signal },
        { resource: '/indexer/v1/transactions' },
      ) as Promise<FluentBridgeTransactionsResponse>;
    },
    placeholderData: {
      items: Array.from({ length: SKELETON_ROWS_COUNT }, () => makeSkeletonItem(transferType)),
      limit: PAGE_LIMIT,
      offset,
      has_more: true,
      next_offset: offset + PAGE_LIMIT,
    },
  });

  const { data, isError, isPlaceholderData } = query;

  const pagination: PaginationParams = React.useMemo(() => ({
    page,
    onNextPageClick: () => setPage((prev) => prev + 1),
    onPrevPageClick: () => setPage((prev) => Math.max(1, prev - 1)),
    resetPage: () => setPage(1),
    hasPages: page > 1,
    hasNextPage: Boolean(data?.has_more),
    canGoBackwards: page > 1,
    isLoading: isPlaceholderData,
    isVisible: page > 1 || Boolean(data?.has_more),
  }), [ data?.has_more, isPlaceholderData, page ]);

  const title = transferType === 'deposit' ?
    `Deposits (${ layerLabels.parent }${ nbsp }${ rightLineArrow }${ nbsp }${ layerLabels.current })` :
    `Withdrawals (${ layerLabels.current }${ nbsp }${ rightLineArrow }${ nbsp }${ layerLabels.parent })`;

  const emptyText = transferType === 'deposit' ? 'There are no deposits.' : 'There are no withdrawals.';

  const listLabel = transferType === 'deposit' ? 'deposits' : 'withdrawals';
  const currentOffset = data?.offset ?? offset;
  const currentItemsCount = data?.items?.length ?? 0;
  const fromItem = currentItemsCount > 0 ? currentOffset + 1 : 0;
  const toItem = currentOffset + currentItemsCount;

  const text = isError ? null : (
    <Skeleton loading={ isPlaceholderData } display="inline-block">
      Showing { fromItem.toLocaleString() }-{ toItem.toLocaleString() } { listLabel }
    </Skeleton>
  );

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  const content = data?.items ? (
    <Box overflowX="auto">
      <TableRoot tableLayout="auto" minW="1320px">
        <TableHeaderSticky top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
          <TableRow>
            <TableColumnHeader>Message hash</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.parent } txn hash</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.current } txn hash</TableColumnHeader>
            <TableColumnHeader isNumeric>Amount (raw)</TableColumnHeader>
            <TableColumnHeader>Batch inclusion</TableColumnHeader>
            <TableColumnHeader>Batch status</TableColumnHeader>
            <TableColumnHeader>
              Sent at
              <TimeFormatToggle/>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.items.map((item, index) => (
            <FluentBridgeTransactionsTableRow
              key={ `${ item.message_hash || 'tx' }-${ item.batch_index ?? 'none' }-${ index }` }
              item={ item }
              isLoading={ isPlaceholderData }
            />
          )) }
        </TableBody>
      </TableRoot>
    </Box>
  ) : null;

  return (
    <>
      <PageTitle title={ title } withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText={ emptyText }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(FluentBridgeTransactionsPage);
