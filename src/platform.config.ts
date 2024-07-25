import * as Pieces from "@pieces.app/pieces-os-client";

let BASE_URL: string;
let WS_URL: string;

if (Pieces.PlatformEnum.Linux) {
  BASE_URL = 'http://localhost:5323';
  WS_URL = 'ws://localhost:5323';
}
if(Pieces.PlatformEnum.Macos  || Pieces.PlatformEnum.Windows) {
  BASE_URL = 'http://localhost:1000';
  WS_URL = 'ws://localhost:1000';
}
else{
  BASE_URL = 'http://localhost:1000';
  WS_URL = 'ws://localhost:1000';

}

const config = new Pieces.Configuration({
  basePath: BASE_URL,
});
export { BASE_URL, WS_URL, config };