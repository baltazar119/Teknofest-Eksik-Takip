"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [tc, setTc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tc.trim().length === 11) {
      router.push("/durum");
    } else {
      alert("Lütfen geçerli bir T.C. Kimlik No girin.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0A406C] to-[#E72313] relative overflow-hidden px-4">
      {/* Sol Logo */}
      <div className="absolute top-0 left-0 opacity-10 w-[120px] sm:w-[180px] md:w-[250px] lg:w-[320px] xl:w-[369px]">
        <Image src="/teknofestlogo.svg" alt="teknofest logo" width={369} height={369} className="w-full h-auto" />
      </div>

      {/* Sağ Logo */}
      <div className="absolute top-0 right-0 opacity-15 w-[120px] sm:w-[180px] md:w-[250px] lg:w-[320px] xl:w-[369px]">
        <Image src="/t3logo.svg" alt="t3 logo" width={369} height={369} className="w-full h-auto" />
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-[600px] p-6 md:p-8 flex flex-col items-center justify-center">
        <h1 className="text-white text-lg md:text-xl font-bold mb-6 text-center">
          Teknofest Eksik Takip Sistemi Giriş
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="T.C. Kimlik No"
            value={tc}
            onChange={(e) => setTc(e.target.value)}
            className="w-full max-w-[400px] h-[50px] px-4 border border-gray-300 rounded-lg outline-none"
          />

          <button
            type="submit"
            className="w-full max-w-[400px] h-[55px] bg-white text-[#0A406C] font-semibold rounded-md hover:bg-gray-100 transition"
          >
            GÖNDER
          </button>
        </form>
      </div>
    </main>
  );
}
