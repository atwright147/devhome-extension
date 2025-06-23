import { Container, Title } from '@mantine/core';

import { useRepos } from '@src/hooks/queries/github/github';

export function Github() {
  const { data, isLoading, isError, error } = useRepos();
  return (
    <Container>
      <Title order={1}>Github</Title>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}
      {!isLoading && !isError && (
        <div>
          <h2>Repositories ({data?.length})</h2>
          <ul>
            {data?.map((repo) => (
              <li key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Title order={2}>Raw Data</Title>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Container>
  );
}
