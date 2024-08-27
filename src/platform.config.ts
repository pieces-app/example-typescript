import * as Pieces from '@pieces.app/pieces-os-client';
import { PiecesClient } from 'pieces-copilot-sdk';

let BASE_URL: string;
let WS_URL: string;
let PORT: number;

const platform = navigator.platform.toLowerCase();

if (platform.includes('win') || platform.includes('mac')) {
  PORT = 1000;
} else if (platform.includes('linux')) {
  PORT = 5323;
} else {
  console.log('PORT not set for : ', platform);
}

BASE_URL = 'http://localhost:' + PORT;
WS_URL = 'ws://localhost:' + PORT;

const config = new Pieces.Configuration({
  basePath: BASE_URL,
});

const piecesClient = new PiecesClient({ baseUrl: BASE_URL });

export { BASE_URL, WS_URL, config, piecesClient };
