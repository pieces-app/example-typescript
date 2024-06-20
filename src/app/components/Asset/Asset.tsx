import * as Pieces from "@pieces.app/pieces-os-client";
import { SeededAsset, SeedTypeEnum } from "@pieces.app/pieces-os-client";
import { Application } from "@pieces.app/pieces-os-client";

type LocalAsset = {
  name: string;
  id: string;
  classification: Pieces.ClassificationSpecificEnum;
};

//==============================[/create]==================================//
export async function createAsset(applicationData: Application, data: string, name: string) {
  let _seededAsset: SeededAsset = {
    application: applicationData,
    format: {
      fragment: {
        string: { raw: data },
      },
    },
    metadata: {
      name: name,
    },
  };

  // create your seed
  let _seed: Pieces.Seed = {
    asset: _seededAsset,
    type: SeedTypeEnum.Asset,
  };

  console.log("seed:", _seed);

  try {
    // make your api call.
    const _a = await new Pieces.AssetsApi().assetsCreateNewAsset({ seed: _seed });
    console.log("well howdy", _a);
  } catch (error) {
    console.error("Error creating asset:", error);
  }
}
//==============================[.end /create]==================================//

export async function deleteAsset(_id: String, setArray: Function) {
  const newAssetsList: Array<LocalAsset> = [];

  try {
    const _assetList = await new Pieces.AssetsApi().assetsSnapshot({});
    for (let i = 0; i < _assetList.iterable.length; i++) {
      if (_assetList.iterable[i].id == _id) {
        try {
          await new Pieces.AssetsApi().assetsDeleteAsset({ asset: _assetList.iterable[i].id });
          console.log(_id);
        } catch (error) {
          console.error(`Error deleting asset with id ${_id}:`, error);
        }
      } else {
        newAssetsList.push({
          id: _assetList.iterable[i].id,
          name: _assetList.iterable[i].name,
          classification: _assetList.iterable[i].original.reference.classification.specific,
        });
      }
    }
    window.alert("Selected snippet got deleted");
    setArray(newAssetsList);
  } catch (error) {
    console.error("Error fetching assets snapshot:", error);
  }
}

// used to rename an asset, takes in an _id and _name that comes from the input fields on
// NameInput + DataInput fields.
//
// this uses your asset snapshot to get your list of snippets, then() to get the snippet list back,
// then use the _id to select the snippet from the list of all snippets.
export async function renameAsset(_name: string, _id: String) {
  try {
    const _assetList = await new Pieces.AssetsApi().assetsSnapshot({});
    for (let i = 0; i < _assetList.iterable.length; i++) {
      if (_assetList.iterable[i].id == _id) {
        let _asset = _assetList.iterable[i];
        _asset.name = _name;

        try {
          const _updated = await new Pieces.AssetApi().assetUpdate({ asset: _asset });
          console.log("updated:", _updated);
        } catch (error) {
          console.error(`Error updating asset with id ${_id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching assets snapshot:", error);
  }
}
