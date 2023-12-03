/// (1) First import the react library here in your index.tsx.
import * as React from "react";
import {createRoot} from "react-dom/client";
import {App} from "./app/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

