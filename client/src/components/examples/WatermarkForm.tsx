import { useState } from "react";
import WatermarkForm, { type WatermarkData } from "../WatermarkForm";
import { formatDateToDDMMYY } from "@/lib/watermark";

export default function WatermarkFormExample() {
  const [data, setData] = useState<WatermarkData>({
    date: formatDateToDDMMYY(new Date()),
    time: "09:30",
    day: "Thứ Hai",
    location: "Hà Nội, Việt Nam",
  });

  return <WatermarkForm data={data} onChange={setData} />;
}
