import React from "react";

const SearhBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      name="search"
      className="form-control"
      placeholder="Search..."
      value={value}
      onChange={e => onChange(e.currentTarget.value)}
    />
  );
};

export default SearhBar;

