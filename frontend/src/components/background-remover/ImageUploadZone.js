{\rtf1\ansi\ansicpg950\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React from "react";\
import \{ Upload \} from "lucide-react";\
\
export default function ImageUploadZone(\{ onFileSelect, dragActive, setDragActive \}) \{\
  const handleDrag = (e) => \{\
    e.preventDefault();\
    e.stopPropagation();\
    if (e.type === "dragenter" || e.type === "dragover") \{\
      setDragActive(true);\
    \} else if (e.type === "dragleave") \{\
      setDragActive(false);\
    \}\
  \};\
\
  const handleDrop = (e) => \{\
    e.preventDefault();\
    e.stopPropagation();\
    setDragActive(false);\
    if (e.dataTransfer.files && e.dataTransfer.files[0]) \{\
      onFileSelect(e.dataTransfer.files[0]);\
    \}\
  \};\
\
  const handleChange = (e) => \{\
    e.preventDefault();\
    if (e.target.files && e.target.files[0]) \{\
      onFileSelect(e.target.files[0]);\
    \}\
  \};\
\
  return (\
    <div\
      className=\{`border-2 border-dashed rounded-lg p-6 text-center $\{\
        dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300"\
      \}`\}\
      onDragEnter=\{handleDrag\}\
      onDragLeave=\{handleDrag\}\
      onDragOver=\{handleDrag\}\
      onDrop=\{handleDrop\}\
    >\
      <input\
        type="file"\
        id="file-upload"\
        accept="image/jpeg,image/png"\
        className="hidden"\
        onChange=\{handleChange\}\
      />\
      <label htmlFor="file-upload" className="cursor-pointer">\
        <div className="flex flex-col items-center gap-3">\
          <Upload className="w-8 h-8 text-blue-500" />\
          <p className="text-lg text-slate-600">\uc0\u40670 \u25802 \u25110 \u25302 \u25918 \u22294 \u29255 \u21040 \u36889 \u35041 </p>\
          <p className="text-sm text-slate-500">\uc0\u25903 \u25588  JPG\u12289 PNG\u65292 \u26368 \u22823  5MB</p>\
        </div>\
      </label>\
    </div>\
  );\
\}}
