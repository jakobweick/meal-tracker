import { auth } from '@clerk/nextjs/server';
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
