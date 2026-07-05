import { defineRelations } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, numeric } from 'drizzle-orm/pg-core';

export const meals = pgTable('meals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  eatenAt: timestamp('eaten_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const foodItems = pgTable('food_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  calories: numeric('calories', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const mealFoodItems = pgTable('meal_food_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  mealId: uuid('meal_id')
    .notNull()
    .references(() => meals.id, { onDelete: 'cascade' }),
  foodItemId: uuid('food_item_id')
    .notNull()
    .references(() => foodItems.id, { onDelete: 'cascade' }),
  quantity: numeric('quantity', { precision: 10, scale: 2 }),
});

export const schemaRelations = defineRelations(
  { meals, foodItems, mealFoodItems },
  (r) => ({
    meals: {
      mealFoodItems: r.many.mealFoodItems(),
    },
    foodItems: {
      mealFoodItems: r.many.mealFoodItems(),
    },
    mealFoodItems: {
      meal: r.one.meals({
        from: r.mealFoodItems.mealId,
        to: r.meals.id,
      }),
      foodItem: r.one.foodItems({
        from: r.mealFoodItems.foodItemId,
        to: r.foodItems.id,
      }),
    },
  })
);
