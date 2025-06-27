import type { ModalProps } from '@mantine/core';
import { Button, Modal, Select, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import type { JSX } from 'react';
import browser from 'webextension-polyfill';
import { z } from 'zod';

import { useRepos } from '@src/hooks/queries/github/github';

interface Props extends ModalProps {}

const schema = z.object({
  repo: z
    .string()
    .min(1, { message: 'Repository is required' })
    .optional()
    .or(z.literal('')),
});

const defaultValues = {
  repo: '',
};

export function ModalAddRepo({ ...props }: Props): JSX.Element {
  const form = useForm({
    mode: 'controlled',
    initialValues: defaultValues,

    validate: zodResolver(schema),
  });
  const { data, isLoading, isError, error } = useRepos();

  const handleSubmit = async (values: typeof form.values) => {
    // Get the current github object or default to an object with repos as an array
    const result = await browser.storage.local.get('github');
    const github =
      typeof result.github === 'object' && result.github !== null
        ? result.github
        : { repos: [] };

    if (values.repo && values.repo !== '') {
      // @ts-expect-error
      if (!github.repos.includes(values.repo)) {
        // @ts-expect-error
        github.repos.push(values.repo);
      }
    }

    // Save the updated object back to storage
    await browser.storage.local.set({ github });

    props.onClose?.();
    form.reset();
  };

  return (
    <Modal {...props} title="Add Repository">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack>
          <Select
            searchable
            label="Repository"
            placeholder="Select repository"
            data={data?.map((repo) => ({
              value: String(repo.node_id), // Use node_id for GraphQL compatibility
              label: repo.name,
            }))}
            disabled={isLoading}
            {...form.getInputProps('repo')}
          />

          <Button type="submit" fullWidth>
            Add
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
