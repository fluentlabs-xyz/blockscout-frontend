import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { generateListStub } from 'stubs/utils';
import { VERIFIER_BATCH } from 'stubs/verifier';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import FluentTxnBatchesListItem from 'ui/txnBatches/fluent/FluentTxnBatchesListItem';
import FluentTxnBatchesTable from 'ui/txnBatches/fluent/FluentTxnBatchesTable';

const PAGE_LIMIT = 50;

const FluentL2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'verifier:batches',
    queryParams: {
      limit: PAGE_LIMIT,
    },
    options: {
      placeholderData: generateListStub<'verifier:batches'>(
        VERIFIER_BATCH,
        PAGE_LIMIT,
        {
          limit: PAGE_LIMIT,
          has_more: true,
          next_cursor: 272,
          next_page_params: {
            cursor: 272,
            limit: PAGE_LIMIT,
          },
        },
      ),
      select: (response) => ({
        ...response,
        next_page_params: response.has_more && typeof response.next_cursor === 'number' ? {
          cursor: response.next_cursor,
          limit: response.limit || PAGE_LIMIT,
        } : null,
      }),
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <FluentTxnBatchesListItem
            key={ item.index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <FluentTxnBatchesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ isPlaceholderData } display="flex" flexWrap="wrap">
        Txn batch
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].index } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].index } </Text>
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Txn batches" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText="There are no txn batches."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default FluentL2TxnBatches;
