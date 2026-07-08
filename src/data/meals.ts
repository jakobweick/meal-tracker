import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { meals } from '@/db/schema';

export async function getMealsForCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  return db.query.meals.findMany({
    where: { userId },
    with: {
      mealFoodItems: {
        with: {
          foodItem: true,
        },
      },
    },
    orderBy: { eatenAt: 'asc' },
  });
}

export async function getMealById(id: string) {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const meal = await db.query.meals.findFirst({
    where: { id, userId },
  });

  return meal ?? null;
}

export async function updateMeal(input: { id: string; name: string; eatenAt: Date }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const [meal] = await db
    .update(meals)
    .set({
      name: input.name,
      eatenAt: input.eatenAt,
      updatedAt: new Date(),
    })
    .where(and(eq(meals.id, input.id), eq(meals.userId, userId)))
    .returning();

  return meal;
}

export async function deleteMeal(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  await db.delete(meals).where(and(eq(meals.id, id), eq(meals.userId, userId)));
}

export async function createMeal(input: { name: string; eatenAt: Date }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const [meal] = await db
    .insert(meals)
    .values({
      userId,
      name: input.name,
      eatenAt: input.eatenAt,
    })
    .returning();

  return meal;
}
