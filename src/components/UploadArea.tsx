import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onFilesSelect: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export default function UploadArea({
  onFilesSelect,
  maxFiles = 5,
  disabled = false,
}: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const files = Array.from(e.dataTransfer.files)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, maxFiles);

      if (files.length > 0) {
        onFilesSelect(files);
      }
    },
    [disabled, maxFiles, onFilesSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || !e.target.files) return;

      const files = Array.from(e.target.files)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, maxFiles);

      if (files.length > 0) {
        onFilesSelect(files);
      }
      e.target.value = "";
    },
    [disabled, maxFiles, onFilesSelect]
  );

  return (
    <label
      data-testid="upload-area"
      className={cn(
        "relative flex flex-col items-center justify-center w-full p-12 md:p-16 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
        isDragOver
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInput}
        disabled={disabled}
        data-testid="input-file"
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          {isDragOver ? (
            <ImageIcon className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <p className="text-base font-medium text-foreground">
            Chọn tối đa {maxFiles} ảnh hoặc kéo thả vào đây
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Hỗ trợ: JPG, PNG, WEBP
          </p>
        </div>
      </div>
    </label>
  );
}
