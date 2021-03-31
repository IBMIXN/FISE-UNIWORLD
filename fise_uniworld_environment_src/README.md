# UniWorld
Source code for UniWorld - UCL MEng Final Year Project with IBM

## Setup Guide
1. Install [Unity Hub](https://unity3d.com/get-unity/download) and [Unity 2019.4.10](https://unity3d.com/get-unity/download/archive)
2. Fork or download this repository and move the folder `UniworldWithoutVoice` to the Unity project directory
3. Launch Unity and wait for it to finish importing the assets
4. Go to Window > Photon Unity Network > Highlight Server Settings (or open `Assets/Photon/PhotonUnityNetworking/Resources/PhotonServerSettings.asset`). Make sure to fill in the App Id PUN value. This can be obtained by registering an account at [Photon Engine](https://www.photonengine.com/) and creating a Photon PUN app.

## Note
- `UniworldWithVoice` includes a `VoiceManager.cs` script that depends on a third party library.
- To use the voice chat functionality, copy the `UniworldWithVoice` folder instead of the `UniworldWithoutVoice` folder
- **Requires paid asset**: [Voice Pro - WebGL, Mobile, Desktop](https://assetstore.unity.com/packages/tools/input-management/voice-pro-webgl-mobile-desktop-169274) asset which can be purchased from the Unity Asset Store. 
  1. Copy the contents of this asset into the `Assets/Scripts/Networking/Voice`.
  2. Open the `Connect` scene (found in `Assets/Scenes/Connect.unity`)
  3. Select the `VoiceManager` game object and remove any scripts causing errors
  4. Attach `Listener` and `Speaker` scripts to the `VoiceManager` game object

# Build and Deployment Guide
1. Go to File > Build Settings
2. Make sure WebGL is selected as the platform and click build
3. Once the build is complete, the following should be generated:
    - `Build`
        - `Build.data.unityweb`
        - `Build.json`
        - `Build.wasm.code.unityweb`
        - `Build.wasm.framework.unityweb`
        - `UnityLoader.js`
    - `TemplateData`
    - `index.html`
4. Simply upload the contents to a static host or cloud storage such as `Github Pages` or `Amazon S3`.
5. Feel free to modify `index.html` and `TemplateData` to customise the web page or replace them with the template provided in: [https://github.com/bymi15/uniworldsrc/tree/main/CustomBuild](https://github.com/bymi15/uniworldsrc/tree/main/CustomBuild)
