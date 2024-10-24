import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete('openai_api_key', {
    path: '/',
  });

  return new Response(null, { status: 200 });
};
