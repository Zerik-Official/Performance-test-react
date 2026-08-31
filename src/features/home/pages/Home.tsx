/**
 * Home page component showing welcome hero and quick navigation cards.
 * @module features/home/pages/Home
 */
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { useAuth } from "@shared/context/AuthContext";
import { ROUTES } from "@shared/constants/routes";

/**
 * Renders the home page with feature cards and role-based actions.
 * @returns {React.ReactElement} The rendered home component.
 */
export function Home(): React.ReactElement {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="bg-black text-white p-8 rounded-xl flex flex-col items-start gap-4 shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <i className="fa-solid fa-cubes text-primary" /> Welcome to SuperApp
        </h1>
        <p className="text-white/80 max-w-2xl text-base">
          Discover, organize, and explore local events, concerts, workshops, and activities near you. Connect with your community and never miss out on what's happening.
        </p>
        {!user && (
          <div className="flex gap-4 pt-2">
            <Link
              to={ROUTES.LOGIN}
              className="px-5 py-2.5 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-colors cursor-pointer text-sm"
            >
              <i className="fa-solid fa-right-to-bracket mr-2" /> Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20 transition-colors cursor-pointer text-sm border border-white/20"
            >
              <i className="fa-solid fa-user-plus mr-2" /> Register
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-lg text-secondary-foreground">
                    <i className="fa-solid fa-calendar text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Events</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore all upcoming local activities, check descriptions, pricing, dates, and locations.
                </p>
              </CardContent>
            </div>
            <div className="p-6 pt-0">
              <Link
                to={ROUTES.EVENT}
                className="w-full text-center block py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-md transition-colors text-sm"
              >
                View Events
              </Link>
            </div>
          </Card>

          <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-lg text-secondary-foreground">
                    <i className="fa-solid fa-layer-group text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Categories</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse events classified by category to find precisely what matches your interests.
                </p>
              </CardContent>
            </div>
            <div className="p-6 pt-0">
              <Link
                to={ROUTES.CATEGORIES}
                className="w-full text-center block py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-md transition-colors text-sm"
              >
                View Categories
              </Link>
            </div>
          </Card>

          {user && (
            <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-lg text-secondary-foreground">
                      <i className="fa-solid fa-heart text-xl" />
                    </div>
                    <h3 className="text-lg font-semibold">My Favorites</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Access the events you have marked as favorites to quickly find them later.
                  </p>
                </CardContent>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to={ROUTES.FAVORITES || "/favorites"}
                  className="w-full text-center block py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-md transition-colors text-sm"
                >
                  View Favorites
                </Link>
              </div>
            </Card>
          )}

          {isAdmin && (
            <>
              <Card className="flex flex-col justify-between hover:shadow-md transition-shadow border-dashed border-2">
                <div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-black text-white rounded-lg">
                        <i className="fa-solid fa-plus text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold">Create Category</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Add new event classification categories to organize upcoming activities.
                    </p>
                  </CardContent>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    to={ROUTES.ADMIN_CATEGORY_NEW}
                    className="w-full text-center block py-2 px-4 bg-black text-white hover:bg-black/90 font-medium rounded-md transition-colors text-sm"
                  >
                    Add Category
                  </Link>
                </div>
              </Card>

              <Card className="flex flex-col justify-between hover:shadow-md transition-shadow border-dashed border-2">
                <div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-black text-white rounded-lg">
                        <i className="fa-regular fa-calendar-plus text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold">Create Event</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Publish new local events, specify capacity, pricing, dates, and images.
                    </p>
                  </CardContent>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    to={ROUTES.ADMIN_EVENT_NEW}
                    className="w-full text-center block py-2 px-4 bg-black text-white hover:bg-black/90 font-medium rounded-md transition-colors text-sm"
                  >
                    Add Event
                  </Link>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}