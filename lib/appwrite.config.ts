import * as sdk from 'node-appwrite'

// export const {
//     PROJECT_ID,
//     API_KEY,
//     DATABASE_ID,
//     PATIENT_COLLECTION_ID,
//     DOCTOR_COLLECTION_ID,
//     APPOINTMENT_COLLECTION_ID,
//     NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
//     NEXT_PUBLIC_ENDPOINT: ENDPOINT,
// } = process.env;

export const config = {
    PROJECT_ID: '66b1a41800107d24877a',
    API_KEY: '6e2c288ac6378be3f281993cc13338ff862764b5591881328de8f302e26468f3615e09539a90cf6c9cd5d952f3c4d8b54f1460b3bf50930c476cf2d792fd1b20d6b11ff521e740b9c7704918fcfdb4a0d91a29d973d3c3ec8097d7ae2ae76dfb283a8eaa7e29802839da5d7b6dbe361dd3fbeee2eaf1dd8328d3736285f85820',
    DATABASE_ID: '66b1a4ec002b11b63365',
    PATIENT_COLLECTION_ID: '66b1a524002272a8d327',
    DOCTOR_COLLECTION_ID: '66b1a55a00321d074944',
    APPOINTMENT_COLLECTION_ID: '66b1a591001f62be63e4',
    BUCKET_ID: '66b1a64600006d9f448d',
    ENDPOINT: 'https://cloud.appwrite.io/v1',
};

const client = new sdk.Client();

client
    .setEndpoint(config.ENDPOINT!)
    .setProject(config.PROJECT_ID!)
    .setKey(config.API_KEY!);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);