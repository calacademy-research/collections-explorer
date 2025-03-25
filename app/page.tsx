"use client";

import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExploreSection from "@/components/ExploreSection";
import SearchBar from '@/components/search-bar';
import { useRouter } from 'next/navigation';

const GlobalSearch: React.FC = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = section.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      section.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    };
    
    section.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to botany page with search query
      router.push(`/botany?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(210, 241, 255, 0.1), transparent 80%)',
        backgroundSize: '120% 120%',
        backgroundPosition: 'center',
        transition: 'background-position 0.3s ease-out'
      }}
    >
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
            Discover Global Biodiversity
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 animate-slide-up text-balance">
            Explore the <span className="text-primary">Living World</span> Around Us
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 animation-delay-200 animate-slide-up max-w-2xl mx-auto text-balance">
            Access and explore millions of species records from around the world with an intuitive, beautifully designed interface.
          </p>
          
          <div className="mb-12 animation-delay-400 animate-slide-up">
            <SearchBar 
              onSearch={handleSearch} 
              expanded={true} 
              className="mx-auto"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animation-delay-600 animate-slide-up">
            <Button className="rounded-full px-8 py-6 h-auto text-base animated-button" onClick={() => router.push('/botany')}>
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" className="rounded-full px-8 py-6 h-auto text-base" onClick={() => window.location.href = '/about'}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce animation-delay-800">
        <div className="h-10 w-10 border-2 border-foreground/20 rounded-full flex items-center justify-center">
          <div className="h-5 w-5 border-b-2 border-r-2 border-foreground/40 rotate-45 translate-y-[-4px]"></div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <GlobalSearch />
      <ExploreSection />
    </>
  );
}
