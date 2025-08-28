import { createFileRoute } from '@tanstack/react-router'
import { WavyBackground } from '@/components/ui/shadcn-io/wavy-background'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="relative h-screen w-full overflow">
      <WavyBackground
        backgroundFill="#0f0f23"
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9"]}
        waveWidth={50}
        blur={10}
        speed="fast"
        waveOpacity={0.5}
        containerClassName="h-full w-full"
        className="flex items-center justify-center">
        {/* Your content flows above */}
        <div className="text-center text-white z-10">
          <h1 className="text-6xl font-bold mb-4">
            VibeSpot
          </h1>
          <p className="text-2xl opacity-80">
            Where music meets the moment
          </p>
          <div className='mt-12 flex justify-center'>
            <Button className="text-xl px-14 py-6 rounded-full font-extrabold transition-duration-300 hover:scale-120 hover:shadow-xl hover:bg-[#9e8cfc] ">
              <a href="/map">
                Find Your Vibe!
              </a>
            </Button>
          </div>
        </div>
      </WavyBackground>
    </div>
  )
}
