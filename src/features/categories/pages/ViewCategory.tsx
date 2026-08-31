/**
 * View categories page component.
 * @module features/categories/pages/ViewCategories
 */
import type { Category } from "@/shared/types/category";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { categoryService } from "../services/categoryService";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/shared/context/AuthContext";
import { ConfirmDialog } from "@/shared/components/ui/confirmDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogForm } from "@/shared/components/ui/dialogForm";
import { useToast } from "@/shared/context/ToastContext";

/**
 * Renders the view categories page with a list of categories.
 * @returns {React.ReactElement} The rendered view categories component.
 */
export function ViewCategories(): React.ReactElement {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (err) {
                setError("The categories could not be loaded.");
                showToast("error", "Error", "The categories could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [showToast]);

    const handleEdit = async (categoryId: string, formData: FormData): Promise<void> => {
        try {
            const name = formData.get("name") as string;
            const description = formData.get("description") as string;

            await categoryService.updateCategory(categoryId, name, description);

            setCategories((currentCategories) =>
                currentCategories.map((category) =>
                    category.id === categoryId
                        ? { ...category, name, description }
                        : category
                )
            );
            showToast("success", "Category updated", "The category was successfully updated.");
        } catch (err) {
            showToast("error", "Error", "Failed to update category.");
            throw err;
        }
    };

    const handleDelete = async (categoryId: string) => {
        try {
            await categoryService.deleteCategory(categoryId);

            setCategories((currentCategories) =>
                currentCategories.filter((category) => category.id !== categoryId)
            );
            showToast("success", "Category deleted", "The category was successfully deleted.");
        } catch (error) {
            setError("The category could not be deleted.");
            showToast("error", "Error", "The category could not be deleted.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="flex flex-row items-center gap-2"><Spinner /> Loading Categories...</p>
            </div>
        );
    }
    
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">Categories</h1>
                </CardHeader>
                <CardContent>
                    {categories.length === 0 ? (
                        <p className="text-muted-foreground">No categories available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {categories.map((cat) => (
                                <li key={cat.id} className="border-b pb-4 pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{cat.name}</h3>
                                        {cat.description && (
                                            <p className="text-sm text-muted-foreground">{cat.description}</p>
                                        )}
                                    </div>
                                    {user?.role === "admin" && (
                                        <div className="flex flex-row items-center gap-2 self-end sm:self-auto">
                                            <DialogForm
                                                trigger={
                                                    <button
                                                        className="px-3 py-1.5 text-xs font-medium bg-white text-black hover:bg-secondary/80 rounded-md transition-colors cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                }
                                                title="Edit category"
                                                description="Update the category information."
                                                submitText="Save changes"
                                                cancelText="Cancel"
                                                onSubmit={(formData) => handleEdit(cat.id, formData)}
                                            >
                                                <div className="space-y-2">
                                                    <label htmlFor={`name-${cat.id}`}>
                                                        Name
                                                    </label>

                                                    <Input
                                                        id={`name-${cat.id}`}
                                                        name="name"
                                                        defaultValue={cat.name}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor={`description-${cat.id}`}>
                                                        Description
                                                    </label>

                                                    <Textarea
                                                        id={`description-${cat.id}`}
                                                        name="description"
                                                        defaultValue={cat.description ?? ""}
                                                    />
                                                </div>
                                            </DialogForm>
                                            <ConfirmDialog
                                                trigger={
                                                    <button
                                                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                }
                                                title="Delete category?"
                                                description={`Are you sure you want to delete "${cat.name}"? This action cannot be undone.`}
                                                confirmText="Delete"
                                                cancelText="Cancel"
                                                onConfirm={() => handleDelete(cat.id)}
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}