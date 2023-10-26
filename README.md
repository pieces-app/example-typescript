# Get Started with Pieces OS and the @pieces-app/client npm package

Configuration & Setup with NPM
---
### Creating the base of your project
Lets get started with the base of your new React project where we will learn about manipulating Pieces OS and creating our own assets locally on device.

##### **How your .tsconfig should look when you are done:**
```json
{  
  "compilerOptions": {  
    "target": "es2020",  
    "module": "CommonJS",  
     "allowJs": true,  
     "checkJs": true,  
     "maxNodeModuleJsDepth": 1,  
    "forceConsistentCasingInFileNames": true,  
  
    /* Type Checking */  
    "strict": false,  
    "skipLibCheck": true,  
    /* Skip type checking all .d.ts files. */  
    "jsx": "react"  
  },  
  "exclude": ["node_modules"]  
}
```

### Installing with npm

#### Need this if you are going to work with ts files
```bash
npm install typescript 
```

I also recommend installing `ts-node` to get the proper commands running and to run individual test files directly from cmd line. Here is that:

```bash
npm install ts-node
```

Then getting the types package for node can also be super beneficially and in some cases needed to work in this environment:

```bash
npm install -D tslib @types/node
```


I ended up also installing a few react libraries to get a more visual experience while learning about the api itself.

Here are those npm commands for `@types`:

```bash 
npm install @types/react && npm install @types/react-dom 
```

Along with the typing, you will need to install the full packages for react, react-dom, and react scripts to properly get started in this project.

```bash
npm install react && npm install react-dom && npm install react-scripts
```

> [!note] Recommendation
> The order that all of the npm packages are saved and added to your dependencies is important and will  effect your installation flow. **This slowed me down for quite a bit.**
>
> If you are having issues with your installation, it is likely due to a conflict in Typescript versions - `npm uninstall typescript` - then go back and perform all other npm installations before reinstalling typescript again.
>

And last but not least its a good idea to add a few scripts into your `package.json` to help with development:

```json
scripts: {
	// Helper scripts i reccomend.
	"dev": "ts-node index.tsx",  
	"clean": "rm -r node_modules && rm package-lock.json",
	
	// React scripts for testing.
	"start": "react-scripts start",
	"build": "react-scripts build",
}
```

> [!info] Don't Forget
> You can run any script that you add here via `npm run <your-script>`. For example to run "start" you would simple run `npm run start`

## Setting up your `public` Directory
---
Next you can go ahead and create a new directory called `public` that will hold your `index.html` file where your entry point exists. Create the file inside of public and save it there. You do not have to add anything to the `index.html` file at this time, as we will come back to this later. If you would like, you can add the following as a placeholder for now:

```html
<!DOCTYPE html>  
<html lang="en">  

</html>
```

## Setting up your `src` Directory
---
Now that the initial `.html` file has been created, you can start to work on your src directory and getting the rest of your core files added to the project.

Inside of the `src` directory, add two files:
- **`singleton.ts`** - single instance container for a few global functions and features
- **`index.tsx`**- where the core info is and where we are going to be spending most of the time during this project following the setup.

Once you open `index.tsx` you should follow these steps to get your base Application window created:

1. Import the full react library at the top of your file, along with a single import from `react-dom`:
```tsx
import * as React from "react";
import { render } from 'react-dom';
```

2. Follow that with the full App() function and main run of the application:
```tsx
function App(): React.JSX.Element {  
    return (  
        <div>  
            <h1>Hello Pieces Dev Community :)</h1>  
        </div>  
    )}
```

3. And then add these last two lines to target the `root` element by using the ID that is on it:
```tsx
const rootElement = document.getElementById("root");  
const root = createRoot(rootElement);
```

> [!faq] Helpful tip
> When working in this environment I noticed some @babel errors during the build process (or running `npm run start`) and found this workaround that you can install via npm as well [here](https://www.npmjs.com/package/@babel/plugin-transform-private-property-in-object).


## Running your Project for the First Time
---
Everything has been added. We are nearly there and will need to perform a final few checks before starting our dev project.

1. Be sure that Pieces OS is running
2. Double check that the port is `localhost:1000`
3. (optional) Run another npm install (because it never hurts)

Now that everything is ready to go, lets run this command here:

```bash
# remember that we added this to the scripts as: "start": "react-scripts start"
npm run start
```

And after a few seconds you should be able to see in your chrome browser (or your primary browser) a blank window that looks like this:

![[Screenshot 2023-10-24 at 2.03.32 PM.png]]

##### **You have now successfully setup your dev environment, and will be ready to test different endpoints inside of Pieces OS.**

## Connecting your Application
---
When Pieces OS is running in the background of your machine, it is communicating with other local applications that use Pieces software, and up until recently only supporting internally built tools.

As each plugin, extension, or application initializes they 'reach out' to Pieces OS and authenticate with the application themselves. There are a number of application formats that we support and provide for each of our applications. ==When developing on Pieces OS, you can use **"LOCAL_DEV"**
to avoid any issues with other applications.==

### Creating `Application`
The `application` model describes what application a format or analytics event originated from. This is passed along when initializing your dev environment and creates a connection to Pieces OS.

To create the `Application` object for your project, you will need to make sure that you have the following three things:

1. Create a `tracked_application` json object to hold your post request data
2. Define your `url` for the `/connect` function
3. Output using `console.log()` following your `connect()` method is complete

***We will go over the different usages in each of these steps one at a time to bring up any specificities that may need a deeper explanation.***


#### `tracked_application`
Connecting your application here is as easy as a single **POST** request and can be done via the Response interface of the **Fetch Api**. Remember that you can name this whatever you would like to, just be sure to include the updated variable name in the `options` down below.

> [!example]
> When creating the `tracked_application` item, you will need to use a type that is not available inside of the current `npm_deployment`.
>
> This structure is the same as the tracked_application full example you see here below, and the only difference from the unavailable type `SeededTrackedApplication` and the available type `TrackedApplication` is `id: number`.

First lets take a look at the `tracked_application` object:

```tsx
const tracked_application = {  
    name: Pieces.ApplicationNameEnum.Brave,  
    version: '0.0.1',  
    platform: Pieces.PlatformEnum.Macos,  
}
```

- **name**: Brave
- **platform**: Depending on your current environment, you need to set the platform parameter to match your current operating system. Select between `.Macos`, `.Windows`, `.Linux`

> [!faq] Imports
> Be sure to double check that you have the following import added to the first few lines of your `index.tsx` file if you have not already: `import * as Pieces from "@pieces-app/client";`

### Creating `connect()` Function
When your program starts, it needs to connect to Pieces OS to gain access to any functional data and to exchange information on the `localhost:1000` route. Now that you have your `tracked_application` - lets get into the into the details.

Start by defining you connect function and add the initial `/connect` route to your function as the `url` variable and then attache the `options` object. Include your `tracked_application` object passed into a `JSON.stringify()` method under the `application` parameter like so:

```tsx
async function connect(): Promise<Boolean> {

	const url: string = 'http://localhost:1000/connect';

	const options: {method: string, body: string} = {  
	    method: 'POST',  
	    body: JSON.stringify({ application: tracked_application}  
    ),
  },
}
```

Now lets add few more things to this file
- **`_flag: Boolean`** - for marking the success or failure of the try catch
- **try, catch**
    - `response` - for capturing the fetch response back from OS Server
    - `data` - for storing the data and logging it
    - `e` - error that is coming back if the response fails

#### Running `connect().then()`:
This will just run the connect function and then log the response in your console, inside of your
browser:

```tsx
connect().then( __ => console.log("Response back from /connect:", __ ));
```

Below this final line should be:
- `function App() ...`
- `const rootElement ...`
- `root.render(...)`

Here is the entire file for you to double check your work:

```tsx
  
import * as React from "react";  
import * as Pieces from "@pieces-app/client";  
  
import {createRoot} from "react-dom/client";  
 
const tracked_application = {  
    name: Pieces.ApplicationNameEnum.Brave,  
    version: '0.0.1',  
    platform: Pieces.PlatformEnum.Macos,  
}  
  
async function connect(): Promise<Boolean> {  
  
    const url: string = 'http://localhost:1000/connect';  
    const options: {method: string, body: string} = {  
        method: 'POST',  
        body: JSON.stringify({ application: tracked_application}  
        ),    }  
    let _flag: Boolean = false;  
  
    try {  
        const response: Response = await fetch(url, options);  
        const data: Promise<any> = await response.json();  
        console.log(data);  
        _flag = true;  
    } catch (e) {  
        console.error(e);  
    }  
    return _flag;  
}  
  
connect().then( __=> console.log("Response back from /connect:", __));  
  
function App(): React.JSX.Element {  
    return (  
        <div>  
            <h1>Hello Pieces Dev Community :)</h1>  
        </div>  
    )}  
  
const rootElement = document.getElementById("root");  
const root = createRoot(rootElement);  
  
root.render(  
    <React.StrictMode>  
        <App />  
    </React.StrictMode>  
);
```


## View Console Output in your Browser
---
Now that everything has been correctly configured (fingers crossed) you can run your sample application and connect to Pieces OS for the first time.

Inside of your terminal at the root directory of your project, use NPM to run one of the scripts that we added to the package.json file called "start":

```bash 
npm run start
```

And you should have the same content in the main browser window as before once this completes. But if you open up your inspector using `cmd+option+i` or `ctrl+shift+c` you will see this inside of your console:

![[Screenshot 2023-10-24 at 4.45.49 PM.png]]

This includes both the full OS response object with all of the data that you will need to get going with other endpoints, and your application is now connected and ready to go for the rest of your exploration and discovery!

Follow along with these nexts steps to learn about **assets and formats,** two things that are very important for managing any form of data with Pieces OS.

## Getting Started with `/asset` + `/assets`
---
**Asset** is a very important models who's primary purpose is to manage the seeded data that comes in to the application, and is stored inside of Pieces OS. Each asset is a identifiable piece of saved data, or pre-seeded data.

**Assets** is equally important, but instead of containing a single asset with parameters storing data on it, Assets serves as the list of `type: Asset` objects that are stored there. Also you will find the operations for adding, deleting, searching, and other functions that are related to referencing a number of different snippets to make a comparison. For instance:

> If I want to create a snippet (lets call it `var`), I need to send this to the master `Assets` list, you would first create `var` itself with the proper formats and data added to the `var` object, then send the newly created SeededAsset over to the Assets list (assets/create). Then you will receive the asset back as the response from the server. Cool, right?


> [!faq] HEY! Read this.
> Traditionally, `Assets` is a linear list of flat `Asset` objects stored in an array or list.
>
> **You can use identifiers to get a specific asset from the asset list called a UUID.** But you'll learn more about that later on.

### `/asset`
Initially when creating your application, you will have no snippets saved to your project, will not be signed in, and you will have not completed onboarding. These are properties that you may see during this creation.

> [!info] Check out `localhost:1000/assets` while Pieces OS is running to see the empty object that is there.

#### **Creating your First Asset**
While creating an asset, there are some required parameters that you will need to be sure to include the proper **format** data.

> [!example] Explaining Format
>
> For each `Asset` object, each required parameter must be included, and the Asset must be seeded before it is sent to be created.

#### SeededAsset
This seed data will become the asset. You can use this structure to provide data to Pieces OS, and will include fewer parameters than what you will get back in your response. Lets get started with the seeded asset formatting before we pass this over to `/Assets`.

At the top level of this object you will see:

- `schema`
- `metadata`
- **`application`** (required)
- **`format`** (required)
- `discovered`
- `available`


`Schema`, `metadata`, `discovered` and `available` are all parameters that have extensive use cases, but for now we are going to focus on `application` & `format` - the two required formats for this object.

With each call you need to include your application object that you created earlier - and we can do this inside of the .then() following the return from `connect()` which is defined here:

```tsx
connect().then(__ => {  
    full_context = __;  
    let _t = JSON.parse(JSON.stringify(full_context));  
    app = _t.application;  
    console.log(app);  
});

// creating the seeded asset in its simplist form.
let seed: SeededAsset = {  
    application: app,  
    format: {  
        fragment: {  
            string: { raw: 'Testing the string param' }    
		 }
	 }
}
```


### `/assets/create`
Now before continuing forward, we will need to prepare the `create()` function to connect to the proper `/assets/create` endpoint. Create slightly differs from connect, since previously our json object did not require any new data that was returned back from the server. In this case **we will need to include the application data that was returned back from our initial call to `/connect`.**

The `create()` function needs to accomplish a few things:

1. Create a new asset using our simple `SeededAsset` configuration that we just created as the `seed` object
2. Send a POST request to the new `http://localhost:1000/assets/create` with out data
3. Return the response back after this is completed

Here is what the `create()` function looks like in its entirety:

```tsx
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
    }}
```

Now that we have the create function created, all that is left is to call `create()` and log our new asset to the console!

You can add this final call to the end of the `connect.then()`:

```tsx
create(seed).then(__ => {  
    console.log('Asset Created! Here is it\'s data: ', __);  
})
```

#### Response
Once you receive your response back from Pieces OS, you will notice the drastic difference in the response back here. There is quite a long list of parameters that you can store along side your assets to make them more powerful.

The response back will look similar to the following:

```
{
    "id": "34a2a447-0c7c-4171-903a-755712e43a9f",
    "name": "Text Snippet",
    "creator": "",
    "created": {
        "value": "2023-10-26T15:30:01.617743Z",
        "readable": "Just now..."
    },
    "updated": {
        "value": "2023-10-26T15:30:01.618784Z",
        "readable": "Just now..."
    },
    "synced": {
        "value": "2023-10-26T15:30:01.617743Z",
        "readable": "Just now..."
    },
    "deleted": {
        "value": "2023-10-26T15:30:01.617743Z",
        "readable": "Just now..."
    },
    "formats": {
        "iterable": [
            {
                "id": "15a216ed-d790-4690-a422-d03e5738d363",
                "creator": "",
                "classification": {
                    "generic": "TEXT",
                    "specific": "text"
                },
                "role": "BOTH",
                "application": {
                    "schema": {
                        "migration": 0,
                        "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                    },
                    "id": "55f4576b-8be6-4508-bf89-e85f263a083b",
                    "name": "BRAVE",
                    "version": "0.0.1",
                    "platform": "MACOS",
                    "onboarded": false,
                    "privacy": "OPEN",
                    "capabilities": "BLENDED",
                    "mechanism": "MANUAL",
                    "automaticUnload": false
                },
                "asset": {
                    "id": "34a2a447-0c7c-4171-903a-755712e43a9f",
                    "name": "Text Snippet",
                    "creator": "",
                    "created": {
                        "value": "2023-10-26T15:30:01.617743Z",
                        "readable": "Just now..."
                    },
                    "updated": {
                        "value": "2023-10-26T15:30:01.617743Z",
                        "readable": "Just now..."
                    },
                    "synced": {
                        "value": "2023-10-26T15:30:01.617743Z",
                        "readable": "Just now..."
                    },
                    "deleted": {
                        "value": "2023-10-26T15:30:01.617743Z",
                        "readable": "Just now..."
                    },
                    "formats": {
                        "iterable": [
                            {
                                "id": "15a216ed-d790-4690-a422-d03e5738d363"
                            }
                        ]
                    },
                    "preview": {
                        "base": "15a216ed-d790-4690-a422-d03e5738d363"
                    },
                    "original": "15a216ed-d790-4690-a422-d03e5738d363",
                    "mechanism": "MANUAL"
                },
                "bytes": {
                    "value": 24,
                    "readable": "24 B"
                },
                "created": {
                    "value": "2023-10-26T15:30:01.617743Z",
                    "readable": "Just now..."
                },
                "updated": {
                    "value": "2023-10-26T15:30:01.618788Z",
                    "readable": "Just now..."
                },
                "deleted": {
                    "value": "2023-10-26T15:30:01.617743Z",
                    "readable": "Just now..."
                },
                "synced": {
                    "value": "2023-10-26T15:30:01.617743Z",
                    "readable": "Just now..."
                },
                "fragment": {
                    "string": {
                        "raw": "Testing the string param"
                    },
                    "bytes": {
                        "raw": [
                            84,
                            101,
                            115,
                            116,
                            105,
                            110,
                            103,
                            32,
                            116,
                            104,
                            101,
                            32,
                            115,
                            116,
                            114,
                            105,
                            110,
                            103,
                            32,
                            112,
                            97,
                            114,
                            97,
                            109
                        ],
                        "base64": [],
                        "base64_url": [],
                        "data_url": []
                    }
                },
                "analysis": {
                    "code": {
                        "schema": {
                            "migration": 0,
                            "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                        },
                        "tokenized": [],
                        "type": "TEXT",
                        "prediction": {},
                        "similarity": {},
                        "top5Colors": [],
                        "top5Sorted": [],
                        "id": "8db688f9-fb54-4d5a-888d-db3b17328bc7",
                        "analysis": "1d8ae90e-2f46-4085-afe8-209658e07040",
                        "model": {
                            "schema": {
                                "migration": 0,
                                "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                            },
                            "id": "48d2a32b-aa93-455c-a6b6-e52dfce4118e",
                            "version": "t02-v02-i03",
                            "created": {
                                "value": "2022-02-17T05:00:00.000Z",
                                "readable": "about a year ago"
                            },
                            "name": "Text vs. Code Model",
                            "cloud": false,
                            "type": "SPEED",
                            "usage": "TEXT_VS_CODE",
                            "cpu": true
                        }
                    },
                    "id": "1d8ae90e-2f46-4085-afe8-209658e07040",
                    "format": "15a216ed-d790-4690-a422-d03e5738d363"
                }
            }
        ],
        "asset": {
            "id": "34a2a447-0c7c-4171-903a-755712e43a9f",
            "name": "Text Snippet",
            "creator": "",
            "created": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "updated": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "synced": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "deleted": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "formats": {
                "iterable": [
                    {
                        "id": "15a216ed-d790-4690-a422-d03e5738d363"
                    }
                ]
            },
            "preview": {
                "base": "15a216ed-d790-4690-a422-d03e5738d363"
            },
            "original": "15a216ed-d790-4690-a422-d03e5738d363",
            "mechanism": "MANUAL"
        }
    },
    "preview": {
        "base": {
            "id": "15a216ed-d790-4690-a422-d03e5738d363",
            "reference": {
                "id": "15a216ed-d790-4690-a422-d03e5738d363",
                "creator": "",
                "classification": {
                    "generic": "TEXT",
                    "specific": "text"
                },
                "role": "BOTH",
                "application": {
                    "schema": {
                        "migration": 0,
                        "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                    },
                    "id": "55f4576b-8be6-4508-bf89-e85f263a083b",
                    "name": "BRAVE",
                    "version": "0.0.1",
                    "platform": "MACOS",
                    "onboarded": false,
                    "privacy": "OPEN",
                    "capabilities": "BLENDED",
                    "mechanism": "MANUAL",
                    "automaticUnload": false
                },
                "asset": "34a2a447-0c7c-4171-903a-755712e43a9f",
                "bytes": {
                    "value": 24,
                    "readable": "24 B"
                },
                "created": {
                    "value": "2023-10-26T15:30:01.617743Z",
                    "readable": "Just now..."
                },
                "updated": {
                    "value": "2023-10-26T15:30:01.617743Z",
                    "readable": "Just now..."
                },
                "deleted": {
                    "value": "2023-10-26T15:30:01.617743Z",
                    "readable": "Just now..."
                },
                "synced": {
                    "value": "2023-10-26T15:30:01.617743Z",
                    "readable": "Just now..."
                },
                "fragment": {
                    "string": {
                        "raw": "Testing the string param"
                    },
                    "bytes": {
                        "raw": [
                            84,
                            101,
                            115,
                            116,
                            105,
                            110,
                            103,
                            32,
                            116,
                            104,
                            101,
                            32,
                            115,
                            116,
                            114,
                            105,
                            110,
                            103,
                            32,
                            112,
                            97,
                            114,
                            97,
                            109
                        ],
                        "base64": [],
                        "base64_url": [],
                        "data_url": []
                    }
                },
                "analysis": {
                    "code": {
                        "schema": {
                            "migration": 0,
                            "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                        },
                        "tokenized": [],
                        "type": "TEXT",
                        "prediction": {},
                        "similarity": {},
                        "top5Colors": [],
                        "top5Sorted": [],
                        "id": "8db688f9-fb54-4d5a-888d-db3b17328bc7",
                        "analysis": "1d8ae90e-2f46-4085-afe8-209658e07040",
                        "model": {
                            "schema": {
                                "migration": 0,
                                "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                            },
                            "id": "48d2a32b-aa93-455c-a6b6-e52dfce4118e",
                            "version": "t02-v02-i03",
                            "created": {
                                "value": "2022-02-17T05:00:00.000Z",
                                "readable": "about a year ago"
                            },
                            "name": "Text vs. Code Model",
                            "cloud": false,
                            "type": "SPEED",
                            "usage": "TEXT_VS_CODE",
                            "cpu": true
                        }
                    },
                    "id": "1d8ae90e-2f46-4085-afe8-209658e07040",
                    "format": "15a216ed-d790-4690-a422-d03e5738d363"
                }
            }
        }
    },
    "original": {
        "id": "15a216ed-d790-4690-a422-d03e5738d363",
        "reference": {
            "id": "15a216ed-d790-4690-a422-d03e5738d363",
            "creator": "",
            "classification": {
                "generic": "TEXT",
                "specific": "text"
            },
            "role": "BOTH",
            "application": {
                "schema": {
                    "migration": 0,
                    "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                },
                "id": "55f4576b-8be6-4508-bf89-e85f263a083b",
                "name": "BRAVE",
                "version": "0.0.1",
                "platform": "MACOS",
                "onboarded": false,
                "privacy": "OPEN",
                "capabilities": "BLENDED",
                "mechanism": "MANUAL",
                "automaticUnload": false
            },
            "asset": "34a2a447-0c7c-4171-903a-755712e43a9f",
            "bytes": {
                "value": 24,
                "readable": "24 B"
            },
            "created": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "updated": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "deleted": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "synced": {
                "value": "2023-10-26T15:30:01.617743Z",
                "readable": "Just now..."
            },
            "fragment": {
                "string": {
                    "raw": "Testing the string param"
                },
                "bytes": {
                    "raw": [
                        84,
                        101,
                        115,
                        116,
                        105,
                        110,
                        103,
                        32,
                        116,
                        104,
                        101,
                        32,
                        115,
                        116,
                        114,
                        105,
                        110,
                        103,
                        32,
                        112,
                        97,
                        114,
                        97,
                        109
                    ],
                    "base64": [],
                    "base64_url": [],
                    "data_url": []
                }
            },
            "analysis": {
                "code": {
                    "schema": {
                        "migration": 0,
                        "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                    },
                    "tokenized": [],
                    "type": "TEXT",
                    "prediction": {},
                    "similarity": {},
                    "top5Colors": [],
                    "top5Sorted": [],
                    "id": "8db688f9-fb54-4d5a-888d-db3b17328bc7",
                    "analysis": "1d8ae90e-2f46-4085-afe8-209658e07040",
                    "model": {
                        "schema": {
                            "migration": 0,
                            "semantic": "MAJOR_0_MINOR_0_PATCH_1"
                        },
                        "id": "48d2a32b-aa93-455c-a6b6-e52dfce4118e",
                        "version": "t02-v02-i03",
                        "created": {
                            "value": "2022-02-17T05:00:00.000Z",
                            "readable": "about a year ago"
                        },
                        "name": "Text vs. Code Model",
                        "cloud": false,
                        "type": "SPEED",
                        "usage": "TEXT_VS_CODE",
                        "cpu": true
                    }
                },
                "id": "1d8ae90e-2f46-4085-afe8-209658e07040",
                "format": "15a216ed-d790-4690-a422-d03e5738d363"
            }
        }
    },
    "mechanism": "MANUAL",
    "websites": {
        "iterable": [],
        "indices": {}
    },
    "tags": {
        "iterable": [],
        "indices": {}
    },
    "sensitives": {
        "iterable": []
    },
    "persons": {
        "iterable": [],
        "indices": {}
    },
    "discovered": false,
    "score": {
        "manual": 0,
        "automatic": 0
    },
    "pseudo": false,
    "annotations": {
        "iterable": [],
        "indices": {}
    },
    "hints": {
        "iterable": [],
        "indices": {}
    },
    "anchors": {
        "iterable": [],
        "indices": {}
    }
}
```


## View Your Data
---
Now when you follow this guide, you will be receiving this data back from inside of your console in the browser. But if you would like to view your data incrementally through the full browser window, you can navigate to `http://localhost:1000/assets` to view a full list of snippets that have been saved.

> [!tip] Recommendation  
> We use [JSON Viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh) internally when developing and **recommend** using some form of web based extension that assists with reading JSON DATA


## Conclusion
This is a very simple guide on how to get up and running using the @pieces-app/client npm package and create a web environment that you can build on top of. **Fork this repo** to get started and learn about the depth of possibilities you have with Pieces OS.

More guides will be coming soon around:
- Using Pieces OS as a database
- Creating a personal Copilot that understands your context
- Learning about `/search` endpoints
- ...more! 