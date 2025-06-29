import { useQuery } from '@tanstack/react-query';
import browser from 'webextension-polyfill';

// Fetch bookmarks tree or a specific folder's subtree
const fetchBookmarks = async (folderId?: string) => {
  if (folderId) {
    // Returns an array with the folder node and its children as a hierarchy
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
