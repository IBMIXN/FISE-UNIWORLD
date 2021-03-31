# Uniworld API

## Setup Instructions

1. Fork or download this repository

2. Install [VS Code](https://code.visualstudio.com/)

3. Install the [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extension and login with your Azure account

4. Run `npm install` in the project directory

5. Create a file: `local.settings.json` in the project root directory with the following content and make sure to fill in the values (i.e. DB_PASSWORD):

```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DB_NAME": "ENTER_DB_NAME",
    "DB_PORT": 10255,
    "DB_USER": "ENTER_DB_USER",
    "DB_PASSWORD": "ENTER_DB_PASSWORD",
    "BLOBSTORAGE_BASE_URL": "https://ENTER_BLOBSTORAGE_NAME.blob.core.windows.net",
    "BLOBSTORAGE_CONNECTION_STRING": "DefaultEndpointsProtocol=https;AccountName=ENTER_ACCOUNT_NAME;AccountKey=ENTER_BLOBSTORAGE_ACCOUNT_KEY_HERE;EndpointSuffix=core.windows.net"
  },
  "Host": {
    "CORS": "*"
  }
}
```

6. Run the application locally (F5)

## Available Scripts

In the project directory, you can run:

### `npm run test`

Runs unit and integration tests.

### `npm run release`

This command can be executed to bump the version of the app according to [semver](https://semver.org/) specifications.

## Endpoints

blobs-delete: [DELETE] http://localhost:7071/api/blobs/{container}

blobs-get: [GET] http://localhost:7071/api/blobs/{container}

blobs-post: [POST] http://localhost:7071/api/blobs/{container}

eventrooms-delete: [DELETE] http://localhost:7071/api/eventrooms/{id}

eventrooms-get: [GET] http://localhost:7071/api/eventrooms

eventrooms-getbyid: [GET] http://localhost:7071/api/eventrooms/{id}

eventrooms-post: [POST] http://localhost:7071/api/eventrooms

eventrooms-put: [PUT] http://localhost:7071/api/eventrooms/{id}

lecturerooms-delete: [DELETE] http://localhost:7071/api/lecturerooms/{id}

lecturerooms-get: [GET] http://localhost:7071/api/lecturerooms

lecturerooms-getbyid: [GET] http://localhost:7071/api/lecturerooms/{id}

lecturerooms-post: [POST] http://localhost:7071/api/lecturerooms

lecturerooms-put: [PUT] http://localhost:7071/api/lecturerooms/{id}

