import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProcessedImage {
  id: string;
  originalName: string;
  dataUrl: string;
}

interface ProcessedImageListProps {
  images: ProcessedImage[];
  onDownload: (image: ProcessedImage) => void;
}

export default function ProcessedImageList({
  images,
  onDownload,
}: ProcessedImageListProps) {
  if (images.length === 0) return null;

  return (
    <div className="w-full space-y-4" data-testid="processed-image-list">
      <h3 className="text-lg font-medium text-foreground">Ảnh đã xử lý</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group rounded-lg overflow-hidden border border-border bg-card"
            data-testid={`processed-image-${image.id}`}
          >
            <img
              src={image.dataUrl}
              alt={image.originalName}
              className="w-full aspect-video object-contain bg-black/5"
            />
            <div className="p-3 flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground truncate flex-1">
                {image.originalName}
              </span>
              <Button
                size="sm"
                onClick={() => onDownload(image)}
                data-testid={`button-download-${image.id}`}
              >
                <Download className="w-4 h-4 mr-1" />
                Tải về
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
