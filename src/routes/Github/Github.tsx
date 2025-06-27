import { Button, Container, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react';

import { ModalAddRepo } from '@components/ModalAddRepo';
import {
  useGithubSettings,
  usePullRequests,
  useRepos,
} from '@src/hooks/queries/github/github';
import browser from 'webextension-polyfill';

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
        <Title order={1}>Github</Title>
        <Button variant="outline" onClick={handlersAddRepoModal.open}>
          Add Repository
        </Button>

        <hr />

        <pre>{JSON.stringify(pullRequestsData, null, 2)}</pre>

        {reposToShow?.map((repo) => (
          <div key={repo.id}>
            <Title order={3}>{repo.name}</Title>
          </div>
        ))}
      </Container>

      <ModalAddRepo
        onClose={handlersAddRepoModal.close}
        opened={openedAddRepoModal}
      />
    </>
  );
}
