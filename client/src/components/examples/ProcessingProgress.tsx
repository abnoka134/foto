import ProcessingProgress from "../ProcessingProgress";

export default function ProcessingProgressExample() {
  return (
    <ProcessingProgress progress={65} isVisible={true} current={2} total={3} />
  );
}
