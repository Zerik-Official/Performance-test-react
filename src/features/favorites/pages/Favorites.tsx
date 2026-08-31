// src/features/favorites/pages/ViewFavorites.tsx
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { favoriteService } from "../services/favoriteService";
import type { Event } from "@/shared/types/events";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/shared/context/ToastContext";
import { ConfirmDialog } from "@/shared/components/ui/confirmDialog";

export function ViewFavorites(): React.ReactElement {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await favoriteService.getFavorites();
        setFavorites(data);
      } catch (err) {
        setError("Could not load your favorite events.");
        showToast("error", "Error", "Could not load your favorite events.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [showToast]);

  const handleRemoveFavorite = async (eventId: string) => {
    try {
      await favoriteService.removeFavorite(eventId);
      setFavorites((prev) => prev.filter((event) => event.id !== eventId));
      showToast("success", "Removed", "Event removed from your favorites.");
    } catch (err) {
      showToast("error", "Error", "Failed to remove event from favorites.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="flex flex-row items-center gap-2"><Spinner /> Loading Favorites...</p>
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Favorite Events</h1>
      {favorites.length === 0 ? (
        <p className="text-muted-foreground">You have no favorite events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((event) => (
            <Card key={event.id} className="overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader className="pb-2">
                  <h3 className="font-semibold text-lg">{event.name}</h3>
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
                  </div>
                </CardContent>
              </div>
              <div className="p-4 pt-0 flex justify-end border-t mt-4">
                <ConfirmDialog
                  trigger={
                    <button className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors cursor-pointer">
                      Remove Favorite
                    </button>
                  }
                  title="Remove favorite?"
                  description={`Are you sure you want to remove "${event.name}" from your favorites?`}
                  confirmText="Remove"
                  cancelText="Cancel"
                  onConfirm={() => handleRemoveFavorite(event.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}