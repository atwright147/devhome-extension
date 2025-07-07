import { useQuery } from '@tanstack/react-query';
import browser from 'webextension-polyfill';

interface JiraTicket {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    [key: string]: unknown;
  };
}

interface UseJiraTicketsOptions {
  assignee?: string;
  jql?: string;
  maxResults?: number;
}

const fetchJiraTickets = async (
  options: UseJiraTicketsOptions,
): Promise<JiraTicket[]> => {
  const result = await browser.runtime.sendMessage({
    type: 'FETCH_JIRA_TICKETS',
    payload: options,
  });

  console.info('Jira tickets fetched:', result);

  if (result.error) {
    throw new Error(result.error);
  }

  return result.issues;
};

export function useJiraTickets(options: UseJiraTicketsOptions) {
  return useQuery({
    queryKey: ['jiraTickets', options.assignee, options.jql],
    queryFn: () => fetchJiraTickets(options),
    // enabled: !!options.assignee || !!options.jql,
  });
}
