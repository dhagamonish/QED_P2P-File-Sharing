# Q.E.D. (Quod Erat Demonstrandum)

**The file has been sent.**

Q.E.D. is a secure, serverless, peer-to-peer file sharing application designed with a bold Neobrutalist aesthetic. It allows you to transfer files of any size directly between devices without ever storing them on a server.

## Philosophy

*   **Direct**: Browser-to-browser via WebRTC.
*   **Secure**: End-to-end encrypted.
*   **Private**: No logs, no tracking, no middleman.
*   **Limitless**: No file size caps (limited only by your RAM/Browser).

## Features

*   **Neobrutalist Design**: High contrast, bold typography, hard shadows.
*   **Instant Rooms**: Generate a unique link and QR code instantly.
*   **Cross-Device**: Seamlessly share between Desktop and Mobile.
*   **Text Sharing**: Send secure text messages alongside files.
*   **Real-time Progress**: Visual feedback for all transfers.

## Tech Stack

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS
*   **Signaling**: Custom Node.js Server + Socket.io
*   **P2P Logic**: Simple-Peer (WebRTC)
*   **Styling**: Lucide React (Icons), Custom Neobrutalist Components

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    *Note: This runs a custom server (`server.js`) to handle both Next.js and Socket.io.*

3.  **Open in Browser**:
    Visit `http://localhost:3000`

## Deployment

See [deployment.md](deployment.md) for instructions on deploying to platforms like Railway, Render, or Google Cloud Run. Note that Vercel serverless functions do not support the long-running WebSocket connections required for the signaling server.
