"use client";
import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#18181b",
          border: "1px solid #27272a",
          color: "#f4f4f5",
        },
      }}
    />
  );
}
