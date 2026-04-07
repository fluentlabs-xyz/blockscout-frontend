import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';

import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataListDisplay from 'ui/shared/DataListDisplay';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import HashStringShorten from 'ui/shared/HashStringShorten';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import Time from 'ui/shared/time/Time';
import { decodeRuntimeUpgradedLog, getRuntimeUpgradeLogsApiUrl, RUNTIME_UPGRADED_TOPIC, RUNTIME_UPGRADE_ADDRESS } from 'ui/runtimeUpgrades/utils';

const RuntimeUpgrades = () => {
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'general:address_logs',
    pathParams: { hash: RUNTIME_UPGRADE_ADDRESS },
    queryParams: { topic: RUNTIME_UPGRADED_TOPIC },
    options: {
      placeholderData: generateListStub<'general:address_logs'>(LOG, 3, { next_page_params: {
        block_number: 9005750,
        index: 42,
        items_count: 50,
        transaction_index: 23,
      } }),
    },
  });

  const apiLogsUrl = React.useMemo(() => getRuntimeUpgradeLogsApiUrl(), []);

  const rows = React.useMemo(() => {
    return (data?.items || []).map((item) => ({
      item,
      decoded: decodeRuntimeUpgradedLog(item),
    }));
  }, [ data?.items ]);

  const actionBar = (
    <ActionBar mt={ -6 } showShadow justifyContent={{ base: 'space-between', lg: 'end' }}>
      <Link href={ apiLogsUrl } external noIcon color="link.primary" fontWeight={ 500 }>
        Download raw logs (JSON)
      </Link>
      <Pagination ml={{ base: 0, lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const titleSecondRow = (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      gap={{ base: 2, lg: 4 }}
      alignItems={{ base: 'flex-start', lg: 'center' }}
      color="text.secondary"
      fontSize="sm"
    >
      <HStack gap={ 2 }>
        <Text as="span">Source contract:</Text>
        <AddressEntity
          address={{ hash: RUNTIME_UPGRADE_ADDRESS }}
          noIcon
          truncation="constant"
          maxW="400px"
          fontWeight={ 600 }
        />
      </HStack>
      <HStack gap={ 2 }>
        <Text as="span">Event:</Text>
        <Badge colorPalette="blue">RuntimeUpgraded</Badge>
      </HStack>
    </Flex>
  );

  const content = rows.length ? (
    <>
      <Box hideBelow="lg" overflowX="auto">
        <TableRoot minW="1200px" tableLayout="fixed">
          <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
            <TableRow>
              <TableColumnHeader w="150px">Block</TableColumnHeader>
              <TableColumnHeader w="280px">Transaction</TableColumnHeader>
              <TableColumnHeader w="280px">Target address</TableColumnHeader>
              <TableColumnHeader w="220px">Genesis version</TableColumnHeader>
              <TableColumnHeader w="250px">Genesis hash</TableColumnHeader>
              <TableColumnHeader w="250px">Code hash</TableColumnHeader>
              <TableColumnHeader w="170px">Timestamp</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { rows.map(({ item, decoded }) => (
              <RuntimeUpgradeTableRow key={ `${ item.transaction_hash || 'tx' }-${ item.index }` } item={ item } decoded={ decoded } isLoading={ isPlaceholderData }/>
            )) }
          </TableBody>
        </TableRoot>
      </Box>

      <VStack hideFrom="lg" gap={ 3 } alignItems="stretch">
        { rows.map(({ item, decoded }) => (
          <RuntimeUpgradeCard key={ `${ item.transaction_hash || 'tx' }-${ item.index }` } item={ item } decoded={ decoded } isLoading={ isPlaceholderData }/>
        )) }
      </VStack>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle
        title="Runtime upgrades"
        secondRow={ titleSecondRow }
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ rows.length }
        emptyText="There are no runtime upgrade events yet."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </Box>
  );
};

interface RuntimeUpgradeRowProps {
  item: Log;
  decoded: ReturnType<typeof decodeRuntimeUpgradedLog>;
  isLoading?: boolean;
}

const RuntimeUpgradeTableRow = ({ item, decoded, isLoading }: RuntimeUpgradeRowProps) => {
  return (
    <TableRow>
      <TableCell>
        { typeof item.block_number === 'number' ? (
          <BlockEntity number={ item.block_number } noIcon isLoading={ isLoading } fontWeight={ 600 }/>
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </TableCell>
      <TableCell>
        { item.transaction_hash ? (
          <TxEntity hash={ item.transaction_hash } noIcon isLoading={ isLoading } truncation="constant" maxW="100%"/>
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </TableCell>
      <TableCell>
        { decoded.targetAddress ? (
          <AddressEntity
            address={{ hash: decoded.targetAddress }}
            noIcon
            isLoading={ isLoading }
            truncation="constant"
            maxW="100%"
          />
        ) : (
          <Text color="text.secondary">Unable to decode</Text>
        ) }
      </TableCell>
      <TableCell>
        <Text noOfLines={ 2 }>{ decoded.genesisVersion || '—' }</Text>
      </TableCell>
      <TableCell>
        <HashCell value={ decoded.genesisHash } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        <HashCell value={ decoded.codeHash } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        { item.block_timestamp ? <Time timestamp={ item.block_timestamp } format="DD MMM YYYY, HH:mm:ss"/> : <Text color="text.secondary">—</Text> }
      </TableCell>
    </TableRow>
  );
};

const RuntimeUpgradeCard = ({ item, decoded, isLoading }: RuntimeUpgradeRowProps) => {
  return (
    <Box borderWidth="1px" borderColor="border.divider" borderRadius="lg" p={ 4 }>
      <VStack alignItems="stretch" gap={ 2 }>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <Text fontWeight={ 600 }>RuntimeUpgraded</Text>
          <Badge colorPalette={ decoded.isDecoded ? 'green' : 'orange' }>{ decoded.isDecoded ? 'Decoded' : 'Partial' }</Badge>
        </HStack>

        <RowLabel label="Block">
          { typeof item.block_number === 'number' ? <BlockEntity number={ item.block_number } noIcon isLoading={ isLoading }/> : <Text color="text.secondary">—</Text> }
        </RowLabel>

        <RowLabel label="Transaction">
          { item.transaction_hash ? <TxEntity hash={ item.transaction_hash } noIcon isLoading={ isLoading } truncation="constant" maxW="100%"/> : <Text color="text.secondary">—</Text> }
        </RowLabel>

        <RowLabel label="Target address">
          { decoded.targetAddress ? <AddressEntity address={{ hash: decoded.targetAddress }} noIcon isLoading={ isLoading } truncation="constant" maxW="100%"/> : <Text color="text.secondary">Unable to decode</Text> }
        </RowLabel>

        <RowLabel label="Genesis version">
          <Text>{ decoded.genesisVersion || '—' }</Text>
        </RowLabel>

        <RowLabel label="Genesis hash">
          <HashCell value={ decoded.genesisHash } isLoading={ isLoading }/>
        </RowLabel>

        <RowLabel label="Code hash">
          <HashCell value={ decoded.codeHash } isLoading={ isLoading }/>
        </RowLabel>

        <RowLabel label="Timestamp">
          { item.block_timestamp ? <Time timestamp={ item.block_timestamp } format="DD MMM YYYY, HH:mm:ss"/> : <Text color="text.secondary">—</Text> }
        </RowLabel>
      </VStack>
    </Box>
  );
};

const RowLabel = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box>
    <Text color="text.secondary" fontSize="sm" mb={ 1 }>{ label }</Text>
    { children }
  </Box>
);

const HashCell = ({ value, isLoading }: { value: string | null; isLoading?: boolean }) => {
  if (!value) {
    return <Text color="text.secondary">—</Text>;
  }

  return (
    <HStack gap={ 1 } maxW="100%">
      <HashStringShorten hash={ value } type="long"/>
      <CopyToClipboard text={ value } isLoading={ isLoading } noTooltip/>
    </HStack>
  );
};

export default RuntimeUpgrades;
