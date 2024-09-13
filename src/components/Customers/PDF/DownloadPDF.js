
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas

function DownloadPDF({customer, latestRecordData}) {
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        // Add client name at the top
        doc.setFontSize(16);
        doc.text(`Client: ${customer.name}`, 10, 20);
        doc.text(`Weight: ${latestRecordData.weight || 'N/A'} kg`, 10, 40);
        doc.text(`Flexibility: ${latestRecordData.flexibility || 'N/A'}`, 10, 50);
    
        // Add HIP ROM data as text
        doc.setFontSize(14);
        doc.text('Latest HIP ROM Data:', 10, 60);
        doc.setFontSize(12);
        doc.text(`Hip ROM Left Internal: ${latestRecordData.hipRomLeftInternal || 'N/A'}`, 10, 70);
        doc.text(`Hip ROM Left External: ${latestRecordData.hipRomLeftExternal || 'N/A'}`, 10, 80);
        doc.text(`Hip ROM Right Internal: ${latestRecordData.hipRomRightInternal || 'N/A'}`, 120, 70); // Right column
        doc.text(`Hip ROM Right External: ${latestRecordData.hipRomRightExternal || 'N/A'}`, 120, 80); // Right column
    
        // Add Quadriceps data as text
        doc.setFontSize(14);
        doc.text('Latest Quadriceps Data (EasyForce):', 10, 90);
        doc.setFontSize(12);
        doc.text(`Left Quadriceps 1: ${latestRecordData.easyForceQuadricepsLeft1 || 'N/A'}`, 10, 100); // Left column
        doc.text(`Left Quadriceps 2: ${latestRecordData.easyForceQuadricepsLeft2 || 'N/A'}`, 10, 110); // Left column
        doc.text(`Left Quadriceps 3: ${latestRecordData.easyForceQuadricepsLeft3 || 'N/A'}`, 10, 120); // Left column
    
        doc.text(`Right Quadriceps 1: ${latestRecordData.easyForceQuadricepsRight1 || 'N/A'}`, 120, 100); // Right column
        doc.text(`Right Quadriceps 2: ${latestRecordData.easyForceQuadricepsRight2 || 'N/A'}`, 120, 110); // Right column
        doc.text(`Right Quadriceps 3: ${latestRecordData.easyForceQuadricepsRight3 || 'N/A'}`, 120, 120); // Right column
    
        // Convert the chart to an image
        const chartElement = document.getElementById('hip-rom-chart'); // Ensure the chart has this id
        html2canvas(chartElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
    
            // Add the chart as an image to the PDF
            doc.addImage(imgData, 'PNG', 10, 140, 180, 90); // Adjust dimensions as needed
            
            // Save the PDF
            doc.save(`${customer.name}-details.pdf`);
        });
    };

    return (
        <div className="text-center mt-4">
            <button 
              className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-teal-700 mt-4" 
              onClick={handleDownloadPDF}>
                Preuzmi PDF
            </button>
        </div>
    );
};

export default DownloadPDF;