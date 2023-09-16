import "./Progress.css";

const Progress = ({ percent }) => {
  return (
    <div className="progress-container">
      <div className="progress" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default Progress;
