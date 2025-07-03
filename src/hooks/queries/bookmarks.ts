import { useQuery } from '@tanstack/react-query';
import browser from 'webextension-polyfill';

const fetchBookmarks = async (folderId?: string) => {
  if (folderId) {
    return browser.bookmarks.getSubTree(folderId);
  }
  return browser.bookmarks.getTree();
};

// React Query hook to get bookmarks or a folder's subtree
export function useBookmarks(folderId?: string) {
  return useQuery({
    queryKey: ['bookmarks', { folderId }],
    queryFn: () => fetchBookmarks(folderId),
  });
}

export function isFolder(
  node: browser.Bookmarks.BookmarkTreeNode,
): node is browser.Bookmarks.BookmarkTreeNode {
  return !node.url;
}
