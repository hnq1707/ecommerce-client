/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../type/Order';

export const exportInvoicePDF = (order: Order) => {
  // Initialize PDF document with A4 size, portrait orientation
  const doc = new jsPDF('p', 'pt', 'a4');

  // Set default font ("times" is available in jsPDF)
  doc.setFont('times', 'normal');

  // Draw invoice title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('INVOICE', doc.internal.pageSize.getWidth() / 2, 40, {
    align: 'center',
  });

  // Draw a separator line below the title
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(40, 50, doc.internal.pageSize.getWidth() - 40, 50);

  // Order information
  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, 40, 70);
  doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString('en-US')}`, 40, 85);
  doc.text(`Customer: ${order.address.name}`, 40, 100);
  doc.text(`Payment Method: ${order.paymentMethod}`, 40, 115);

  // Create table columns for product list
  const tableColumn = ['Product', 'Variant', 'Qty', 'Unit Price (VND)', 'Total Price (VND)'];
  const tableRows: (string | number)[][] = order.orderItemList.map((item) => {
    const variant = item.product.productVariants.find((v) => v.id === item.productVariantId);
    const variantText = variant ? `${variant.color} - ${variant.size}` : 'Default';
    return [
      item.product.name,
      variantText,
      item.quantity,
      item.itemPrice.toLocaleString('en-US'),
      (item.itemPrice * item.quantity).toLocaleString('en-US'),
    ];
  });

  // Use autoTable to generate the product table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 130,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
    margin: { left: 40, right: 40 },
  });

  // Get the final Y position after the table to print the grand total
  const finalY = (doc as any).lastAutoTable.finalY || 130;
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.text(
    `Grand Total: ${order.totalPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    })}`,
    40,
    finalY + 30,
  );

  // Draw a separator line above the grand total (for better effect)
  doc.setLineWidth(0.5);
  doc.line(40, finalY + 20, doc.internal.pageSize.getWidth() - 40, finalY + 20);

  // Save the PDF file
  doc.save(`invoice_${order.id}.pdf`);
};
