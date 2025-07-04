import type browser from 'webextension-polyfill';

import { isFolder } from '@src/hooks/queries/bookmarks';

export interface Options {
  value: string;
  label: string;
}

export function flattenFolders(
  nodes: browser.Bookmarks.BookmarkTreeNode[],
  skipRoot = false,
  parentPath = '',
): Options[] {
  const result: Options[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isFolder(node)) {
      if (skipRoot && i === 0) {
        // Skip the first/top-level node, but process its children
        if (node.children) {
          result.push(...flattenFolders(node.children, false, parentPath));
        }
        continue;
      }
      const currentPath = parentPath
        ? `${parentPath}/${node.title || 'Untitled Folder'}`
        : node.title || 'Untitled Folder';
      result.push({
        value: node.id,
        label: currentPath,
      });
      if (node.children) {
        result.push(...flattenFolders(node.children, false, currentPath));
      }
    }
  }
  return result;
}
