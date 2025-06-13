import '@mantine/core/styles.css';

import { Anchor, AppShell, Burger } from '@mantine/core';
import { useDisclosure, useHash } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRoutes } from 'raviger';

import { AppNavLink } from '@components/AppNavLink';
import { Bookmarks as BookmarksRoute } from '@src/routes/Bookmarks/Bookmarks';
import { Dashboard as DashboardRoute } from '@src/routes/Dashboard/Dashboard';
import { Home as HomeRoute } from '@src/routes/Home/Home';

const queryClient = new QueryClient();

const routes = {
  '/': () => <HomeRoute />,
  '/dashboard': () => <DashboardRoute />,
  '/bookmarks': () => <BookmarksRoute />,
};

export default function App() {
  const route = useRoutes(routes);
  const [opened, { toggle }] = useDisclosure();

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
          <AppNavLink href="/" label="Home" />
          <AppNavLink href="/dashboard" label="Dashboard" />
          <AppNavLink href="/bookmarks" label="Bookmarks" />
        </AppShell.Navbar>

        <AppShell.Main>{route}</AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  );
}
