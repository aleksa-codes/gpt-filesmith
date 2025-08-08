# GPT FileSmith 🛠️

GPT FileSmith is a dynamic file generator inspired by _Rick and Morty's Interdimensional Cable_. Enter any path or URL (e.g., `/blackhole.py`, `/mcdonalds/special-deals.html`), and GPT-4 will generate a corresponding file based on the path and extension. If no extension is specified, it defaults to generating an HTML file. Currently, only HTML files are downloadable.

## 🌐 Demo

Try it live at [GPT FileSmith](https://filesmith.aleksa.io/)!

## ✨ Features

- **Dynamic File Creation**: Enter any path (e.g., `/about.html`, `/styles.css`), and GPT-4 generates file content based on the path and extension.
- **HTML File Support**: Generate and download HTML files directly.
- **Responsive Design**: Built with Astro and Tailwind CSS for a clean, adaptable UI.
- **Direct Browser Access**: Enter file paths directly in the address bar (e.g., `/example.html`).
- **Downloadable Files**: Download the generated HTML files with a single click.

## 🛠️ Tech Stack

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **API Integration**: OpenAI API

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or bun
- OpenAI API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aleksa-codes/gpt-filesmith.git
   cd gpt-filesmith
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Create a `.env` file with your OpenAI API key (optional; the key can also be added in-app):

   ```bash
   OPENAI_API_KEY=your-api-key
   ```

4. Start the development server:

   ```bash
   bun dev
   # or
   npm run dev
   ```

5. Access the app at `http://localhost:4321`.

## 💡 Usage

1. Enter a path with an extension (e.g., `/example.html`, `/styles.css`). If no extension is specified, HTML will be used by default.
2. Alternatively, enter the file path directly in the browser's address bar (e.g., `http://localhost:4321/example.html`).
3. GPT-4 will generate file content based on the specified path and file type.
4. Preview the generated file or download it if it’s an HTML file.

### Example Paths

- `/index.html`: Generates a homepage layout with header and navigation.
- `/style.css`: Generates a stylesheet using Tailwind CSS classes.
- `/api/response.json`: Creates a sample JSON API response.
- `/app.js`: Produces a JavaScript file with basic functionality.
- `/special-deals.html`: Generates a promotional webpage.

## 🛠️ Building for Production

To create a production build, run:

```bash
bun run build
# or
npm run build
```

The production-ready static files will be in the `dist` folder.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/aleksa-codes/gpt-filesmith/blob/main/LICENSE) file for details.

---

<p align="center">Made with ❤️ by <a href="https://github.com/aleksa-codes">aleksa.codes</a></p>
