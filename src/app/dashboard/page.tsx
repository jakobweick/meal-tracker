"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

type Meal = {
  id: string;
  name: string;
  eatenAt: Date;
  calories: number;
};

const placeholderMeals: Meal[] = [
  {
    id: "1",
    name: "Oatmeal with Berries",
    eatenAt: new Date(new Date().setHours(8, 15)),
    calories: 320,
  },
  {
    id: "2",
    name: "Grilled Chicken Salad",
    eatenAt: new Date(new Date().setHours(12, 45)),
    calories: 450,
  },
  {
    id: "3",
    name: "Greek Yogurt",
    eatenAt: new Date(new Date().setHours(15, 30)),
    calories: 150,
  },
  {
    id: "4",
    name: "Salmon with Vegetables",
    eatenAt: new Date(new Date().setHours(19, 0)),
    calories: 520,
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const mealsForDate = placeholderMeals.filter((meal) =>
    isSameDay(meal.eatenAt, date)
  );

  const totalCalories = mealsForDate.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Track your meals for the selected day.
        </p>
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
                <Badge variant="secondary">{meal.calories} kcal</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
