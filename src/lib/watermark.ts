import Pica from "pica";
import JSZip from "jszip";
import type { WatermarkData } from "@/components/WatermarkForm";
import logoPath from "@assets/logo_1764528864504.png";

const pica = new Pica();

interface WatermarkOptions {
  watermarkData: WatermarkData;
  quality?: number;
}

function getMonthName(monthIndex: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months[monthIndex];
}

export function formatDateToDDMMYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} Tháng ${month}, ${year}`;
}

export function parseDateFromDDMMYY(dateStr: string): Date {
  const match = dateStr.match(/(\d+)\s+Tháng\s+(\d+),\s+(\d+)/);
  if (!match) return new Date();
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);
  return new Date(year, month, day);
}

export async function loadImageFile(file: File): Promise<{
  image: HTMLImageElement;
  isLandscape: boolean;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const isLandscape = img.width >= img.height;
      resolve({ image: img, isLandscape });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCondensedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  condenseFactor: number = 0.85,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(condenseFactor, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export async function applyWatermark(
  image: HTMLImageElement,
  isLandscape: boolean,
  options: WatermarkOptions,
): Promise<string> {
  const { watermarkData, quality = 0.92 } = options;

  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = logoPath;
    });
  } catch {
    // Logo loading failed, continue without it
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const baseSize = Math.min(image.width, image.height);
  const scaleFactor = baseSize / 1000;
  const padding = 40 * scaleFactor;

  const timeFontSize = Math.round(130 * scaleFactor);
  const dateFontSize = Math.round(40 * scaleFactor);
  const dayFontSize = Math.round(40 * scaleFactor);
  const locationFontSize = Math.round(40 * scaleFactor);

  // Wait for fonts at correct sizes before any measureText calls
  try {
    await Promise.all([
      document.fonts.load(`700 ${timeFontSize}px "Big Shoulders Display"`),
      document.fonts.load(`${dateFontSize}px "Roboto"`),
      document.fonts.load(`500 30px "RobotoMedium"`),
      document.fonts.load(`100 20px "Roboto Condensed"`),
    ]);
    await document.fonts.ready;
  } catch {
    // Font loading failed, will use fallback
  }
  await new Promise((resolve) => setTimeout(resolve, 300));

  function drawWrappedCondensedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    scaleX: number,
    maxWidth: number,
    lineHeight: number,
  ): number {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any existing transform
    ctx.scale(scaleX, 1);
    const scaledMaxWidth = maxWidth / scaleX;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > scaledMaxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x / scaleX, y + i * lineHeight);
    }
    ctx.restore();

    return lines.length * lineHeight;
  }

  function countWrappedLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    scaleX: number,
    maxWidth: number,
  ): number {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any existing transform
    ctx.scale(scaleX, 1);
    const scaledMaxWidth = maxWidth / scaleX;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > scaledMaxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    ctx.restore();
    return lines.length;
  }

  const locationLineHeight = locationFontSize * 1.2;
  const maxLocationWidth = image.width * 0.7;

  // Pre-calculate location line count to adjust layout
  ctx.font = `${locationFontSize}px 'Roboto', sans-serif`;
  const locationLineCount = countWrappedLines(
    ctx,
    watermarkData.location,
    0.85,
    maxLocationWidth,
  );
  const extraLocationHeight = (locationLineCount - 1) * locationLineHeight;

  ctx.font = `700 ${timeFontSize}px 'Big Shoulders Display', sans-serif`;
  const timeWidth = ctx.measureText(watermarkData.time).width;

  ctx.font = `${dateFontSize}px 'Roboto', sans-serif`;
  const dateText = watermarkData.date;
  const dateWidth = ctx.measureText(dateText).width * 0.85;

  ctx.font = `${dayFontSize}px 'Roboto', sans-serif`;
  const dayWidth = ctx.measureText(watermarkData.day).width * 0.85;

  const dividerWidth = 5 * scaleFactor;
  const dividerMargin = 20 * scaleFactor;
  const rightSideWidth = Math.max(dateWidth, dayWidth);
  const boxWidth =
    timeWidth +
    dividerMargin +
    dividerWidth +
    dividerMargin +
    rightSideWidth +
    padding * 2;
  const boxHeight =
    timeFontSize + locationFontSize + extraLocationHeight + 30 * scaleFactor;

  const boxX = padding;
  const boxY =
    image.height -
    padding -
    timeFontSize -
    locationFontSize +
    10 * scaleFactor -
    extraLocationHeight;

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const timeX = boxX;
  const timeY = boxY + timeFontSize / 2 - 10 * scaleFactor;

  ctx.font = `700 ${timeFontSize}px 'Big Shoulders Display', sans-serif`;
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 5 * scaleFactor;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2 * scaleFactor;
  ctx.strokeText(watermarkData.time, timeX, timeY);
  ctx.fillStyle = "white";
  ctx.fillText(watermarkData.time, timeX, timeY);
  ctx.shadowColor = "transparent";

  const dividerX = timeX + timeWidth + dividerMargin;
  const dividerHeight = timeFontSize * 0.85;
  const dividerY = timeY - dividerHeight / 2 - 6 * scaleFactor;
  ctx.fillStyle = "#fdc630";
  ctx.fillRect(dividerX, dividerY, dividerWidth, dividerHeight);

  const rightX = dividerX + dividerWidth + dividerMargin;
  ctx.fillStyle = "white";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 8 * scaleFactor;
  ctx.shadowOffsetX = 3 * scaleFactor;
  ctx.shadowOffsetY = 3 * scaleFactor;

  ctx.font = `${dateFontSize}px 'Roboto', sans-serif`;
  drawCondensedText(ctx, dateText, rightX, dividerY + dateFontSize / 2, 0.85);

  ctx.font = `${dayFontSize}px 'Roboto', sans-serif`;
  drawCondensedText(
    ctx,
    watermarkData.day,
    rightX,
    dividerY + dividerHeight - dayFontSize / 2,
    0.85,
  );

  // Location — anchored just below the time/date block
  const locationY = boxY + timeFontSize + 16 * scaleFactor;

  ctx.font = `${locationFontSize}px 'Roboto', sans-serif`;
  drawWrappedCondensedText(
    ctx,
    watermarkData.location,
    boxX + 10 * scaleFactor,
    locationY,
    0.85,
    maxLocationWidth,
    locationLineHeight,
  );

  ctx.shadowColor = "transparent";

  // Bottom right Timemark branding
  const brandFontSize: number = 30;
  const subTextFontSize: number = 20;
  ctx.font = `500 ${brandFontSize}px 'RobotoMedium', sans-serif`;

  const timeText: string = "Time";
  const markText: string = "mark";
  const timeTextWidth: number = ctx.measureText(timeText).width;
  const markTextWidth: number = ctx.measureText(markText).width;
  const totalBrandWidth: number = timeTextWidth + markTextWidth;

  const brandY: number = image.height - padding - subTextFontSize - 8;
  const brandStartX: number = image.width - padding - totalBrandWidth;

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffc02d";
  ctx.fillText(timeText, brandStartX, brandY);

  ctx.fillStyle = "white";
  ctx.fillText(markText, brandStartX + timeTextWidth, brandY);

  ctx.font = `100 ${subTextFontSize}px 'Roboto Condensed', sans-serif`;
  const subText: string = "100% Chân thực";
  const subTextWidth: number = ctx.measureText(subText).width;

  const extraSpace: number = totalBrandWidth - subTextWidth;
  const letterSpacing: number = extraSpace / (subText.length - 1);

  ctx.fillStyle = "white";
  let currentX: number = brandStartX;
  for (const char of subText) {
    ctx.fillText(char, currentX, brandY + brandFontSize);
    currentX += ctx.measureText(char).width + letterSpacing;
  }

  ctx.shadowColor = "transparent";

  return canvas.toDataURL("image/jpeg", quality);
}

export async function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadAllAsZip(
  images: { dataUrl: string; filename: string }[],
): Promise<void> {
  const zip = new JSZip();

  for (const image of images) {
    const base64Data = image.dataUrl.split(",")[1];
    zip.file(image.filename, base64Data, { base64: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "watermarked_images.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getDayName(dayIndex: number): string {
  const days = [
    "Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư",
    "Thứ Năm", "Thứ Sáu", "Thứ Bảy",
  ];
  return days[dayIndex];
}

export async function getLocationFromCoords(
  lat: number,
  lon: number,
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=vi`,
    );
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}
