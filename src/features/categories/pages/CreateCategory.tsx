/**
 * Create categories page component.
 * @module features/categories/pages/CreateCategories
 */
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { categoryService } from "../services/categoryService";
import type { CategoryPayload } from "@/shared/types/category";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/shared/context/ToastContext";

/**
 * Renders the form to create a new category.
 * @returns {React.ReactElement} The rendered create category component.
 */
export function CreateCategories(): React.ReactElement {
    const { showToast } = useToast();

    const [form, setForm] = useState<CategoryPayload>({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handles input change events for the form fields.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Input change event.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handles form submission to create a category.
     * @param {React.FormEvent} e - Form submission event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            
            await categoryService.createCategory(form);
            
            showToast("success", "Category created", "The category was successfully created.");
            setForm({ name: "", description: "" });
        } catch (err) {
            setError("Failed to create category.");
            showToast("error", "Error", "Failed to create category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">Create Category</h1>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleInputChange}
                                required
                                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Category name"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description || ""}
                                onChange={handleInputChange}
                                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Category description (optional)"
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer mt-2"
                        >
                            {loading && <Spinner />}
                            {loading ? "Creating..." : "Create Category"}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}