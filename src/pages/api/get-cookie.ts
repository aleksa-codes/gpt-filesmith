import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const apiKey = cookies.get('openai_api_key');
  return new Response(JSON.stringify({ apiKey }));
};
