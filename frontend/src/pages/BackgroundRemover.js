import React, { useState, useRef } from "react";
import { ProcessedImage } from "@/entities/ProcessedImage";
import { UploadFile, RemoveImageBackground } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Upload, Download, Scissors, Sparkles, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

import ImageUploadZone from "../components/background-remover/ImageUploadZone";
import ProcessingStatus from "../components/background-remover/ProcessingStatus";
import ImagePreview from "../components/background-remover/ImagePreview";

export default function BackgroundRemoverPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("檔案大小不能超過 5MB");
      return;
    }

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setError("請上傳 JPG 或 PNG 格式的圖片");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setProcessedImage(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const simulateProgress = (startValue, endValue, duration, callback) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progressPercent;

      setProgress(currentValue);

      if (progressPercent >= 1) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 50);
    return interval;
  };

  const processImage = async () => {
    if (!selectedFile) {
      setError("請先選擇圖片");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setProcessedImage(null);

    try {
      setProcessingStep("步驟 1/3：正在上傳圖片...");
      simulateProgress(0, 30, 1000);
      const uploadResult = await UploadFile({ file: selectedFile });
      if (!uploadResult || !uploadResult.file_url) {
        throw new Error("圖片上傳失敗，請檢查網路。");
      }

      setProcessingStep("步驟 2/3：AI 正在移除背景...");
      simulateProgress(30, 80, 3000);
      const removeResult = await RemoveImageBackground({ image_url: uploadResult.file_url });
      if (!removeResult || !removeResult.processed_image_url) {
        throw new Error("AI 去背失敗，請重試。");
      }

      setProcessingStep("步驟 3/3：正在準備透明 PNG...");
      simulateProgress(80, 100, 1000);

      const img = new Image();
      img.src = removeResult.processed_image_url;
      await new Promise((resolve) => { img.onload = resolve; });

      const processedResult = await ProcessedImage.create({
        original_filename: selectedFile.name,
        original_url: uploadResult.file_url,
        processed_url: removeResult.processed_image_url,
        file_size: selectedFile.size,
        processing_status: "completed",
        processing_time: 4.5,
        image_width: img.width,
        image_height: img.height
      });

      setProcessedImage(processedResult);
      setProcessingStep("處理完成！");
    } catch (error) {
      setError(error.message || "處理失敗，請重試。");
      setProcessingStep("處理失敗");
    }

    setIsProcessing(false);
  };

  const downloadResult = () => {
    if (processedImage?.processed_url) {
      const link = document.createElement('a');
      link.href = processedImage.processed_url;
      link.download = `${processedImage.original_filename.split('.')[0]}_無背景.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError("沒有可下載的圖片，請重新處理。");
    }
  };

  const resetProcessor = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setIsProcessing(false);
    setProcessingStep("");
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              AI 背景移除工具
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            一鍵移除圖片背景，輸出透明 PNG，超簡單！
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-800">
                  <Upload className="w-6 h-6 text-blue-500" />
                  上傳圖片
                </CardTitle>
                <p className="text-slate-600">支援 JPG、PNG，最大 5MB</p>
              </CardHeader>
              <CardContent>
                {!selectedFile ? (
                  <ImageUploadZone 
                    onFileSelect={handleFileSelect}
                    dragActive={dragActive}
                    setDragActive={setDragActive}
                  />
                ) : (
                  <div className="space-y-6">
                    <ImagePreview 
                      file={selectedFile}
                      previewUrl={previewUrl}
                      onRemove={resetProcessor}
                    />
                    
                    {!isProcessing && !processedImage && (
                      <Button 
                        onClick={processImage}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        開始 AI 去背
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {isProcessing && (
                <ProcessingStatus 
                  step={processingStep}
                  progress={progress}
                />
              )}
              
              {processedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                        <Check className="w-6 h-6 text-green-500" />
                        處理完成
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="relative">
                        <img 
                          src={processedImage.processed_url}
                          alt="去背結果"
                          className="w-full rounded-xl shadow-lg border border-slate-200"
                          style={{ background: 'url("data:image/svg+xml,%3csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3cpattern id=\'a\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'%3e%3crect fill=\'%23f1f5f9\' width=\'10\' height=\'10\'/%3e%3crect fill=\'%23e2e8f0\' x=\'10\' width=\'10\' height=\'10\'/%3e%3crect fill=\'%23e2e8f0\' y=\'10\' width=\'10\' height=\'10\'/%3e%3crect fill=\'%23f1f5f9\' x=\'10\' y=\'10\' width=\'10\' height=\'10\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'url(%23a)\'/%3e%3c/svg%3e")' }}
                        />
                        <Badge className="absolute top-4 right-4 bg-green-500/90 text-white font-semibold px-3 py-1">
                          透明 PNG
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <span className="text-slate-500">處理時間</span>
                          <div className="font-semibold text-slate-800">
                            {processedImage.processing_time?.toFixed(1)}秒
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <span className="text-slate-500">圖片尺寸</span>
                          <div className="font-semibold text-slate-800">
                            {processedImage.image_width} × {processedImage.image_height}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={downloadResult}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          下載透明 PNG
                        </Button>
                        <Button 
                          onClick={resetProcessor}
                          variant="outline"
                          className="px-6 border-slate-300 hover:bg-slate-50"
                        >
                          再試一張
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
