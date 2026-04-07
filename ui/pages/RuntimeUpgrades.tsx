import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useQueries } from '@tanstack/react-query';
import React from 'react';

import type { Block } from 'types/api/block';
import type { Log } from 'types/api/log';

import useApiFetch from 'lib/api/useApiFetch';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
import {
  decodeRuntimeUpgradedLog,
  getRuntimeUpgradeLogsApiUrl,
  getSystemContractTag,
  RUNTIME_UPGRADED_TOPIC,
  RUNTIME_UPGRADE_ADDRESS,
} from 'ui/runtimeUpgrades/utils';
import ActionBar from 'ui/shared/ActionBar';
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

const RuntimeUpgrades = () => {
  const { data, isPlaceholderData, isPending, isError, pagination } = useQueryWithPages({
    resourceName: 'general:address_logs',
    pathParams: { hash: RUNTIME_UPGRADE_ADDRESS },
    queryParams: { topic: RUNTIME_UPGRADED_TOPIC },
  });

  const apiFetch = useApiFetch();
  const apiLogsUrl = React.useMemo(() => getRuntimeUpgradeLogsApiUrl(), []);

  const blockNumbers = React.useMemo(() => {
    return Array.from(new Set((data?.items || [])
      .map((item) => item.block_number)
      .filter((blockNumber): blockNumber is number => typeof blockNumber === 'number')));
  }, [ data?.items ]);

  const blockQueries = useQueries({
    queries: blockNumbers.map((blockNumber) => ({
      queryKey: [ 'general:block', blockNumber ],
      queryFn: () => apiFetch<'general:block', Block>('general:block', {
        pathParams: { height_or_hash: String(blockNumber) },
      }),
      enabled: !isPlaceholderData,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  const blockTimestamps = React.useMemo(() => {
    return blockNumbers.reduce<Record<number, string>>((result, blockNumber, index) => {
      const blockData = blockQueries[index]?.data;
      const timestamp = blockData && 'timestamp' in blockData ? blockData.timestamp : null;
      if (timestamp) {
        result[blockNumber] = timestamp;
      }
      return result;
    }, {});
  }, [ blockNumbers, blockQueries ]);

  const rows = React.useMemo(() => {
    return (data?.items || []).map((item) => {
      const decoded = decodeRuntimeUpgradedLog(item);

      return {
        item,
        decoded,
        timestamp: item.block_timestamp || (typeof item.block_number === 'number' ? blockTimestamps[item.block_number] : null),
        systemTag: getSystemContractTag(decoded.targetAddress),
      };
    });
  }, [ blockTimestamps, data?.items ]);

  const groupedRows = React.useMemo(() => {
    const groupsMap = new Map<string, Array<(typeof rows)[number]>>();

    rows.forEach((row) => {
      const key = row.decoded.genesisHash || '__unknown__';
      const current = groupsMap.get(key);

      if (current) {
        current.push(row);
      } else {
        groupsMap.set(key, [ row ]);
      }
    });

    return Array.from(groupsMap.entries())
      .map(([ key, entries ]) => {
        const versionSet = new Set(entries.map((entry) => entry.decoded.genesisVersion).filter(Boolean));
        const codeHashSet = new Set(entries.map((entry) => entry.decoded.codeHash).filter(Boolean));
        const latestBlockNumber = entries.reduce((max, entry) => {
          return typeof entry.item.block_number === 'number' ? Math.max(max, entry.item.block_number) : max;
        }, 0);

        return {
          key,
          genesisHash: key === '__unknown__' ? null : key,
          entries,
          latestBlockNumber,
          version: versionSet.size === 1 ? [ ...versionSet ][0] : null,
          codeHash: codeHashSet.size === 1 ? [ ...codeHashSet ][0] : null,
        };
      })
      .sort((a, b) => b.latestBlockNumber - a.latestBlockNumber);
  }, [ rows ]);

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

  const content = groupedRows.length ? (
    <AccordionRoot display="flex" flexDirection="column" gap={ 4 }>
      { groupedRows.map((group, index) => {
        const isUnknownGenesis = !group.genesisHash;

        return (
          <AccordionItem key={ group.key } value={ group.key } borderWidth="1px" borderColor="border.divider" borderRadius="lg" overflow="hidden">
            <AccordionItemTrigger px={ 4 } py={ 3 }>
              <VStack alignItems="flex-start" flex={ 1 } gap={ 1 } mr={ 3 }>
                <HStack gap={ 2 } flexWrap="wrap">
                  <Text fontWeight={ 700 }>Genesis hash</Text>
                  { isUnknownGenesis ? (
                    <Text color="text.secondary">Unknown</Text>
                  ) : (
                    <HashCell value={ group.genesisHash } noCopy isLoading={ isPlaceholderData }/>
                  ) }
                  <Badge colorPalette="blue">{ group.entries.length } upgrades</Badge>
                </HStack>

                <HStack gap={ 3 } color="text.secondary" fontSize="sm" flexWrap="wrap">
                  <Text>Version: { group.version || 'Mixed/unknown' }</Text>
                  <Text>Code hash: { group.codeHash ? '' : 'Mixed/unknown' }</Text>
                  { group.codeHash ? <HashCell value={ group.codeHash } noCopy isLoading={ isPlaceholderData }/> : null }
                </HStack>
              </VStack>
            </AccordionItemTrigger>
            <AccordionItemContent px={ 4 } pb={ 4 }>
              <VStack alignItems="stretch" gap={ 3 }>
                { group.entries.map(({ item, decoded, timestamp, systemTag }) => (
                  <RuntimeUpgradeCard
                    key={ `${ item.transaction_hash || 'tx' }-${ item.index }-${ index }` }
                    item={ item }
                    decoded={ decoded }
                    timestamp={ timestamp }
                    systemTag={ systemTag }
                    isLoading={ isPlaceholderData }
                  />
                )) }
              </VStack>
            </AccordionItemContent>
          </AccordionItem>
        );
      }) }
    </AccordionRoot>
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
        emptyText={ isPending ? 'Loading runtime upgrades…' : 'There are no runtime upgrade events yet.' }
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
  timestamp: string | null;
  systemTag: string | null;
  isLoading?: boolean;
}

const RuntimeUpgradeCard = ({ item, decoded, timestamp, systemTag, isLoading }: RuntimeUpgradeRowProps) => {
  return (
    <Box borderWidth="1px" borderColor="border.divider" borderRadius="lg" p={ 4 }>
      <VStack alignItems="stretch" gap={ 2 }>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <Text fontWeight={ 600 }>RuntimeUpgraded</Text>
          <Badge colorPalette={ decoded.isDecoded ? 'green' : 'orange' }>{ decoded.isDecoded ? 'Decoded' : 'Partial' }</Badge>
        </HStack>

        <RowLabel label="Block">
          { typeof item.block_number === 'number' ? (
            <BlockEntity number={ item.block_number } noIcon isLoading={ isLoading }/>
          ) : (
            <Text color="text.secondary">—</Text>
          ) }
        </RowLabel>

        <RowLabel label="Transaction">
          { item.transaction_hash ? (
            <TxEntity
              hash={ item.transaction_hash }
              noIcon
              isLoading={ isLoading }
              truncation="constant"
              maxW="100%"
            />
          ) : (
            <Text color="text.secondary">—</Text>
          ) }
        </RowLabel>

        <RowLabel label="Target contract">
          { decoded.targetAddress ? (
            <VStack alignItems="flex-start" gap={ 1 }>
              <AddressEntity
                address={{ hash: decoded.targetAddress }}
                noIcon
                isLoading={ isLoading }
                truncation="constant"
                maxW="100%"
              />
              { systemTag ? <Badge colorPalette="purple">{ systemTag }</Badge> : null }
            </VStack>
          ) : (
            <Text color="text.secondary">Unable to decode</Text>
          ) }
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
          { timestamp ? (
            <Time timestamp={ timestamp } format="DD MMM YYYY, HH:mm:ss"/>
          ) : (
            <Text color="text.secondary">—</Text>
          ) }
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

const HashCell = ({ value, isLoading, noCopy }: { value: string | null; isLoading?: boolean; noCopy?: boolean }) => {
  if (!value) {
    return <Text color="text.secondary">—</Text>;
  }

  return (
    <HStack gap={ 1 } maxW="100%" whiteSpace="nowrap">
      <HashStringShorten hash={ value } type="long"/>
      { noCopy ? null : <CopyToClipboard text={ value } isLoading={ isLoading } noTooltip/> }
    </HStack>
  );
};

export default RuntimeUpgrades;
