import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const RuntimeUpgrades = dynamic(() => import('ui/pages/RuntimeUpgrades'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/runtime-upgrades">
      <RuntimeUpgrades/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
