"use client";

import { useState } from "react";
import MediaPicker from "./MediaPicker";

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageInput({ value, onChange }: ImageInputProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const hasImage = !!value;

  return (
    <>
      {hasImage ? (
        // ── Image set: show large preview with overlay actions ──
        <div className="group relative w-full aspect-[16/9] max-w-md rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Aperçu"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-zinc-900 font-semibold px-4 py-2 rounded-full text-sm transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Changer
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 bg-red-500/90 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Retirer
            </button>
          </div>
        </div>
      ) : (
        // ── No image: dashed dropzone-style picker trigger ──
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="group w-full aspect-[16/9] max-w-md rounded-xl border-2 border-dashed border-zinc-700 hover:border-green-app hover:bg-green-app/5 transition-colors flex flex-col items-center justify-center gap-2 text-center p-6"
        >
          <div className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-green-app/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-zinc-500 group-hover:text-green-app transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
            Choisir une image
          </p>
          <p className="text-xs text-zinc-500">
            Depuis la bibliothèque ou nouvel upload
          </p>
        </button>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onChange}
      />
    </>
  );
}
