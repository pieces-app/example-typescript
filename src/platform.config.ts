import * as Pieces from "@pieces.app/pieces-os-client";
import { PiecesClient } from "pieces-copilot-sdk";

let BASE_URL: string;
let WS_URL: string;

// Define your port here 
// LINUX PORT=5323
// For Windows and MacOs PORT=1000

const PORT = 5323

BASE_URL = 'http://localhost:'+PORT;
WS_URL = 'ws://localhost:'+PORT;

const config = new Pieces.Configuration({
  basePath: BASE_URL,
});

const piecesClient = new PiecesClient({ baseUrl: BASE_URL });

export { BASE_URL, WS_URL, config, piecesClient };