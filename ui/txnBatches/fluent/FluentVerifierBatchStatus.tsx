import React from 'react';

import type { VerifierBatchStatus } from 'types/api/verifier';

import StatusTag from 'ui/shared/statusTag/StatusTag';

interface Props {
  status: VerifierBatchStatus;
  isLoading?: boolean;
}

const FluentVerifierBatchStatus = ({ status, isLoading }: Props) => {
  const normalized = status.name.toLowerCase();

  if (normalized.includes('final')) {
    return <StatusTag type="ok" text={ status.name } loading={ isLoading }/>;
  }

  if (normalized.includes('revert') || normalized.includes('invalid') || normalized.includes('fail')) {
    return <StatusTag type="error" text={ status.name } loading={ isLoading }/>;
  }

  return <StatusTag type="pending" text={ status.name } loading={ isLoading }/>;
};

export default React.memo(FluentVerifierBatchStatus);
