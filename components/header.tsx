"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
