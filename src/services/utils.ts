import CryptoJS, { AES } from 'crypto-js';
import { global_const } from '../config/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TableHeaderCell {
  content: string;
  rowSpan?: number;
  colSpan?: number;
  styles?: any;
  field?: string; // For bottom headers only
}

// crypto Js taking load so commented
// export const encryptData = (data: any) => {
//     const encryptedData = AES.encrypt(JSON.stringify(data), global_const.cryptoKey).toString();
//     return encryptedData;
// };

// export const decryptData = (encryptedData: any) => {
//     const decryptedData = AES.decrypt(encryptedData, global_const.cryptoKey).toString(CryptoJS.enc.Utf8);
//     return JSON.parse(decryptedData);
// };

function xorCipher(text:any, key:any) {
    let output = '';
    for (let i = 0; i < text.length; i++) {
        // XOR each character with the key (loop the key if it's shorter)
        output += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return output;
}

export const encryptData= (data: any) => {
    let a = xorCipher(JSON.stringify(data), global_const.cryptoKey);
    return a
}

export const decryptData= (data: any) => {
    let a = xorCipher(data, global_const.cryptoKey);
    return JSON.parse(a)
}

// (with ts)
// export const encryptData = (data: Credentials, secretKey: string): string => {
//     const encryptedData = AES.encrypt(JSON.stringify(data), secretKey).toString();
//     return encryptedData;
// };

// export const decryptData = (encryptedData: string, secretKey: string): Credentials => {
//     const decryptedData = AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
//     return JSON.parse(decryptedData);
// };

export const buildHierarchy = (items:any) => {
    const itemMap:any = {};
  
    // Create a map of items by their id for quick lookup
    items.forEach((item:any) => {
      itemMap[item.id] = { ...item };
    });
  
    // Create the hierarchical structure
    const hierarchy:any = [];
    items.forEach((item:any) => {
      if (item.parentId === null) {
        hierarchy.push(itemMap[item.id]);
      } else if (itemMap[item.parentId]) {
        if (!itemMap[item.parentId].items) {
          itemMap[item.parentId].items = [];
        }
        itemMap[item.parentId].items.push(itemMap[item.id]);
      }
    });
  
    return hierarchy;
  }


  /*
  // Author: Rudy
  // For generating pdfs with multiple headers. Not ready yet
  // This function is not in use and should not be used.
  */
export function convertKeysDeep<T extends any>(obj: T): any
{
  if (Array.isArray(obj)) {
          return obj.map(item => convertKeysDeep(item));
      }

      if (obj !== null && typeof obj === 'object') {
          const newObj: Record<string, any> = {};
          for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  const spacedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2');
                  const titleCaseKey = spacedKey.replace(/\b\w/g, char => char.toUpperCase());
                  newObj[titleCaseKey] = convertKeysDeep(obj[key]);
              }
          }
          return newObj;
      }

    return obj;
}

export function formatDate(dateString: any, bool?: boolean) {
  if (!dateString) return '';
  const dateTime = new Date(dateString);
  const day = String(dateTime.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
  const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1) and pad with leading zero if needed
  const year = dateTime.getFullYear(); // Get the full year
  const hours = String(dateTime.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
  const minutes = String(dateTime.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
  const seconds = String(dateTime.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero

  if (bool) {
    return `${day}${month}${year}_${hours}${minutes}${seconds}`;
  }
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

/*
// Author: Rudy
// For generating pdfs with single headers.
// THIS WILL ONLY WORK FOR TABLES WITH SINGLE LINE HEADERS
*/
export function generateDynamicPDF(
  data: any[],
  columns: { header: string, key: string, width?: number, align?: 'left' | 'right' | 'center' }[],
  fileName: string,
  reportTitle: string,
  address: string,
  email: string,
  phNo: string,
  page?: string,
  fromDate?:string,
  toDate?:string,
  pageo?: string,
): void {
  const doc = new jsPDF('l', 'mm', page || 'a3');
  const pageWidth = doc.internal.pageSize.width;

  // Fetch from localStorage
  const username = localStorage.getItem('username') || 'User';

  // Header
  doc.setFontSize(14);
  // @ts-ignore
  doc.setFont(undefined, 'bold');
  doc.text(reportTitle, pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(12);
  // @ts-ignore
 // doc.setFont(undefined, 'normal');
  doc.text("HERITAGE DAIRY", pageWidth / 2, 17, { align: 'center' });

  doc.setFontSize(10);
  doc.text(address, pageWidth / 2, 22, { align: 'center' });

  doc.setFontSize(8);
  doc.text(`Email: ${email}  Contact No: ${phNo}`, pageWidth / 2, 27, { align: 'center' });


  doc.text(`${fromDate}`, 10, 31, { align: 'left' });
  doc.text(`${toDate}`,doc.internal.pageSize.width -12 , 31, { align: 'right' });


  const lineY = 34;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(10, lineY, pageWidth - 11, lineY);

  const logoWidth = 30;
  const logoHeight = 20;
  const logoX = 10;
  const logoY = 6;

  // Add asset image (placeholder)
  doc.addImage('/assets/Heritage Dairy Logo.png', 'JPEG', logoX, logoY, logoWidth, logoHeight);

  // Table Headers
  const tableHeaders = columns.map(col => ({
    content: col.header,
    styles: { halign: "center", valign: 'middle' }
  }));

  function parser(data: any, item: any)
  {
    if (data === "date") return formatDate(item[data]);
    return item[data];
  }

  const tableBody = data.map((row, idx) => {
    return columns.map(col => col.key === 'srNo' ? idx + 1 : row[col.key]);
  });

  // Column width config
  const columnStyles: any = {};
  columns.forEach((col, idx) => {
    columnStyles[idx] = {
      cellWidth: col.width || 'auto',
      halign: col.align || 'left'
    };
  });

  // Generate table
  autoTable(doc, {
    // @ts-ignore
    head: [tableHeaders],
    body: tableBody,
    startY: 39,
    margin: { left: 10, right: 20 }, // This centers the table
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 1,
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: columnStyles
  });

  // Footer with page numbers
  // @ts-ignore
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = doc.internal.pageSize.height - 5;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
     // hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Generated By: ${username}`, 10, footerY, { align: 'left' });
    doc.text(`Report Generated Date: ${formattedDate}`, pageWidth - 10, footerY, { align: 'right' });
  }

  doc.save(`${fileName}.pdf`);
}

export function genDynamic2levelPDF(
  reportData: any[],
  topHeader: TableHeaderCell[],
  bottomHeader: TableHeaderCell[],
  formatDate: (date: string) => string,
  fieldsOrder: string[],
  columnStyle: any,
  fileName: string = 'report.pdf',
  reportTitle: string,
  address: string,
  email: string,
  phNo: string,
  fromDate?:string,
  toDate?:string
)
{
  const username = localStorage.getItem('username') || 'User';
  const doc: any = new jsPDF('l', 'mm', 'a3');  // landscape orientation
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(reportTitle, doc.internal.pageSize.width / 2, 11, { align: 'center' });
  doc.setFontSize(12);
  doc.text('HERITAGE DAIRY', doc.internal.pageSize.width / 2, 17, { align: 'center' });
  doc.text(address, doc.internal.pageSize.width / 2, 22, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Email: ${email}  Contact No: ${phNo}`,
  doc.internal.pageSize.width / 2, 27, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`${fromDate}`, 10, 31, { align: 'left' });
  doc.text(`${toDate}`,doc.internal.pageSize.width -12 , 31, { align: 'right' });
  const defaultStyle = { halign: 'center', valign: 'middle' };

  const headerTopRow = topHeader.map(cell => ({
    content: cell.content,
    rowSpan: cell.rowSpan ?? 1,
    colSpan: cell.colSpan ?? 1,
    styles: { ...defaultStyle, ...(cell.styles || {}) }
  }));

  const headerBottomRow = bottomHeader.map(cell => ({
    content: cell.content,
    styles: { ...defaultStyle, ...(cell.styles || {}) }
  }));

  const headers = [headerTopRow, headerBottomRow];

              
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = 248; // Sum of all column widths (28 + 20*11)
  const margin = (pageWidth - tableWidth) / 2;

  const logoWidth = 30;
  const logoHeight = 20;
  const logoX = 10;
  const logoY = 6;

  doc.addImage('/assets/Heritage Dairy Logo.png', 'JPEG', logoX, logoY, logoWidth, logoHeight);

  const lineY = 34;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(10, lineY, pageWidth - 11, lineY);
  
  function parser(data: any, item: any)
  {
    if (data === "date") return formatDate(item[data]);
    return item[data];
  }

  // Step 3: Generate body rows
  const body = reportData.map((item, index) => {
    return fieldsOrder.map((field) => ({
      content: parser(field, item)
    }));
  });


  (doc as any).autoTable({
    head: headers,
    body: body,
    startY: 39,
    margin: { left: 10, right: 20 }, // This centers the table
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    styles: {
      fontSize: 8,
      cellPadding: 1,
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: columnStyle
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);

    // Calculate positions for footer elements
    const footerY = doc.internal.pageSize.height - 5;

    const centerX = pageWidth / 2;
    // const rightX = pageWidth - margin - 5;

    // Add page numbers (centered)
    doc.text(`Page ${i} of ${pageCount}`, centerX, footerY, { align: 'center' });

    // Add date (right-aligned)
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  doc.text(`Report Generated Date: ${formattedDate}`, 407, footerY, { align: 'right' });

  // Add user email (left-aligned)
  doc.text(`Generated By: ${username}`, 10, footerY, { align: 'left' });
        }

  doc.save(fileName);
}