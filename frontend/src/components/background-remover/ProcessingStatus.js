{\rtf1\ansi\ansicpg950\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React from "react";\
import \{ Progress \} from "@/components/ui/progress";\
\
export default function ProcessingStatus(\{ step, progress \}) \{\
  return (\
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">\
      <h3 className="text-lg font-semibold text-slate-800 mb-4">\{step\}</h3>\
      <Progress value=\{progress\} className="w-full h-2" />\
      <p className="text-sm text-slate-600 mt-2">\uc0\u27491 \u22312 \u34389 \u29702 \u65292 \u35531 \u31245 \u20505 ...</p>\
    </div>\
  );\
\}}
