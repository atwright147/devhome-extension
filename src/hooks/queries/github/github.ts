import { useQuery } from '@tanstack/react-query';
import { Octokit } from 'octokit';
import browser from 'webextension-polyfill';

import type { Settings } from '@src/types/settings';

let octokit: Octokit;
let cacheTime: number | undefined;

(async () => {
  const { settings } = (await browser.storage.local.get(
    'settings',
  )) as unknown as { settings: Settings };
  const { githubAccessToken, githubCacheTime } = settings;
  if (githubAccessToken) {
    octokit = new Octokit({ auth: githubAccessToken });
  }
  cacheTime = githubCacheTime;
})();

const fetchRepos = async () => {
  const repos = await octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      per_page: 100, // You can set this to up to 100 to fetch more per page
    },
    (response) => response.data,
  );

  return repos;
};

export function useRepos() {
  return useQuery({
    queryKey: ['github', 'repos'],
    queryFn: fetchRepos,
    staleTime: cacheTime,
  });
}

type GithubSettings = {
  github?: {
    repos?: string[];
  };
};

const fetchGithubSettings = async (): Promise<GithubSettings> => {
  const github = await browser.storage.local.get('github');
  return github as GithubSettings;
};

export function useGithubSettings() {
  return useQuery<GithubSettings>({
    queryKey: ['github', 'settings'],
    queryFn: fetchGithubSettings,
    staleTime: cacheTime,
  });
}

type RepoId = string;

export function usePullRequests(reposToFetch: RepoId[], limit = 10) {
  return useQuery({
    queryKey: ['pullRequests', { reposToFetch, limit }],

    queryFn: async () => {
      if (!reposToFetch || reposToFetch.length === 0) {
        return []; // Return empty array if no repos are provided
      }

      // Build GraphQL query using node(id: ...) for each repo
      const repoQueryParts: string[] = [];
      reposToFetch.forEach((repoId, index) => {
        const alias = `repo${index}`;
        repoQueryParts.push(`
          ${alias}: node(id: \"${repoId}\") {
            ... on Repository {
              id
              name
              url
              description
              pullRequests(first: ${limit}, states: [OPEN]) {
                totalCount
                nodes {
                  number
                  title
                  state
                  url
                  author {
                    login
                  }
                  createdAt
                }
              }
            }
          }
        `);
      });

      const query = `
        query GetReposPullRequestsById {
          ${repoQueryParts.join('\n')}
        }
      `;

      try {
        const response = await octokit.graphql(query);

        // Type assertion to treat response as an object with string keys
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const responseObj = response as Record<string, any>;

        // Process the response into a more usable format for your component
        const formattedData = reposToFetch.map((repoId, index) => {
          const alias = `repo${index}`;
          const repoGraphQLData = responseObj[alias];
          if (repoGraphQLData?.pullRequests) {
            return {
              id: repoId,
              name: repoGraphQLData.name,
              url: repoGraphQLData.url,
              description: repoGraphQLData.description,
              totalCount: repoGraphQLData.pullRequests.totalCount,
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              details: repoGraphQLData.pullRequests.nodes.map((pr: any) => ({
                number: pr.number,
                title: pr.title,
                state: pr.state,
                url: pr.url,
                authorLogin: pr.author?.login || 'N/A',
                createdAt: pr.createdAt,
              })),
            };
          }
          return {
            id: repoId,
            name: null,
            url: null,
            totalCount: 0,
            details: [],
            error: `Could not fetch data for repo id ${repoId}`,
          };
        });

        return formattedData;
      } catch (err) {
        const error = err as Error;
        console.error('Error in usePullRequests queryFn:', error);
        // Re-throw the error so React Query can catch and expose it
        throw new Error(
          error.message || 'Failed to fetch pull requests via GraphQL.',
        );
      }
    },
    enabled: reposToFetch && reposToFetch.length > 0, // Only run query if reposToFetch is not empty
  });
}
