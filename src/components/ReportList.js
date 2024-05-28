import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function ReportList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await axios.get('http://localhost:5000/api/reports');
      setReports(response.data);
    };

    fetchReports();
  }, []);

  const generatePDF = (report) => {
    const doc = new jsPDF();
    
    // Müştəri məlumatları
    doc.text(`Customer Name: ${report.customer.name}`, 10, 10);
    doc.text(`Manager: ${report.customer.manager}`, 10, 20);
    doc.text(`Contact: ${report.customer.contact}`, 10, 30);

    // Məhsul məlumatları
    let y = 40;
    report.products.forEach((prod, index) => {
      doc.text(`${prod.name} - ${prod.quantity} x ${prod.price} = ${prod.total}`, 10, y);
      y += 10;
    });

    // Şəkil əlavə etmək
    const imageUrl = 'data:image/jpeg;base64,' + report.image; // Şəkilin base64 formatında olduğunu düşünürük
    doc.addImage(imageUrl, 'JPEG', 10, y, 50, 50);
    y += 60;

    // Digər məlumatlar
    doc.text(`Discount: ${report.discount}`, 10, y);
    y += 10;
    doc.text(`Total Amount: ${report.totalAmount}`, 10, y);
    y += 10;
    doc.text(`Final Amount: ${report.finalAmount}`, 10, y);
    
    doc.save('report.pdf');
  };

  return (
    <div>
      <h1>Reports</h1>
      <ul>
        {reports.map(report => (
          <li key={report._id}>
            {report.customer.name} - {report.finalAmount}
            <button onClick={() => generatePDF(report)}>Generate PDF</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportList;
