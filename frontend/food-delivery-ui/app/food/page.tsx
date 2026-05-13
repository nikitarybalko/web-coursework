import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import RestaurantCard from "@/components/common/RestaurantCard/RestaurantCard";
import { fetchAllRestaurants } from "@/lib/utils";

export default async function RestaurantsPage() {
  const restaurants = await fetchAllRestaurants();

  return (
    <>
      <Header />
      <main className="flex flex-col grow bg-background pt-std px-std min-w-0">
        <div className="flex flex-col max-w-page-max-w w-full mx-auto self-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Заклади поруч
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
