
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (title, headers, data) => {
  const doc = new jsPDF();
  doc.text(title, 14, 16);
  doc.autoTable({
    startY: 20,
    head: [headers],
    body: data,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [22, 160, 133] },
  });
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
};
