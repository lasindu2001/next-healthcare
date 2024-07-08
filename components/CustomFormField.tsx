"use client"

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
}

interface CustomProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldType: FormFieldType;
}

const CustomFormField = ({ control, name, label, fieldType }: CustomProps) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel className="shad-input-label">{label}</FormLabel>
                    )}
                    <FormControl>
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField