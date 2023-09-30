import "./Slider.css";

export default function Slider({ value, onChange, onClick }) {
  return (
    <div className="slider-container">
      {/* <span className="label">{value}</span> */}
      <input
        value={value}
        onChange={onChange}
        onClick={onClick}
        type="range"
        step={0.05}
        min={0}
        max={1}
        className="input"
      />
    </div>
  );
}
