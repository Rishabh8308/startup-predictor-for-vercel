"use client"

import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ExportButtonProps {
  targetId: string        // id of the DOM element to capture
  filename?: string
  className?: string
}

export function ExportButton({
  targetId,
  filename = "startup-analysis.pdf",
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const element = document.getElementById(targetId)
      if (!element) {
        alert("Export target not found. Please try again.")
        return
      }

      // Dynamic imports to avoid SSR issues
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ])
      const html2canvas = html2canvasModule.default
      const jsPDF = jsPDFModule.default

      // Capture the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f0a1e",
        logging: false,
        windowWidth: 1000,
      })

      const imgData = canvas.toDataURL("image/png")
      const img = new Image()
      img.src = imgData

      // A4 page: 210 × 297 mm
      const pdfWidth = 210
      const pdfHeight = 297
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      const pdf = new jsPDF({
        orientation: imgHeight > pdfHeight ? "portrait" : "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add pages if content is taller than one page
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      pdf.save(filename)
    } catch (error) {
      console.error("PDF export failed:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
        "bg-gradient-to-r from-purple-600 to-indigo-600",
        "hover:from-purple-500 hover:to-indigo-500",
        "text-white font-semibold text-sm",
        "transition-all duration-200 shadow-lg shadow-purple-500/25",
        "hover:shadow-purple-500/40 hover:scale-[1.02]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
        "border border-purple-500/30",
        className
      )}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating PDF…
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </button>
  )
}
