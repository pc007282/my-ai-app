import React from "react";
import { Progress } from "@/components/ui/progress";

export default function ProcessingStatus({ step, progress }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{step}</h3>
      <Progress value={progress} className="w-full h-2" />
      <p className="text-sm text-slate-600 mt-2">正在處理，請稍候...</p>
    </div>
  );
}
