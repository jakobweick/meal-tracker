import { Suspense } from "react";
import { getMealsForCurrentUser } from "@/data/meals";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const meals = await getMealsForCurrentUser();

  return (
    <Suspense>
      <DashboardClient meals={meals} />
    </Suspense>
  );
}
