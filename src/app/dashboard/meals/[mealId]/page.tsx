import { notFound } from "next/navigation";
import { getMealById } from "@/data/meals";
import { EditMealForm } from "./edit-meal-form";

export default async function EditMealPage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const { mealId } = await params;
  const meal = await getMealById(mealId);

  if (!meal) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Edit meal</h1>
        <p className="text-muted-foreground text-sm">
          Update the details of this meal.
        </p>
      </div>

      <EditMealForm meal={meal} />
    </div>
  );
}
