import { Box, Flex, createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import hexToUtf8 from 'lib/hexToUtf8';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';
import parseFluentRuntimeOwnedBytecode from './parseFluentRuntimeOwnedBytecode';

const OPTIONS = [
  { label: 'Hex', value: 'Hex' as const },
  { label: 'UTF-8', value: 'UTF-8' as const },
];

const collection = createListCollection<SelectOption>({
  items: OPTIONS,
});

export type DataType = (typeof OPTIONS)[number]['value'];

interface Props {
  bytecode: string;
  isLoading: boolean;
  addressData: Address;
  showVerificationButton?: boolean;
}

const ContractDetailsDeployedByteCode = ({ bytecode, isLoading: isLoadingProp, addressData, showVerificationButton }: Props) => {
  const [ isLoading, setIsLoading ] = React.useState(isLoadingProp);
  const [ showSelect, setShowSelect ] = React.useState(false);
  const [ selectedDataType, setSelectedDataType ] = React.useState<Array<DataType>>([ 'Hex' ]);
  const [ isRawWrapperVisible, setIsRawWrapperVisible ] = React.useState(false);

  React.useEffect(() => {
    if (!isLoadingProp) {
      if (config.UI.views.address.decodedBytecodeEnabled && !addressData.is_verified) {
        // we don't want to decode the whole bytecode here
        // the "scilla_version" should appear somewhere in the beginning of the bytecode
        // but there could be some comments of arbitrary length before it
        // adjust the value if needed
        const SYMBOLS_TO_CHECK = 500;
        const decodedBytecode = hexToUtf8(bytecode.slice(0, SYMBOLS_TO_CHECK * 2 + 2));
        const isScillaSourceCode = decodedBytecode.includes('scilla_version 0');
        if (isScillaSourceCode) {
          setShowSelect(true);
          setSelectedDataType([ 'UTF-8' ]);
        }
      }
    }

    setIsLoading(isLoadingProp);
  }, [ isLoadingProp, bytecode, addressData.is_verified ]);

  React.useEffect(() => {
    setIsRawWrapperVisible(false);
  }, [ bytecode ]);

  const handleSelectValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSelectedDataType(value as Array<DataType>);
  }, []);

  const toggleRawWrapperVisibility = React.useCallback(() => {
    setIsRawWrapperVisible((flag) => !flag);
  }, []);

  const content = selectedDataType[0] === 'UTF-8' ? hexToUtf8(bytecode) : bytecode;
  const parsedRuntimeOwnedBytecode = React.useMemo(() => parseFluentRuntimeOwnedBytecode(bytecode), [ bytecode ]);

  const runtimeOwnedContent = parsedRuntimeOwnedBytecode ? (
    <Flex flexDir="column" rowGap={ 4 }>
      <Box>
        <Box fontWeight={ 600 } mb={ 2 }>Runtime-owned contract</Box>
        <Box>This account uses Fluent runtime-owned bytecode (OwnableAccount wrapper).</Box>
        <Box>The executable bytecode is provided by its runtime owner, not stored here as plain bytecode.</Box>
      </Box>
      <Flex flexDir="column" rowGap={ 3 }>
        <Box>
          <Box as="span" fontWeight={ 500 } mr={ 2 }>Runtime owner:</Box>
          <AddressEntity
            address={{ hash: parsedRuntimeOwnedBytecode.runtimeOwner }}
            noIcon
            display="inline-flex"
            verticalAlign="top"
            truncation="dynamic"
          />
        </Box>
        <Box>
          <Box as="span" fontWeight={ 500 } mr={ 2 }>Executable bytecode source:</Box>
          <Link href={ route({ pathname: '/address/[hash]', query: { hash: parsedRuntimeOwnedBytecode.runtimeOwner, tab: 'contract_bytecode' } }) }>
            Open owner bytecode page
          </Link>
        </Box>
        <Flex alignItems="center" flexWrap="wrap" columnGap={ 3 } rowGap={ 2 }>
          <Box as="span" fontWeight={ 500 }>Raw stored code:</Box>
          <Button
            size="sm"
            variant="outline"
            colorPalette="cyan"
            onClick={ toggleRawWrapperVisibility }
          >
            { isRawWrapperVisible ? 'Hide raw wrapper bytes' : 'View raw wrapper bytes' }
          </Button>
        </Flex>
        { isRawWrapperVisible && (
          <RawDataSnippet
            data={ bytecode }
            textareaMaxHeight="220px"
            textareaMinHeight="auto"
            contentProps={{ mt: 1 }}
          />
        ) }
      </Flex>
    </Flex>
  ) : null;

  const beforeSlot = (
    <Flex alignItems="center" flexWrap="wrap" mb={ 3 } columnGap={ 3 } rowGap={ 1 }>
      <Skeleton fontWeight={ 500 } loading={ isLoading }>Deployed bytecode</Skeleton>
      <Flex alignItems="center" flexGrow={ 1 }>
        { showSelect && (
          <Select
            collection={ collection }
            placeholder="Select type"
            value={ selectedDataType }
            onValueChange={ handleSelectValueChange }
            w="100px"
            loading={ isLoading }
          />
        ) }
        { showVerificationButton && !parsedRuntimeOwnedBytecode && (
          <ContractDetailsVerificationButton
            isLoading={ isLoading }
            addressHash={ addressData.hash }
            ml="auto"
            mr={ 3 }
          />
        ) }
        <CopyToClipboard text={ content } isLoading={ isLoading } ml={ showVerificationButton ? 0 : 'auto' }/>
      </Flex>
    </Flex>

  );

  return (
    <RawDataSnippet
      data={ runtimeOwnedContent ?? content }
      beforeSlot={ beforeSlot }
      textareaMaxHeight="300px"
      isLoading={ isLoading }
      showCopy={ false }
    />
  );
};

export default React.memo(ContractDetailsDeployedByteCode);
