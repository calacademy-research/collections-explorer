"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();

  const handleBack = () => {
    if (document.referrer.includes("/botany")) {
      router.back();
    } else {
      router.push("/botany");
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
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Button>
      </div>
    </header>
  );
}
