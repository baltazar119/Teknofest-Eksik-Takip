"use client";

import { useState } from "react";

export default function FormPage() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [area, setArea] = useState("Teknofest İstanbul");
  const [catering, setCatering] = useState("Yok");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("tarih", date);
    form.append("saatBasla", startTime);
    form.append("saatBitis", endTime);
    form.append("alan", area);
    form.append("catering", catering === "Var" ? "true" : "false");

    if (file) {
      form.append("dosya", file);
    }

    try {
      const response = await fetch("/api/gonullu", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Kayıt başarıyla yapıldı!");
        setDate("");
        setStartTime("");
        setEndTime("");
        setArea("Teknofest İstanbul");
        setCatering("Yok");
        setFile(null);
      } else {
        alert("Hata: " + result.error);
      }
    } catch (error) {
      alert("Sunucu hatası: " + error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0A406C] to-[#E72313] px-4 py-10">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#0A406C] mb-6">Gönüllü Formu</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
          <label className="text-[#0A406C]">Gün</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-[#E53935] to-[#7F201D] text-white"
            required
          />

          <label className="text-[#0A406C]">Saat Aralığı</label>
          <div className="flex gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-1/2 px-4 py-2 rounded-md bg-gradient-to-r from-[#E53935] to-[#7F201D] text-white"
              required
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-1/2 px-4 py-2 rounded-md bg-gradient-to-r from-[#E53935] to-[#7F201D] text-white"
              required
            />
          </div>

          <label className="text-[#0A406C]">Alan</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-[#E53935] to-[#7F201D] text-white"
          >
            <option>Teknofest İstanbul</option>
            <option>Teknofest Ankara</option>
          </select>

          <label className="text-[#0A406C]">Catering</label>
          <div className="flex gap-4 px-2">
            <label className="flex items-center gap-1 text-gray-800">
              <input type="radio" checked={catering === "Var"} onChange={() => setCatering("Var")} />
              Var
            </label>
            <label className="flex items-center gap-1 text-gray-800">
              <input type="radio" checked={catering === "Yok"} onChange={() => setCatering("Yok")} />
              Yok
            </label>
          </div>

          <label className="text-[#0A406C]">Resim Ekle</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="bg-gradient-to-r from-[#E53935] to-[#7F201D] p-2 rounded-md text-white file:bg-white file:text-[#E53935]"
          />

          <button
            type="submit"
            className="mt-4 bg-[#0A406C] hover:bg-[#09365b] text-white font-bold py-3 rounded-md"
          >
            KAYDET
          </button>
        </form>
      </div>
    </main>
  );
}
