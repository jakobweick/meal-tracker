"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createMeal } from "@/data/meals";

const createMealSchema = z.object({
  name: z.string().trim().min(1).max(200),
  eatenAt: z.date(),
});

export async function addMeal(input: { name: string; eatenAt: Date }) {
  const parsed = createMealSchema.parse(input);

  await createMeal(parsed);

  redirect("/dashboard?mealCreated=1");
}
