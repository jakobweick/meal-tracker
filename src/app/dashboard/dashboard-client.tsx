"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FoodItem = {
  id: string;
  name: string;
  calories: string | null;
};

type Meal = {
  id: string;
  name: string;
  eatenAt: Date;
  mealFoodItems: {
    id: string;
    quantity: string | null;
    foodItem: FoodItem | null;
  }[];
};

function mealCalories(meal: Meal) {
  return meal.mealFoodItems.reduce((sum, item) => {
    const calories = item.foodItem?.calories ? Number(item.foodItem.calories) : 0;
    const quantity = item.quantity ? Number(item.quantity) : 1;
    return sum + calories * quantity;
  }, 0);
}

export function DashboardClient({ meals }: { meals: Meal[] }) {
  const [date, setDate] = useState<Date>(new Date());
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownMealCreatedToast = useRef(false);

  useEffect(() => {
    if (
      searchParams.get("mealCreated") === "1" &&
      !hasShownMealCreatedToast.current
    ) {
      hasShownMealCreatedToast.current = true;
      toast.success("Meal logged successfully");
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  const mealsForDate = meals.filter((meal) => isSameDay(meal.eatenAt, date));

  const totalCalories = mealsForDate.reduce(
    (sum, meal) => sum + mealCalories(meal),
    0
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Track your meals for the selected day.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/meals/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add meal
          </Link>
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => selected && setDate(selected)}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <Card>
        <CardHeader>
          <CardTitle>Meals on {format(date, "PPP")}</CardTitle>
          <CardDescription>
            {mealsForDate.length > 0
              ? `${mealsForDate.length} meal${mealsForDate.length === 1 ? "" : "s"} · ${totalCalories} kcal total`
              : "No meals logged for this date."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {mealsForDate.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nothing logged yet. Meals you add will show up here.
            </p>
          ) : (
            mealsForDate.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{meal.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {format(meal.eatenAt, "p")}
                  </span>
                </div>
                <Badge variant="secondary">{mealCalories(meal)} kcal</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
