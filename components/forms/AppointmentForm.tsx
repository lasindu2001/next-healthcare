"use client";

import { useForm } from "react-hook-form";
import { Form } from "../ui/form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { useState } from "react";
import SubmitButton from "../SubmitButton";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useRouter } from "next/navigation";

const AppointmentForm = ({
    userId,
    patientId,
    type = "create",
    appointment,
}: {
    userId: string;
    patientId: string;
    type: "create" | "schedule" | "cancel";
    appointment?: Appointment;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment?.primaryPhysician : "",
            schedule: appointment
                ? new Date(appointment?.schedule!)
                : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true);
        let status;
        switch (type) {
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
        }
        try {
            if (type === "create" && patientId) {
                const appointment = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason!,
                    schedule: new Date(values.schedule),
                    status: status as Status,
                    note: values.note,
                };
                const newAppointment = await createAppointment(appointment);
                if (newAppointment) {
                    form.reset();
                    router.push(
                        `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    let buttonLabel;
    switch (type) {
        case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
        case "schedule":
            buttonLabel = "Schedule Appointment";
            break;
        default:
            buttonLabel = "Submit Apppointment";
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                {type === "create" && (
                    <section className="mb-12 space-y-4">
                        <h1 className="header">New Appointment</h1>
                        <p className="text-dark-700">
                            Request a new appointment in 10 seconds.
                        </p>
                    </section>
                )}
                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a doctor"
                        >
                            {Doctors.map((doctor, i) => (
                                <SelectItem key={doctor.name + i} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt="doctor"
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected Appointment Date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />
                        <div className={`flex flex-col gap-6 ${type === "create" && "xl:flex-row"}`}>
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Appointment Reason"
                                placeholder="Annual montly check-up"
                                disabled={type === "schedule"}
                            />
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Comments/Notes"
                                placeholder="Prefer afternoon appointments, if possible"
                                disabled={type === "schedule"}
                            />
                        </div>
                    </>
                )}
                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for Cancellation"
                        placeholder="Urgent meeting came up"
                    />
                )}
                <SubmitButton
                    isLoading={isLoading}
                    className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
                >
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm