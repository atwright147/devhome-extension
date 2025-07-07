import type { ModalProps } from '@mantine/core';
import {
  Button,
  Fieldset,
  Modal,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { type JSX, useEffect, useMemo } from 'react';
import browser from 'webextension-polyfill';
import { z } from 'zod';

import { useBookmarks } from '@src/hooks/queries/bookmarks';
import type { Settings } from '@src/types/settings';
import { flattenFolders } from '@src/utils/flattenFolders';

interface Props extends ModalProps {}

const schema = z.object({
  bookmarkFolder: z
    .string()
    .min(1, { message: 'Bookmark Folder is required' })
    .optional()
    .or(z.literal('')),
  githubAccessToken: z
    .string()
    .min(10, { message: 'Github Access Token is required' })
    .optional()
    .or(z.literal('')),
  githubCacheTime: z
    .number()
    .min(1, { message: 'Github API Cache Time is required' })
    .optional()
    .or(z.literal('')),
  gitlabAccessToken: z
    .string()
    .min(10, { message: 'GitLab Access Token is required' })
    .optional()
    .or(z.literal('')),
  gitlabCacheTime: z
    .number()
    .min(1, { message: 'GitLab API Cache Time is required' })
    .optional()
    .or(z.literal('')),
  bitBucketAccessToken: z
    .string()
    .min(10, { message: 'BitBucket Access Token is required' })
    .optional()
    .or(z.literal('')),
  bitBucketCacheTime: z
    .number()
    .min(1, { message: 'BitBucket API Cache Time is required' })
    .optional()
    .or(z.literal('')),
  jiraAccessToken: z
    .string()
    .min(10, { message: 'Jira Access Token is required' })
    .optional()
    .or(z.literal('')),
  jiraUserName: z
    .string()
    .min(1, { message: 'Jira User Name is required' })
    .optional()
    .or(z.literal('')),
  jiraBaseUrl: z
    .string()
    .url({ message: 'Jira Base URL must be a valid URL' })
    .optional()
    .or(z.literal('')),
  jiraCacheTime: z
    .number()
    .min(1, { message: 'Jira API Cache Time is required' })
    .optional()
    .or(z.literal('')),
});

const DEFAULT_CACHE_TIME = 15;

const defaultValues: Settings = {
  bookmarkFolder: '0',
  githubAccessToken: '',
  githubCacheTime: DEFAULT_CACHE_TIME,
  gitlabAccessToken: '',
  gitlabCacheTime: DEFAULT_CACHE_TIME,
  bitBucketAccessToken: '',
  bitBucketCacheTime: DEFAULT_CACHE_TIME,
  jiraAccessToken: '',
  jiraCacheTime: DEFAULT_CACHE_TIME,
};

export function ModalSettings({ ...props }: Props): JSX.Element {
  const { data: bookmarks, isLoading, error } = useBookmarks();

  const form = useForm({
    mode: 'controlled',
    initialValues: defaultValues as unknown as Record<string, unknown>,

    validate: zodResolver(schema),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      const { settings } = await browser.storage.local.get('settings');
      if (settings) {
        form.setInitialValues(settings as unknown as Record<string, unknown>);
        form.setValues(settings as unknown as Record<string, unknown>);
      }
    })();
  }, []);

  const bookmarkFolders = useMemo(() => {
    if (isLoading) return [];
    if (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
    // Skip the top-level object
    return bookmarks ? flattenFolders(bookmarks, true) : [];
  }, [bookmarks, isLoading, error]);

  const handleSubmit = async (values: typeof form.values) => {
    await browser.storage.local.set({ settings: values });
    props.onClose?.();
    form.reset();
  };

  return (
    <Modal {...props} title="Settings" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack>
          <Fieldset legend="Bookmarks">
            <Select
              label="Bookmark Folder"
              placeholder="Select a folder"
              data={bookmarkFolders}
              {...form.getInputProps('bookmarkFolder')}
            />
          </Fieldset>

          <Fieldset legend="Github">
            <TextInput
              label="Github Access Token"
              placeholder="Paste your token"
              {...form.getInputProps('githubAccessToken')}
            />

            <TextInput
              label="Github API Cache Time"
              placeholder="Enter cache time"
              {...form.getInputProps('githubCacheTime')}
            />
          </Fieldset>

          <Fieldset legend="GitLab">
            <TextInput
              label="GitLab Access Token"
              placeholder="Paste your token"
              {...form.getInputProps('gitlabAccessToken')}
            />

            <TextInput
              label="GitLab API Cache Time"
              placeholder="Enter cache time"
              {...form.getInputProps('gitlabCacheTime')}
            />
          </Fieldset>

          <Fieldset legend="BitBucket">
            <TextInput
              label="BitBucket Access Token"
              placeholder="Paste your token"
              {...form.getInputProps('bitBucketAccessToken')}
            />

            <TextInput
              label="BitBucket API Cache Time"
              placeholder="Enter cache time"
              {...form.getInputProps('gitlabCacheTime')}
            />
          </Fieldset>

          <Fieldset legend="Jira">
            <TextInput
              label="Jira Access Token"
              placeholder="Paste your token"
              {...form.getInputProps('jiraAccessToken')}
            />

            <TextInput
              label="Jira User Name"
              placeholder="Enter your username"
              {...form.getInputProps('jiraUserName')}
            />

            <TextInput
              label="Jira Base URL"
              placeholder="Enter your Jira base URL"
              {...form.getInputProps('jiraBaseUrl')}
            />

            <TextInput
              label="Jira API Cache Time"
              placeholder="Enter cache time"
              {...form.getInputProps('jiraCacheTime')}
            />
          </Fieldset>

          <Button type="submit" fullWidth>
            Save
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
