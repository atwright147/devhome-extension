import type { Settings } from '@src/types/settings';
import { Version3Client } from 'jira.js';
import type { SearchAndReconcileResults } from 'jira.js/version3/models/index';
import browser from 'webextension-polyfill';

console.log('background script loaded');

interface Message {
  type: string;
  payload: {
    assignee?: string;
    jql?: string;
    maxResults?: number;
  };
}

function isMessage(message: unknown): message is Message {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    typeof message.type === 'string' &&
    'payload' in message &&
    typeof message.payload === 'object'
  );
}

browser.runtime.onMessage.addListener(
  async (message: unknown): Promise<SearchAndReconcileResults> => {
    if (isMessage(message)) {
      if (message.type === 'FETCH_JIRA_TICKETS') {
        const { assignee, jql: _jql, maxResults } = message.payload;
        const { settings } = await browser.storage.local.get('settings');
        const { jiraAccessToken, jiraUserName, jiraBaseUrl } =
          settings as Settings;

        if (!jiraAccessToken || !jiraUserName || !jiraBaseUrl) {
          throw new Error('Missing Jira credentials or base URL in settings');
        }

        let jql = _jql ?? '';
        if (!_jql) {
          jql = assignee
            ? `assignee = ${assignee}`
            : 'assignee = currentUser()';
        }

        const client = new Version3Client({
          host: jiraBaseUrl,
          authentication: {
            basic: {
              email: 'atwright147@gmail.com',
              apiToken: jiraAccessToken,
            },
          },
        });

        let response: SearchAndReconcileResults;

        try {
          response =
            await client.issueSearch.searchForIssuesUsingJqlEnhancedSearch({
              jql,
              maxResults: maxResults ?? 20,
              fields: [
                'summary',
                'status',
                'assignee',
                'issuetype',
                'project',
                'priority',
              ],
            });

          return response;
        } catch (err) {
          console.error('Error fetching Jira tickets:', err);

          return {
            issues: [],
            names: {},
            schema: {},
          };
        }
      }
    }

    return { issues: [], names: {}, schema: {} };
  },
);
