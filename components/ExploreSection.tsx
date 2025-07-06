import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ExploreCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  path: string;
}

const ExploreSection: React.FC = () => {
  // Fetch the botany count dynamically
  const botanyCountResult = useQuery(api.botany.getBotanyDocumentCount, {});
  const botanyCount = botanyCountResult?.count ?? 0;
  const categories: ExploreCategory[] = [
    {
      id: 'Botany',
      title: 'Botany',
      description: 'Discover flowering plants, trees, ferns, and other flora.',
      icon: '🌿',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      count: botanyCount,
      path: '/botany'
    },
    {
      id: 'InvertebrateZoology',
      title: 'Invertebrate Zoology',
      description: 'Study creatures without backbones, from insects to mollusks.',
      icon: '🦋',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      count: 0,
      path: '/explorer?collection=invertebrate-zoology'
    },
    {
      id: 'Mammalogy',
      title: 'Mammalogy',
      description: 'Explore the world of mammals, from tiny rodents to large carnivores.',
      icon: '🦁',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      count: 0,
      path: '/explorer?collection=mammalogy'
    },
    {
      id: 'Ornithology',
      title: 'Ornithology',
      description: 'Study our extensive collection of bird specimens and data.',
      icon: '🦅',
      color: 'bg-sky-50 border-sky-200 text-sky-900',
      count: 0,
      path: '/explorer?collection=ornithology'
    }
  ];

  return (
    <section className="relative py-20 bg-background z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="scroll-effect">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">
                Explore Biodiversity
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Browse through millions of species records categorized for easy discovery.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={category.id}
                href={category.path}
                className="scroll-effect" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  'rounded-2xl border hover-card h-full p-6 flex flex-col',
                  category.color
                )}>
                  <div className="text-4xl mb-4">{category.icon}</div>
                  
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  
                  <p className="text-sm mb-4">{category.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm">
                      {category.id === 'Botany'
                        ? (botanyCountResult === undefined ? 'Loading...' : botanyCount.toLocaleString() + ' species')
                        : (category.count === 0 ? "Coming Soon" : category.count.toLocaleString() + " species")}
                    </span>
                    
                    <ArrowRight className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection; 