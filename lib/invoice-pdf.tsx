import { invoiceFileName, type Invoice } from "@/lib/invoice";

const PDF_IMAGE = /^data:image\/(png|jpe?g);/;

async function toPdfImage(src: string) {
  if (PDF_IMAGE.test(src)) return src;
  const image = new Image();
  image.src = src;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext("2d")?.drawImage(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export async function renderInvoicePdf(invoice: Invoice) {
  const [{ pdf }, { InvoiceDocument }, logo] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/invoice/invoice-document"),
    toPdfImage(invoice.logo),
  ]);
  return pdf(<InvoiceDocument invoice={invoice} logo={logo} />).toBlob();
}

export function downloadInvoicePdf(invoice: Invoice, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = invoiceFileName(invoice);
  link.click();
  setTimeout(() => URL.revokeObjectURL(url));
}
