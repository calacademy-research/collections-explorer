"use client";
import { useParams } from "next/navigation";

export default function PlantPage() {
  const params = useParams();
  const botanyId = params.id;

  return (
    <div className="w-full">
      <p>tbd marcelo</p>
    </div>
  );
}
