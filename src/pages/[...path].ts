import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const getContentType = (extension: string): string => {
  const types: { [key: string]: string } = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
  };
  return types[extension] || (extension ? 'text/plain' : 'text/html');
};

function getMessagePrompt(extension: string | undefined, path: string | undefined) {
  if (!extension || extension === 'html') {
    return `Generate HTML code with content that matches following URL path: ${path}. The website design and colors should match the path. Use Tailwind CSS. Minimum 100vh, responsive design, navigation, footer and multiple sections. For images use online sources that are topic-specific. No comments or extra tags.`;
  } else if (extension === 'json') {
    return `Generate JSON code with content that matches following URL path: ${path}. The structure should only contain relevant keys and values for the topic.`;
  } else {
    return `Generate ${extension.toUpperCase()} code with content that matches following URL path: ${path}. The code should be valid and follow best practices for the language.`;
  }
}

const generateCompletion = async (prompt: string, apiKey: string | null) => {
  if (!apiKey) {
    throw new Error('No API key provided');
  }

  const openai = new OpenAI({ apiKey });

  return openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert AI developer that creates files. Do not say anything before or after the file content.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 1.1,
    stop: ['</html>'],
  });
};

const validatePath = (path: string) => {
  if (path.length > 100) throw new Error('Path too long');
};

// Helper function to get cookie value
const getCookie = (cookieStr: string | null, name: string): string | null => {
  if (!cookieStr) return null;
  const value = `; ${cookieStr}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { path = '' } = params;
    validatePath(path);

    // Get API key from cookie
    const apiKey = getCookie(request.headers.get('cookie'), 'openai_api_key');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const extension = path.includes('.') ? path.split('.').slice(-1)[0] : '';
    const contentType = getContentType(extension);
    const prompt = getMessagePrompt(extension, path);
    const { choices } = await generateCompletion(prompt, apiKey);

    let content = choices?.[0]?.message?.content || '';
    content = content.replace(/```(html|css|js|json)?/g, '');

    if (extension === 'html' || extension === '') {
      content = `
      <body style="display: flex; flex-direction: column; height: 100vh; justify-content: space-between; background: #f2f2f2; font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <iframe style="flex: 1; width: 100%; border: none; overflow-y: auto;" src="data:text/html;charset=utf-8,${encodeURIComponent(
          content,
        )}"></iframe>
        <div style="text-align: center; background: #f9f9f9; padding: 12px;">
          <p style="font-size: 18px; font-weight: 500; color: #333; margin: 0;">Like what you see?</p>
          <div style="display: inline-flex; gap: 8px;">
            <a href="/" 
               style="margin-top: 8px; background: #ccc; color: #333; font-weight: 600; padding: 8px 16px; border-radius: 12px; text-decoration: none; transition: background-color 0.3s ease;"
               onmouseover="this.style.backgroundColor='#ddd'"
               onmouseout="this.style.backgroundColor='#ccc'">
              Go Home
            </a>
            <a href="data:text/html;charset=utf-8,${encodeURIComponent(content)}" download="${
              path?.split('.')[0]
            }.html" 
               style="margin-top: 8px; background: #6D28D9; color: #fff; font-weight: 600; padding: 8px 16px; border-radius: 12px; text-decoration: none; transition: background-color 0.3s ease;"
               onmouseover="this.style.backgroundColor='#7C3AED'"
               onmouseout="this.style.backgroundColor='#6D28D9'">
              Download
            </a>
          </div>
        </div>
      </body>`;
    }

    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
