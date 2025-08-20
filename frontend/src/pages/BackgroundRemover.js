{\rtf1\ansi\ansicpg950\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React, \{ useState, useRef \} from "react";\
import \{ ProcessedImage \} from "@/entities/ProcessedImage";\
import \{ UploadFile, RemoveImageBackground \} from "@/integrations/Core";\
import \{ Button \} from "@/components/ui/button";\
import \{ Card, CardContent, CardHeader, CardTitle \} from "@/components/ui/card";\
import \{ Progress \} from "@/components/ui/progress";\
import \{ Badge \} from "@/components/ui/badge";\
import \{ AlertCircle, Upload, Download, Scissors, Sparkles, Check, X \} from "lucide-react";\
import \{ Alert, AlertDescription \} from "@/components/ui/alert";\
import \{ motion, AnimatePresence \} from "framer-motion";\
\
import ImageUploadZone from "../components/background-remover/ImageUploadZone";\
import ProcessingStatus from "../components/background-remover/ProcessingStatus";\
import ImagePreview from "../components/background-remover/ImagePreview";\
\
export default function BackgroundRemoverPage() \{\
  const [selectedFile, setSelectedFile] = useState(null);\
  const [previewUrl, setPreviewUrl] = useState(null);\
  const [processedImage, setProcessedImage] = useState(null);\
  const [isProcessing, setIsProcessing] = useState(false);\
  const [processingStep, setProcessingStep] = useState("");\
  const [progress, setProgress] = useState(0);\
  const [error, setError] = useState(null);\
  const [dragActive, setDragActive] = useState(false);\
  const fileInputRef = useRef(null);\
\
  const handleFileSelect = (file) => \{\
    if (!file) return;\
\
    if (file.size > 5 * 1024 * 1024) \{\
      setError("\uc0\u27284 \u26696 \u22823 \u23567 \u19981 \u33021 \u36229 \u36942  5MB");\
      return;\
    \}\
\
    if (!file.type.match(/^image\\/(jpeg|jpg|png)$/)) \{\
      setError("\uc0\u35531 \u19978 \u20659  JPG \u25110  PNG \u26684 \u24335 \u30340 \u22294 \u29255 ");\
      return;\
    \}\
\
    setError(null);\
    setSelectedFile(file);\
    setProcessedImage(null);\
\
    const reader = new FileReader();\
    reader.onload = (e) => setPreviewUrl(e.target.result);\
    reader.readAsDataURL(file);\
  \};\
\
  const simulateProgress = (startValue, endValue, duration, callback) => \{\
    const startTime = Date.now();\
    const interval = setInterval(() => \{\
      const elapsed = Date.now() - startTime;\
      const progressPercent = Math.min(elapsed / duration, 1);\
      const currentValue = startValue + (endValue - startValue) * progressPercent;\
\
      setProgress(currentValue);\
\
      if (progressPercent >= 1) \{\
        clearInterval(interval);\
        if (callback) callback();\
      \}\
    \}, 50);\
    return interval;\
  \};\
\
  const processImage = async () => \{\
    if (!selectedFile) \{\
      setError("\uc0\u35531 \u20808 \u36984 \u25799 \u22294 \u29255 ");\
      return;\
    \}\
\
    setIsProcessing(true);\
    setProgress(0);\
    setError(null);\
    setProcessedImage(null);\
\
    try \{\
      setProcessingStep("\uc0\u27493 \u39519  1/3\u65306 \u27491 \u22312 \u19978 \u20659 \u22294 \u29255 ...");\
      simulateProgress(0, 30, 1000);\
      const uploadResult = await UploadFile(\{ file: selectedFile \});\
      if (!uploadResult || !uploadResult.file_url) \{\
        throw new Error("\uc0\u22294 \u29255 \u19978 \u20659 \u22833 \u25943 \u65292 \u35531 \u27298 \u26597 \u32178 \u36335 \u12290 ");\
      \}\
\
      setProcessingStep("\uc0\u27493 \u39519  2/3\u65306 AI \u27491 \u22312 \u31227 \u38500 \u32972 \u26223 ...");\
      simulateProgress(30, 80, 3000);\
      const removeResult = await RemoveImageBackground(\{ image_url: uploadResult.file_url \});\
      if (!removeResult || !removeResult.processed_image_url) \{\
        throw new Error("AI \uc0\u21435 \u32972 \u22833 \u25943 \u65292 \u35531 \u37325 \u35430 \u12290 ");\
      \}\
\
      setProcessingStep("\uc0\u27493 \u39519  3/3\u65306 \u27491 \u22312 \u28310 \u20633 \u36879 \u26126  PNG...");\
      simulateProgress(80, 100, 1000);\
\
      const img = new Image();\
      img.src = removeResult.processed_image_url;\
      await new Promise((resolve) => \{ img.onload = resolve; \});\
\
      const processedResult = await ProcessedImage.create(\{\
        original_filename: selectedFile.name,\
        original_url: uploadResult.file_url,\
        processed_url: removeResult.processed_image_url,\
        file_size: selectedFile.size,\
        processing_status: "completed",\
        processing_time: 4.5,\
        image_width: img.width,\
        image_height: img.height\
      \});\
\
      setProcessedImage(processedResult);\
      setProcessingStep("\uc0\u34389 \u29702 \u23436 \u25104 \u65281 ");\
    \} catch (error) \{\
      setError(error.message || "\uc0\u34389 \u29702 \u22833 \u25943 \u65292 \u35531 \u37325 \u35430 \u12290 ");\
      setProcessingStep("\uc0\u34389 \u29702 \u22833 \u25943 ");\
    \}\
\
    setIsProcessing(false);\
  \};\
\
  const downloadResult = () => \{\
    if (processedImage?.processed_url) \{\
      const link = document.createElement('a');\
      link.href = processedImage.processed_url;\
      link.download = `$\{processedImage.original_filename.split('.')[0]\}_\uc0\u28961 \u32972 \u26223 .png`;\
      document.body.appendChild(link);\
      link.click();\
      document.body.removeChild(link);\
    \} else \{\
      setError("\uc0\u27794 \u26377 \u21487 \u19979 \u36617 \u30340 \u22294 \u29255 \u65292 \u35531 \u37325 \u26032 \u34389 \u29702 \u12290 ");\
    \}\
  \};\
\
  const resetProcessor = () => \{\
    setSelectedFile(null);\
    setPreviewUrl(null);\
    setProcessedImage(null);\
    setIsProcessing(false);\
    setProcessingStep("");\
    setProgress(0);\
    setError(null);\
  \};\
\
  return (\
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">\
      <div className="max-w-6xl mx-auto">\
        <motion.div \
          initial=\{\{ opacity: 0, y: -20 \}\}\
          animate=\{\{ opacity: 1, y: 0 \}\}\
          className="text-center mb-12"\
        >\
          <div className="flex items-center justify-center gap-3 mb-4">\
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">\
              <Scissors className="w-8 h-8 text-white" />\
            </div>\
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">\
              AI \uc0\u32972 \u26223 \u31227 \u38500 \u24037 \u20855 \
            </h1>\
          </div>\
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">\
            \uc0\u19968 \u37749 \u31227 \u38500 \u22294 \u29255 \u32972 \u26223 \u65292 \u36664 \u20986 \u36879 \u26126  PNG\u65292 \u36229 \u31777 \u21934 \u65281 \
          </p>\
        </motion.div>\
\
        \{error && (\
          <motion.div\
            initial=\{\{ opacity: 0, scale: 0.95 \}\}\
            animate=\{\{ opacity: 1, scale: 1 \}\}\
            className="mb-6"\
          >\
            <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">\
              <AlertCircle className="h-4 w-4" />\
              <AlertDescription className="text-red-700 font-medium">\{error\}</AlertDescription>\
            </Alert>\
          </motion.div>\
        )\}\
\
        <div className="grid lg:grid-cols-2 gap-8">\
          <motion.div\
            initial=\{\{ opacity: 0, x: -20 \}\}\
            animate=\{\{ opacity: 1, x: 0 \}\}\
            transition=\{\{ delay: 0.1 \}\}\
          >\
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">\
              <CardHeader className="text-center pb-4">\
                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-800">\
                  <Upload className="w-6 h-6 text-blue-500" />\
                  \uc0\u19978 \u20659 \u22294 \u29255 \
                </CardTitle>\
                <p className="text-slate-600">\uc0\u25903 \u25588  JPG\u12289 PNG\u65292 \u26368 \u22823  5MB</p>\
              </CardHeader>\
              <CardContent>\
                \{!selectedFile ? (\
                  <ImageUploadZone \
                    onFileSelect=\{handleFileSelect\}\
                    dragActive=\{dragActive\}\
                    setDragActive=\{setDragActive\}\
                  />\
                ) : (\
                  <div className="space-y-6">\
                    <ImagePreview \
                      file=\{selectedFile\}\
                      previewUrl=\{previewUrl\}\
                      onRemove=\{resetProcessor\}\
                    />\
                    \
                    \{!isProcessing && !processedImage && (\
                      <Button \
                        onClick=\{processImage\}\
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"\
                      >\
                        <Sparkles className="w-5 h-5 mr-2" />\
                        \uc0\u38283 \u22987  AI \u21435 \u32972 \
                      </Button>\
                    )\}\
                  </div>\
                )\}\
              </CardContent>\
            </Card>\
          </motion.div>\
\
          <motion.div\
            initial=\{\{ opacity: 0, x: 20 \}\}\
            animate=\{\{ opacity: 1, x: 0 \}\}\
            transition=\{\{ delay: 0.2 \}\}\
            className="space-y-6"\
          >\
            <AnimatePresence mode="wait">\
              \{isProcessing && (\
                <ProcessingStatus \
                  step=\{processingStep\}\
                  progress=\{progress\}\
                />\
              )\}\
              \
              \{processedImage && (\
                <motion.div\
                  initial=\{\{ opacity: 0, y: 20 \}\}\
                  animate=\{\{ opacity: 1, y: 0 \}\}\
                >\
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">\
                    <CardHeader>\
                      <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">\
                        <Check className="w-6 h-6 text-green-500" />\
                        \uc0\u34389 \u29702 \u23436 \u25104 \
                      </CardTitle>\
                    </CardHeader>\
                    <CardContent className="space-y-6">\
                      <div className="relative">\
                        <img \
                          src=\{processedImage.processed_url\}\
                          alt="\uc0\u21435 \u32972 \u32080 \u26524 "\
                          className="w-full rounded-xl shadow-lg border border-slate-200"\
                          style=\{\{ background: 'url("data:image/svg+xml,%3csvg width=\\'20\\' height=\\'20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3e%3cdefs%3e%3cpattern id=\\'a\\' width=\\'20\\' height=\\'20\\' patternUnits=\\'userSpaceOnUse\\'%3e%3crect fill=\\'%23f1f5f9\\' width=\\'10\\' height=\\'10\\'/%3e%3crect fill=\\'%23e2e8f0\\' x=\\'10\\' width=\\'10\\' height=\\'10\\'/%3e%3crect fill=\\'%23e2e8f0\\' y=\\'10\\' width=\\'10\\' height=\\'10\\'/%3e%3crect fill=\\'%23f1f5f9\\' x=\\'10\\' y=\\'10\\' width=\\'10\\' height=\\'10\\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'url(%23a)\\'/%3e%3c/svg%3e")' \}\}\
                        />\
                        <Badge className="absolute top-4 right-4 bg-green-500/90 text-white font-semibold px-3 py-1">\
                          \uc0\u36879 \u26126  PNG\
                        </Badge>\
                      </div>\
\
                      <div className="grid grid-cols-2 gap-4 text-sm">\
                        <div className="bg-slate-50 rounded-lg p-3">\
                          <span className="text-slate-500">\uc0\u34389 \u29702 \u26178 \u38291 </span>\
                          <div className="font-semibold text-slate-800">\
                            \{processedImage.processing_time?.toFixed(1)\}\uc0\u31186 \
                          </div>\
                        </div>\
                        <div className="bg-slate-50 rounded-lg p-3">\
                          <span className="text-slate-500">\uc0\u22294 \u29255 \u23610 \u23544 </span>\
                          <div className="font-semibold text-slate-800">\
                            \{processedImage.image_width\} \'d7 \{processedImage.image_height\}\
                          </div>\
                        </div>\
                      </div>\
\
                      <div className="flex gap-3">\
                        <Button \
                          onClick=\{downloadResult\}\
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"\
                        >\
                          <Download className="w-5 h-5 mr-2" />\
                          \uc0\u19979 \u36617 \u36879 \u26126  PNG\
                        </Button>\
                        <Button \
                          onClick=\{resetProcessor\}\
                          variant="outline"\
                          className="px-6 border-slate-300 hover:bg-slate-50"\
                        >\
                          \uc0\u20877 \u35430 \u19968 \u24373 \
                        </Button>\
                      </div>\
                    </CardContent>\
                  </Card>\
                </motion.div>\
              )\}\
            </AnimatePresence>\
          </motion.div>\
        </div>\
      </div>\
    </div>\
  );\
\}}
