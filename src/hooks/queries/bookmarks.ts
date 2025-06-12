import { useQuery } from '@tanstack/react-query';
import browser from 'webextension-polyfill';

// Fetch all bookmarks using the browser.bookmarks API
const fetchBookmarks = async () => {
  return browser.bookmarks.getTree();
};

// React Query hook to get bookmarks
export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
  });
}
