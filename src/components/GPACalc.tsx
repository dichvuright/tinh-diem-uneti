"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Trash2, 
  Calculator, 
  LineChart, 
  GraduationCap,
  BookOpen,
  Hash
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { GradeCalculator } from '@/lib/grade-calculator'

interface SubjectRow {
  id: string
  name: string
  credits: string
  score: string
}

export default function GPACalc() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { id: Math.random().toString(), name: '', credits: '', score: '' }
  ])
  const [result, setResult] = useState<{
    gpa10: number
    gpa4: number
    totalCredits: number
  } | null>(null)

  const addSubject = () => {
    setSubjects([...subjects, { id: Math.random().toString(), name: '', credits: '', score: '' }])
  }

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id))
    }
  }

  const updateSubject = (id: string, field: keyof SubjectRow, value: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const calculateGPA = () => {
    let totalScoreCredits = 0
    let totalCredits = 0
    let totalScore4Credits = 0

    const validSubjects = subjects.filter(s => s.credits && s.score)

    if (validSubjects.length === 0) {
      toast.error("Vui lòng nhập ít nhất một môn học với đầy đủ thông tin")
      return
    }

    for (const s of validSubjects) {
      const credits = parseFloat(s.credits)
      const score = parseFloat(s.score)

      if (isNaN(credits) || credits <= 0) {
        toast.error(`Số tín chỉ của môn ${s.name || 'chưa tên'} không hợp lệ`)
        return
      }
      if (isNaN(score) || score < 0 || score > 10) {
        toast.error(`Điểm của môn ${s.name || 'chưa tên'} phải từ 0-10`)
        return
      }

      totalScoreCredits += score * credits
      totalCredits += credits
      totalScore4Credits += GradeCalculator.convertTo4(score) * credits
    }

    const gpa10 = totalScoreCredits / totalCredits
    const gpa4 = totalScore4Credits / totalCredits

    setResult({
      gpa10: Math.round(gpa10 * 100) / 100,
      gpa4: Math.round(gpa4 * 100) / 100,
      totalCredits
    })
    toast.success("Đã tính GPA thành công!")
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto">
      <div className="lg:col-span-8 space-y-4">
        <Card className="shadow-xl border-primary/10">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b py-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Nhập danh sách môn học
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="grid grid-cols-12 gap-2 items-end group animate-in slide-in-from-left-2 duration-200">
                  <div className="col-span-5 sm:col-span-6 space-y-1.5">
                    {index === 0 && <Label className="text-xs font-bold text-slate-500 uppercase">Tên môn học</Label>}
                    <div className="relative">
                      <Input 
                        placeholder="Tên môn học..." 
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                        className="pl-8 h-9 text-xs"
                      />
                      <BookOpen className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2 space-y-1.5">
                    {index === 0 && <Label className="text-xs font-bold text-slate-500 uppercase text-center block">Tín chỉ</Label>}
                    <div className="relative">
                      <Input 
                        placeholder="Số TC" 
                        type="number"
                        value={subject.credits}
                        onChange={(e) => updateSubject(subject.id, 'credits', e.target.value)}
                        className="pl-8 h-9 text-xs text-center"
                      />
                      <Hash className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 space-y-1.5">
                    {index === 0 && <Label className="text-xs font-bold text-slate-500 uppercase text-center block">Điểm (Hệ 10)</Label>}
                    <div className="relative">
                      <Input 
                        placeholder="Điểm" 
                        type="number"
                        step="0.1"
                        value={subject.score}
                        onChange={(e) => updateSubject(subject.id, 'score', e.target.value)}
                        className="pl-8 h-9 text-xs text-center"
                      />
                      <GraduationCap className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center pb-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSubject(subject.id)}
                      className="h-10 w-10 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={addSubject}
                variant="outline" 
                className="flex-1 h-11 border-dashed gap-2 hover:border-primary hover:text-primary transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm môn học mới
              </Button>
              <RainbowButton 
                onClick={calculateGPA}
                className="flex-1 h-11 text-base font-bold"
              >
                <Calculator className="w-4 h-4 mr-2" /> TÍNH ĐIỂM GPA
              </RainbowButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 h-fit">
        <Card className="shadow-xl border-primary/10 overflow-hidden sticky top-4">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b py-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              Kết Quả Tổng Kết
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-xs uppercase font-black text-primary/60 tracking-widest mb-1">GPA Hệ 10</p>
                    <p className="text-4xl font-black text-primary tracking-tighter">
                      {result ? result.gpa10.toFixed(2) : "--"}
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125" />
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center relative overflow-hidden group border-b-2 border-b-emerald-500">
                  <div className="relative z-10">
                    <p className="text-xs uppercase font-black text-emerald-600/60 tracking-widest mb-1">GPA Hệ 4</p>
                    <p className="text-4xl font-black text-emerald-600 tracking-tighter">
                      {result ? result.gpa4.toFixed(2) : "--"}
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="text-sm font-medium text-slate-500">Tổng số tín chỉ:</span>
                  <span className="text-sm font-bold text-slate-700">{result?.totalCredits || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="text-sm font-medium text-slate-500">Số môn đã nhập:</span>
                  <span className="text-sm font-bold text-slate-700">{subjects.filter(s => s.credits && s.score).length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-500">Xếp loại:</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    result ? GradeCalculator.getGradeInfo(result.gpa10).className : "bg-slate-100 text-slate-400"
                  )}>
                    {result ? GradeCalculator.getGradeInfo(result.gpa10).rank : "N/A"}
                  </span>
                </div>
              </div>

              {!result && (
                <div className="text-center py-4 px-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed text-slate-400">
                  <p className="text-xs italic">
                    Nhập thông tin môn học và nhấn "Tính Điểm GPA" để xem kết quả chi tiết.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
