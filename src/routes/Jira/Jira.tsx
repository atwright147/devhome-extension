import { Container, Stack, Title } from '@mantine/core';

import { useJiraTickets } from '@src/hooks/queries/jira/jira';

export function Jira() {
  const { data, isLoading, isError, error } = useJiraTickets({});

  return (
    <>
      <Container>
        <Title order={1}>Jira</Title>

        <pre>{JSON.stringify(data, null, 2)}</pre>
        <pre>{JSON.stringify(error, null, 2)}</pre>

        <Stack>
          {data?.map((ticket) => (
            <pre key={ticket.id}>{JSON.stringify(ticket, null, 2)}</pre>
          ))}
        </Stack>
      </Container>
    </>
  );
}
