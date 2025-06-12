import { Button, Modal, Select, Stack, TextInput } from '@mantine/core';
import type { ModalProps } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { JSX } from 'react';

const bookmarkFolders = [
  { value: '0', label: 'Bookmarks Bar' },
  { value: '1', label: 'Other Bookmarks' },
];

interface Props extends ModalProps {}

export function ModalSettings({ ...props }: Props): JSX.Element {
  const form = useForm({
    initialValues: {
      folder: '',
      token: '',
    },

    validate: {
      folder: (value) => (value ? null : 'Please select a folder'),
      token: (value) => (value ? null : 'Token is required'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    props.onClose?.();
  };

  return (
    <Modal {...props} title="Settings">
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Bookmark folder"
            placeholder="Select folder"
            data={bookmarkFolders}
            {...form.getInputProps('folder')}
            required
          />
          <TextInput
            label="GitHub Access Token"
            placeholder="Paste your token"
            {...form.getInputProps('token')}
            required
          />
          <Button type="submit" fullWidth>
            Save
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
