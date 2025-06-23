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
