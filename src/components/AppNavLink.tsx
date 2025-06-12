import { NavLink, type NavLinkProps } from '@mantine/core';
import { ActiveLink } from 'raviger';
import type { ComponentProps, JSX } from 'react';

export const AppNavLink = (
  props: NavLinkProps & Pick<ComponentProps<typeof ActiveLink>, 'href'>,
): JSX.Element => {
  return <NavLink component={ActiveLink} {...props} />;
};
