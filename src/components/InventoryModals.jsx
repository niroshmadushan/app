import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Generate PDF
export const generatePDF = (inventory, grnEntries, gonEntries) => {
  const doc = new jsPDF('p', 'pt', 'a4');  // Ensuring proper page size and units

  // Set Report Title and Date
  doc.setFontSize(18);
  doc.text("Inventory Management Report", 40, 40); // Title
  doc.setFontSize(10);
  const generatedDate = new Date().toLocaleString();
  doc.text(`Generated on: ${generatedDate}`, 40, 60);

  let startY = 80;

  // Section 1: Total GRNs (Goods Received Notes)
  if (grnEntries.length > 0) {
    doc.setFontSize(14);
    doc.text("Total Goods Received Notes (GRNs)", 40, startY);
    doc.autoTable({
      startY: startY + 10,
      head: [['ID', 'Product', 'Quantity', 'Unit Price (Rs.)', 'Total (Rs.)', 'Date']],
      body: grnEntries.map(entry => [
        String(entry.id || 'N/A'),  // Ensure text is a valid string
        entry.product || 'N/A',     // Handle undefined/null as 'N/A'
        String(entry.quantity || '0'),
        `Rs.${entry.unitPrice ? entry.unitPrice.toFixed(2) : '0.00'}`,
        `Rs.${entry.total ? entry.total.toFixed(2) : '0.00'}`,
        entry.date || 'N/A'
      ]),
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 113, 188], textColor: [255, 255, 255] }
    });
    startY = doc.autoTable.previous.finalY + 30;
  }

  // Section 2: Total GONs (Goods Out Notes)
  if (gonEntries.length > 0) {
    doc.setFontSize(14);
    doc.text("Total Goods Out Notes (GONs)", 40, startY);
    doc.autoTable({
      startY: startY + 10,
      head: [['ID', 'Product', 'Quantity', 'Date']],
      body: gonEntries.map(entry => [
        String(entry.id || 'N/A'),
        entry.product || 'N/A',
        String(entry.quantity || '0'),
        entry.date || 'N/A'
      ]),
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 113, 188], textColor: [255, 255, 255] }
    });
    startY = doc.autoTable.previous.finalY + 30;
  }

  // Section 3: Current Inventory
  if (inventory.length > 0) {
    doc.setFontSize(14);
    doc.text("Current Inventory", 40, startY);
    doc.autoTable({
      startY: startY + 10,
      head: [['ID', 'Product', 'Quantity', 'Unit Price (Rs.)', 'Total Value (Rs.)']],
      body: inventory.map(product => [
        String(product.id || 'N/A'),
        product.product || 'N/A',
        String(product.quantity || '0'),
        `Rs.${product.unitPrice ? product.unitPrice.toFixed(2) : '0.00'}`,
        `Rs.${(product.quantity && product.unitPrice) ? (product.quantity * product.unitPrice).toFixed(2) : '0.00'}`
      ]),
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 113, 188], textColor: [255, 255, 255] }
    });
  }

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.text("This is a system-generated report.", 40, pageHeight - 30);

  // Save the PDF
  doc.save('inventory_report.pdf');
};
