/**
 * Confirmation dialog component.
 *
 * @module shared/components/ui/confirm-dialog
 */

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

type ConfirmDialogProps = {
  /** Element that triggers the confirmation dialog. */
  trigger: React.ReactElement;

  /** Title displayed in the confirmation dialog. */
  title: string;

  /** Optional description displayed below the title. */
  description?: string;

  /** Text displayed on the confirmation button. */
  confirmText?: string;

  /** Text displayed on the cancel button. */
  cancelText?: string;

  /** Callback executed when the user confirms the action. */
  onConfirm: () => void | Promise<void>;
};

/**
 * Confirmation dialog component.
 *
 * The component handles the confirmation action and displays a loading
 * state while the action is being executed. The dialog closes after a
 * successful action and remains open if the action fails.
 *
 * @param {ConfirmDialogProps} props - Component props.
 * @param {React.ReactElement} props.trigger - Element that triggers the dialog.
 * @param {string} props.title - Title displayed in the dialog.
 * @param {string} [props.description] - Optional description displayed below the title.
 * @param {string} [props.confirmText="Confirmar"] - Text displayed on the confirmation button.
 * @param {string} [props.cancelText="Cancelar"] - Text displayed on the cancel button.
 * @param {() => void | Promise<void>} props.onConfirm - Callback executed when the user confirms the action.
 * @returns {React.ReactElement} Confirmation dialog element.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
}: ConfirmDialogProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  /**
   * Handles the confirmation action.
   *
   * Prevents duplicate submissions while the action is being executed.
   * The dialog closes after a successful action and remains open if
   * the action fails.
   */
  const handleConfirm = async (): Promise<void> => {
    if (confirming) {
      return;
    }

    try {
      setConfirming(true);

      await onConfirm();

      setOpen(false);
    } catch (error) {
      console.error("Failed to confirm action:", error);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger} />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {description && (
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={confirming}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={confirming}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            {confirming && <Spinner />}
            {confirming ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}