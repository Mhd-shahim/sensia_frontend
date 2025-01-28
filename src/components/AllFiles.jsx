import React from "react"
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react";
import axios from "axios";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { use } from "react";



const CardList = () => {

  const [fileName, setFileName] = useState(""); // For storing the custom file name
  const [file, setFile] = useState(null); // For storing the uploaded file
  const [uploadStatus, setUploadStatus] = useState(""); // For storing the upload status message
  const [jsonData, setJsonData] = useState(null); // For storing the converted JSON data

    // Handle file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle file name input
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", fileName);

    try {
      setUploadStatus("Uploading...");
      // Send file to backend (replace with your actual API endpoint)
      const response = await axios.post("http://localhost:8000/file/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Assuming the backend sends back the converted JSON data
      setJsonData(response.data);
      setUploadStatus("File uploaded successfully!");
      handleClose();
      fetchExcelFiles();
    } catch (error) {
      setUploadStatus("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [excelFile, setExcelFiles] = useState([])

// Replace with your API endpoint
const fetchExcelFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/excel-files/');  // Adjust the URL as needed
      setExcelFiles(response.data);  // Set the data received from the API
    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExcelFiles();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <h3 className="">All Clients</h3>
        <div className="mb-3">
        <button className="btn btn-primary" onClick={handleShow}>Upload Client Data</button>
        </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Upload File</Modal.Title>
            </Modal.Header>
            <Modal.Body>    

            <FloatingLabel
                controlId="floatingInput"
                label="Name"
                className="mb-3"
                value={fileName}
                 onChange={handleFileNameChange}
            >
                <Form.Control type="text" placeholder="name@example.com" />
            </FloatingLabel>

        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />


      {uploadStatus && <p>{uploadStatus}</p>}

            </Modal.Body>
            <Modal.Footer>

            <Button variant="primary" onClick={handleFileUpload}>
                Submit
            </Button>
            </Modal.Footer>
        </Modal>

        {excelFile.map((name, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={index}>
           <Link to={`/file/${name.name}/${name.id}`}>
            <div className="card shadow-sm h-100">
                <div className="card-body">
                <h5 className="card-title text-center">{name.name}</h5>
                </div>
            </div>
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;
