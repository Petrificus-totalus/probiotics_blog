"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/spend?page=1");
  }, [router]);

  return null;
}
