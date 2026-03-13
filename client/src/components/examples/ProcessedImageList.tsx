import ProcessedImageList, { type ProcessedImage } from "../ProcessedImageList";

const mockProcessedImages: ProcessedImage[] = [
  {
    id: "1",
    originalName: "vacation_photo.jpg",
    dataUrl: "https://picsum.photos/seed/proc1/800/600",
  },
  {
    id: "2",
    originalName: "family_portrait.jpg",
    dataUrl: "https://picsum.photos/seed/proc2/600/800",
  },
];

export default function ProcessedImageListExample() {
  return (
    <ProcessedImageList
      images={mockProcessedImages}
      onDownload={(img) => console.log("Download:", img.originalName)}
    />
  );
}
