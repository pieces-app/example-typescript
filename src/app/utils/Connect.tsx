import * as Pieces from "@pieces.app/pieces-os-client";

// ============================ [/connect]=============================//
const tracked_application = {
  name: Pieces.ApplicationNameEnum.Unknown,
  version: '0.0.1',
  platform: Pieces.PlatformEnum.Macos,
}
// TODO: this will need to be updated once we are further along with the connector work.
export async function connect(): Promise<JSON> {
  const connectorApi = new Pieces.ConnectorApi();
  const response = await connectorApi.connect({
    seededConnectorConnection: { application: tracked_application },
  });
  //  console.log(response); you can log response just to confirm
  return JSON.parse(JSON.stringify(response));
}
// ============================ [.end /connect]=============================//