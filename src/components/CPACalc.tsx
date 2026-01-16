"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Label } from "@/components/ui/label"
import { 
  Calculator, 
  LineChart, 
  TrendingUp,
  History,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { GradeCalculator } from '@/lib/grade-calculator'

export default function CPACalc() {
  const [currentCPA, setCurrentCPA] = useState('')
  const [currentCredits, setCurrentCredits] = useState('')
  const [newGPA, setNewGPA] = useState('')
  const [newCredits, setNewCredits] = useState('')
  
  const [result, setResult] = useState<{
    finalCPA: number
    totalCredits: number
  } | null>(null)

  const calculateCPA = () => {
    const cGPA = parseFloat(currentCPA)
    const cCredits = parseFloat(currentCredits)
    const nGPA = parseFloat(newGPA)
    const nCredits = parseFloat(newCredits)

    if (isNaN(cGPA) || isNaN(cCredits) || isNaN(nGPA) || isNaN(nCredits)) {
      toast.error("Vui lòng nhập đầy đủ và chính xác các thông tin")
      return
    }

    if (cGPA < 0 || cGPA > 4 || nGPA < 0 || nGPA > 4) {
      toast.error("Điểm CPA/GPA phải nằm trong khoảng 0 - 4")
      return
    }

    if (cCredits < 0 || nCredits <= 0) {
      toast.error("Số tín chỉ không hợp lệ")
      return
    }

    const totalCredits = cCredits + nCredits
    const totalPoints = (cGPA * cCredits) + (nGPA * nCredits)
    const finalCPA = totalPoints / totalCredits

    setResult({
      finalCPA: Math.round(finalCPA * 100) / 100,
      totalCredits
    })
    toast.success("Đã tính CPA tích lũy thành công!")
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto">
      <div className="lg:col-span-12">
        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b py-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Dự tính CPA tích lũy (Hệ 4)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <History className="w-4 h-4 text-slate-400" />
                    <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Kết quả hiện tại</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">CPA hiện tại</Label>
                      <Input 
                        placeholder="VD: 3.2" 
                        type="number"
                        step="0.01"
                        value={currentCPA}
                        onChange={(e) => setCurrentCPA(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Số TC tích lũy</Label>
                      <Input 
                        placeholder="VD: 60" 
                        type="number"
                        value={currentCredits}
                        onChange={(e) => setCurrentCredits(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Target className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Học kỳ mới</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">GPA dự kiến</Label>
                      <Input 
                        placeholder="VD: 3.5" 
                        type="number"
                        step="0.01"
                        value={newGPA}
                        onChange={(e) => setNewGPA(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Số TC học kỳ</Label>
                      <Input 
                        placeholder="VD: 18" 
                        type="number"
                        value={newCredits}
                        onChange={(e) => setNewCredits(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <RainbowButton 
                  onClick={calculateCPA}
                  className="w-full h-12 text-lg font-bold"
                >
                  <Calculator className="w-5 h-5 mr-3" /> TÍNH CPA DỰ KIẾN
                </RainbowButton>
              </div>

              <div className="flex flex-col justify-center">
                {result ? (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">CPA SAU KHI CẬP NHẬT</p>
                      <div className="text-7xl font-black text-primary tracking-tighter">
                        {result.finalCPA.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm font-medium text-slate-500">Tổng số tín chỉ mới:</span>
                        <span className="text-sm font-bold text-slate-700">{result.totalCredits}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm font-medium text-slate-500">Xếp loại tích lũy:</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          GradeCalculator.grades.find(g => parseFloat(g.grade4) <= result.finalCPA)?.className || "bg-slate-100 text-slate-400"
                        )}>
                          {GradeCalculator.grades.find(g => parseFloat(g.grade4) <= result.finalCPA)?.rank || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex flex-items-center justify-center p-12 text-center flex-col gap-4">
                    <LineChart className="w-16 h-16 mx-auto text-slate-200" />
                    <p className="text-slate-400 italic">
                      Nhập thông tin và nhấn tính toán để thấy kết quả CPA dự kiến của bạn.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
