# Product Specification: Q.E.D. (Quantum Encrypted Delivery)

> **Product Vision**: To provide the fastest, most private way to move data between devices by eliminating the "middleman" server entirely.

## 1. Executive Summary
**Q.E.D.** is a web-based, peer-to-peer (P2P) file sharing application. Unlike simplified cloud storage services (Google Drive, WeTransfer) which require uploading files to a server before they can be downloaded, Q.E.D. establishes a direct **WebRTC** pipeline between the sender and receiver. This results in faster transfer speeds (especially on local networks), enhanced privacy (files are never stored on a third-party server), and zero storage costs.

## 2. Core Value Proposition
*   **Zero Latency**: Transfer begins immediately. No waiting for an upload to finish before the download can start.
*   **Total Privacy**: Data flows directly from User Device A → User Device B. No persistent copies exist in the cloud.
*   **Frictionless Access**: No accounts, no logins, no app installation required. Just a URL.
*   **Unlimited Potential**: No artificial file size limits enforced by the platform; limits are only dictated by the browser and device hardware.

## 3. Product Functionalities

### A. The "Instant Room" (Landing Page)
*   **One-Click Session**: Users can generate a unique, cryptographically random room ID (`nanoId`) instantly.
*   **Zero-Scroll Interface**: Designed for immediate action. No marketing fluff—just a "Start Sending" button.
*   **Visual Trust**: Neo-brutalist aesthetics convey improved durability and simplicity ("It just works").

### B. The Connection Hub (Room Page - Connection)
*   **QR Code Pairing**: Instant mobile-desktop connection. A user scans the on-screen QR code to open the same room on their phone.
*   **Smart Status Indicators**:
    *   *Signaling Status*: Shows if the device is talking to the handshake server.
    *   *P2P Status*: Clearly indicates "ONLINE" (Green) or "OFFLINE" (Red) for the direct peer connection.
*   **Clipboard Integration**: One-click "Copy Link" for sharing via messaging apps.

### C. The Transfer Engine (Room Page - Action)
*   **Drag & Drop Zone**: Intuitive interface for selecting files. Supports multi-file selection.
*   **Real-Time Progress**: Visual progress bar tracking the chunks of data being sent/received.
*   **Dual Mode**:
    *   **Files Tab**: For sending photos, videos, documents, and blobs.
    *   **Text Tab**: For sharing clipboards, passwords, or URLs securely between devices.
*   **Auto-Download**: Received files are automatically reassembled and prompted for download.

## 4. User Journey

### Scenario: "The Quick Handoff"
1.  **User A (Desktop)** has a PDF they need on their phone.
2.  User A visits `qed.share`.
3.  User A clicks **"Start Sending"**.
4.  user A sees a QR Code.
5.  **User B (Mobile/Self)** scans the QR Code.
6.  The devices perform a WebRTC handshake. **Status turns GREEN**.
7.  User A drops the PDF into the zone.
8.  User B instantly sees a "Receiving" prompt and the file downloads.
9.  Success. User A closes the tab, and the "Room" effectively ceases to exist.

## 5. Technical Edge (For Stakeholders)
*   **Protocol**: WebRTC (Web Real-Time Communication).
*   **Signaling**: Lightweight WebSocket/HTTP server only used for the initial handshake (SDP Exchange).
*   **Traversal**: Uses STUN/TURN servers to punch through NATs and firewalls, ensuring connectivity even on restrictive networks.
*   **responsive Design**: "Zero-Scroll" layout ensures 100% visibility of critical controls on standard laptops (1366x768) and mobile devices.

## 6. Target Audience
*   **Power Users**: Moving screenshots/files between their own Laptop and Phone.
*   **Privacy Advocates**: Sharing sensitive documents without email/cloud trails.
*   **Teams**: Quick local sharing in an office without Slack/Email limits.

## 7. Future Roadmap (Potential)
*   *v2.0*: End-to-End Encryption (E2EE) with password protection.
*   *v2.1*: History logic to "resume" interrupted transfers.
*   *v2.2*: "Broadcast" mode (One sender, multiple receivers).
