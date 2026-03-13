import UploadArea from "../UploadArea";

export default function UploadAreaExample() {
  return (
    <UploadArea
      onFilesSelect={(files) => console.log("Files selected:", files)}
      maxFiles={5}
    />
  );
}
