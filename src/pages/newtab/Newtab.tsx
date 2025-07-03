import '@mantine/core/styles.css';

import { AppShell, Burger, Button, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRoutes } from 'raviger';

import { ModalSettings } from '@components/ModalSettings';
import { Bookmarks as BookmarksRoute } from '@src/routes/Bookmarks/Bookmarks';
import { Dashboard as DashboardRoute } from '@src/routes/Dashboard/Dashboard';
import { Github as GithubRoute } from '@src/routes/Github/Github';
import { Home as HomeRoute } from '@src/routes/Home/Home';
import { Nav } from '../../components/Nav';

const queryClient = new QueryClient();

const routes = {
  '/': () => <HomeRoute />,
  '/dashboard': () => <DashboardRoute />,
  '/bookmarks': () => <BookmarksRoute />,
  '/github': () => <GithubRoute />,
};

export default function App() {
  const route = useRoutes(routes);
  const [opened, { toggle }] = useDisclosure();
  const [openedSettingsDialog, handlersSettingsDialog] = useDisclosure();

  return (
    <QueryClientProvider client={queryClient}>
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

        <AppShell.Navbar p="md">
          <Stack justify="space-between" h="100%">
            <AppShell.Section>
              <Nav />
            </AppShell.Section>

            <Button onClick={handlersSettingsDialog.open}>Settings</Button>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>{route}</AppShell.Main>
      </AppShell>

      <ModalSettings
        opened={openedSettingsDialog}
        onClose={handlersSettingsDialog.close}
      />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
