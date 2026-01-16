export interface GradeInfo {
  id: string
  min: number
  max: number
  letter: string
  rank: string
  className: string
  range: string
  grade4: string
}

export class GradeCalculator {
  static readonly grades: GradeInfo[] = [
    { id: 'gradeA', min: 8.5, max: 10, letter: 'A', rank: 'Giỏi', range: '8.5 -> 10.0', className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400', grade4: '4.0' },
    { id: 'gradeBPlus', min: 7.8, max: 8.4, letter: 'B+', rank: 'Khá giỏi', range: '7.8 -> 8.4', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400', grade4: '3.5' },
    { id: 'gradeB', min: 7.0, max: 7.7, letter: 'B', rank: 'Khá', range: '7.0 -> 7.7', className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400', grade4: '3.0' },
    { id: 'gradeCPlus', min: 6.3, max: 6.9, letter: 'C+', rank: 'TB khá', range: '6.3 -> 6.9', className: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400', grade4: '2.5' },
    { id: 'gradeC', min: 5.5, max: 6.2, letter: 'C', rank: 'Trung bình', range: '5.5 -> 6.2', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400', grade4: '2.0' },
    { id: 'gradeDPlus', min: 4.8, max: 5.4, letter: 'D+', rank: 'TB Yếu', range: '4.8 -> 5.4', className: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400', grade4: '1.5' },
    { id: 'gradeD', min: 4.0, max: 4.7, letter: 'D', rank: 'Yếu', range: '4.0 -> 4.7', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400', grade4: '1.0' },
    { id: 'gradeFPlus', min: 3.0, max: 3.9, letter: 'F+', rank: 'Kém', range: '3.0 -> 3.9', className: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400', grade4:'0.5' },
    { id: 'gradeF', min: 0, max: 2.9, letter: 'F', rank: 'Rất kém', range: '0.0 -> 2.9', className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400', grade4: '0.0' }
  ]

  static getGradeInfo(score10: number): GradeInfo {
    return this.grades.find(g => score10 >= g.min && score10 <= g.max) || this.grades[this.grades.length - 1]
  }

  static convertTo4(score10: number): number {
    if (score10 >= 8.5) return 4.0
    if (score10 >= 7.8) return 3.5
    if (score10 >= 7.0) return 3.0
    if (score10 >= 6.3) return 2.5
    if (score10 >= 5.5) return 2.0
    if (score10 >= 4.8) return 1.5
    if (score10 >= 4.0) return 1.0
    return 0.0
  }

  static calculateSubjectGrade(
    credits: number,
    attendance: number,
    hs1: number[],
    hs2: number[],
    examScore: number
  ) {
    const tuSo = (attendance * credits) + hs1.reduce((a, b) => a + b, 0) + (hs2.reduce((a, b) => a + b, 0) * 2)
    const mauSo = credits + hs1.length + (hs2.length * 2)
    
    if (mauSo === 0) return null

    let tbThuongKi = tuSo / mauSo
    tbThuongKi = Math.round(tbThuongKi * 100) / 100

    let tbMonValue = (tbThuongKi * 0.4) + (examScore * 0.6)
    tbMonValue = Math.round(tbMonValue * 10) / 10

    const gradeInfo = this.getGradeInfo(tbMonValue)
    const tbMon4Value = this.convertTo4(tbMonValue)

    return {
      tbThuongKi,
      tbMonValue,
      tbMon4Value,
      gradeInfo,
      mauSo,
      isPassed: tbMonValue >= 4.0
    }
  }
}
