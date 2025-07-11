"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/botany');
    }
  };

  return (
    <header className="border-b">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={handleBack}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
//linter errors changed