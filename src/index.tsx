/// (1) First import the react library here in your index.tsx.
import * as React from "react";
// @ts-ignore
import * as Pieces from "@pieces.app/client";

import {createRoot} from "react-dom/client";
// @ts-ignore
import {Application, SeededAsset} from "@pieces.app/client";


//=============================[GLOBALS]================================//

let full_context: JSON;
let app: Application;


// ============================ [/connect]=============================//
const tracked_application = {
    name: Pieces.ApplicationNameEnum.Brave,
    version: '0.0.1',
    platform: Pieces.PlatformEnum.Macos,
}

async function connect(): Promise<JSON> {

    const url: string = 'http://localhost:1000/connect';
    const options: {method: string, body: string} = {
        method: 'POST',
        body: JSON.stringify({ application: tracked_application}
        ),
    }

    let _flag: Boolean = false;
    let _output: Promise<JSON>;

    try {
        const response: Response = await fetch(url, options);
        const data: Promise<JSON> = await response.json();
        // console.log(data);
        _output = data;
        return _output;
        // _flag = true;
    } catch (e) {
        console.error(e);
    }

}
// ============================ [.end /connect]=============================//

//==============================[/create]==================================//
async function create(_seed: SeededAsset): Promise<JSON> {
    const _url: string = 'http://localhost:1000/assets/create';
    const options: {method: string, body: string} = {
        method: 'POST',
        body: JSON.stringify({asset: _seed, type: 'SEEDED_ASSET'}),
    }


    try {
        const response: Response = await fetch(_url, options);
        const data: Promise<JSON> = await response.json();
        return data;
    } catch (e) {
        console.error(e);
    }
}
//==============================[.end /create]==================================//

connect().then(__ => {
    full_context = __;
    let _t = JSON.parse(JSON.stringify(full_context));
    app = _t.application;
    console.log('Application Data: ', app);

    // now that we have our app back - lets take this and seed Asset
    let seed: SeededAsset = {
        application: app,
        format: {
            fragment: {
                string: {
                    raw: 'Testing the string param',
            }
        }
    }
    };

    create(seed).then(__ => {
        console.log('Asset Created! Here is it\'s data: ', __);
    })

})

/// (3) Then create your function() here to call your webpage AKA your application:
function App(): React.JSX.Element {
    return (
        <div>
            <h1>Hello Pieces Dev Community :)</h1>
        </div>
    )
}


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

