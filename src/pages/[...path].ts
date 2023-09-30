import type { APIRoute } from "astro";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function getContentType(extension: string | undefined) {
  switch (extension) {
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "json":
      return "application/json";
    default:
      return "text/plain";
  }
}

function getMessagePrompt(extension: string | undefined, path: string | undefined) {
  if (!extension || extension === "html") {
    return `Create a HTML document with content that matches following URL path: ${path}. The website design and colors should match the path and be inspired by Dribbble. Minimum 100vh, responsive design, navigation, footer and multiple sections. Use only meta, title, and the provided Tailwind CSS script ("<script src='https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio'></script>"). For images use online sources that are topic-specific. No comments or extra tags:`;
  } else if (extension === "json") {
    return `Create a JSON structure with content that matches following URL path: ${path}. The structure should only contain relevant keys and values for the topic:`;
  } else {
    return `Create a file of type ${extension} with content that matches following URL path: ${path}:`;
  }
}

async function generateCompletion(prompt: string) {
  return openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an advanced AI developer that creates files.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    stop: ["</html>"],
  });
}

function validatePath(path: string) {
  if (path.length > 100) {
    throw new Error("Path is too long");
  }
}

export const get: APIRoute = async ({ params }) => {
    const { path } = params;
    validatePath(path as string);
    const splittedPath = path?.split(".");
    const extension = splittedPath!.length > 1 ? splittedPath?.pop() : "html";
    const contentType = getContentType(extension);
    const messagePrompt = getMessagePrompt(extension, path);

    const completion = await generateCompletion(messagePrompt);

    if (!completion) {
      throw new Error("Completion not generated");
    }

    let content = completion.data.choices[0].message?.content;

    if (extension === "html") {
      content = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-height: 100vh; background-color: #f1f1f1; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <iframe src="data:text/html;charset=utf-8,${encodeURIComponent(content!)}" style="width: 100%; height: 90vh; border: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"></iframe>
          <a href="data:text/html;charset=utf-8,${encodeURIComponent(content!)}" download="${path?.split('.')[0]}.html" style="background-color: #6b46c1; color: white; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; outline: none; transition: background-color 0.3s, box-shadow 0.3s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 1rem;">
          Download
        </a>
      </div>
      <style>
        a:hover {
          background-color: #5a3fbf;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      </style>`;
  }
  
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": contentType,
    },
  });
};
