import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileComponent from './components/SingleFile'
import 'bootstrap/dist/css/bootstrap.min.css';
import AllFile from './components/AllFiles'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllFile />} />
        <Route path="/file/:name/:id" element={<FileComponent />} />
      </Routes>
    </Router>
  )
}

export default App
