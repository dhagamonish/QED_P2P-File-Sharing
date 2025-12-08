# Q.E.D.
> *Quod Erat Demonstrandum* — "Which was to be demonstrated."

**Q.E.D.** is a minimalist, peer-to-peer file transfer tool designed for the intellectual web. It adheres to the philosophy of doing one thing perfectly: moving data from Point A to Point B without intermediaries, surveillance, or friction.

When the file arrives, the proof is complete. **Q.E.D.**

![Q.E.D. Interface](https://via.placeholder.com/800x400?text=Q.E.D.+Interface)

## The Philosophy
*   **Axiomatic Privacy**: No servers store your files. Data flows directly between peers via WebRTC.
*   **Universal Logic**: Works on any device with a browser. No installation required.
*   **Infinite Set**: No file size limits. If your device can hold it, you can send it.
*   **Neobrutalist Aesthetic**: Raw, bold, and unpretentious. Form follows function.

## Features
*   **Instant P2P Connection**: Uses a lightweight signaling server only for the handshake.
*   **Ephemeral Rooms**: Unique, cryptographically random room IDs (`nanoid`).
*   **Cross-Device**: Seamlessly connects Mobile to Desktop via QR Code.
*   **Text & Clipboard**: Share code snippets, URLs, or secrets instantly.
*   **Visual Feedback**: Real-time progress bars and connection status.

## Tech Stack
*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (Neobrutalist Theme)
*   **Protocol**: WebRTC (`simple-peer`)
*   **Signaling**: Custom Node.js Server (`socket.io`)

## Getting Started

### Prerequisites
*   Node.js 18+
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/qed.git
    cd qed
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the application**
    Visit `http://localhost:3000`.

## Deployment
Q.E.D. requires a persistent Node.js server for WebRTC signaling.
*   **Recommended**: Render, Railway, or Fly.io.
*   **Not Supported**: Vercel/Netlify (Serverless functions cannot maintain Socket.io connections).

## License
MIT. Free as in logic.
