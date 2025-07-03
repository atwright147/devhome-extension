import { useTotalPullRequestsAndIssues } from '../hooks/queries/github/github';
import { AppNavLink } from './AppNavLink';

export function Nav() {
  const {
    data: totalCounts,
    isLoading,
    error,
  } = useTotalPullRequestsAndIssues();

  return (
    <nav>
      <AppNavLink href="/" label="Home" />
      <AppNavLink href="/dashboard" label="Dashboard" />
      <AppNavLink href="/bookmarks" label="Bookmarks" />
      <AppNavLink
        href="/github"
        label={`Github (${totalCounts?.totalPullRequests || 0} PRs, ${totalCounts?.totalIssues || 0} Issues)`}
      />
    </nav>
  );
}
