import ActionButtons from "../ActionButtons";

export default function ActionButtonsExample() {
  return (
    <ActionButtons
      onProcess={() => console.log("Process clicked")}
      onDownloadAll={() => console.log("Download all clicked")}
      canProcess={true}
      canDownload={true}
      isProcessing={false}
    />
  );
}
