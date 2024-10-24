# GPT FileSmith

**GPT FileSmith** is a file generator tool inspired by _Rick and Morty's Interdimensional Cable_ concept. You can enter any path or URL (e.g., `/blackhole.py`, `/mcdonalds/special-deals.html`), and it will generate a corresponding file using GPT-4, based on the path and extension. The app supports generating HTML, CSS, JavaScript, JSON, and other common file types on the fly.

## Demo

Visit [GPT FileSmith](https://filesmith.aleksa.io/) to try the app live!

## Features

- **Dynamic file creation:** Enter any path (e.g., `/about.html`, `/styles.css`) and GPT-4 generates a file corresponding to that path and extension.
- **Multiple file types:** Supports HTML, CSS, JavaScript, JSON, and more.
- **Customizable design:** Tailwind CSS is used for responsive, clean design.
- **Use directly in browser:** You can also enter the file path directly in the browser's address bar for a seamless experience (e.g., `/example.html`).
- **Download files:** You can generate and download the created files.

## How It Works

1. Enter a path with an extension (e.g., `/example.html`, `/styles.css`).
2. GPT-4 will generate the file content based on the file type and the given path.
3. The page is dynamically created, allowing you to preview or download the file.

## Installation

Follow these steps to install and run the project locally.

### Prerequisites

- **Node.js** (v14+)
- **Yarn** or **npm**
- An OpenAI API key

### Clone the repository

```bash
git clone https://github.com/aleksa-codes/gpt-filesmith.git
cd gpt-filesmith
```

### Install dependencies

You can install dependencies using either Yarn or npm.

#### Using Yarn

```bash
yarn install
```

#### Using npm

```bash
npm install
```

### Running the Development Server

Once you have the dependencies installed and your API key set up, you can run the development server.

#### Using Yarn

```bash
yarn dev
```

#### Using npm

```bash
npm run dev
```

The application will start, and you can access it at `http://localhost:4321`.

## Usage

1. Enter a path or URL in the form (e.g., `/example.html`, `/scripts/main.js`).
2. Alternatively, you can enter the file path directly in the browser's address bar (e.g., `http://localhost:3000/example.html`).
3. The app will generate the content for the file type (HTML, CSS, JS, etc.).
4. Preview the generated file in the browser or download it using the provided link.

## Example Paths

Here are some example paths you can try:

- `/index.html`: Generates a homepage with a header, navigation, and content.
- `/style.css`: Generates a basic stylesheet with Tailwind CSS classes.
- `/api/response.json`: Generates a sample JSON response.
- `/app.js`: Generates a simple JavaScript file.
- `/special-deals.html`: Generates a promotional webpage.

## Build for Production

To build the app for production, use the following commands.

#### Using Yarn

```bash
yarn build
```

#### Using npm

```bash
npm run build
```

The static files will be generated in the `dist` folder, ready to be deployed.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/aleksa-codes/gpt-filesmith/blob/main/LICENSE) file for details.
