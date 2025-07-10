import { Card, Container, Stack, Text, Title } from '@mantine/core';

import { useJiraTickets } from '@src/hooks/queries/jira/jira';

export function Jira() {
  const { data, isLoading, isError, error } = useJiraTickets({});

  return (
    <>
      <Container>
        <Title order={1}>Jirax</Title>

        <Stack>
          {data?.issues?.map((issue) => {
            return (
              <Card
                key={issue.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Stack gap="0">
                  <Title order={3} mb={0}>
                    {issue.key}
                  </Title>

                  <Text>{issue.fields.summary}</Text>

                  <a
                    href={issue.self}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {issue.self}
                  </a>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Container>
    </>
  );
}
