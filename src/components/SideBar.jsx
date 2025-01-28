import React from "react";

const Sidebar = () => {
  const items = ["Home", "About", "Services", "Contact"]; // Example items for the sidebar

  return (
    <div className="sidebar bg-light p-3" style={{ height: "100vh", width: "250px" }}>
      <h4 className="mb-4">Sidebar</h4>
      <ul className="list-unstyled">
        {items.map((item, index) => (
          <li key={index} className="mb-2">
            <a href="#" className="text-decoration-none text-dark">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
