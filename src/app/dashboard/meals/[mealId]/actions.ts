"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateMeal, deleteMeal } from "@/data/meals";

const updateMealSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  eatenAt: z.date().refine((d) => !isNaN(d.getTime()), "Invalid date"),
});

export async function editMeal(input: { id: string; name: string; eatenAt: Date }) {
  const parsed = updateMealSchema.parse(input);

  await updateMeal(parsed);

  redirect("/dashboard?mealUpdated=1");
}

const deleteMealSchema = z.object({
  id: z.string().uuid(),
});

export async function removeMeal(input: { id: string }) {
  const parsed = deleteMealSchema.parse(input);

  await deleteMeal(parsed.id);

  redirect("/dashboard?mealDeleted=1");
}
