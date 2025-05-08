import './index.css'
import App from './App'
import ReactDOM from 'react-dom/client';
import React from 'react';
export function renderToDOM(container: Element): void {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
