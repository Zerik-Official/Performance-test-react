/**
 * Create events page component.
 * @module features/events/pages/CreateEvents
 */
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { eventService } from "../services/eventsService";
import { categoryService } from "@/features/categories/services/categoryService";
import type { EventPayload } from "@/shared/types/events";
import type { Category } from "@/shared/types/category";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/shared/context/ToastContext";

/**
 * Renders the form to create a new event.
 * @returns {React.ReactElement} The rendered create event component.
 */
export function CreateEvents(): React.ReactElement {
    const { showToast } = useToast();

    const [form, setForm] = useState<EventPayload>({
        name: "",
        description: "",
        date: "",
        location: "",
        price: "",
        capacity: "",
        categoryId: "",
        images: [""],
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (err) {
                showToast("error", "Error", "Could not load categories for selection.");
            }
        };
        fetchCategories();
    }, [showToast]);

    /**
     * Handles input change events for the form fields.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e - Input change event.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handles changes for an image URL input at a specific index.
     * @param {number} index - Image field index.
     * @param {string} value - Image URL value.
     */
    const handleImageChange = (index: number, value: string) => {
        const newImages = [...form.images];
        newImages[index] = value;
        setForm((prev) => ({ ...prev, images: newImages }));
    };

    /**
     * Appends a new image input field.
     */
    const addImageField = () => {
        setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
    };

    /**
     * Removes an image input field by index.
     * @param {number} index - Image field index.
     */
    const removeImageField = (index: number) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    /**
     * Handles form submission to create an event.
     * @param {React.FormEvent} e - Form submission event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            
            await eventService.createEvent(form);
            
            showToast("success", "Event created", "The event was successfully created.");
            setForm({
                name: "",
                description: "",
                date: "",
                location: "",
                price: "",
                capacity: "",
                categoryId: "",
                images: [""],
            });
        } catch (err) {
            setError("Failed to create event.");
            showToast("error", "Error", "Failed to create event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">Create Event</h1>
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
                                placeholder="Event name"
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
                                placeholder="Event description (optional)"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="date" className="text-sm font-medium">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="location" className="text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={form.location}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Event location"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="price" className="text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={form.price}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="capacity" className="text-sm font-medium">Capacity</label>
                                <input
                                    type="number"
                                    id="capacity"
                                    name="capacity"
                                    value={form.capacity}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="100"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Images (URLs)</label>
                            {form.images.map((img, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="url"
                                        value={img}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        className="border rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {form.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="px-3 py-2 text-xs bg-red-50 text-red-600 rounded-md hover:bg-red-100 cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addImageField}
                                className="self-start text-xs text-primary font-medium hover:underline mt-1 cursor-pointer"
                            >
                                + Add another image
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer mt-4"
                        >
                            {loading && <Spinner />}
                            {loading ? "Creating..." : "Create Event"}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}