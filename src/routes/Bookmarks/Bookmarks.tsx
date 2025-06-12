import { useBookmarks } from '@src/hooks/queries/bookmarks';

export function Bookmarks() {
  const { data: bookmarks, isLoading, error } = useBookmarks();

  if (isLoading) {
    return <div>Loading bookmarks...</div>;
  }

  if (error) {
    return <div>Error loading bookmarks: {error.message}</div>;
  }

  return (
    <div>
      <h1>Bookmarks</h1>
      <ul>
        {bookmarks?.map((bookmark) => (
          <li key={bookmark.id}>
            {bookmark.title || 'No title'} - {bookmark.url || 'No URL'}
          </li>
        ))}
      </ul>
    </div>
  );
}
