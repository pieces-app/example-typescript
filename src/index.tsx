/// (1) First import the react library here in your index.tsx.
import * as React from "react";
import {useState} from "react";
import * as Pieces from "@pieces.app/client";
import {Application, SeededAsset, SeedTypeEnum} from "@pieces.app/client";
import {createRoot} from "react-dom/client";


// types
type LocalAsset = {
    name: string,
    id: string,
    classification: Pieces.ClassificationSpecificEnum,
}


//=============================[GLOBALS]================================//
let full_context: JSON;
let applicationData: Application;
let _indicator: HTMLElement;
let snippetList: Array<LocalAsset>;

// For Creation.
let name: string;
let data: string;

// ============================ [/connect]=============================//
const tracked_application = {
    name: Pieces.ApplicationNameEnum.Brave,
    version: '0.0.1',
    platform: Pieces.PlatformEnum.Macos,
}

// TODO: this will need to be updated once we are further along with the connector work.
async function connect(): Promise<JSON> {

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

//==============================[/create]==================================//
function createAsset() {

    let _seededAsset: SeededAsset = {
        application: applicationData,
        format: {
            fragment: {
                string: { raw: data },
            },
        },
        metadata: {
            name: name
        }
    }

    // create your seed
    let _seed: Pieces.Seed = {
        asset: _seededAsset,
        type: SeedTypeEnum.Asset
    }

    // make your api call.
    new Pieces.AssetsApi().assetsCreateNewAsset({seed: _seed}).then(_a => {
        console.log("well howdy", _a);
    })

}
//==============================[.end /create]==================================//

function deleteAsset(_id: String){

    new Pieces.AssetsApi().assetsSnapshot({}).then(_assetList => {
        for (let i = 0; i < _assetList.iterable.length; i++) {
            if (_assetList.iterable[i].id == _id) {
                new Pieces.AssetsApi().assetsDeleteAsset({asset: _assetList.iterable[i].id }).then(_ => console.log("delete confirmed!"))
            }
        }
    })
}

// used to rename an asset, takes in an _id and _name that comes from the input fields on
// NameInput + DataInput fields.
//
// this uses your asset snapshot to get your list of snippets, then() to get the snippet list back,
// then use the _id to select the snippet from the list of all snippets.
function renameAsset(_name: string, _id: String){

    new Pieces.AssetsApi().assetsSnapshot({}).then(_assetList => {
        for (let i = 0; i < _assetList.iterable.length; i++) {
            if (_assetList.iterable[i].id == _id) {

                let _asset = _assetList.iterable[i];

                _asset.name = _name;

                new Pieces.AssetApi().assetUpdate({asset: _asset}).then(_updated => {
                    console.log("updated:", _updated);
                })
            }
        }
    })
}

// you primary App function where all react elements render at their core.
// for reactivity i added a number of state based properties here, and made the highest level
// a little more verbose.
//
// refresh is responsible for adding new assets to the snippet list itself when you create a new asset.
// the refresh button is connected to first <button> element you see below the header and div there.
// TODO: update the logic here for refresh, it is having issues and populating the snippet viewing area with the old list along with the new one, creating duplicates.
function App(): React.JSX.Element {

    const [array, setArray] = useState([]);

    const refresh = (_newAsset: LocalAsset) => {
        setArray(prevArray => [...prevArray, _newAsset])
    }

    function refreshSnippetList() {
        new Pieces.AssetsApi().assetsSnapshot({}).then((assets) => {
            // console.log('Response', assets)
            for (let i = 0; i < assets.iterable.length; i++) {
                let _local: LocalAsset = {
                    id: assets.iterable[i].id,
                    name: assets.iterable[i].name,
                    classification: assets.iterable[i].original.reference.classification.specific
                }

                refresh(_local);

            }
        })
    }

    return (
        <div style={{ padding: '10px 20px' }}>
            <Header />

            <div style={{ width: "auto", border: '2px solid black', height: '400px', padding: '20px', borderRadius: '9px' }}>
                <div style={{ overflow: "scroll", height: 'inherit' }}>
                    {array.map((item: LocalAsset, index) => (
                        <div key={index} style={{ marginTop: '5px', marginBottom: '5px', alignItems: 'center', padding: "10px", borderRadius: '10px', border: '1px solid gray', maxHeight: '100px', display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                            <h3>{item.name}</h3>
                            <div style={{flexDirection: "column"}}>
                                <p>{item.id}</p>
                                <p>{item.classification}</p>
                            </div>

                        </div>

                    ))}
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column'}}>
                <button style={{ maxWidth: '100px', marginTop: '10px',}} onClick={refreshSnippetList}>Refresh</button>
                <h3>Create a Snippet</h3>
                <h4>Name:</h4>
                <NameTextInput />
                <h4>Add Data:</h4>
                <DataTextInput />
                <h3>Delete Snippet</h3>
                <h4>ID:</h4>
                <DeleteAssetIDInput />
                <h3>Rename Snippet</h3>
                <h4>New Name:</h4>
                <RenameAssetInput />

            </div>
        </div>
    )
}

// this is the header element with its children:
function Header(): React.JSX.Element {
    return (
        <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Hello Pieces Dev Community :)</h3>
            <Indicator />
        </div>
    )
}

// this is your indicator badge that we will manipulate through the initial connect call. it will either
// be green or red depending on the current status.
function Indicator(): React.JSX.Element {
    return (
        <>
            <div style={{ display: "inherit", justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ paddingRight: '10px' }}>Connection Status</p>
                <div id={"indicator"} style={{ backgroundColor: "red", width: '24px', height: '24px', borderRadius: '20px', border: '1px solid black'}}></div>
            </div>
        </>
    )
}

function NameTextInput() {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
        name = event.target.value;
    };

    return (
        <input type="text" value={value} style={{ maxWidth: '450px' }} onChange={handleChange} />
    );
}

function DataTextInput() {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
        data = event.target.value;
    };

    return (
        <>
            <textarea value={value} style={{ height: '200px', width: '450px', verticalAlign: 'top' }} onChange={handleChange} />
            <CreateButton />
        </>

    );
}

function DeleteAssetIDInput() {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <>
            <input value={value} style={{ width: '450px', verticalAlign: 'top' }} onChange={handleChange} />
            <button style={{ marginTop: '10px', maxWidth: '200px' }} onClick={() => deleteAsset(value)}>Delete Snippet</button>
        </>

    );
}

function RenameAssetInput() {
    const [name, setNameValue] = useState('');
    const [id, setIdValue] = useState('');

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    };

    const handleIdChange = (event) => {
        setIdValue(event.target.value);
    };

    return (
        <>
            <p>Name:</p>
            <input value={name} style={{ width: '450px', verticalAlign: 'top' }} onChange={handleNameChange} />
            <p>ID:</p>
            <input value={id} style={{ width: '450px', verticalAlign: 'top' }} onChange={handleIdChange} />
            <button style={{ marginTop: '10px', maxWidth: '200px' }} onClick={() => renameAsset(name, id)}>Rename Snippet</button>
        </>

    );
}


function CreateButton(): React.JSX.Element {
    return (
        <button style={{ marginTop: '10px', maxWidth: '200px' }} onClick={createAsset}>Create Snippet</button>
    )
}


connect().then(__ => {
    // TODO: this needs improvement but is okay for now. since the types are not here yet,
    // for some reason i had to parse the stringified full_context object to get correct typing.
    full_context = __;
    let _t = JSON.parse(JSON.stringify(full_context));
    applicationData = _t.application;
    console.log('Application Data: ', applicationData);

    // define the indicator now that it exists.
    _indicator = document.getElementById("indicator");

    // conditional for the response back on application.
    if (__ != undefined) {
        _indicator.style.backgroundColor = "green";
    } else {
        _indicator.style.backgroundColor = "red";
    }

})




const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

