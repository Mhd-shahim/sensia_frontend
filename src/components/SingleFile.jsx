import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const TablePage = () => {
  const { id, name } = useParams(); // Retrieve 'id' and 'name' from the URL
  const [excelFile, setExcelFiles] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null); // For error handling
  const [currentPage, setCurrentPage] = useState(1); // For current page tracking
  const itemsPerPage = 10; // Number of items per page

  // Calculate total pages
  const totalPages = Math.ceil(excelFile.length / itemsPerPage);

  // Fetch data from the server
  useEffect(() => {
    const fetchExcelFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get-excel/${id}`); // Adjust the URL as needed
        console.log(response.data); // Log the response to verify its structure

        if (Array.isArray(response.data.data)) {
          setExcelFiles(response.data.data); // Set the data if it's an array
        } else {
          console.error("Data is not an array:", response.data);
          setError("Received data is not in the expected array format");
        }
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      }
    };

    fetchExcelFiles();
  }, [id]); // Dependency on 'id' so it refetches when the ID changes

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = excelFile.slice(indexOfFirstItem, indexOfLastItem);

  // Function to render compact pagination
  const renderPagination = () => {
    const paginationItems = [];
    const maxButtons = 5; // Maximum number of buttons to display at once

    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Add "Previous" button
    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // Add ellipsis if needed at the start
    if (startPage > 1) {
      paginationItems.push(
        <Pagination.Ellipsis key="start-ellipsis" onClick={() => handlePageChange(1)} />
      );
    }

    // Add page numbers
    for (let number = startPage; number <= endPage; number++) {
      paginationItems.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Add ellipsis if needed at the end
    if (endPage < totalPages) {
      paginationItems.push(
        <Pagination.Ellipsis key="end-ellipsis" onClick={() => handlePageChange(totalPages)} />
      );
    }

    // Add "Next" button
    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return paginationItems;
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{name}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Group code</th>
            <th>Mailing Code</th>
            <th>Mail Date</th>
            <th>Category</th>
            <th>Product</th>
            <th>Source</th>
            <th>Segment</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(excelFile) && excelFile.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.Group_Code}</td>
                <td>{item.Mailing_Code}</td>
                <td>{new Date(item.Mail_Date).toLocaleDateString()}</td>
                <td>{item.Category}</td>
                <td>{item.Product}</td>
                <td>{item.Source}</td>
                <td>{item.Segment}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Compact Pagination */}
      <Pagination>{renderPagination()}</Pagination>
    </div>
  );
};

export default TablePage;
