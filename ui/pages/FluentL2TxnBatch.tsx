import { useRouter } from 'next/router';
import React from 'react';

import type { VerifierBatch } from 'types/api/verifier';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { VERIFIER_BATCH } from 'stubs/verifier';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TextAd from 'ui/shared/ad/TextAd';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import PageTitle from 'ui/shared/Page/PageTitle';
import PrevNext from 'ui/shared/PrevNext';
import FluentVerifierBatchStatus from 'ui/txnBatches/fluent/FluentVerifierBatchStatus';

const PAGE_LIMIT = 1;

const PLACEHOLDER_DATA = {
  items: [ VERIFIER_BATCH ],
  limit: PAGE_LIMIT,
  has_more: true,
  next_cursor: VERIFIER_BATCH.index,
  next_page_params: {
    cursor: VERIFIER_BATCH.index,
    limit: PAGE_LIMIT,
  },
};

interface HashValueProps {
  hash: string;
  isLoading?: boolean;
}

const HashValue = ({ hash, isLoading }: HashValueProps) => {
  return (
    <>
      <Skeleton loading={ isLoading } display="inline-block">
        <HashStringShortenDynamic hash={ hash }/>
      </Skeleton>
      <CopyToClipboard text={ hash } isLoading={ isLoading }/>
    </>
  );
};

const FluentL2TxnBatch = () => {
  const router = useRouter();
  const number = getQueryParamString(router.query.number);

  throwOnAbsentParamError(number);

  const batchNumber = Number(number);
  const isBatchNumberValid = Number.isInteger(batchNumber) && batchNumber >= 0;

  const batchQuery = useApiQuery<'verifier:batches', unknown, VerifierBatch | undefined>('verifier:batches', {
    queryParams: isBatchNumberValid ? {
      limit: PAGE_LIMIT,
      cursor: batchNumber + 1,
    } : undefined,
    queryOptions: {
      enabled: isBatchNumberValid,
      placeholderData: PLACEHOLDER_DATA,
      select: (response) => response.items[0],
    },
  });

  const batch = batchQuery.data;
  const isLoading = batchQuery.isPlaceholderData;
  const isNotFound = !isLoading && !batchQuery.isError && (!batch || batch.index !== batchNumber);

  const nextBatchQuery = useApiQuery<'verifier:batches', unknown, VerifierBatch | undefined>('verifier:batches', {
    queryParams: isBatchNumberValid ? {
      limit: PAGE_LIMIT,
      cursor: batchNumber + 2,
    } : undefined,
    queryOptions: {
      enabled: isBatchNumberValid && !isNotFound,
      select: (response) => response.items[0],
    },
  });

  const hasNextBatch = nextBatchQuery.data?.index === batchNumber + 1;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!isBatchNumberValid) {
      return;
    }

    if (direction === 'next' && !hasNextBatch) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextNumber = batchNumber + increment;

    if (nextNumber < 0) {
      return;
    }
    router.push({ pathname: '/batches/[number]', query: { number: String(nextNumber) } }, undefined);
  }, [ batchNumber, hasNextBatch, isBatchNumberValid, router ]);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title={ `Txn batch #${ number }` }/>

      { !isBatchNumberValid || batchQuery.isError || isNotFound ? <DataFetchAlert/> : null }

      { batch ? (
        <DetailedInfo.Container>
          <DetailedInfo.ItemLabel>
            Txn batch number
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } display="inline-block">{ batch.index.toLocaleString() }</Skeleton>
            <PrevNext
              ml={ 6 }
              onClick={ handlePrevNextClick }
              prevLabel="View previous txn batch"
              nextLabel="View next txn batch"
              isPrevDisabled={ batch.index === 0 }
              isNextDisabled={ !hasNextBatch }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            Status
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <FluentVerifierBatchStatus status={ batch.status } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            Batch root
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <HashValue hash={ batch.batch_root } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            From block hash
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <HashValue hash={ batch.from_block_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            To block hash
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <HashValue hash={ batch.to_block_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            Start block
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntity number={ batch.start_block } isLoading={ isLoading } noIcon/>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            End block
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntity number={ batch.end_block } isLoading={ isLoading } noIcon/>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            Blocks
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } display="inline-block">{ batch.block_count.toLocaleString() }</Skeleton>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            L1 event block
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntityL1 number={ batch.l1_event_block } isLoading={ isLoading } noIcon/>
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel>
            Resolved
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } display="inline-block">{ batch.interval_resolved ? 'Yes' : 'No' }</Skeleton>
          </DetailedInfo.ItemValue>
        </DetailedInfo.Container>
      ) : null }
    </>
  );
};

export default FluentL2TxnBatch;
