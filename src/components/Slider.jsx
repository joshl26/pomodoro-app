import "./Slider.css";

export default function Slider({ value, onChange, onClick }) {
  return (
    <div className="container">
      {/* <span className="label">{value}</span> */}
      <input
        value={value}
        onChange={onChange}
        onClick={onClick}
        type="range"
        step="5"
        min={0}
        max={100}
        className="input"
      />
    </div>
  );
}
