import { createFileRoute } from '@tanstack/react-router'
import { WavyBackground } from 'src/components/shadcn/ui/shadcn-io/wavy-background'
import { Button } from '@/components/shadcn/ui/button'
import { getServerMessage } from '@/services/get-server-message'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    getServerMessage({ data: '🎉' }) // Prefetch for later use
    const ctx = context

    return { ctx }
  }, 
  component: App,
})

function App() {
  const { ctx } = Route.useLoaderData()
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
            {ctx.IsAuthenticated ? (
              <Button className="text-xl px-14 py-6 rounded-full font-bold transition-duration-300 hover:scale-120 hover:shadow-xl hover:bg-[#9e8cfc] ">
                <a href="/events">
                  {m.Home_Button2()}
                </a>
              </Button>
            ) : <Button className="text-xl px-14 py-6 rounded-full font-bold transition-duration-300 hover:scale-120 hover:shadow-xl hover:bg-[#9e8cfc] ">
              <a href="/signin">
                {m.Home_Button()}
              </a>
            </Button>}
          </div>
        </div>
      </WavyBackground>
    </div>
  )
}
