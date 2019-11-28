import React from "react";

const Listgroup = ({
  items,
  valueProperty,
  textProperty,
  onItemSelect,
  selectedItem
}) => {
  return (
    <ul className="list-group">
      {items.map(item => (
        <li
          key={item[valueProperty]}
          className={
            selectedItem === item ? "list-group-item active" : "list-group-item"
          }
          onClick={() => onItemSelect(item)}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

Listgroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id"
};

export default Listgroup;
