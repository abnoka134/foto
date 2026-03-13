import { X, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ImagePreviewItem {
  id: string;
  file: File;
  preview: string;
  isLandscape: boolean;
}

interface ImagePreviewProps {
  images: ImagePreviewItem[];
  onRemove: (id: string) => void;
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="w-full" data-testid="image-preview-container">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
            data-testid={`image-preview-${image.id}`}
          >
            <img
              src={image.preview}
              alt={image.file.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(image.id)}
              data-testid={`button-remove-${image.id}`}
            >
              <X className="w-3 h-3" />
            </Button>
            <div className="absolute bottom-1 left-1 right-1">
              <Badge
                variant="secondary"
                className="text-[10px] bg-black/60 text-white border-0 gap-1"
              >
                <ImageIcon className="w-2.5 h-2.5" />
                {image.isLandscape ? "Ngang" : "Dọc"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
