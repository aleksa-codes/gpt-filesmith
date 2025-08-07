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
    model: 'gpt-5-nano',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert AI developer that creates files. Do not say anything before or after the file content.',
      },
      { role: 'user', content: prompt },
    ],
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
      <body style="display: flex; flex-direction: column; height: 100vh; justify-content: space-between; background: #f3f4f6; font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <iframe style="flex: 1; width: 100%; border: none; overflow-y: auto;" src="data:text/html;charset=utf-8,${encodeURIComponent(content)}"></iframe>
        
        <!-- Footer -->
        <div style="text-align: center; background: #f9fafb; padding: 16px;">
          <p style="font-size: 18px; font-weight: 500; color: #4b5563; margin-bottom: 12px; margin-top: 0;">Like what you see?</p>
          
          <!-- Button Container -->
          <div style="display: inline-flex; gap: 12px;">
            <!-- Home Button -->
            <a href="/" 
               style="display: flex; align-items: center; gap: 6px; background: #e5e7eb; color: #374151; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; transition: background-color 0.3s ease;"
               onmouseover="this.style.backgroundColor='#d1d5db'"
               onmouseout="this.style.backgroundColor='#e5e7eb'">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </g>
              </svg>
              Go Home
            </a>
      
            <!-- Download Button -->
            <a href="data:text/html;charset=utf-8,${encodeURIComponent(content)}" download="${path?.split('.')[0]}.html" 
               style="display: flex; align-items: center; gap: 6px; background: #6D28D9; color: #ffffff; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; transition: background-color 0.3s ease;"
               onmouseover="this.style.backgroundColor='#7C3AED'"
               onmouseout="this.style.backgroundColor='#6D28D9'">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5l5-5m-5 5V3"/>
              </svg>
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
