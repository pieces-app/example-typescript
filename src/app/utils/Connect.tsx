import * as Pieces from "@pieces.app/client";

// ============================ [/connect]=============================//
const tracked_application = {
  name: Pieces.ApplicationNameEnum.Brave,
  version: '0.0.1',
  platform: Pieces.PlatformEnum.Macos,
}
// TODO: this will need to be updated once we are further along with the connector work.
export async function connect(): Promise<JSON> {

  const url: string = 'http://localhost:1000/connect';
  const options: {method: string, body: string} = {
      method: 'POST',
      body: JSON.stringify({ application: tracked_application}
      ),
  }

  let _output: Promise<JSON>;

  try {
      const response: Response = await fetch(url, options);
      const data: Promise<JSON> = await response.json();
      _output = data;
      return _output;
  } catch (e) {
      console.error(e);
  }

}
// ============================ [.end /connect]=============================//