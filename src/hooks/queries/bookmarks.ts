import { useQuery } from '@tanstack/react-query';
import browser from 'webextension-polyfill';

// Fetch all bookmarks using the browser.bookmarks API
const fetchBookmarks = async () => {
  if (!('browser' in window) || !browser.bookmarks) {
    throw new Error('Bookmarks API not available');
  }
  // Get all bookmarks
  const bookmarks = await browser.bookmarks.getTree();
  return bookmarks;
};

// React Query hook to get bookmarks
export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
  });
}
