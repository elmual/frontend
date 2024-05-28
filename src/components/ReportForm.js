import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function ReportForm() {
  const [customer, setCustomer] = useState({ name: '', manager: '', contact: '' });
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({ name: '', quantity: 0, price: 0 });
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [image, setImage] = useState('');

  const addProduct = () => {
    setProducts([...products, { ...product, total: product.quantity * product.price }]);
    setProduct({ name: '', quantity: 0, price: 0 });
  };

  const calculateTotal = () => {
    const total = products.reduce((sum, prod) => sum + prod.total, 0);
    setTotalAmount(total - discount);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result.split(',')[1]); // Base64 data
    };
    reader.readAsDataURL(file);
  };

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
    if (report.image) {
      const imageUrl = 'data:image/jpeg;base64,' + report.image; // Şəkilin base64 formatında olduğunu düşünürük
      doc.addImage(imageUrl, 'JPEG', 10, y, 50, 50);
      y += 60;
    }

    // Digər məlumatlar
    doc.text(`Discount: ${report.discount}`, 10, y);
    y += 10;
    doc.text(`Total Amount: ${report.totalAmount}`, 10, y);
    y += 10;
    doc.text(`Final Amount: ${report.finalAmount}`, 10, y);
    
    doc.save('report.pdf');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const report = { customer, products, discount, totalAmount, finalAmount: totalAmount - discount, image };
    const response = await axios.post('http://localhost:5000/api/reports', report);
    alert('Report created successfully');
    generatePDF(response.data);
  };

  return (
    <div>
      <h1>Create Report</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name:</label>
          <input type="text" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
        </div>
        <div>
          <label>Manager:</label>
          <input type="text" value={customer.manager} onChange={e => setCustomer({ ...customer, manager: e.target.value })} />
        </div>
        <div>
          <label>Contact:</label>
          <input type="text" value={customer.contact} onChange={e => setCustomer({ ...customer, contact: e.target.value })} />
        </div>
        <div>
          <label>Product Name:</label>
          <input type="text" value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} />
          <label>Quantity:</label>
          <input type="number" value={product.quantity} onChange={e => setProduct({ ...product, quantity: Number(e.target.value) })} />
          <label>Price:</label>
          <input type="number" value={product.price} onChange={e => setProduct({ ...product, price: Number(e.target.value) })} />
          <button type="button" onClick={addProduct}>Add Product</button>
        </div>
        <div>
          <h3>Products</h3>
          <ul>
            {products.map((prod, index) => (
              <li key={index}>{prod.name} - {prod.quantity} x {prod.price} = {prod.total}</li>
            ))}
          </ul>
        </div>
        <div>
          <label>Discount:</label>
          <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
        </div>
        <div>
          <label>Upload Image:</label>
          <input type="file" onChange={handleImageUpload} />
        </div>
        <button type="button" onClick={calculateTotal}>Calculate Total</button>
        <div>
          <h3>Total Amount: {totalAmount}</h3>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReportForm;
