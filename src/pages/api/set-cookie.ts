import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, request }) => {
  const { apiKey } = await request.json();
  cookies.set('openai_api_key', apiKey, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true, // Makes cookie inaccessible to JavaScript
    secure: true, // Only sent over HTTPS
    sameSite: 'strict', // Protects against CSRF
  });
  return new Response(null, { status: 200 });
};
