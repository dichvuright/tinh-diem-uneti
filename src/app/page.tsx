import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubjectGradeCalc from "@/components/SubjectGradeCalc";
import GPACalc from "@/components/GPACalc";
import CPACalc from "@/components/CPACalc";
import { Calculator, GraduationCap, BarChart3, TrendingUp } from "lucide-react";
import { Toaster } from "sonner";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 md:px-6">
      <div className="relative z-10 max-w-7xl mx-auto space-y-4">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-3">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
            <SparklesText>Công Cụ Tính Điểm UNETI</SparklesText>
          </h1>
          <TypingAnimation className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
            Công cụ tính điểm học tập hiện đại, chính xác và dễ sử dụng cho học
            sinh, sinh viên.
          </TypingAnimation>
          <div className="group mt-2 relative mx-auto flex w-fit z-30 items-center justify-center rounded-full px-3 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
          <span
            className={cn(
              "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-slate-300 dark:bg-slate-700" />
          <AnimatedGradientText className="text-xs font-medium">
            DichVuRight - DHTI19A3HN UNETI
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-3 stroke-slate-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </div>
        </header>
      
        <Tabs defaultValue="subject" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 h-12 p-1">
              <TabsTrigger
                value="subject"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Calculator className="w-4 h-4 hidden sm:inline" />
                Môn học
              </TabsTrigger>
              <TabsTrigger
                value="gpa"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <BarChart3 className="w-4 h-4 hidden sm:inline" />
                GPA
              </TabsTrigger>
              <TabsTrigger
                value="cpa"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <TrendingUp className="w-4 h-4 hidden sm:inline" />
                CPA
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="subject"
            className="mt-0 focus-visible:outline-none"
          >
            <h2 className="sr-only">Tính điểm trung bình môn học</h2>
            <SubjectGradeCalc />
          </TabsContent>

          <TabsContent value="gpa" className="mt-0 focus-visible:outline-none">
            <h2 className="sr-only">Tính điểm GPA học kỳ</h2>
            <GPACalc />
          </TabsContent>

          <TabsContent value="cpa" className="mt-0 focus-visible:outline-none">
            <h2 className="sr-only">Tính điểm CPA tích lũy</h2>
            <CPACalc />
          </TabsContent>
        </Tabs>

        <footer className="text-center text-slate-400 text-sm pt-12">
          &copy; {new Date().getFullYear()} DichVuRight - DHTI19A3HN UNETI. All
          rights reserved.
        </footer>
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      <Toaster position="top-center" richColors />
    </main>
  );
}
