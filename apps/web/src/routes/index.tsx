import { createFileRoute } from '@tanstack/react-router'
import { WavyBackground } from 'src/components/shadcn/ui/shadcn-io/wavy-background'
import { Button } from '@/components/shadcn/ui/button'
import { getServerMessage } from '@/services/get-server-message'
import { m } from '@/paraglide/messages'
import { useEffect, useRef, useMemo } from 'react'
import { useIsVisible } from '@/hooks/useIsVisible'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/ui/card'
import { PlaceholderImage2, PlaceholderImage3 } from '@/assets'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollToPlugin, ScrollTrigger } from 'gsap/all'
import { getThemeServerFn } from '@/services/ThemeService'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    getServerMessage({ data: '🎉' })
    const ctx = context
    const theme = await getThemeServerFn()

    return { ctx, theme }
  },
  component: App,
})

function App() {
  const { ctx, theme } = Route.useLoaderData()

  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  const ref2 = useRef<HTMLDivElement>(null);
  const isVisible2 = useIsVisible(ref2);

  const ref3 = useRef<HTMLDivElement>(null);
  const isVisible3 = useIsVisible(ref3);

  const ref4 = useRef<HTMLDivElement>(null);
  const isVisible4 = useIsVisible(ref4);

  // Calculate background color safely (no document access during SSR)
  const backgroundColor = useMemo(() => {
    if (theme === 'dark') return '#0f0f23';
    if (theme === 'light') return '#ffffff';
    // Default to light for SSR
    return '#ffffff';
  }, [theme]);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor])

  // Only register GSAP plugins on client side, once
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger);
    }
  }, []);

  return (
    <div className="relative">
      <div>
        <div id='section1' ref={ref1} className={`transition-opacity ease-in duration-500 ${isVisible1 ? "opacity-100" : "opacity-0"} relative h-screen w-full overflow`}>
            <WavyBackground
            backgroundFill={backgroundColor}
            colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9"]}
            waveWidth={30}
            blur={15}
            speed="fast"
            waveOpacity={1}
            containerClassName="h-full w-full"
            className="flex items-center justify-center">
            <div className="text-center text-white z-10 px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              VibeSpot
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl opacity-80 text-foreground">
              Where music meets the moment
              </p>
              <div className='mt-8 md:mt-12 flex justify-center'>
              {ctx.IsAuthenticated ? (
                <Button className="text-base md:text-lg lg:text-xl px-8 md:px-12 lg:px-14 py-4 md:py-5 lg:py-6 rounded-full font-bold transition-duration-300 hover:scale-110 md:hover:scale-120 hover:shadow-xl hover:bg-[#9e8cfc] ">
                <a href="/events">
                  {m.Home_Button2()}
                </a>
                </Button>
              ) : <Button className="text-base md:text-lg lg:text-xl px-8 md:px-12 lg:px-14 py-4 md:py-5 lg:py-6 rounded-full font-bold transition-duration-300 hover:scale-110 md:hover:scale-120 hover:shadow-xl hover:bg-[#9e8cfc] ">
                <a href="/signin">
                {m.Home_Button()}
                </a>
              </Button>}
              </div>
            </div>
            </WavyBackground>
        </div>
        <div id='section2' className="flex flex-col w-full text-center text-white border-t-1 border-b-1">
          <div ref={ref2} className={`transition-opacity ease-in duration-1300 ${isVisible2 ? "opacity-100" : "opacity-0"}`}>
            <Card className="bg-secondary shadow-lg m-4 md:m-8 lg:m-10 p-8 md:p-12 lg:p-20 transition-transform duration-300">
              <CardHeader>
                <CardTitle className='text-xl md:text-2xl lg:text-3xl'>
                  "VibeSpot isn't just an app, it's your gateway to unforgettable live music experiences. Discover events, connect with fellow music lovers, and let the rhythm of the city guide you to your next great adventure."
                </CardTitle>
                <CardDescription className='text-lg md:text-xl lg:text-2xl'>
                  - Alex R., Event Manager
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div ref={ref3} className={`transition-opacity ease-in duration-1300 ${isVisible3 ? "opacity-100" : "opacity-0"} flex flex-col md:flex-row justify-between items-center`}>
            <Card className="bg-secondary shadow-lg m-4 md:m-8 lg:m-10 p-6 md:p-8 lg:p-10 w-full md:w-1/2">
              <CardHeader>
                <CardTitle className='text-base md:text-lg lg:text-xl'>
                  Discover live music events happening around you with VibeSpot. Whether you're into rock, jazz, pop, or indie, our app helps you find the perfect event to match your vibe.
                </CardTitle>
                <CardDescription className='text-base md:text-lg lg:text-2xl'>

                </CardDescription>
              </CardHeader>
            </Card>
            <div className='m-4 md:m-8 lg:m-10 w-full md:w-1/4'>
              <img src={PlaceholderImage2} alt="" className='rounded-2xl w-full h-auto max-h-60 md:max-h-none md:h-47 shadow-2xl object-cover' />
            </div>
          </div>
          <div ref={ref4} className={`transition-opacity ease-in duration-1300 ${isVisible4 ? "opacity-100" : "opacity-0"} flex flex-col md:flex-row-reverse justify-between items-center`}>
            <Card className="bg-secondary shadow-lg m-4 md:m-8 lg:m-10 p-6 md:p-8 lg:p-10 w-full md:w-1/2">
              <CardHeader>
                <CardTitle className='text-base md:text-lg lg:text-xl'>
                  "VibeSpot makes it easy to connect with friends and fellow music enthusiasts. Share events, plan meetups, and create unforgettable memories together."
                </CardTitle>
                <CardDescription className='text-sm md:text-base lg:text-lg'>
                  - Jamie L., Music Enthusiast
                </CardDescription>
              </CardHeader>
            </Card>
            <div className='m-4 md:m-8 lg:m-10 w-full md:w-1/4'>
              <img src={PlaceholderImage3} alt="" className='rounded-2xl w-full h-auto max-h-60 md:max-h-none md:h-54 shadow-2xl object-cover' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
