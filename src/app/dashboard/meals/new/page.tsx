import { NewMealForm } from "./new-meal-form";

export default function NewMealPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add meal</h1>
        <p className="text-muted-foreground text-sm">
          Log a new meal you&apos;ve eaten.
        </p>
      </div>

      <NewMealForm />
    </div>
  );
}
