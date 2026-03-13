import { Calendar, Clock, FileText, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseDateFromDDMMYY, formatDateToDDMMYY, getDayName } from "@/lib/watermark";

export interface WatermarkData {
  date: string;
  time: string;
  day: string;
  location: string;
}

interface WatermarkFormProps {
  data: WatermarkData;
  onChange: (data: WatermarkData) => void;
  disabled?: boolean;
}

export default function WatermarkForm({
  data,
  onChange,
  disabled = false,
}: WatermarkFormProps) {
  const handleChange = (field: keyof WatermarkData, value: string) => {
    if (field === "date") {
      const parts = value.split("-");
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const ddmmyyFormat = formatDateToDDMMYY(dateObj);
        const newDay = getDayName(dateObj.getDay());
        onChange({ ...data, date: ddmmyyFormat, day: newDay });
      }
    } else {
      onChange({ ...data, [field]: value });
    }
  };

  const getHTMLDateFormat = (ddmmyyDate: string): string => {
    const match = ddmmyyDate.match(/(\d+)\s+Tháng\s+(\d+),\s+(\d+)/);
    if (!match) return "";
    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    const year = match[3];
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="space-y-4" data-testid="watermark-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            Ngày
          </Label>
          <Input
            id="date"
            type="date"
            value={getHTMLDateFormat(data.date)}
            onChange={(e) => handleChange("date", e.target.value)}
            disabled={disabled}
            className="h-12"
            data-testid="input-date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="flex items-center gap-2 text-sm font-medium">
            <Clock className="w-4 h-4 text-primary" />
            Giờ
          </Label>
          <Input
            id="time"
            type="time"
            value={data.time}
            onChange={(e) => handleChange("time", e.target.value)}
            disabled={disabled}
            className="h-12"
            data-testid="input-time"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="day" className="flex items-center gap-2 text-sm font-medium">
          <FileText className="w-4 h-4 text-primary" />
          Thứ
        </Label>
        <Input
          id="day"
          type="text"
          value={data.day}
          onChange={(e) => handleChange("day", e.target.value)}
          placeholder="VD: Thứ Hai"
          disabled={disabled}
          className="h-12"
          data-testid="input-day"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="w-4 h-4 text-primary" />
          Địa điểm
        </Label>
        <Input
          id="location"
          type="text"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="VD: Hà Nội, Việt Nam"
          disabled={disabled}
          className="h-12"
          data-testid="input-location"
        />
      </div>
    </div>
  );
}
