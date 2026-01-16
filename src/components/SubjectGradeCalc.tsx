"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Label } from "@/components/ui/label"
import { 
  BookOpen, 
  Calculator, 
  GraduationCap, 
  Hash, 
  CalendarCheck, 
  Percent, 
  Edit3, 
  FileText, 
  LineChart, 
  Medal, 
  CheckCircle2,
  FileSpreadsheet,
  Download,
  AlertCircle,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { GradeCalculator, GradeInfo } from '@/lib/grade-calculator'
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  AlignmentType, 
  WidthType 
} from 'docx'

const grades = GradeCalculator.grades


export default function SubjectGradeCalc() {
  const [subjectName, setSubjectName] = useState('')
  const [credits, setCredits] = useState('3')
  const [attendance, setAttendance] = useState('')
  const [examScore, setExamScore] = useState('')
  const [hs1, setHs1] = useState(['', '', '', '', '', ''])
  const [hs2, setHs2] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
  const [result, setResult] = useState<{
    mauSo: number
    tbThuongKi: number
    tbMon: number
    tbMon4: number
    grade: GradeInfo
  } | null>(null)
  
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportType, setExportType] = useState<'excel' | 'word' | 'txt' | null>(null)

  const handleHsChange = (type: 'hs1' | 'hs2', index: number, value: string) => {
    // Validate value between 0 and 10
    const numValue = parseFloat(value)
    if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 10)) {
      toast.error("Điểm phải nằm trong khoảng 0 - 10")
      return
    }

    if (type === 'hs1') {
      const newHs1 = [...hs1]
      newHs1[index] = value
      setHs1(newHs1)
    } else {
      const newHs2 = [...hs2]
      newHs2[index] = value
      setHs2(newHs2)
    }
  }

  const getHsValues = (arr: string[]) => {
    return arr
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v) && v >= 0 && v <= 10)
  }

  const calculate = () => {
    setErrors({})
    const sName = subjectName.trim()
    const sCredits = parseInt(credits)
    const dCC = parseFloat(attendance)
    const dThi = parseFloat(examScore)
    const dsHS1 = getHsValues(hs1)
    const dsHS2 = getHsValues(hs2)

    const newErrors: { [key: string]: boolean } = {}

    if (!sName) {
      newErrors.subjectName = true
      setErrors(newErrors)
      toast.error("Vui lòng nhập tên môn học")
      return
    }
    if (isNaN(sCredits) || sCredits < 1) {
      newErrors.credits = true
      setErrors(newErrors)
      toast.error("Số tín chỉ phải từ 1 trở lên")
      return
    }
    if (isNaN(dCC) || dCC < 0 || dCC > 10) {
      newErrors.attendance = true
      setErrors(newErrors)
      toast.error("Điểm chuyên cần phải từ 0 đến 10")
      return
    }
    if (isNaN(dThi) || dThi < 0 || dThi > 10) {
      newErrors.examScore = true
      setErrors(newErrors)
      toast.error("Điểm thi phải từ 0 đến 10")
      return
    }
    
    if (dsHS1.length === 0 && dsHS2.length === 0) {
      toast.warning("Vui lòng nhập ít nhất một cột điểm hệ số 1")
      return
    }

    const calcResult = GradeCalculator.calculateSubjectGrade(sCredits, dCC, dsHS1, dsHS2, dThi)

    if (calcResult) {
      setResult({
        mauSo: calcResult.mauSo,
        tbThuongKi: calcResult.tbThuongKi,
        tbMon: calcResult.tbMonValue,
        tbMon4: calcResult.tbMon4Value,
        grade: calcResult.gradeInfo
      })
    }
  }

  const exportToExcel = () => {
    if (!result) return

    const data = [
      ["THÔNG TIN KẾT QUẢ HỌC TẬP"],
      ["Môn học:", subjectName],
      ["Số tín chỉ:", credits],
      ["Điểm chuyên cần:", attendance],
      ["Điểm hệ số 1 (HS1):", getHsValues(hs1).join(", ") || "-"],
      ["Điểm hệ số 2 (HS2):", getHsValues(hs2).join(", ") || "-"],
      ["Điểm thi cuối kỳ:", examScore],
      [],
      ["KẾT QUẢ TÍNH TOÁN"],
      ["Mẫu số chia:", result.mauSo],
      ["TB thường kỳ:", result.tbThuongKi],
      ["Điểm trung bình (Hệ 10):", result.tbMon],
      ["Điểm trung bình (Hệ 4):", result.tbMon4],
      ["Xếp loại chữ:", result.grade.letter],
      ["Xếp loại:", result.grade.rank]
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Ket Qua")
    XLSX.writeFile(wb, `${subjectName || 'KetQua'}_Grade.xlsx`)
    toast.success("Đã xuất file Excel thành công!")
  }

  const exportToWord = async () => {
    if (!result) return

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "KẾT QUẢ TÍNH ĐIỂM CHI TIẾT",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: `Môn học: `, bold: true }),
              new TextRun(subjectName),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Số tín chỉ: `, bold: true }),
              new TextRun(credits),
            ],
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Thành phần", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Điểm số", bold: true })] })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Chuyên cần")] }),
                  new TableCell({ children: [new Paragraph(attendance.toString())] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Hệ số 1 (HS1)")] }),
                  new TableCell({ children: [new Paragraph(getHsValues(hs1).join(", ") || "-")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Hệ số 2 (HS2)")] }),
                  new TableCell({ children: [new Paragraph(getHsValues(hs2).join(", ") || "-")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Thi cuối kỳ")] }),
                  new TableCell({ children: [new Paragraph(examScore.toString())] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TỔNG KẾT (Hệ 10)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: result.tbMon.toFixed(1), bold: true })] })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TỔNG KẾT (Hệ 4)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: result.tbMon4.toFixed(2), bold: true })] })] }),
                ]
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: `Xếp loại: `, bold: true }),
              new TextRun(`${result.grade.letter} (${result.grade.rank})`),
            ],
          }),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${subjectName || 'KetQua'}_Grade.docx`)
    toast.success("Đã xuất file Word thành công!")
  }

  const exportToTxt = () => {
    if (!result) return

    const content = `
KẾT QUẢ TÍNH ĐIỂM MÔN HỌC
--------------------------------
Môn học: ${subjectName}
Số tín chỉ: ${credits}

CHI TIẾT ĐIỂM:
- Chuyên cần: ${attendance}
- Hệ số 1 (HS1): ${getHsValues(hs1).join(", ") || "-"}
- Hệ số 2 (HS2): ${getHsValues(hs2).join(", ") || "-"}
- Thi cuối kỳ: ${examScore}

KẾT QUẢ:
- Mẫu số: ${result.mauSo}
- TB Thường kỳ: ${result.tbThuongKi}
- Điểm trung bình (Hệ 10): ${result.tbMon}
- Điểm trung bình (Hệ 4): ${result.tbMon4}
- Xếp loại: ${result.grade.letter} - ${result.grade.rank}
--------------------------------
Xuất từ TinhDiem Uneti
    `.trim()

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `${subjectName || 'KetQua'}_Grade.txt`)
    toast.success("Đã xuất file TXT thành công!")
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto">
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        <Card className="shadow-xl border-primary/10 overflow-hidden gap-0">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b py-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Nhập thông tin điểm số
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectName" className="flex items-center gap-2 font-semibold text-base">
                  <BookOpen className="w-4 h-4 text-primary" /> Tên môn học
                </Label>
                <div className="relative group">
                  <Input 
                    id="subjectName" 
                    placeholder="VD: Toán Giải Tích 1" 
                    className={cn(
                      "pl-9 h-10 text-sm focus-visible:ring-primary/20 transition-all border-slate-200",
                      errors.subjectName && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    value={subjectName}
                    onChange={(e) => {
                      setSubjectName(e.target.value)
                      if (errors.subjectName) setErrors(prev => ({ ...prev, subjectName: false }))
                    }}
                  />
                  <BookOpen className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits" className="flex items-center gap-2 font-semibold text-base">
                  <Hash className="w-4 h-4 text-primary" /> Số tín chỉ
                </Label>
                <div className="relative group">
                  <Input 
                    id="credits" 
                    type="number" 
                    placeholder="1-10" 
                    className={cn(
                      "pl-9 h-10 text-sm focus-visible:ring-primary/20 transition-all border-slate-200",
                      errors.credits && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    value={credits}
                    onChange={(e) => {
                      setCredits(e.target.value)
                      if (errors.credits) setErrors(prev => ({ ...prev, credits: false }))
                    }}
                  />
                  <Hash className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance" className="flex items-center gap-2 font-semibold text-base">
                <CalendarCheck className="w-4 h-4 text-primary" /> Điểm chuyên cần
              </Label>
              <div className="relative group">
                <Input 
                  id="attendance" 
                  type="number" 
                  step="0.1" 
                  placeholder="Nhập điểm từ 0-10" 
                  className={cn(
                    "pl-9 h-10 text-sm focus-visible:ring-primary/20 transition-all border-slate-200",
                    errors.attendance && "border-destructive focus-visible:ring-destructive/20"
                  )}
                  value={attendance}
                  onChange={(e) => {
                    setAttendance(e.target.value)
                    if (errors.attendance) setErrors(prev => ({ ...prev, attendance: false }))
                  }}
                />
                <Percent className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-700 dark:text-slate-300">
                    <LineChart className="w-3.5 h-3.5 text-primary" /> Hệ số 1 (HS1)
                  </div>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                  {hs1.map((val, i) => (
                    <Input 
                      key={`hs1-${i}`}
                      type="number" 
                      step="0.1" 
                      placeholder={`.${i+1}`}
                      className="text-center h-9 bg-white dark:bg-slate-950 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all px-1 text-sm font-medium"
                      value={val}
                      onChange={(e) => handleHsChange('hs1', i, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-300">
                    <LineChart className="w-3.5 h-3.5 text-emerald-500" /> Hệ số 2 (HS2)
                  </div>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                  {hs2.map((val, i) => (
                    <Input 
                      key={`hs2-${i}`}
                      type="number" 
                      step="0.1" 
                      placeholder={`.${i+1}`}
                      className="text-center h-9 bg-white dark:bg-slate-950 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all px-1 text-sm font-medium"
                      value={val}
                      onChange={(e) => handleHsChange('hs2', i, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examScore" className="flex items-center gap-2 font-semibold text-base">
                <GraduationCap className="w-4 h-4 text-orange-500" /> Điểm thi cuối kỳ
              </Label>
              <div className="relative group">
                <Input 
                  id="examScore" 
                  type="number" 
                  step="0.1" 
                  placeholder="Nhập điểm thi từ 0-10" 
                  className={cn(
                    "pl-9 h-10 text-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all border-slate-200",
                    errors.examScore && "border-destructive focus-visible:ring-destructive/20 border-b-destructive"
                  )}
                  value={examScore}
                  onChange={(e) => {
                    setExamScore(e.target.value)
                    if (errors.examScore) setErrors(prev => ({ ...prev, examScore: false }))
                  }}
                />
                <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </div>

            <RainbowButton 
              className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/10 rounded-xl group active:scale-[0.98] transition-all" 
              onClick={calculate}
            >
              <Calculator className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              TÍNH KẾT QUẢ
            </RainbowButton>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              Công thức chi tiết & Giải thích
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] sm:text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                    <th className="border-b border-r p-2 font-bold">Thành phần</th>
                    <th className="border-b border-r p-2 font-bold whitespace-nowrap">Tín chỉ</th>
                    <th className="border-b border-r p-2 font-bold">Chuyên cần</th>
                    <th className="border-b border-r p-2 font-bold">Hệ số 1</th>
                    <th className="border-b border-r p-2 font-bold">Hệ số 2</th>
                    <th className="border-b border-r p-2 font-bold">TB Quá trình</th>
                    <th className="border-b border-r p-2 font-bold">Thi HK</th>
                    <th className="border-b p-2 font-bold">Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="divide-x border-b">
                    <td className="p-2 text-center align-middle font-medium max-w-[120px] truncate">
                      {subjectName || <span className="text-slate-300">Tên môn</span>}
                    </td>
                    <td className="p-2 text-center align-middle font-medium">
                      {credits || <span className="text-slate-300">3</span>}
                    </td>
                    <td className="p-2 text-center align-middle font-medium">
                      {attendance || <span className="text-slate-300">10</span>}
                    </td>
                    <td className="p-2 text-center align-middle">
                      <div className="flex flex-wrap justify-center gap-1">
                        {getHsValues(hs1).length > 0 ? (
                          getHsValues(hs1).map((v, i) => (
                            <span key={i} className="px-1 border rounded bg-slate-50 dark:bg-slate-900">{v}</span>
                          ))
                        ) : (
                          <span className="px-1 border rounded text-slate-300 border-dashed">8</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-center align-middle">
                      <div className="flex flex-wrap justify-center gap-1">
                        {getHsValues(hs2).length > 0 ? (
                          getHsValues(hs2).map((v, i) => (
                            <span key={i} className="px-1 border rounded bg-emerald-50 dark:bg-emerald-950/30">{v}</span>
                          ))
                        ) : (
                          <span className="px-1 border rounded text-slate-300 border-dashed">9</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-center align-middle bg-slate-50/30 dark:bg-slate-900/20">
                      <div className="flex flex-col items-center gap-1">
                        <span className="whitespace-nowrap scale-[0.85]">
                          ({attendance || "10"}×{credits || "3"} + ΣHS1 + ΣHS2×2) / ΣHệ-số
                        </span>
                        <span className="font-bold text-primary">= {result?.tbThuongKi || "9.00"}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center align-middle bg-orange-50/20 dark:bg-orange-950/10">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-slate-400">Thi × 0.6</span>
                        <span className="font-bold text-orange-500">{examScore || <span className="text-slate-300">9</span>}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center align-middle">
                       <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                        <span className="text-[14px] font-black text-slate-800 dark:text-slate-200">
                           {result?.tbMon || "9.0"}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border",
                          (result?.tbMon ?? 10) >= 4 
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                            : "bg-rose-100 text-rose-700 border-rose-200"
                        )}>
                          {(result?.tbMon ?? 10) >= 4 ? "ĐẠT" : "HỎNG"}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t text-[11px] text-slate-500 italic">
              * TB Môn = (TB Quá trình × 0.4) + (Thi HK × 0.6). Chuẩn đạt: TB Môn ≥ 4.0 (Hệ 10)
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Export Confirmation Modal */}
      {isExportDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Xác nhận xuất file
              </CardTitle>
              <button 
                onClick={() => setIsExportDialogOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Bạn đang chuẩn bị xuất kết quả cho môn <strong>{subjectName || "không tên"}</strong> định dạng <strong>{exportType?.toUpperCase()}</strong>.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                Vui lòng xác nhận để bắt đầu quá trình tải xuống.
              </p>
            </CardContent>
            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button
                onClick={() => setIsExportDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Hủy
              </button>
              <RainbowButton
                onClick={() => {
                  if (exportType === 'excel') exportToExcel()
                  if (exportType === 'word') exportToWord()
                  if (exportType === 'txt') exportToTxt()
                  setIsExportDialogOpen(false)
                }}
                className="h-10 px-6 text-sm"
              >
                Xác nhận Tải về
              </RainbowButton>
            </div>
          </Card>
        </div>
      )}

      <div className="lg:col-span-5 xl:col-span-4 h-fit">
        <Card className="shadow-xl border-primary/10 overflow-hidden flex flex-col gap-0 h-fit">
          <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <LineChart className="w-4 h-4 text-primary" />
              Kết Quả
            </CardTitle>
            <div className="text-sm text-slate-500 font-medium">
              Môn: <span className="text-primary font-bold">{subjectName || "Chưa nhập"}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-500">Mẫu số chia:</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{result?.mauSo || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-500">TB thường kì:</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{result?.tbThuongKi.toFixed(2) || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-500">Điểm thi:</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{examScore || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-primary/5 px-2 rounded-lg mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-tighter">HỆ 4 (CPA/GPA)</span>
                    <span className="text-lg font-black text-primary leading-tight">{result?.tbMon4.toFixed(2) || "-"}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">HỆ 10 (TB MÔN)</span>
                    <span className="text-lg font-black text-slate-700 dark:text-slate-300 leading-tight">{result?.tbMon.toFixed(1) || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="relative py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-primary/5 text-center group overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <div className="text-xs uppercase tracking-[0.15em] font-black text-slate-400">ĐIỂM TRUNG BÌNH:</div>
                  <div className="text-5xl font-black text-primary tracking-tighter">
                    {result ? result.tbMon.toFixed(1) : "-"}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-125" />
              </div>
            </div>
            <div className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
              {result && (
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      setExportType('excel')
                      setIsExportDialogOpen(true)
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-100 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 transition-all group scale-95 hover:scale-100 active:scale-90"
                  >
                    <FileSpreadsheet className="w-5 h-5 mb-1 group-hover:bounce" />
                    <span className="text-xs font-bold">EXCEL</span>
                  </button>
                  <button 
                    onClick={() => {
                      setExportType('word')
                      setIsExportDialogOpen(true)
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-700 hover:bg-blue-100 transition-all group scale-95 hover:scale-100 active:scale-90"
                  >
                    <FileText className="w-5 h-5 mb-1 group-hover:bounce" />
                    <span className="text-xs font-bold">WORD</span>
                  </button>
                  <button 
                    onClick={() => {
                      setExportType('txt')
                      setIsExportDialogOpen(true)
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-100/50 text-slate-700 hover:bg-slate-200 transition-all group scale-95 hover:scale-100 active:scale-90"
                  >
                    <Download className="w-5 h-5 mb-1 group-hover:bounce" />
                    <span className="text-xs font-bold">TXT</span>
                  </button>
                </div>
              )}
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-900/50 border-y py-2.5 px-5 flex items-center gap-2">
              <Medal className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Thang Điểm & Xếp Loại</span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white dark:bg-slate-950 border-b text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-2.5 text-left pl-5">Chữ</th>
                    <th className="p-2.5 text-left">Hệ 10</th>
                    <th className="p-2.5 text-left">Hệ 4</th>
                    <th className="p-2.5 text-left pr-5">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                  {grades.map(g => (
                    <tr key={g.id} className={cn(
                      "hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors",
                      result?.grade.id === g.id && "bg-primary/5 dark:bg-primary/10"
                    )}>
                      <td className="p-3 pl-5 font-bold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          {g.letter}
                          {result?.grade.id === g.id && <CheckCircle2 className="w-3 h-3 text-primary" />}
                        </div>
                      </td>
                      <td className="p-3 text-dark-500 font-bold">{g.range}</td>
                      <td className="p-3 text-dark-500 font-bold">{g.grade4}</td>
                      <td className="p-3 pr-5">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-xs font-bold inline-block",
                          g.className.split(' ').find(c => c.startsWith('text-')),
                          g.className.split(' ').find(c => c.startsWith('bg-')) + ' bg-opacity-20'
                        )}>
                          {g.rank}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
              <p className="text-xs text-slate-400 font-medium italic text-center">
                (✓) là xếp loại dựa trên điểm của bạn
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}