import '@mantine/core/styles.css';

import {
  AppShell,
  Burger,
  Button,
  Checkbox,
  Container,
  Group,
  TextInput,
} from '@mantine/core';
import { MantineProvider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

export default function App() {
  const [opened, { toggle }] = useDisclosure();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <MantineProvider defaultColorScheme="auto">
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header p="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </AppShell.Header>

        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

        <AppShell.Main>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
            <Checkbox
              mt="md"
              label="I agree to sell my privacy"
              key={form.key('termsOfService')}
              {...form.getInputProps('termsOfService', { type: 'checkbox' })}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
