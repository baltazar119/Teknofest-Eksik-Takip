"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PcDurumPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0A406C] to-[#E72313] relative overflow-hidden px-4">
      {/* Sol Logo */}
      <div className="absolute top-4 left-4 w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] xl:w-[140px]">
        <Image
          src="/teknofestlogo.svg"
          alt="Teknofest Logo"
          width={369}
          height={369}
          className="w-full h-auto"
        />
      </div>

      {/* Sağ Logo */}
      <div className="absolute top-4 right-4 w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] xl:w-[140px]">
        <Image
          src="/t3logo.svg"
          alt="T3 Logo"
          width={369}
          height={369}
          className="w-full h-auto"
        />
      </div>

      {/* Kart */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-[480px] flex flex-col items-center gap-6 z-10">
        {/* Başlık */}
        <h1 className="text-xl md:text-2xl font-bold text-center text-[#0A406C]">
          Gönüllü Formu
        </h1>
        <p className="text-sm text-center text-gray-700">
          Hoş geldiniz, lütfen bir işlem seçin:
        </p>

        {/* Butonlar */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => router.push("/pc-form")}
            className="w-full h-[50px] bg-[#0A406C] text-white font-semibold rounded-md shadow hover:bg-[#09365b] transition"
          >
            Durum Bildir
          </button>
          <button
            onClick={() => alert("Su Bildirildi")}
            className="w-full h-[50px] bg-[#0A406C] text-white font-semibold rounded-md shadow hover:bg-[#09365b] transition"
          >
            Su Bildir
          </button>
          <button
            onClick={() => alert("Sorun Bildirildi")}
            className="w-full h-[50px] bg-[#E53935] text-white font-semibold rounded-md shadow hover:bg-[#cc3c3c] transition"
          >
            Sorun Bildir
          </button>
        </div>
      </div>
    </main>
  );
}
