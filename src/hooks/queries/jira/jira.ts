import { useQuery } from '@tanstack/react-query';
import type { SearchAndReconcileResults } from 'jira.js/version3/models/index';
import browser from 'webextension-polyfill';

interface UseJiraTicketsOptions {
  assignee?: string;
  jql?: string;
  maxResults?: number;
}

const fetchJiraTickets = async (
  options: UseJiraTicketsOptions,
): Promise<SearchAndReconcileResults> => {
  return browser.runtime.sendMessage({
    type: 'FETCH_JIRA_TICKETS',
    payload: options,
  });
};

export function useJiraTickets(options: UseJiraTicketsOptions) {
  return useQuery({
    queryKey: ['jiraTickets', options.assignee, options.jql],
    queryFn: () => fetchJiraTickets(options),
    // enabled: !!options.assignee || !!options.jql,
  });
}
