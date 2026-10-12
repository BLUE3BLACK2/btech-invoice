import { Document, Font, Image as PdfImage, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  calculateTotals,
  formatCurrency,
  formatDate,
  formatQuantity,
  invoiceTitle,
  lineItemAmount,
  type Invoice,
} from "@/lib/invoice";

const PAGE_MARGIN = 36;
const FONT_SIZE = 9.75;
const BALANCE_FONT_SIZE = 11.25;
const LINE_HEIGHT = 13.5;
const CELL_PADDING = 15;
const MONEY_COLUMN_WIDTH = 83.25;
const AMOUNT_COLUMN_WIDTH = 123.75;
const AMOUNT_PADDING = 18.75;
const AMOUNT_GAP = 12;
const WIDTH_TOLERANCE = 0.05;

const helveticaWidths: Record<string, number> = {
  " ": 278,
  ",": 278,
  ".": 278,
  "-": 333,
  D: 722,
  E: 667,
  G: 778,
  I: 278,
  R: 722,
  S: 667,
  U: 722,
};

const colors = {
  text: "#333333",
  muted: "#777777",
  heading: "#3a3a3a",
  tableHeader: "#3a3a3a",
  highlight: "#f5f5f5",
  inverse: "#ffffff",
};

const fonts = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
};

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingVertical: PAGE_MARGIN,
    fontFamily: fonts.regular,
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT / FONT_SIZE,
    color: colors.text,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14.25 - PAGE_MARGIN,
    paddingHorizontal: 36.75,
  },
  logo: {
    marginTop: 3.6,
    height: 34.08,
    maxWidth: 220,
    objectFit: "contain",
    objectPosition: "left",
  },
  companyName: {
    marginTop: 18.045,
    marginLeft: 11.25,
    fontFamily: fonts.bold,
  },
  titleBlock: {
    alignItems: "flex-end",
  },
  title: {
    marginTop: 8.775,
    fontSize: 27.75,
    lineHeight: 1,
    color: colors.heading,
  },
  number: {
    marginTop: 5.925,
    marginRight: 3.75,
    fontSize: 12,
    lineHeight: 1,
    color: colors.muted,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 19.5,
  },
  billTo: {
    flex: 1,
    paddingTop: 8.25,
    paddingLeft: 48,
    paddingRight: 24,
  },
  label: {
    color: colors.muted,
  },
  billToName: {
    marginTop: 2.25,
    fontFamily: fonts.bold,
  },
  amounts: {
    width: 269.25,
    marginRight: 25.5,
  },
  summary: {
    alignSelf: "flex-end",
    marginTop: 45,
  },
  amountRow: {
    flexDirection: "row",
    height: 21.75,
    paddingTop: 6,
  },
  balanceRow: {
    flexDirection: "row",
    height: 25.5,
    marginTop: 2.025,
    paddingTop: 4.875,
    borderRadius: 3,
    backgroundColor: colors.highlight,
    fontFamily: fonts.bold,
    fontSize: BALANCE_FONT_SIZE,
  },
  amountLabel: {
    flex: 1,
    textAlign: "right",
  },
  amountValue: {
    paddingRight: AMOUNT_PADDING,
    textAlign: "right",
  },
  table: {
    marginTop: 34.5,
    marginHorizontal: 29.25,
  },
  tableHeader: {
    flexDirection: "row",
    height: 21,
    paddingTop: 3.975,
    borderRadius: 3,
    backgroundColor: colors.tableHeader,
    color: colors.inverse,
  },
  tableRow: {
    flexDirection: "row",
    paddingTop: 8.475,
  },
  itemCell: {
    flex: 1,
    paddingHorizontal: CELL_PADDING,
  },
  itemName: {
    fontFamily: fonts.bold,
  },
  quantityCell: {
    width: 75,
    paddingHorizontal: CELL_PADDING,
  },
  moneyCell: {
    flexShrink: 0,
    paddingRight: CELL_PADDING,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    marginTop: 39,
    paddingLeft: 48,
    paddingRight: 44.25,
  },
  notes: {
    flex: 1,
    paddingRight: 24,
  },
  noteBody: {
    marginTop: 3,
  },
  signature: {
    width: 180,
    alignItems: "center",
    textAlign: "center",
  },
  signatureImage: {
    height: 54,
    maxWidth: 180,
    objectFit: "contain",
  },
  signatureSpace: {
    height: 54,
  },
  signatureLine: {
    alignSelf: "stretch",
    marginTop: 6,
    borderTopWidth: 0.75,
    borderTopColor: colors.text,
  },
  signatory: {
    marginTop: 4.5,
    fontFamily: fonts.bold,
  },
  terms: {
    marginTop: 22.5,
    paddingHorizontal: 48,
  },
});

function fitWidth(texts: string[], fontSize: number, padding: number, minWidth: number) {
  const contentWidth = Math.max(
    ...texts.map((text) => [...text].reduce((width, char) => width + (helveticaWidths[char] ?? 556), 0)),
  );
  return Math.max(minWidth, (contentWidth * fontSize) / 1000 + padding + WIDTH_TOLERANCE);
}

type AmountRowProps = {
  label: string;
  value: string;
  valueWidth: number;
  highlight?: boolean;
};

function AmountRow({ label, value, valueWidth, highlight }: AmountRowProps) {
  return (
    <View style={highlight ? styles.balanceRow : styles.amountRow} wrap={false}>
      <Text style={highlight ? styles.amountLabel : [styles.amountLabel, styles.label]}>
        {label}
      </Text>
      <Text style={[styles.amountValue, { width: valueWidth }]}>{value}</Text>
    </View>
  );
}

type NoteBlockProps = {
  label: string;
  children: string;
};

function NoteBlock({ label, children }: NoteBlockProps) {
  return (
    <View wrap={false}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.noteBody}>{children}</Text>
    </View>
  );
}

type InvoiceDocumentProps = {
  invoice: Invoice;
  logo: string;
  signature: string;
};

export function InvoiceDocument({ invoice, logo, signature }: InvoiceDocumentProps) {
  const totals = calculateTotals(invoice);
  const money = (amount: number) => formatCurrency(amount, invoice.currency);
  const rows = invoice.items.map((item) => ({
    ...item,
    rate: money(item.rate),
    amount: money(lineItemAmount(item)),
  }));
  const amounts = {
    date: formatDate(invoice.date),
    dueDate: formatDate(invoice.dueDate),
    balanceDue: money(totals.balanceDue),
    subtotal: money(totals.subtotal),
    tax: money(totals.tax),
    total: money(totals.total),
  };
  const moneyCell = [
    styles.moneyCell,
    {
      width: fitWidth(
        rows.flatMap((row) => [row.rate, row.amount]),
        FONT_SIZE,
        CELL_PADDING,
        MONEY_COLUMN_WIDTH,
      ),
    },
  ];
  const valueWidth = Math.max(
    fitWidth([amounts.balanceDue], BALANCE_FONT_SIZE, AMOUNT_PADDING + AMOUNT_GAP, AMOUNT_COLUMN_WIDTH),
    fitWidth(
      [amounts.date, amounts.dueDate, amounts.subtotal, amounts.tax, amounts.total],
      FONT_SIZE,
      AMOUNT_PADDING + AMOUNT_GAP,
      AMOUNT_COLUMN_WIDTH,
    ),
  );

  return (
    <Document title={invoiceTitle(invoice)} author={invoice.companyName} creator="BTECH Invoice">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <PdfImage src={logo} style={styles.logo} />
            <Text style={styles.companyName}>{invoice.companyName}</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.number}># {invoice.number}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.billTo}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={styles.billToName}>{invoice.billTo}</Text>
          </View>
          <View style={styles.amounts}>
            <AmountRow label="Date:" value={amounts.date} valueWidth={valueWidth} />
            <AmountRow label="Due Date:" value={amounts.dueDate} valueWidth={valueWidth} />
            <AmountRow
              label="Balance Due:"
              value={amounts.balanceDue}
              valueWidth={valueWidth}
              highlight
            />
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={styles.itemCell}>Item</Text>
            <Text style={styles.quantityCell}>Quantity</Text>
            <Text style={moneyCell}>Rate</Text>
            <Text style={moneyCell}>Amount</Text>
          </View>
          {rows.map((row) => (
            <View key={row.id} style={styles.tableRow} wrap={false}>
              <Text style={[styles.itemCell, styles.itemName]}>{row.description}</Text>
              <Text style={styles.quantityCell}>{formatQuantity(row.quantity)}</Text>
              <Text style={moneyCell}>{row.rate}</Text>
              <Text style={moneyCell}>{row.amount}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.amounts, styles.summary]} wrap={false}>
          <AmountRow label="Subtotal:" value={amounts.subtotal} valueWidth={valueWidth} />
          <AmountRow
            label={`Tax (${invoice.taxRate}%):`}
            value={amounts.tax}
            valueWidth={valueWidth}
          />
          <AmountRow label="Total:" value={amounts.total} valueWidth={valueWidth} />
        </View>

        <View style={styles.footer} wrap={false}>
          <View style={styles.notes}>
            {invoice.notes.trim() && <NoteBlock label="Notes:">{invoice.notes}</NoteBlock>}
          </View>
          <View style={styles.signature}>
            {signature ? (
              <PdfImage src={signature} style={styles.signatureImage} />
            ) : (
              <View style={styles.signatureSpace} />
            )}
            <View style={styles.signatureLine} />
            {invoice.signatory.trim() && <Text style={styles.signatory}>{invoice.signatory}</Text>}
            <Text style={styles.label}>Authorized Signature</Text>
          </View>
        </View>

        {invoice.terms.trim() && (
          <View style={styles.terms}>
            <NoteBlock label="Terms:">{invoice.terms}</NoteBlock>
          </View>
        )}
      </Page>
    </Document>
  );
}
