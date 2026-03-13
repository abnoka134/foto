import { Progress } from "@/components/ui/progress";

interface ProcessingProgressProps {
  progress: number;
  isVisible: boolean;
  current?: number;
  total?: number;
}

export default function ProcessingProgress({
  progress,
  isVisible,
  current,
  total,
}: ProcessingProgressProps) {
  if (!isVisible) return null;

  return (
    <div className="w-full space-y-2" data-testid="processing-progress">
      <Progress value={progress} className="h-2" />
      {current !== undefined && total !== undefined && (
        <p className="text-xs text-center text-muted-foreground">
          Đang xử lý ảnh {current} / {total}
        </p>
      )}
    </div>
  );
}
