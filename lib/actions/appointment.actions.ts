'use server';

import { ID } from "node-appwrite";
import { config, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            config.DATABASE_ID!,
            config.APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );
        revalidatePath("/admin");
        return parseStringify(newAppointment);
    } catch (error) {
        console.error("An error occurred while creating a new appointment:", error);
    }
};