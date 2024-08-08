import { ID, Query } from "node-appwrite";
import { storage, users, config, databases } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newuser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        );
        return parseStringify(newuser);
    } catch (error: any) {
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email]),
            ]);
            return existingUser.users[0];
        }
        console.error("An error occurred while creating a new user:", error);
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);
    } catch (error) {
        console.error("An error occurred while retrieving the user details:", error);
    }
};

export const registerPatient = async ({
    identificationDocument,
    ...patient
}: RegisterUserParams) => {
    try {
        // upload file
        let file;
        if (identificationDocument) {
            const fileBlob = identificationDocument.get("blobFile") as Blob;
            const fileName = identificationDocument.get("fileName") as string;
            const newFile = new File([fileBlob], fileName);
            file = await storage.createFile(config.BUCKET_ID, ID.unique(), newFile);
        }
        // create new patient document
        const newPatient = await databases.createDocument(
            config.DATABASE_ID!,
            config.PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id ? file.$id : null,
                identificationDocumentUrl: file?.$id
                    ? `${config.ENDPOINT}/storage/buckets/${config.BUCKET_ID}/files/${file.$id}/view?project=${config.PROJECT_ID}`
                    : null,
                ...patient,
            }
        );
        return parseStringify(newPatient);
    } catch (error) {
        console.error("An error occurred while creating a new patient:", error);
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            config.DATABASE_ID!,
            config.PATIENT_COLLECTION_ID!,
            [Query.equal("userId", [userId])]
        );
        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the patient details:",
            error
        );
    }
};