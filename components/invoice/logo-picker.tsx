"use client";

import { ImagePlus, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { DEFAULT_LOGO } from "@/lib/invoice";
import { Button } from "@/components/ui/button";

const MAX_LOGO_SIZE = 512 * 1024;

type LogoPickerProps = {
  value: string;
  onChange: (logo: string) => void;
};

export function LogoPicker({ value, onChange }: LogoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) {
      setError("Ukuran logo maksimal 512 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      onChange(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex h-24 w-60 items-center justify-center rounded-action border border-border bg-surface p-4">
        <Image
          src={value}
          alt="Logo perusahaan"
          width={1000}
          height={234}
          unoptimized={value.startsWith("data:")}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="size-4" />
          Ganti Logo
        </Button>
        {value !== DEFAULT_LOGO && (
          <Button variant="ghost" size="sm" onClick={() => onChange(DEFAULT_LOGO)}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
