import { Box, Flex, HStack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import React from 'react';

import type { RuntimeUpgrade, RuntimeUpgradeVersion } from 'types/api/runtimeUpgrades';

import useApiQuery from 'lib/api/useApiQuery';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
import {
  getRuntimeUpgradesApiUrl,
  getSystemContractTag,
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
import Time from 'ui/shared/time/Time';

const RuntimeUpgrades = () => {
  const { data, isPending, isError } = useApiQuery('general:runtime_upgrades');
  const [ expandedValues, setExpandedValues ] = React.useState<Array<string>>([]);

  const sourceContractTruncation = useBreakpointValue<'none' | 'constant'>({
    base: 'constant',
    md: 'none',
  }) ?? 'none';

  const apiLogsUrl = React.useMemo(() => getRuntimeUpgradesApiUrl(), []);

  const entries = React.useMemo(() => {
    return (data?.items || [])
      .slice()
      .sort((a, b) => (getRuntimeUpgradeLatestBlockNumber(b) || 0) - (getRuntimeUpgradeLatestBlockNumber(a) || 0));
  }, [ data ]);

  const handleAccordionValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setExpandedValues(value);
  }, []);

  const actionBar = (
    <ActionBar mt={ -6 } showShadow justifyContent={{ base: 'space-between', lg: 'end' }}>
      <Link href={ apiLogsUrl } external noIcon color="link.primary" fontWeight={ 500 }>
        Download raw upgrades (JSON)
      </Link>
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
          truncation={ sourceContractTruncation }
          maxW="800px"
          fontWeight={ 600 }
        />
      </HStack>
    </Flex>
  );

  const content = entries.length ? (
    <AccordionRoot
      display="flex"
      flexDirection="column"
      gap={ 4 }
      value={ expandedValues }
      onValueChange={ handleAccordionValueChange }
    >
      { entries.map((entry, index) => {
        const value = getRuntimeUpgradeAccordionValue(entry, index);

        return (
          <RuntimeUpgradeGroup
            key={ value }
            entry={ entry }
            value={ value }
            isOpen={ expandedValues.includes(value) }
          />
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
        itemsNum={ entries.length }
        emptyText={ isPending ? 'Loading runtime upgrades…' : 'There are no runtime upgrade events yet.' }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </Box>
  );
};

interface RuntimeUpgradeGroupProps {
  entry: RuntimeUpgradeVersion;
  value: string;
  isOpen: boolean;
}

const RuntimeUpgradeGroup = ({ entry, value, isOpen }: RuntimeUpgradeGroupProps) => {
  const genesisHash = entry.genesis_hash;
  const version = entry.genesis_version;
  const codeHash = entry.code_hash;
  const upgradesCount = entry.upgrades_count;

  const detailsQuery = useApiQuery('general:runtime_upgrade', {
    pathParams: { genesis_hash: genesisHash ?? undefined },
    queryOptions: {
      enabled: isOpen && Boolean(genesisHash),
      staleTime: 5 * 60 * 1000,
    },
  });

  const items = detailsQuery.data?.items || [];

  const displayedUpgradesCount = upgradesCount ?? (detailsQuery.data ? items.length : null);
  let detailsContent: React.ReactNode;

  if (!genesisHash) {
    detailsContent = <Text color="text.secondary">Genesis hash is unavailable.</Text>;
  } else if (detailsQuery.isPending) {
    detailsContent = <Text color="text.secondary">Loading runtime upgrades…</Text>;
  } else if (detailsQuery.isError) {
    detailsContent = <Text color="text.secondary">Unable to load runtime upgrades.</Text>;
  } else if (items.length) {
    detailsContent = (
      <VStack alignItems="stretch" gap={ 3 }>
        { items.map((item, index) => (
          <RuntimeUpgradeCard
            key={ `${ item.transaction_hash || 'tx' }-${ item.log_index }-${ index }` }
            item={ item }
          />
        )) }
      </VStack>
    );
  } else {
    detailsContent = <Text color="text.secondary">There are no runtime upgrade events for this genesis hash.</Text>;
  }

  return (
    <AccordionItem value={ value } borderWidth="1px" borderColor="border.divider" borderRadius="lg" overflow="hidden">
      <AccordionItemTrigger px={ 4 } py={ 3 }>
        <VStack alignItems="flex-start" flex={ 1 } gap={ 1 } mr={ 3 }>
          <HStack gap={ 2 } flexWrap="wrap">
            <Text fontWeight={ 700 }>Genesis hash</Text>
            <HashCell value={ genesisHash } noCopy/>
            { displayedUpgradesCount !== null ? <Badge colorPalette="blue">{ displayedUpgradesCount } upgrades</Badge> : null }
          </HStack>

          <HStack gap={ 3 } color="text.secondary" fontSize="sm" flexWrap="wrap">
            <Text>Version: { version || 'Unknown' }</Text>
            { codeHash ? <HashCell value={ codeHash } noCopy/> : null }
          </HStack>
        </VStack>
      </AccordionItemTrigger>
      <AccordionItemContent px={ 4 } pb={ 4 }>
        { detailsContent }
      </AccordionItemContent>
    </AccordionItem>
  );
};

function getRuntimeUpgradeAccordionValue(entry: RuntimeUpgradeVersion, index: number) {
  return entry.genesis_hash || `runtime-upgrade-${ index }`;
}

function getRuntimeUpgradeLatestBlockNumber(entry: RuntimeUpgradeVersion) {
  return entry.latest_block_number;
}

interface RuntimeUpgradeRowProps {
  item: RuntimeUpgrade;
  isLoading?: boolean;
}

const RuntimeUpgradeCard = ({ item, isLoading }: RuntimeUpgradeRowProps) => {
  const systemTag = getSystemContractTag(item.target_address_hash);
  const targetAddressTruncation = useBreakpointValue<'none' | 'constant'>({
    base: 'constant',
    sm: 'constant',
    md: 'none',
    lg: 'none',
    xl: 'constant',
    '2xl': 'constant',
    '3xl': 'constant',
    '4xl': 'constant',
    '5xl': 'constant',
    '6xl': 'constant',
  }) ?? 'none';

  return (
    <Box
      borderWidth="1px"
      borderColor="border.divider"
      borderRadius="lg"
      overflow="hidden"
      display="grid"
      gridTemplateColumns={{
        base: '120px minmax(0, 1fr)',
        lg: '160px minmax(0, 1fr)',
        xl: '160px minmax(0, 1fr) 160px minmax(0, 1fr)',
      }}
    >
      <RowLabel label="Target address" row={ 1 } column="left">
        { item.target_address_hash ? (
          <VStack alignItems="flex-start" gap={ 1 }>
            <AddressEntity
              address={{ hash: item.target_address_hash }}
              noIcon
              isLoading={ isLoading }
              truncation={ targetAddressTruncation }
              maxW="100%"
            />
            { systemTag ? <Badge colorPalette="purple">{ systemTag }</Badge> : null }
          </VStack>
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </RowLabel>

      <RowLabel label="Version" row={ 2 } column="left">
        <Text>{ item.genesis_version || '—' }</Text>
      </RowLabel>

      <RowLabel label="Genesis hash" row={ 3 } column="left">
        <HashCell value={ item.genesis_hash } isLoading={ isLoading }/>
      </RowLabel>

      <RowLabel label="Code hash" row={ 4 } column="left" isLastInColumn>
        <HashCell value={ item.code_hash } isLoading={ isLoading }/>
      </RowLabel>

      <RowLabel label="Block" row={ 1 } column="right">
        { typeof item.block_number === 'number' ? (
          <BlockEntity number={ item.block_number } noIcon isLoading={ isLoading }/>
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </RowLabel>

      <RowLabel label="Log index" row={ 2 } column="right">
        { typeof item.log_index === 'number' ? (
          <Text>{ item.log_index }</Text>
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </RowLabel>

      <RowLabel label="Transaction" row={ 3 } column="right">
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

      <RowLabel label="Timestamp" row={ 4 } column="right" isLastInColumn isLast>
        { item.block_timestamp ? (
          <Time timestamp={ item.block_timestamp } format="DD MMM YYYY, HH:mm:ss"/>
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </RowLabel>
    </Box>
  );
};

const RowLabel = ({
  label,
  children,
  row,
  column,
  isLastInColumn,
  isLast,
}: {
  label: string;
  children: React.ReactNode;
  row: number;
  column: 'left' | 'right';
  isLastInColumn?: boolean;
  isLast?: boolean;
}) => {
  const labelColumn = column === 'left' ? '1' : '3';
  const valueColumn = column === 'left' ? '2' : '4';
  const borderBottomWidth = {
    base: isLast ? 0 : '1px',
    xl: isLastInColumn ? 0 : '1px',
  };

  return (
    <>
      <Text
        color="text.secondary"
        fontSize="sm"
        whiteSpace="nowrap"
        px={ 3 }
        py={ 2 }
        borderBottomWidth={ borderBottomWidth }
        borderColor="border.divider"
        gridColumn={{ xl: labelColumn }}
        gridRow={{ xl: row }}
      >
        { label }
      </Text>
      <Box
        minW={ 0 }
        px={ 3 }
        py={ 2 }
        borderBottomWidth={ borderBottomWidth }
        borderRightWidth={{ base: 0, xl: column === 'left' ? '1px' : 0 }}
        borderColor="border.divider"
        gridColumn={{ xl: valueColumn }}
        gridRow={{ xl: row }}
      >
        { children }
      </Box>
    </>
  );
};

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
