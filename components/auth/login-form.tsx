"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import { useActionState } from "react";
import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const invalid = Boolean(state?.error);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Username" htmlFor="username">
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          required
          invalid={invalid}
          defaultValue={state?.username}
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          invalid={invalid}
        />
      </Field>
      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" block disabled={pending}>
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Masuk
      </Button>
    </form>
  );
}
