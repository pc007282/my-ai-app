{\rtf1\ansi\ansicpg950\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React from "react";\
import \{ X \} from "lucide-react";\
import \{ Button \} from "@/components/ui/button";\
\
export default function ImagePreview(\{ file, previewUrl, onRemove \}) \{\
  return (\
    <div className="relative">\
      <img\
        src=\{previewUrl\}\
        alt=\{file.name\}\
        className="w-full rounded-lg shadow-md border border-slate-200"\
      />\
      <Button\
        variant="destructive"\
        size="icon"\
        className="absolute top-2 right-2"\
        onClick=\{onRemove\}\
      >\
        <X className="w-4 h-4" />\
      </Button>\
      <p className="text-sm text-slate-600 mt-2">\{file.name\}</p>\
    </div>\
  );\
\}}
