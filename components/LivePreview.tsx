
import React, { useEffect, useState } from 'react';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ html, css, js }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #333; }
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 400);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="h-full w-full bg-[#0c0c0e] p-6 flex flex-col">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-800/20">
        <div className="h-11 bg-slate-50 border-b border-slate-200 flex items-center px-5 gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          </div>
          <div className="flex-1 max-w-xl mx-auto bg-white border border-slate-200 rounded-lg h-7.5 flex items-center px-4 text-[10px] text-slate-400 font-bold tracking-tight">
            <svg className="w-3 h-3 mr-2 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            sandbox-production.codestream.io/runtime
          </div>
          <div className="w-16"></div>
        </div>
        <div className="flex-1 relative bg-white">
          <iframe
            srcDoc={srcDoc}
            title="SaaS Preview Sandbox"
            sandbox="allow-scripts allow-modals allow-popups"
            frameBorder="0"
            width="100%"
            height="100%"
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
