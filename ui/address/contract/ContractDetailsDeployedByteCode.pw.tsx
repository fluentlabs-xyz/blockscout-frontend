import React from 'react';

import * as addressMock from 'mocks/address/address';
import { test, expect } from 'playwright/lib';

import ContractDetailsDeployedByteCode from './ContractDetailsDeployedByteCode';

test('scilla decoded bytecode', async({ render, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_VIEWS_CONTRACT_DECODED_BYTECODE_ENABLED', 'true' ],
  ]);
  const component = await render(
    <ContractDetailsDeployedByteCode
      // eslint-disable-next-line max-len
      bytecode="0x7363696c6c615f76657273696f6e20300a6c6962726172792053534e4c69737450726f78790a6c6574207a65726f203d2055696e7431323820300a6c6574206f6e655f6d7367203d0a66756e20286d3a204d65737361676529203d3e0a"
      isLoading={ false }
      addressData={{ ...addressMock.contract, is_verified: false }}
      showVerificationButton
    />,
  );
  await expect(component).toHaveScreenshot();
});

test('runtime-owned bytecode raw wrapper toggle', async({ render, page }) => {
  const bytecode = '0xef440000000000000000000000000000000000005200080000000000000000000000001111111111111111111111111111111111111111';
  const runtimeOwner = '0x0000000000000000000000000000000000520008';

  const component = await render(
    <ContractDetailsDeployedByteCode
      bytecode={ bytecode }
      isLoading={ false }
      addressData={{ ...addressMock.contract, is_verified: false }}
      showVerificationButton
    />,
  );

  await expect(component.getByText('Runtime-owned contract')).toBeVisible();
  await expect(component.getByText(runtimeOwner)).toBeVisible();
  await expect(component.locator(`a[href="/address/${ runtimeOwner }?tab=contract_bytecode"]`)).toBeVisible();
  await expect(component.getByRole('button', { name: 'View raw wrapper bytes' })).toBeVisible();
  await expect(page.getByText(bytecode, { exact: true })).toHaveCount(0);

  await component.getByRole('button', { name: 'View raw wrapper bytes' }).click();
  await expect(component.getByRole('button', { name: 'Hide raw wrapper bytes' })).toBeVisible();
  await expect(page.getByText(bytecode, { exact: true })).toBeVisible();

  await component.getByRole('button', { name: 'Hide raw wrapper bytes' }).click();
  await expect(component.getByRole('button', { name: 'View raw wrapper bytes' })).toBeVisible();
  await expect(page.getByText(bytecode, { exact: true })).toHaveCount(0);
});
