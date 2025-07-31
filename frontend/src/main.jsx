// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
// import './index.css'
// import { App } from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";
import { AppProvider } from "./context/AppProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </StrictMode>
);
