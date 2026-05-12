import { Elysia } from 'elysia';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

type ResponseInit = {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
};

/**
 * Elysia plugin that provides Handlebars template rendering.
 *
 * Registers a `view(name, data, init?)` method on the Elysia context
 * via `.decorate()`. The view method renders a Handlebars template
 * wrapped in a layout template and returns an HTML Response.
 *
 * @returns An Elysia plugin instance
 */
export function viewPlugin() {
  const viewsRoot = join(process.cwd(), 'res');
  const layoutTpl = Handlebars.compile(
    readFileSync(join(viewsRoot, 'main.hbs'), 'utf8'),
  );

  const view = <T extends Record<string, unknown>>(
    name: string,
    data?: T,
    init: ResponseInit = {},
  ): Response => {
    const tplSrc = readFileSync(join(viewsRoot, `${name}.hbs`), 'utf8');
    const tpl = Handlebars.compile(tplSrc);
    const body = tpl(data ?? {});
    return new Response(
      layoutTpl({ body, ...(data as Record<string, unknown>) }),
      {
        ...init,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...(init.headers || {}),
        },
      },
    );
  };

  return new Elysia({ name: 'handlebars-view' }).decorate('view', view);
}
