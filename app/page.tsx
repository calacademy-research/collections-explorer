"use client";

import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExploreSection from "@/components/ExploreSection";
import SearchBar from '@/components/search-bar';
import { useRouter } from 'next/navigation';
import BackgroundImage from './components/BackgroundImage';
import Link from 'next/link';
import Image from 'next/image';

const collections = [
  { title: "Botany", href: "/botany" },
  { title: "Entomology", href: "/entomology" },
  { title: "Herpetology", href: "/herpetology" },
  { title: "Ichthyology", href: "/ichthyology" },
  { title: "Ornithology", href: "/ornithology" },
];

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
      style={{ zIndex: 1 }}
    >
      <BackgroundImage />
      
      <div className="container mx-auto px-4 relative z-[2]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-3 bg-white/80 text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-md animate-fade-in backdrop-blur-md">
            Discover Global Biodiversity
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 animate-slide-up text-balance text-white drop-shadow-lg">
            Explore the <span className="text-white">Living</span> <span className="text-white">World</span> Around Us
          </h1>
          
          <p className="text-xl text-white mb-10 animation-delay-200 animate-slide-up max-w-2xl mx-auto text-balance drop-shadow-lg">
            Access and discover thousands of species records from around the world with an intuitive, beautifully designed interface.
          </p>
          
          <div className="mb-12 animation-delay-400 animate-slide-up">
            <SearchBar 
              onSearch={handleSearch} 
              expanded={true} 
              className="mx-auto backdrop-blur-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animation-delay-600 animate-slide-up">
            <Button className="rounded-full px-8 py-6 h-auto text-base animated-button backdrop-blur-sm" onClick={() => router.push('/botany')}>
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" className="rounded-full px-8 py-6 h-auto text-base backdrop-blur-sm" onClick={() => window.location.href = '/about'}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce animation-delay-800">
        <div className="h-10 w-10 border-2 border-white/20 rounded-full flex items-center justify-center">
          <div className="h-5 w-5 border-b-2 border-r-2 border-white/40 rotate-45 translate-y-[-4px]"></div>
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
      <footer className="border-t py-8 bg-muted/30">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="flex flex-row items-stretch gap-8 relative">
            {/* Left: Decorative nature gif */}
            <div className="hidden md:block flex-shrink-0" style={{ width: '320px', minWidth: '220px', maxWidth: '400px' }}>
              <Image 
                src="/nature-background.gif" 
                alt="Nature decorative background" 
                width={320}
                height={240}
                className="h-full w-full object-cover rounded-lg opacity-40 pointer-events-none" 
              />
            </div>
            {/* Right: Footer grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
              <div>
                <h3 className="font-bold mb-4">California Academy of Sciences</h3>
                <p className="text-sm text-muted-foreground">
                  55 Music Concourse Drive
                  <br />
                  Golden Gate Park
                  <br />
                  San Francisco, CA 94118
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-4">Collections</h3>
                <ul className="space-y-2">
                  {collections.map((collection) => (
                    <li key={collection.title}>
                      <Link
                        href={collection.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {collection.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">About</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/research"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Research
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Connect</h3>
                <div className="flex gap-4">
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} California Academy of Sciences. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
