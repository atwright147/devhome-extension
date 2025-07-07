import { Button, Container, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react';

import { ModalAddRepo } from '@components/ModalAddRepo';
import { RepoCard } from '@components/RepoCard';
import {
  useGithubSettings,
  usePullRequests,
  useRepos,
} from '@src/hooks/queries/github/github';

export function Github() {
  const { data, isLoading, isError, error } = useRepos();
  const [openedAddRepoModal, handlersAddRepoModal] = useDisclosure();
  const githubSettings = useGithubSettings();

  const reposToFetch = useMemo(() => {
    if (!githubSettings.data?.github?.repos) return [];
    return githubSettings.data.github.repos;
  }, [githubSettings.data]);

  const { data: pullRequestsData } = usePullRequests(reposToFetch);
  // Fetch the user's GitHub settings from local storage

  const reposToShow = useMemo(() => {
    if (isLoading) return [];
    if (isError) {
      console.error('Error fetching repositories:', error);
      return [];
    }

    if (!data || !githubSettings.data?.github?.repos) return [];

    // Compare using node_id instead of id
    return data.filter((repo) =>
      githubSettings.data.github?.repos
        ?.map(String)
        .includes(String(repo.node_id)),
    );
  }, [data, isLoading, isError, error, githubSettings]);

  return (
    <>
      <Container>
        <Stack mb="xs">
          <Title order={1}>Github</Title>
          <Button
            variant="outline"
            style={{ width: 'fit-content' }}
            onClick={handlersAddRepoModal.open}
          >
            Add Repository
          </Button>
        </Stack>

        <Stack>
          {pullRequestsData?.map((repo) => (
            <RepoCard
              key={repo.id}
              name={repo.name}
              description={repo.description}
              url={repo.url}
              prs={repo.details}
            />
          ))}
        </Stack>
      </Container>

      <ModalAddRepo
        onClose={handlersAddRepoModal.close}
        opened={openedAddRepoModal}
      />
    </>
  );
}
