import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { fetchRestaurantOrders } from "@/lib/utils";
import OrdersDashboardClient from "@/components/dashboard/OrdersDashboardClient";

export default async function DashboardOrdersPage() {
  const session = await getServerSession(authOptions);

  // Перевірка доступу
  if (!session || !session.idToken || session.role !== "RESTAURANT") {
    redirect("/login");
  }

  // Отримуємо поточні замовлення
  const orders = await fetchRestaurantOrders(session.idToken);

  return (
    <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
      <OrdersDashboardClient initialOrders={orders} token={session.idToken} />
    </div>
  );
}
