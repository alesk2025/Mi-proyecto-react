import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToCsv = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportTableToPdf = async (tableRef, filename, title, farmName, adminName, logoUrl) => {
  if (!tableRef) {
    alert('No se encontró la tabla para exportar.');
    return;
  }

  const defaultLogo = 'https://via.placeholder.com/80x80?text=LOGO';

  const tempDiv = document.createElement('div');
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.padding = '10mm';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.fontSize = '10pt';
  tempDiv.style.backgroundColor = '#f8f8f8';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';

  tempDiv.innerHTML = `
    <div style="border: 1px solid #ddd; border-radius: 12px; overflow: hidden; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #2c3e50; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
        <img src="${logoUrl || defaultLogo}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" alt="Logo Finca">
        <div style="text-align: right;">
          <h1 style="margin: 0; font-size: 24pt; font-weight: bold;">${farmName}</h1>
          <p style="margin: 0; font-size: 12pt; opacity: 0.8;">${title}</p>
        </div>
      </div>
      <div style="padding: 20px;">
        ${tableRef.outerHTML}
      </div>
      <div style="text-align: right; font-size: 8pt; padding: 10px 20px; color: #aaa; background-color: #f8f8f8; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
        <p style="margin: 0;">Generado por Campo Inteligente | Administrador: ${adminName}</p>
        <p style="margin: 0;">Fecha de Generación: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = canvas.height * imgWidth / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
  document.body.removeChild(tempDiv);
};