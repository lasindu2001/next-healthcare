'use server';

import { ID, Query } from "node-appwrite";
import { config, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types/appwrite.types";

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

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            config.DATABASE_ID!,
            config.APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );
        return parseStringify(appointment);
    } catch (error) {
        console.error("An error occurred while retrieving the existing patient:", error);
    }
};

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            config.DATABASE_ID!,
            config.APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        );
        // const scheduledAppointments = (
        //   appointments.documents as Appointment[]
        // ).filter((appointment) => appointment.status === "scheduled");
        // const pendingAppointments = (
        //   appointments.documents as Appointment[]
        // ).filter((appointment) => appointment.status === "pending");
        // const cancelledAppointments = (
        //   appointments.documents as Appointment[]
        // ).filter((appointment) => appointment.status === "cancelled");
        // const data = {
        //   totalCount: appointments.total,
        //   scheduledCount: scheduledAppointments.length,
        //   pendingCount: pendingAppointments.length,
        //   cancelledCount: cancelledAppointments.length,
        //   documents: appointments.documents,
        // };
        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };
        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "scheduled":
                        acc.scheduledCount++;
                        break;
                    case "pending":
                        acc.pendingCount++;
                        break;
                    case "cancelled":
                        acc.cancelledCount++;
                        break;
                }
                return acc;
            },
            initialCounts
        );
        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        };
        return parseStringify(data);
    } catch (error) {
        console.error("An error occurred while retrieving the recent appointments:", error);
    }
}