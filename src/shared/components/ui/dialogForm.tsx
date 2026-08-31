/**
 * Reusable dialog form component.
 *
 * @module shared/components/ui/DialogForm
 */

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * Props for the DialogForm component.
 */
type DialogFormProps = {
    /**
     * Element that triggers the dialog to open.
     */
    trigger: React.ReactElement;

    /**
     * Title displayed at the top of the dialog.
     */
    title: string;

    /**
     * Optional description displayed below the title.
     */
    description?: string;

    /**
     * Text displayed on the submit button.
     *
     * @default "Save"
     */
    submitText?: string;

    /**
     * Text displayed on the cancel button.
     *
     * @default "Cancel"
     */
    cancelText?: string;

    /**
     * Form fields and other content displayed inside the dialog.
     */
    children: React.ReactNode;

    /**
     * Callback executed when the form is submitted.
     *
     * If the callback resolves successfully, the dialog is closed.
     * If the callback throws an error, the dialog remains open.
     *
     * @param formData - Data collected from the form fields.
     */
    onSubmit: (formData: FormData) => void | Promise<void>;
};

/**
 * Renders a reusable dialog containing a form.
 *
 * The component handles opening and closing the dialog, rendering
 * the form fields, preventing the default form submission, collecting
 * form values, and displaying a loading state while the form is being
 * submitted.
 *
 * @param props - DialogForm component properties.
 * @returns The rendered dialog form component.
 */
export function DialogForm({
    trigger,
    title,
    description,
    submitText = "Save",
    cancelText = "Cancel",
    children,
    onSubmit,
}: DialogFormProps): React.ReactElement {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    /**
     * Handles the form submission.
     *
     * Prevents duplicate submissions while the form is being processed.
     * The dialog is closed after a successful submission and remains open
     * if the submission fails.
     *
     * @param event - Form submission event.
     */
    const handleSubmit = async (
        event: React.SubmitEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const formData = new FormData(event.currentTarget);

        try {
            setSubmitting(true);

            await onSubmit(formData);

            setOpen(false);
        } catch (error) {
            console.error("Failed to submit form:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger render={trigger} />

            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {title}
                        </AlertDialogTitle>

                        {description && (
                            <AlertDialogDescription>
                                {description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>

                    <div className="space-y-4 py-4">
                        {children}
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={submitting}
                            className="cursor-pointer"
                        >
                            {cancelText}
                        </AlertDialogCancel>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="cursor-pointer"
                        >
                            {submitting && <Spinner />}
                            {submitting ? "Saving..." : submitText}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}