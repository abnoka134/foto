import { useState, useEffect, useCallback } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import UploadArea from "@/components/UploadArea";
import ImagePreview, { type ImagePreviewItem } from "@/components/ImagePreview";
import WatermarkForm, { type WatermarkData } from "@/components/WatermarkForm";
import ProcessingProgress from "@/components/ProcessingProgress";
import ActionButtons from "@/components/ActionButtons";
import ProcessedImageList, { type ProcessedImage } from "@/components/ProcessedImageList";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import {
  loadImageFile,
  applyWatermark,
  downloadImage,
  downloadAllAsZip,
  getDayName,
  getLocationFromCoords,
  formatDateToDDMMYY,
} from "@/lib/watermark";

export default function Home() {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<ImagePreviewItem[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProcessing, setCurrentProcessing] = useState(0);
  const [watermarkData, setWatermarkData] = useState<WatermarkData>({
    date: formatDateToDDMMYY(new Date()),
    time: new Date().toTimeString().slice(0, 5),
    day: getDayName(new Date().getDay()),
    location: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = await getLocationFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setWatermarkData((prev) => ({ ...prev, location }));
        },
        () => {
          setWatermarkData((prev) => ({
            ...prev,
            location: "Hà Nội, Việt Nam",
          }));
        }
      );
    }
  }, []);

  const handleFilesSelect = useCallback(async (files: File[]) => {
    const newImages: ImagePreviewItem[] = [];

    for (const file of files) {
      try {
        const { image, isLandscape } = await loadImageFile(file);
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          preview: image.src,
          isLandscape,
        });
      } catch (error) {
        console.error("Error loading image:", error);
      }
    }

    setSelectedImages(newImages);
    setProcessedImages([]);
    setProgress(0);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setSelectedImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleProcess = useCallback(async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setCurrentProcessing(0);
    setProcessedImages([]);

    const processed: ProcessedImage[] = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const imageItem = selectedImages[i];
      setCurrentProcessing(i + 1);

      try {
        const { image, isLandscape } = await loadImageFile(imageItem.file);
        const dataUrl = await applyWatermark(image, isLandscape, {
          watermarkData,
        });

        processed.push({
          id: imageItem.id,
          originalName: imageItem.file.name.replace(/\.[^/.]+$/, "") + "_watermark.jpg",
          dataUrl,
        });

        setProgress(((i + 1) / selectedImages.length) * 100);
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Lỗi",
          description: `Không thể xử lý ảnh: ${imageItem.file.name}`,
          variant: "destructive",
        });
      }
    }

    setProcessedImages(processed);
    setIsProcessing(false);

    if (processed.length > 0) {
      toast({
        title: "Hoàn thành!",
        description: `Đã xử lý ${processed.length} ảnh thành công.`,
      });
    }
  }, [selectedImages, watermarkData, toast]);

  const handleDownloadSingle = useCallback((image: ProcessedImage) => {
    downloadImage(image.dataUrl, image.originalName);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (processedImages.length === 0) return;

    try {
      await downloadAllAsZip(
        processedImages.map((img) => ({
          dataUrl: img.dataUrl,
          filename: img.originalName,
        }))
      );
      toast({
        title: "Đã tải xuống",
        description: "File ZIP đã được tải về.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo file ZIP.",
        variant: "destructive",
      });
    }
  }, [processedImages, toast]);

  const canProcess = selectedImages.length > 0 && !isProcessing;
  const canDownload = processedImages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-600 to-purple-800 p-4 md:p-6">
      <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: 0, visibility: "hidden", position: "absolute" }}>
        Font preload
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Camera className="w-8 h-8 text-primary" />
                <h1
                  className="text-3xl md:text-4xl font-display tracking-wide text-foreground"
                  data-testid="text-title"
                >
                  Photo Watermark
                </h1>
              </div>
            </div>

            <DisclaimerBanner />

            {selectedImages.length === 0 ? (
              <UploadArea onFilesSelect={handleFilesSelect} maxFiles={5} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedImages.length} ảnh đã chọn
                  </span>
                  <button
                    onClick={() => setSelectedImages([])}
                    className="text-sm text-primary hover:underline"
                    data-testid="button-clear-images"
                  >
                    Chọn lại
                  </button>
                </div>
                <ImagePreview
                  images={selectedImages}
                  onRemove={handleRemoveImage}
                />
              </div>
            )}

            <WatermarkForm
              data={watermarkData}
              onChange={setWatermarkData}
              disabled={isProcessing}
            />

            <ProcessingProgress
              progress={progress}
              isVisible={isProcessing}
              current={currentProcessing}
              total={selectedImages.length}
            />

            <ActionButtons
              onProcess={handleProcess}
              onDownloadAll={handleDownloadAll}
              canProcess={canProcess}
              canDownload={canDownload}
              isProcessing={isProcessing}
            />

            <ProcessedImageList
              images={processedImages}
              onDownload={handleDownloadSingle}
            />
          </CardContent>
        </Card>

        <p className="text-center text-white/60 text-xs mt-4">
          Xử lý hoàn toàn trên thiết bị của bạn. Ảnh không được tải lên máy chủ.
        </p>
      </div>
    </div>
  );
}
