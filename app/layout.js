export const metadata = { title: 'UW Peer Accountability Program' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f4f0; color: #1a1a2e; min-height: 100vh; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
