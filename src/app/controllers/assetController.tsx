import * as Pieces from "@pieces.app/pieces-os-client";

export default class AssetController {
  public static instance: AssetController;
  public newAssetData = "";


  public static getInstance() {
    return (AssetController.instance ??= new AssetController());
  }
}