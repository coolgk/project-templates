import React, { ComponentType, FunctionComponent } from 'react';
import { render, RenderResult } from '@testing-library/react/pure';

import App from 'src/pages/_app';

type Render = typeof render;
type RenderParams = Parameters<Render>;
type RenderAppOptions<T> = RenderParams[1] & { pageProps?: T };

export function renderApp<Props = Record<string, unknown>>(
  component: ComponentType<Props>,
  { pageProps, ...options }: RenderAppOptions<Props> = {}
): RenderResult {
  return render(<App Component={component as FunctionComponent} pageProps={pageProps} />, options);
}
