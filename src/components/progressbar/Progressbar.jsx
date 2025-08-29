import ProgressWrapper from "./Progressbar.style";

const Progressbar = ({ variant, done }) => {
  // Ensure minimum width for text visibility when progress > 0
  const getProgressWidth = () => {
    if (done === 0) return '0%';
    if (variant === 'green2' && done > 0 && done < 15) {
      // For green2 variant, ensure minimum 15% width for text visibility
      return '15%';
    }
    return `${done}%`;
  };

  return (
    <ProgressWrapper variant={variant}>
      <div className="progress-done" style={{ width: getProgressWidth() }}>
        {done > 0 && <p>{done}%</p>}
      </div>
    </ProgressWrapper>
  );
};

export default Progressbar;
