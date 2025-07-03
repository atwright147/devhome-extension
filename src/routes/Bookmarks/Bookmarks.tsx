import { Accordion, Group, Text } from '@mantine/core';
import { IconFolderFilled } from '@tabler/icons-react';
import { type JSX, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';

import { useBookmarks } from '@src/hooks/queries/bookmarks';

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
          marginTop: 4,
        }}
      />
    );
  }

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
    <Accordion variant="contained" multiple>
      {nodes.map((node) =>
        node.children && node.children.length > 0 ? (
          <Accordion.Item key={node.id} value={node.id}>
            <Accordion.Control>
              <Group align="center" gap={10} wrap="nowrap">
                {getIcon(node)}
                {node.title}
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <BookmarkTree nodes={node.children} />
            </Accordion.Panel>
          </Accordion.Item>
        ) : node.url ? (
          <div
            key={node.id}
            style={{ paddingLeft: 32, paddingTop: 4, paddingBottom: 4 }}
          >
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Group gap={10} wrap="nowrap" align="flex-start">
                {getIcon(node)}
                <Text>{node.title}</Text>
              </Group>
            </a>
          </div>
        ) : null,
      )}
    </Accordion>
  );
}

export function Bookmarks() {
  const [bookmarksFolderId, setBookmarksFolderId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const settings = await browser.storage.local.get('settings');
      const folderId = (settings.settings as { bookmarkFolder?: string })
        ?.bookmarkFolder;
      setBookmarksFolderId(folderId);
    })();
  }, []);

  const { data: bookmarks, isLoading, error } = useBookmarks();

  const {
    data: selectedFolder,
    isLoading: isLoadingSelectedFolder,
    error: errorSelectedFolder,
  } = useBookmarks(bookmarksFolderId);

  if (isLoading || isLoadingSelectedFolder) {
    return <div>Loading bookmarks…</div>;
  }

  if (error || errorSelectedFolder) {
    return <div>Error loading bookmarks: {error?.message}</div>;
  }

  return (
    <div>
      <h1>Bookmarks</h1>
      <BookmarkTree nodes={selectedFolder?.[0]?.children || []} />
      <hr />
      <BookmarkTree nodes={bookmarks?.[0]?.children || []} />
    </div>
  );
}
