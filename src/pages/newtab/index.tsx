import { MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client';

import Newtab from '@pages/newtab/Newtab';

function init() {
  const rootContainer = document.querySelector('#__root');
  if (!rootContainer) throw new Error("Can't find Newtab root element");
  const root = createRoot(rootContainer);
  root.render(
    <MantineProvider defaultColorScheme="auto">
      <Newtab />
    </MantineProvider>,
  );
}

init();
