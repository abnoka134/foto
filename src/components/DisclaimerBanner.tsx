import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
      data-testid="disclaimer-banner"
    >
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-700 dark:text-amber-300">
        Ứng dụng đánh dấu thời gian địa điểm, không dùng cho mục đích xấu gây
        thiệt hại đến các cá nhân tổ chức. Người dùng tự chịu trách nhiệm cho
        hành vi của mình!
      </p>
    </div>
  );
}
