import StrollerCalculator from "@/components/stroller-calculator"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#49205e] to-[#805ba5] p-4 md:p-8">
      <main className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center bg-white/80 backdrop-blur-sm py-6 px-4 rounded-lg shadow-lg">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-[#5e4b8b] md:text-5xl drop-shadow-md">
              Stroller Running Calculator
            </h1>
            <p className="text-[#5e4b8b] text-lg">Calculate your "extra" miles when pushing a stroller</p>
          </div>
          <StrollerCalculator />

          <div className="mt-8 text-center bg-white/80 backdrop-blur-sm py-3 px-4 rounded-lg">
            <p className="text-[#5e4b8b] text-sm">
              Got feedback? Send it to us!{" "}
              <a
                href="mailto:strollerrunningcalculator@gmail.com"
                className="underline hover:text-[#ff6e61] transition-colors"
              >
                strollerrunningcalculator@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
