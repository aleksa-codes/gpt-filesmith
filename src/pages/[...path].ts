import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

const getContentType = (extension: string): string => {
  const types: { [key: string]: string } = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json'
  };
  return types[extension] || (extension ? 'text/plain' : 'text/html');
};

function getMessagePrompt(extension: string | undefined, path: string | undefined) {
  if (!extension || extension === 'html') {
    return `Create a HTML document with content that matches following URL path: ${path}. The website design and colors should match the path and be inspired by Dribbble. Use Tailwind CSS. Minimum 100vh, responsive design, navigation, footer and multiple sections. For images use online sources that are topic-specific. No comments or extra tags.`;
  } else if (extension === 'json') {
    return `Create a JSON structure with content that matches following URL path: ${path}. The structure should only contain relevant keys and values for the topic.`;
  } else {
    return `Create a file of type ${extension} with content that matches following URL path: ${path}.`;
  }
}

const generateCompletion = async (prompt: string) =>
  openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert AI developer that creates files.' },
      { role: 'user', content: prompt }
    ],
    temperature: 1.1,
    stop: ['</html>']
  });

const validatePath = (path: string) => {
  if (path.length > 100) throw new Error('Path too long');
};

export const GET: APIRoute = async ({ params }) => {
  const { path = '' } = params;
  validatePath(path);

  // Get extension, if any
  const extension = path.includes('.') ? path.split('.').slice(-1)[0] : '';

  // Get content type
  const contentType = getContentType(extension);

  // Generate the prompt
  const prompt = getMessagePrompt(extension, path);

  // Generate the completion
  const { choices } = (await generateCompletion(prompt)) || {};

  let content = choices?.[0]?.message?.content || '';

  // Handle HTML-specific logic
  if (extension === 'html' || extension === '') {
    content = `
    <body style="display: flex; flex-direction: column; height: 100vh; justify-content: space-between; background: #f2f2f2; font-family: Arial, sans-serif; margin: 0; padding: 0;">
      <iframe style="flex: 1; width: 100%; border: none; overflow-y: auto;" src="data:text/html;charset=utf-8,${encodeURIComponent(
        content!
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
          <a href="data:text/html;charset=utf-8,${encodeURIComponent(content!)}" download="${path?.split('.')[0]}.html" 
             style="margin-top: 8px; background: #6D28D9; color: #fff; font-weight: 600; padding: 8px 16px; border-radius: 12px; text-decoration: none; transition: background-color 0.3s ease;"
             onmouseover="this.style.backgroundColor='#7C3AED'"
             onmouseout="this.style.backgroundColor='#6D28D9'">
            Download
          </a>
        </div>
      </div>
    </body>`;
  }

  return new Response(content, { status: 200, headers: { 'Content-Type': contentType } });
};
