import ImagePreview, { type ImagePreviewItem } from "../ImagePreview";

const mockImages: ImagePreviewItem[] = [
  {
    id: "1",
    file: new File([], "photo1.jpg"),
    preview: "https://picsum.photos/seed/1/400/300",
    isLandscape: true,
  },
  {
    id: "2",
    file: new File([], "photo2.jpg"),
    preview: "https://picsum.photos/seed/2/300/400",
    isLandscape: false,
  },
  {
    id: "3",
    file: new File([], "photo3.jpg"),
    preview: "https://picsum.photos/seed/3/400/400",
    isLandscape: true,
  },
];

export default function ImagePreviewExample() {
  return (
    <ImagePreview
      images={mockImages}
      onRemove={(id) => console.log("Remove image:", id)}
    />
  );
}
