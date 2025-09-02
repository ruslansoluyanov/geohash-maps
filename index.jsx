import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import GeohashGenerator from './main.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<GeohashGenerator />);
