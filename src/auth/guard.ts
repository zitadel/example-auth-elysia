import { getAuthUser } from '@zitadel/elysia-auth';
import { authConfig } from './index.js';

/**
 * Elysia beforeHandle guard that ensures the user is authenticated before
 * accessing protected routes. It retrieves the current Auth.js session and
 * validates that a user is present. If authentication fails, the client is
 * redirected to the sign-in page with the original URL preserved in the
 * callbackUrl query parameter. On success, control is passed to the route
 * handler.
 *
 * @param context - Elysia context containing the request and set objects.
 *   The session will be available after validation.
 * @returns A redirect response if not authenticated, undefined otherwise
 *
 * @remarks
 * - Must be used after setting up Auth.js session handling so that request
 *   cookies are parsed.
 * - Relies on getAuthUser() from @zitadel/elysia-auth.
 * - Redirects unauthenticated users to
 *   `/auth/signin?callbackUrl=<original URL>`.
 * - Original request URL is URL-encoded in callbackUrl.
 *
 * @example
 * ```ts
 * import { requireAuth } from './guards'
 *
 * app.get('/profile', handler, { beforeHandle: requireAuth })
 * ```
 */
export async function requireAuth({
  request,
  set,
}: {
  request: Request;
  set: { redirect?: string };
}): Promise<Response | void> {
  try {
    const authUser = await getAuthUser(request, authConfig);
    if (!authUser?.session.user) {
      const callbackUrl: string = encodeURIComponent(request.url);
      set.redirect = `/auth/signin?callbackUrl=${callbackUrl}`;
    }
  } catch (err) {
    throw err as Error;
  }
}
