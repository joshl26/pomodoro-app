import "./Progress.css";

const Progress = ({ percent }) => {
  return (
    <div className="container">
      <div className="progress" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default Progress;
