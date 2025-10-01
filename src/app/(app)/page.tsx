'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'
import DotGrid from '../../components/DotGrid'
import SplitText from "../../components/SplitText"
import ScrollVelocity from '../../components/ScrollVelocity'
import Link from "next/link"

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

export default function Home() {
  return (
    <main className="relative bg-black flex flex-col items-center justify-center px-4 md:px-24 py-12 overflow-hidden h-full min-h-[82vh] ">
      
      {/* 🔵 Fullscreen DotGrid Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <DotGrid
          dotSize={10}
          gap={35}
          baseColor="#5227FF"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Foreground Content - 2 Columns */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-6xl ">
        
        {/* Left Section */}
        <section className="text-white space-y-6">
          <SplitText
            text="Wanna Go Anonymous!"
            className="text-5xl md:text-7xl font-semibold"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <p className="text-lg md:text-2xl text-gray-300 max-w-lg">
            Explore mystery messages where your identity remains a secret.
          </p>
          <div className="flex gap-5">
            <Link href='/sign-up'>
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition"
          >
            Sign Up
          </Button>
          </Link>
           <Link href='/work'>
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition"
          >
            How it Works
          </Button>
          </Link>
          </div>
        
        </section>

        {/* Right Section - Carousel */}
        <div className="w-full max-w-sm">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselContent>
              {messages.map((message, index) => {
                // Extract sender name (after "Message from ")
                const sender = message.title.replace("Message from ", "");
                return (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <span>Message from </span>
                            <span className="line-through text-gray-500">{sender}</span>
                            <span className="text-purple-600 font-bold">Anonymous</span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex  items-center justify-center p-6">
                          <span className="text-xl font-semibold text-center">
                            {message.content}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Scroll Velocity Section */}
      <div className="relative z-10 mt-16 w-full">
        <ScrollVelocity
          texts={['Cholo Dei Feedback', 'Go Anonymous']}
          velocity={100}
          className="custom-scroll-text text-white"
        />
      </div>
    </main>
  )
}
