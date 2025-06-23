import { IconFolderFilled } from '@tabler/icons-react';

import { Group } from '@mantine/core';
import { useBookmarks } from '@src/hooks/queries/bookmarks';
import type { JSX } from 'react';
import browser from 'webextension-polyfill';

function faviconURL(siteUrl: string | undefined): string {
  if (!siteUrl) {
    return '';
  }

  const faviconUrl = new URL(browser.runtime.getURL('/_favicon/'));
  faviconUrl.searchParams.set('pageUrl', siteUrl);
  faviconUrl.searchParams.set('size', '32');
  return faviconUrl.toString();
}

function getIcon(node: BookmarkNode): JSX.Element {
  if (node.url) {
    return (
      <img
        src={faviconURL(node.url)}
        alt={node.title}
        style={{
          width: 16,
          height: 16,
          verticalAlign: 'middle',
          marginRight: 4,
        }}
      />
    );
  }

  console.info(`Bookmark without URL: ${node.title || node.id}`);
  return <IconFolderFilled size={20} />;
}

type BookmarkNode = {
  id: string;
  title?: string;
  url?: string;
  children?: BookmarkNode[];
};

function BookmarkTree({ nodes }: { nodes: BookmarkNode[] }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          {
            <a href={node.url} target="_blank" rel="noopener noreferrer">
              <Group align="center" gap={10}>
                {getIcon(node)}
                {node.title}
              </Group>
            </a>
          }
          {node.children && node.children.length > 0 && (
            <BookmarkTree nodes={node.children} />
          )}
        </li>
      ))}
    </ul>
  );
}

export function Bookmarks() {
  const { data: bookmarks, isLoading, error } = useBookmarks();

  if (isLoading) {
    return <div>Loading bookmarks…</div>;
  }

  if (error) {
    return <div>Error loading bookmarks: {error.message}</div>;
  }

  return (
    <div>
      <h1>Bookmarks</h1>
      {/* <pre>{JSON.stringify(bookmarks, null, 2)}</pre> */}
      <BookmarkTree nodes={bookmarks?.[0]?.children || []} />
    </div>
  );
}
