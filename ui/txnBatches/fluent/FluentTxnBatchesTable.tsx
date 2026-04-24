import React from 'react';

import type { VerifierBatch } from 'types/api/verifier';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import FluentTxnBatchesTableItem from './FluentTxnBatchesTableItem';

type Props = {
  items: Array<VerifierBatch>;
  top: number;
  isLoading?: boolean;
};

const FluentTxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="1320px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Batch #</TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
          <TableColumnHeader>Batch root</TableColumnHeader>
          <TableColumnHeader>From block hash</TableColumnHeader>
          <TableColumnHeader>To block hash</TableColumnHeader>
          <TableColumnHeader isNumeric>Start block</TableColumnHeader>
          <TableColumnHeader isNumeric>End block</TableColumnHeader>
          <TableColumnHeader isNumeric>Blocks</TableColumnHeader>
          <TableColumnHeader isNumeric>L1 event block</TableColumnHeader>
          <TableColumnHeader>Resolved</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <FluentTxnBatchesTableItem
            key={ item.index + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(FluentTxnBatchesTable);
