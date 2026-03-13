import { Wand2, Download, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onProcess: () => void;
  onDownloadAll: () => void;
  canProcess: boolean;
  canDownload: boolean;
  isProcessing: boolean;
}

export default function ActionButtons({
  onProcess,
  onDownloadAll,
  canProcess,
  canDownload,
  isProcessing,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3" data-testid="action-buttons">
      <Button
        onClick={onProcess}
        disabled={!canProcess || isProcessing}
        className="w-full h-14 text-base font-medium bg-gradient-to-r from-primary to-purple-700 hover:from-primary/90 hover:to-purple-700/90"
        data-testid="button-process"
      >
        <Wand2 className="w-5 h-5 mr-2" />
        {isProcessing ? "Đang xử lý..." : "Tạo Watermark"}
      </Button>

      {canDownload && (
        <Button
          onClick={onDownloadAll}
          variant="outline"
          className="w-full h-12 text-base"
          data-testid="button-download-all"
        >
          <Package className="w-5 h-5 mr-2" />
          Tải tất cả (ZIP)
        </Button>
      )}
    </div>
  );
}
