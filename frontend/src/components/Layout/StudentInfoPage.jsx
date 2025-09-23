import React, { useState } from "react";
import PDF from "./PDF"; // Import your PDF component

function StudentInfoPage() {
  const [studentId, setStudentId] = useState("");
  const [showPDF, setShowPDF] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId) {
      setShowPDF(true);
    } else {
      alert("Please enter a Student ID");
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Information PDF Generator</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2 items-center">
          <label htmlFor="studentId" className="font-medium">
            Student ID:
          </label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Load Student Data
          </button>
        </div>
      </form>
      
      {showPDF && (
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">PDF Generator</h2>
          <PDF studentId={studentId} />
        </div>
      )}
    </div>
  );
}

export default StudentInfoPage;