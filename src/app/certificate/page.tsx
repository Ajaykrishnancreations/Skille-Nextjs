"use client"
import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const handleGenerateCertificate = async () => {
    try {
      const existingPdfBytes = await fetch('/certificate.pdf').then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const page = pdfDoc.getPage(0);
      const nameX = 100;
      const nameY = 255;
      const dobX = 140;
      const dobY = 60;
      const textColor = rgb(90 / 255, 90 / 255, 90 / 255);
      page.drawText(`${name}`, { x: nameX, y: nameY, color: textColor, size: 24 });
      page.drawText(`${dob}`, { x: dobX, y: dobY, color: textColor, size: 12 });
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const fileName = 'filled_certificate.pdf';
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Error loading or modifying PDF:', error);
    }
  };

  return (
    <div>
      <center>
        <div className='p-10'>
          <h1>Generate Certificate</h1>
          <form className='mt-10'>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your name" required />
            </div>
            <br />
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Certificate Number</label>
              <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the Certificate no." required />
            </div>
            <br />
            <button type="button" onClick={handleGenerateCertificate} className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
              Generate Certificate
            </button>
          </form>
        </div>
      </center>
    </div>

  );
};

export default Home;
