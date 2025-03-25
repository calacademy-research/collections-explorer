"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/botany">
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Link>
        </Button>
      </div>
    </header>
  );
} 