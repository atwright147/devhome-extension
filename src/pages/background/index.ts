import type { Settings } from '@src/types/settings';
import browser from 'webextension-polyfill';

console.log('background script loaded');

browser.runtime.onMessage.addListener(async (message) => {
  console.log('Received message in background script:', message);
  if (message.type === 'FETCH_JIRA_TICKETS') {
    const { assignee, jql, maxResults } = message.payload;
    const { settings } = await browser.storage.local.get('settings');
    const { jiraAccessToken, jiraUserName, jiraBaseUrl } = settings as Settings;

    if (!jiraAccessToken || !jiraUserName || !jiraBaseUrl) {
      return { error: 'Missing Jira credentials or base URL in settings' };
    }

    // Use jiraUserName from settings if assignee is not specified
    const effectiveAssignee = assignee || jiraUserName;

    let query: string;
    if (jql) {
      query = jql;
    } else if (effectiveAssignee) {
      query = `assignee=${effectiveAssignee} AND resolution=Unresolved ORDER BY updated DESC`;
    } else {
      query = 'resolution=Unresolved ORDER BY updated DESC';
    }

    const url = `${jiraBaseUrl}/rest/api/2/search?jql=${encodeURIComponent(query)}&maxResults=${maxResults || 20}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${btoa(`${jiraUserName}:${jiraAccessToken}`)}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        return { error: 'Failed to fetch Jira tickets' };
      }

      const data = await response.json();
      return { issues: data.issues };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { error: errorMessage };
    }
  }
});
