/**
 * View events page component with pagination, search/filtering, and favorites support.
 * @module features/events/pages/Events
 */
import type { Event, EventPayload } from "@/shared/types/events";
import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { eventService } from "../services/eventsService";
import { favoriteService } from "@/features/favorites/services/favoriteService";
import { categoryService } from "@/features/categories/services/categoryService";
import type { Category } from "@/shared/types/category";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/shared/context/AuthContext";
import { ConfirmDialog } from "@/shared/components/ui/confirmDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogForm } from "@/shared/components/ui/dialogForm";
import { useToast } from "@/shared/context/ToastContext";
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "lucide-react";

const ITEMS_PER_PAGE = 6;

function EventImageCarousel({ images, eventName }: { images: string[] | { url?: string }[]; eventName: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const normalizedImages = Array.isArray(images)
        ? images.map((img) => (typeof img === "string" ? img : img?.url || ""))
        : [];

    const validImages = normalizedImages.filter(Boolean);

    if (validImages.length === 0) {
        return (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm rounded-t-lg">
                No image available
            </div>
        );
    }

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-48 bg-muted overflow-hidden rounded-t-lg group">
            <img
                src={validImages[currentIndex]}
                alt={`${eventName} - image ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
            />
            {validImages.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="size-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                        {currentIndex + 1} / {validImages.length}
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Renders the view events page with a list of event cards and pagination.
 * @returns {React.ReactElement} The rendered events component.
 */
export function Events(): React.ReactElement {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    // State for managing image inputs during editing
    const [editImages, setEditImages] = useState<string[]>([""]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const promises: Promise<any>[] = [
                    eventService.getEvents(),
                    categoryService.getCategories(),
                ];

                if (user) {
                    promises.push(favoriteService.getFavorites());
                }

                const results = await Promise.all(promises);
                setEvents(results[0]);
                setCategories(results[1]);
                if (user && results[2]) {
                    setFavoriteIds(results[2].map((fav: Event) => fav.id));
                }
            } catch (err) {
                setError("The events could not be loaded.");
                showToast("error", "Error", "The events could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, showToast]);

    // Calculate paginated events
    const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
    
    const paginatedEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return events.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [events, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat ? cat.name : "Uncategorized";
    };

    const handleToggleFavorite = async (eventId: string) => {
        if (!user) {
            showToast("error", "Authentication required", "Please log in to manage your favorites.");
            return;
        }

        const isFav = favoriteIds.includes(eventId);
        try {
            if (isFav) {
                await favoriteService.removeFavorite(eventId);
                setFavoriteIds((prev) => prev.filter((id) => id !== eventId));
                showToast("success", "Removed", "Removed from favorites.");
            } else {
                await favoriteService.addFavorite(eventId);
                setFavoriteIds((prev) => [...prev, eventId]);
                showToast("success", "Added", "Added to favorites.");
            }
        } catch (err) {
            showToast("error", "Error", "Failed to update favorites.");
        }
    };

    const handleOpenEdit = (event: Event) => {
        const normalized = Array.isArray(event.images)
            ? event.images.map((img) => (typeof img === "string" ? img : (img as any)?.url || ""))
            : [];
        setEditImages(normalized.length > 0 ? normalized : [""]);
    };

    const handleEditImageChange = (index: number, value: string) => {
        const updated = [...editImages];
        updated[index] = value;
        setEditImages(updated);
    };

    const addEditImageField = () => {
        setEditImages((prev) => [...prev, ""]);
    };

    const removeEditImageField = (index: number) => {
        setEditImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEdit = async (eventId: string, formData: FormData): Promise<void> => {
        try {
            const name = formData.get("name") as string;
            const description = formData.get("description") as string;
            const location = formData.get("location") as string;
            const date = formData.get("date") as string;
            const price = formData.get("price") as string;
            const capacity = formData.get("capacity") as string;
            const categoryId = formData.get("categoryId") as string;
            const images = editImages.filter((img) => img.trim() !== "");

            const payload: Partial<EventPayload> = {
                name,
                description,
                location,
                date,
                price,
                capacity,
                categoryId,
                images,
            };

            await eventService.updateEvent(eventId, payload);

            setEvents((currentEvents) =>
                currentEvents.map((event) =>
                    event.id === eventId
                        ? { ...event, ...payload }
                        : event
                )
            );
            showToast("success", "Event updated", "The event was successfully updated.");
        } catch (err) {
            showToast("error", "Error", "Failed to update event.");
            throw err;
        }
    };

    const handleDelete = async (eventId: string) => {
        try {
            await eventService.deleteEvent(eventId);

            setEvents((currentEvents) => {
                const updated = currentEvents.filter((event) => event.id !== eventId);
                const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
                return updated;
            });
            showToast("success", "Event deleted", "The event was successfully deleted.");
        } catch (error) {
            setError("The event could not be deleted.");
            showToast("error", "Error", "The event could not be deleted.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="flex flex-row items-center gap-2"><Spinner /> Loading Events...</p>
            </div>
        );
    }
    
    if (error) return <p style={{ color: "red" }} className="p-6">{error}</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Events</h1>
            {events.length === 0 ? (
                <p className="text-muted-foreground">No events available.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedEvents.map((event) => {
                            const isFavorite = favoriteIds.includes(event.id);
                            return (
                                <Card key={event.id} className="overflow-hidden flex flex-col justify-between">
                                    <div>
                                        <div className="relative">
                                            <EventImageCarousel images={event.images} eventName={event.name} />
                                            {user && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFavorite(event.id)}
                                                    className="absolute top-2 right-2 bg-background/80 hover:bg-background p-2 rounded-full shadow transition-colors cursor-pointer"
                                                    aria-label="Toggle favorite"
                                                >
                                                    <HeartIcon
                                                        className={`size-5 ${
                                                            isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                                                        }`}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-lg">{event.name}</h3>
                                                <span className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground font-medium">
                                                    {getCategoryName(event.categoryId)}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            {event.description && (
                                                <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                                            )}
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                                                <div>
                                                    <span className="font-medium text-muted-foreground">Date:</span>
                                                    <p>{new Date(event.date).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-muted-foreground">Location:</span>
                                                    <p className="truncate">{event.location}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-muted-foreground">Price:</span>
                                                    <p>${event.price}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-muted-foreground">Capacity:</span>
                                                    <p>{event.capacity}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>

                                    {user?.role === "admin" && (
                                        <div className="p-4 pt-0 flex justify-end gap-2 border-t mt-4">
                                            <div onClick={() => handleOpenEdit(event)}>
                                                <DialogForm
                                                    trigger={
                                                        <button
                                                            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                    }
                                                    title="Edit event"
                                                    description="Update the event information."
                                                    submitText="Save changes"
                                                    cancelText="Cancel"
                                                    onSubmit={(formData) => handleEdit(event.id, formData)}
                                                >
                                                    <div className="space-y-2">
                                                        <label htmlFor={`name-${event.id}`} className="text-sm font-medium">Name</label>
                                                        <Input
                                                            id={`name-${event.id}`}
                                                            name="name"
                                                            defaultValue={event.name}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label htmlFor={`description-${event.id}`} className="text-sm font-medium">Description</label>
                                                        <Textarea
                                                            id={`description-${event.id}`}
                                                            name="description"
                                                            defaultValue={event.description ?? ""}
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-2">
                                                            <label htmlFor={`date-${event.id}`} className="text-sm font-medium">Date & Time</label>
                                                            <Input
                                                                type="datetime-local"
                                                                id={`date-${event.id}`}
                                                                name="date"
                                                                defaultValue={event.date ? event.date.slice(0, 16) : ""}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor={`location-${event.id}`} className="text-sm font-medium">Location</label>
                                                            <Input
                                                                id={`location-${event.id}`}
                                                                name="location"
                                                                defaultValue={event.location}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="space-y-2">
                                                            <label htmlFor={`price-${event.id}`} className="text-sm font-medium">Price</label>
                                                            <Input
                                                                type="number"
                                                                id={`price-${event.id}`}
                                                                name="price"
                                                                defaultValue={event.price}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor={`capacity-${event.id}`} className="text-sm font-medium">Capacity</label>
                                                            <Input
                                                                type="number"
                                                                id={`capacity-${event.id}`}
                                                                name="capacity"
                                                                defaultValue={event.capacity}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor={`categoryId-${event.id}`} className="text-sm font-medium">Category</label>
                                                            <select
                                                                id={`categoryId-${event.id}`}
                                                                name="categoryId"
                                                                defaultValue={event.categoryId}
                                                                required
                                                                className="border rounded-md px-3.5 py-2 text-sm w-full bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                                            >
                                                                {categories.map((cat) => (
                                                                    <option key={cat.id} value={cat.id}>
                                                                        {cat.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 pt-2">
                                                        <label className="text-sm font-medium">Images (URLs)</label>
                                                        {editImages.map((img, idx) => (
                                                            <div key={idx} className="flex gap-2">
                                                                <Input
                                                                    type="url"
                                                                    value={img}
                                                                    onChange={(e) => handleEditImageChange(idx, e.target.value)}
                                                                    placeholder="https://example.com/image.jpg"
                                                                />
                                                                {editImages.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeEditImageField(idx)}
                                                                        className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-md hover:bg-red-100 cursor-pointer"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={addEditImageField}
                                                            className="text-xs text-primary font-medium hover:underline cursor-pointer"
                                                        >
                                                            + Add another image
                                                        </button>
                                                    </div>
                                                </DialogForm>
                                            </div>
                                            <ConfirmDialog
                                                trigger={
                                                    <button
                                                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                }
                                                title="Delete event?"
                                                description={`Are you sure you want to delete "${event.name}"? This action cannot be undone.`}
                                                confirmText="Delete"
                                                cancelText="Cancel"
                                                onConfirm={() => handleDelete(event.id)}
                                            />
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3.5 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors cursor-pointer flex items-center gap-1"
                            >
                                <ChevronLeftIcon className="size-4" /> Previous
                            </button>
                            <span className="text-sm text-muted-foreground">
                                Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3.5 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors cursor-pointer flex items-center gap-1"
                            >
                                Next <ChevronRightIcon className="size-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}