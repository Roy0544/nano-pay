import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#0f172a",
    paddingBottom: 12,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
  },
  companySubText: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  payslipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "right",
  },
  periodText: {
    fontSize: 10,
    color: "#475569",
    textAlign: "right",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    backgroundColor: "#f1f5f9",
    padding: 6,
    marginBottom: 8,
    borderRadius: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  gridCol: {
    width: "50%",
    marginBottom: 8,
    paddingRight: 10,
  },
  label: {
    fontSize: 9,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    padding: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableCell: {
    fontSize: 10,
    color: "#1e293b",
  },
  colDesc: { width: "50%" },
  colQty: { width: "25%", textAlign: "center" },
  colAmount: { width: "25%", textAlign: "right" },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 36,
    right: 36,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
    color: "#94a3b8",
    fontSize: 8,
  },
});

export interface PayslipPDFProps {
  companyName?: string;
  employeeName: string;
  employeePhone?: string;
  accountNumber?: string;
  ifscCode?: string;
  monthYear: string;
  daysWorked: number;
  dailyWage: number;
  netPay: number;
}

export function PayslipDocument({
  companyName = "NanoPay Organization",
  employeeName,
  employeePhone = "N/A",
  accountNumber = "N/A",
  ifscCode = "N/A",
  monthYear,
  daysWorked,
  dailyWage,
  netPay,
}: PayslipPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.companySubText}>Automated Payroll & Salary Advice</Text>
          </View>
          <View>
            <Text style={styles.payslipTitle}>SALARY PAYSLIP</Text>
            <Text style={styles.periodText}>{monthYear}</Text>
          </View>
        </View>

        {/* Employee Details Section */}
        <Text style={styles.sectionTitle}>EMPLOYEE & BANK DETAILS</Text>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Employee Name</Text>
            <Text style={styles.value}>{employeeName}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Phone / Mobile</Text>
            <Text style={styles.value}>{employeePhone}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Bank Account</Text>
            <Text style={styles.value}>{accountNumber}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>IFSC Code</Text>
            <Text style={styles.value}>{ifscCode}</Text>
          </View>
        </View>

        {/* Earnings Calculation Breakdown Table */}
        <Text style={styles.sectionTitle}>SALARY BREAKDOWN</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Earnings Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Days / Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount (₹)</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colDesc]}>Base Daily Wages</Text>
            <Text style={[styles.tableCell, styles.colQty]}>
              {daysWorked} days @ ₹{dailyWage}/day
            </Text>
            <Text style={[styles.tableCell, styles.colAmount]}>
              ₹ {netPay.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* Total Net Payable Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>TOTAL NET SALARY PAYABLE</Text>
          <Text style={styles.summaryValue}>₹ {netPay.toLocaleString("en-IN")}</Text>
        </View>

        {/* Footer Notice */}
        <Text style={styles.footer}>
          This is a system-generated digital payslip issued via NanoPay Payroll Platform. No physical signature is required.
        </Text>
      </Page>
    </Document>
  );
}
