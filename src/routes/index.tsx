import { createFileRoute } from '@tanstack/react-router'
import { WavyBackground } from 'src/components/shadcn/ui/shadcn-io/wavy-background'
import { Button } from '@/components/shadcn/ui/button'
import { getServerMessage } from '@/services/get-server-message'
import { m } from '@/paraglide/messages'
import { useRef } from 'react'
import { useIsVisible } from '@/hooks/useIsVisible'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/ui/card'
import { PlaceholderImage1, PlaceholderImage2 } from '@/assets'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollToPlugin, ScrollSmoother, ScrollTrigger } from 'gsap/all'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    getServerMessage({ data: '🎉' })
    const ctx = context

    return { ctx }
  },
  component: App,
})

function App() {
  const { ctx } = Route.useLoaderData()

  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  const ref2 = useRef<HTMLDivElement>(null);
  const isVisible2 = useIsVisible(ref2);

  const ref3 = useRef<HTMLDivElement>(null);
  const isVisible3 = useIsVisible(ref3);

  const ref4 = useRef<HTMLDivElement>(null);
  const isVisible4 = useIsVisible(ref4);

  if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger, ScrollSmoother);
  }
  
  useGSAP(() => {
    let smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: false,
      normalizeScroll: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <div id='section1' ref={ref1} className={`transition-opacity ease-in duration-500 ${isVisible1 ? "opacity-100" : "opacity-0"} relative h-screen w-full overflow`}>
          <WavyBackground
            backgroundFill="#0f0f23"
            colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9"]}
            waveWidth={30}
            blur={15}
            speed="fast"
            waveOpacity={1}
            containerClassName="h-full w-full"
            className="flex items-center justify-center">
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
        <div id='section2' className="flex flex-col w-full text-center text-white border-t-1 border-b-1">
          <div ref={ref2} className={`transition-opacity ease-in duration-1300 ${isVisible2 ? "opacity-100" : "opacity-0"}`}>
            <Card className="bg-secondary shadow-lg m-10 p-20 transition-transform duration-300">
              <CardHeader>
                <CardTitle className='text-3xl'>
                  "VibeSpot isn't just an app, it's your gateway to unforgettable live music experiences. Discover events, connect with fellow music lovers, and let the rhythm of the city guide you to your next great adventure."
                </CardTitle>
                <CardDescription className='text-2xl'>
                  - Alex R., Event Manager
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div ref={ref3} className={`transition-opacity ease-in duration-1300 ${isVisible3 ? "opacity-100" : "opacity-0"} flex flex-row justify-between`}>
            <Card className="bg-secondary shadow-lg m-10 p-10 w-1/2">
              <CardHeader>
                <CardTitle className='text-xl'>
                  Discover live music events happening around you with VibeSpot. Whether you're into rock, jazz, pop, or indie, our app helps you find the perfect event to match your vibe.
                </CardTitle>
                <CardDescription className='text-2xl'>

                </CardDescription>
              </CardHeader>
            </Card>
            <div className='m-10 w-1/4'>
              <img src={PlaceholderImage1} alt="" className='rounded-2xl w-fit h-47 shadow-2xl' />
            </div>
          </div>
          <div ref={ref4} className={`transition-opacity ease-in duration-1300 ${isVisible4 ? "opacity-100" : "opacity-0"} flex flex-row justify-between`}>
            <div className='m-10 w-1/4'>
              <img src={PlaceholderImage2} alt="" className='rounded-2xl w-fit h-54 shadow-2xl' />
            </div>
            <Card className="bg-secondary shadow-lg m-10 p-10 w-1/2">
              <CardHeader>
                <CardTitle className='text-xl'>
                  "VibeSpot makes it easy to connect with friends and fellow music enthusiasts. Share events, plan meetups, and create unforgettable memories together."
                </CardTitle>
                <CardDescription className='text-lg'>
                  - Jamie L., Music Enthusiast
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
