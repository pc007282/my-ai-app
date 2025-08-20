import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImagePreview({ file, previewUrl, onRemove }) {
  return (
    <div className="relative">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-full rounded-lg shadow-md border border-slate-200"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="w-4 h-4" />
      </Button>
      <p className="text-sm text-slate-600 mt-2">{file.name}</p>
    </div>
  );
}
