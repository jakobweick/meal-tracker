"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { addMeal } from "./actions";

export function NewMealForm() {
  const [name, setName] = useState("");
  const [eatenAt, setEatenAt] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a meal name.");
      return;
    }

    startTransition(async () => {
      try {
        await addMeal({ name: name.trim(), eatenAt });
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New meal</CardTitle>
        <CardDescription>Log a meal you&apos;ve eaten.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken salad"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Eaten at</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !eatenAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eatenAt ? format(eatenAt, "PPP p") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eatenAt}
                  onSelect={(selected) => selected && setEatenAt(selected)}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save meal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
