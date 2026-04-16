import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import type { SelectOption } from 'toolkit/chakra/select';
import { FormFieldCheckbox } from 'toolkit/components/forms/fields/FormFieldCheckbox';
import { FormFieldSelect } from 'toolkit/components/forms/fields/FormFieldSelect';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { FormFieldUrl } from 'toolkit/components/forms/fields/FormFieldUrl';

import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';

const ContractVerificationFluentRust = ({ config }: { config: SmartContractVerificationConfig }) => {
  const { watch } = useFormContext<FormFields>();
  const sourceType = watch('source_type')?.[0];

  const compilerCollection = React.useMemo(() => createListCollection<SelectOption>({
    items: (config.fluent_compiler_versions ?? []).map((value) => ({
      label: value,
      value,
    })),
  }), [ config.fluent_compiler_versions ]);

  const sourceTypeCollection = React.useMemo(() => createListCollection<SelectOption>({
    items: [
      { label: 'Git repository', value: 'git' },
      { label: 'Archive content', value: 'archive' },
    ],
  }), []);

  const abiValidator = React.useCallback((value: unknown) => {
    if (typeof value !== 'string' || !value.trim()) {
      return true;
    }

    try {
      const parsed = JSON.parse(value) as unknown;

      return Array.isArray(parsed) ? true : 'ABI must be a JSON array';
    } catch (error) {
      return 'ABI must be valid JSON';
    }
  }, []);

  return (
    <ContractVerificationMethod title="Contract verification via Fluent (Rust)">
      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="name"
          required
          placeholder="Contract name"
          rules={{ maxLength: 255 }}
        />
        <span>The contract name is the name assigned to the verified contract in Blockscout.</span>
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldSelect<FormFields, 'compiler'>
          name="compiler"
          placeholder="SDK version"
          collection={ compilerCollection }
          required
        />
        <span>Select the Fluent SDK version used during compilation.</span>
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="abi"
          required
          placeholder="Contract ABI (JSON array)"
          asComponent="Textarea"
          rules={{ validate: { json: abiValidator } }}
        />
        <span>Provide the contract ABI as a JSON array.</span>
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldSelect<FormFields, 'source_type'>
          name="source_type"
          placeholder="Source type"
          collection={ sourceTypeCollection }
          required
        />
        <span>Choose whether to verify from a git repository or archive content.</span>
      </ContractVerificationFormRow>

      { sourceType === 'archive' ? (
        <ContractVerificationFormRow>
          <FormFieldText<FormFields>
            name="archive_content"
            required
            placeholder="Archive content"
            asComponent="Textarea"
          />
          <span>Paste the archive content string expected by the Fluent verifier.</span>
        </ContractVerificationFormRow>
      ) : (
        <>
          <ContractVerificationFormRow>
            <FormFieldUrl<FormFields>
              name="repository_url"
              placeholder="Repository URL"
              required
            />
            <span>Any git repository URL accepted by the verifier can be used here.</span>
          </ContractVerificationFormRow>

          <ContractVerificationFormRow>
            <FormFieldText<FormFields>
              name="commit_ref"
              placeholder="Commit ref"
              required
              rules={{ maxLength: 255 }}
            />
            <span>Provide the exact commit, tag, or branch reference to verify.</span>
          </ContractVerificationFormRow>
        </>
      ) }

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="features"
          placeholder="Cargo features"
          asComponent="Textarea"
        />
        <span>Optional. Provide one Cargo feature per line.</span>
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="rust_flags"
          placeholder="Rust flags"
          asComponent="Textarea"
        />
        <span>Optional. Provide one rustc flag per line.</span>
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldCheckbox<FormFields, 'no_default_features'>
          name="no_default_features"
          label="Disable default Cargo features"
        />
        <span>Enable this when the contract must be compiled with `--no-default-features`.</span>
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="rust_toolchain"
          placeholder="Rust toolchain"
          rules={{ maxLength: 255 }}
        />
        <span>Optional. For example, `stable`, `beta`, or a pinned toolchain version.</span>
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="manifest_path"
          placeholder="Manifest path"
          rules={{ maxLength: 255 }}
        />
        <span>Optional. Relative path to the Cargo manifest, for example `contracts/my_contract/Cargo.toml`.</span>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationFluentRust);
