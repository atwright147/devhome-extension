import {
  Accordion,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import type { JSX } from 'react';

interface Props {
  name: string;
  description: string;
  prs: {
    number: number;
    title: string;
    state: 'OPEN';
    url: string;
    authorLogin: string;
    createdAt: string;
  }[];
  url: string;
}

export function RepoCard({ name, description, prs, url }: Props): JSX.Element {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="0">
        <Title order={3} mb={0}>
          {name}
        </Title>

        {description && <Text>{description}</Text>}

        <a href={url} rel="noopener noreferrer" target="_blank">
          {url}
        </a>
      </Stack>

      <Accordion>
        <Accordion.Item value={`pull-requests-${name}`}>
          <Accordion.Control>Pull Requests ({prs.length})</Accordion.Control>
          <Accordion.Panel>
            <Stack>
              {prs?.map((pr) => (
                <Stack key={pr.number} gap="3px">
                  <Group align="center">
                    <Text>{pr.title}</Text>
                    <Badge color={pr.state === 'OPEN' ? 'green' : 'red'}>
                      {pr.state}
                    </Badge>
                  </Group>

                  <Text size="sm">
                    #{pr.number} opened by {pr.authorLogin} on{' '}
                    {new Date(pr.createdAt).toLocaleDateString()}
                  </Text>

                  <a href={pr.url} target="_blank" rel="noopener noreferrer">
                    View Pull Request
                  </a>
                </Stack>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
