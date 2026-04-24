import { Flex } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'toolkit/chakra/link';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';

type Props = {
  hash: string;
  href?: string;
};

const FluentHashValue = ({ hash, href }: Props) => {
  const value = (
    <HashStringShorten
      hash={ hash }
      type="long"
      noTooltip
    />
  );

  return (
    <Flex alignItems="center" minW={ 0 }>
      { href ? (
        <Link href={ href } minW={ 0 }>
          { value }
        </Link>
      ) : value }
      <CopyToClipboard text={ hash } noTooltip/>
    </Flex>
  );
};

export default React.memo(FluentHashValue);
