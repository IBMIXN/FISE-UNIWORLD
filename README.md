# FISE Uniworld
##### Uniworld is a real-time 3D environment for university events. This was developed as part of the MEng Computer Science degree final year project at UCL and collaborated with IBM as part of the Industry Exchange Network (IXN).

## Features

- **3D Environment** – The 3D environment contains a lobby scene, event hall, lecture hall, and IBM university centre.
    - The event hall contains dynamically created rooms with meeting tables arranged in a grid layout
    - The lecture hall contains dynamically created rooms with an embedded lecture slide
    - Rooms are dynamically created via the Editor and loaded from the API
    - The IBM university centre contains objects linked to online learning resources and past project showcases as part of the IBM university programs.


- **Editor** – The web-based tool for creating and managing virtual event rooms and lecture rooms.

- **API** – The backend which provides RESTful endpoints for reading and manipulating event room and lecture room data from the database. Also, it provides endpoints for uploading files to Azure blob storage.

## Technology Stack

The uniworld project uses a wide range of technologies:
- [Unity](https://unity.com/) - 3D game engine for the main Uniworld environment
- [Photon Engine](https://www.photonengine.com/) - Networking engine and multiplayer platform integrated with Unity
- [ReactJS](https://reactjs.org/) - Front-end Javascript library for Uniworld Editor
- [Material UI](https://material-ui.com/) - Popular React UI framework
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) - Serverless REST API for Uniworld
- [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) - Blob storage for uploading media files

## Developer Guide

Available at `fise_uniworld_environment_src/Developer Guide`

## License

AGPL-3.0 License