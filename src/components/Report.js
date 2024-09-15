import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import React, { useState } from "react";

const { ipcRenderer } = window.require("electron");

function Report() {
  const [date, setDate] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const handleGenerateReport = async () => {
    if (!date) {
      setError("Please select a date");
      return;
    }

    try {
      const result = await ipcRenderer.invoke("create-report", date);
      if (result.error) {
        setError(result.error);
        setReport(null);
      } else {
        setReport(result);
        setError("");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Fariha Telecom", 14, 15);
    doc.setFontSize(12);
    doc.text("Maijdee, Noakhali", 14, 22);
    doc.text(`Date: ${date}`, 140, 22);

    // Sales table
    doc.autoTable({
      head: [["Product name", "Quantity", "Profit", "Price"]],
      body: report.sales.map((sale) => [
        sale.productName,
        sale.quantity,
        sale.totalProfit,
        sale.totalSale,
      ]),
      startY: 30,
    });

    // Summary table
    const summaryData = [
      ["Total profit", "", report.totalProfit, ""],
      ["Total Sales", "", "", report.totalSales],
      ["Total expenses (-)", "", "", report.totalExpense],
      ["Total", "", "", report.totalAfterExpenses],
      ["Hardware service", "", "", report.hardwareService],
      ["Software service", "", "", report.softwareService],
      ["Grand total", "", "", report.grandTotal],
    ];

    doc.autoTable({
      body: summaryData,
      startY: doc.lastAutoTable.finalY + 10,
    });

    // Expenses table
    doc.autoTable({
      head: [["List of expenses", ""]],
      body: [
        ["Expense details", "Amount"],
        ...report.expenses.map((expense) => [expense.details, expense.amount]),
      ],
      startY: doc.lastAutoTable.finalY + 10,
    });

    doc.save(`Sales_Report_${date}.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generate Report
      </Typography>
      <TextField
        label="Select Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleGenerateReport}
        sx={{ mt: 2, mb: 2 }}
      >
        Generate Report
      </Button>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {report && (
        <>
          <Typography variant="h5" gutterBottom>
            Fariha Telecom
          </Typography>
          <Typography gutterBottom>Maijdee, Noakhali</Typography>
          <Typography gutterBottom>Date: {date}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Profit</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.sales.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell align="right">{sale.quantity}</TableCell>
                    <TableCell align="right">{sale.totalProfit}</TableCell>
                    <TableCell align="right">{sale.totalSale}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total profit</TableCell>
                <TableCell align="right">{report.totalProfit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Sales</TableCell>
                <TableCell align="right">{report.totalSales}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total expenses (-)</TableCell>
                <TableCell align="right">{report.totalExpense}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell align="right">{report.totalAfterExpenses}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hardware service</TableCell>
                <TableCell align="right">{report.hardwareService}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Software service</TableCell>
                <TableCell align="right">{report.softwareService}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Grand total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{report.grandTotal}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography variant="h6" sx={{ mt: 2 }}>
            List of expenses
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expense details</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.details}</TableCell>
                  <TableCell align="right">{expense.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            onClick={handleDownloadPDF}
            sx={{ mt: 2 }}
          >
            Download PDF
          </Button>
        </>
      )}
    </Box>
  );
}

export default Report;
