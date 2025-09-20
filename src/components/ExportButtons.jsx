import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button, Box, Typography, ButtonGroup } from "@mui/material";
import { PictureAsPdf, TableChart, Download } from "@mui/icons-material";

export default function ExportButtons({ data, columns, fileName }) {
  const exportPDF = () => {
    const doc = new jsPDF();


    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(fileName, 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generado en: ${new Date().toLocaleDateString()}`, 14, 32);


    autoTable(doc, {
      head: [columns],
      body: data.map(row =>
        columns.map(c => {

          const value = row[c];
          if (typeof value === "object" && value !== null) {

            if (value.nombre) return value.nombre;
            return JSON.stringify(value);
          }
          return value || "";
        })
      ),
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 40 },
    });

    doc.save(fileName + ".pdf");
  };

  const exportExcel = () => {
    const rows = data.map(row => {
      const formatted = {};
      columns.forEach(c => {
        let value = row[c];
        if (typeof value === "object" && value !== null) {
          if (value.nombre) value = value.nombre;
          else value = JSON.stringify(value);
        }
        formatted[c] = value || "";
      });
      return formatted;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = columns.map(() => ({ width: 20 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName + ".xlsx");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        p: 2,
        bgcolor: "grey.50",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Download />
         Opciones de exportación
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Descargue los datos en su formato preferido ({data.length} archivos)
        </Typography>
      </Box>

      <ButtonGroup variant="outlined" sx={{ ml: 2 }}>
        <Button
          onClick={exportPDF}
          startIcon={<PictureAsPdf />}
          sx={{
            borderRadius: "8px 0 0 8px",
            textTransform: "none",
            px: 3,
            "&:hover": {
              bgcolor: "error.light",
              color: "white",
              borderColor: "error.main",
            },
          }}
        >
          Exportar PDF
        </Button>
        <Button
          onClick={exportExcel}
          startIcon={<TableChart />}
          sx={{
            borderRadius: "0 8px 8px 0",
            textTransform: "none",
            px: 3,
            "&:hover": {
              bgcolor: "success.light",
              color: "white",
              borderColor: "success.main",
            },
          }}
        >
         Exportar Excel
        </Button>
      </ButtonGroup>
    </Box>
  );
}
