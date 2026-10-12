"use client";

import { ImagePlus, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "./button";

const MAX_IMAGE_SIZE = 512 * 1024;

type ImagePickerProps = {
  value: string;
  onChange: (value: string) => void;
  alt: string;
  pickLabel: string;
  emptyText?: string;
  resetValue?: string;
};

export function ImagePicker({
  value,
  onChange,
  alt,
  pickLabel,
  emptyText,
  resetValue = "",
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Ukuran gambar maksimal 512 KB.");
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
        {value ? (
          <Image
            src={value}
            alt={alt}
            width={1000}
            height={234}
            unoptimized={value.startsWith("data:")}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-center text-sm text-subtle">{emptyText}</span>
        )}
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="size-4" />
          {pickLabel}
        </Button>
        {value !== resetValue && (
          <Button variant="ghost" size="sm" onClick={() => onChange(resetValue)}>
            {resetValue ? <RotateCcw className="size-4" /> : <X className="size-4" />}
            {resetValue ? "Reset" : "Hapus"}
          </Button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
