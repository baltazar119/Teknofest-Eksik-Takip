"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Gonullu = {
  id: number;
  tarih: string;
  saatBasla: string;
  saatBitis: string;
  alan: string;
  catering: boolean;
  dosyaYolu: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [veriler, setVeriler] = useState<Gonullu[]>([]);
  const [arama, setArama] = useState("");
  const [tarihFiltre, setTarihFiltre] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Gonullu>>({});
  const tabloRef = useRef<HTMLDivElement>(null);

  // Giriş kontrolü
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      router.replace("/admin-login");
    }
  }, [router]);

  // Verileri çek
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/gonullu");
      const data = await response.json();
      setVeriler(data);
    } catch (error) {
      alert("Veriler yüklenirken hata oluştu.");
    }
  };

  // Filtreleme
  const filtreliVeriler = veriler.filter((k) => {
    const tarihUygun = tarihFiltre ? k.tarih.startsWith(tarihFiltre) : true;
    const alanUygun = k.alan.toLowerCase().includes(arama.toLowerCase());
    return tarihUygun && alanUygun;
  });

  // PDF dışa aktarım
  const handlePdfExport = async () => {
    if (!tabloRef.current) return;
    const canvas = await html2canvas(tabloRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("gonullu_kayitlari.pdf");
  };

  // Kayıt silme
  const handleDelete = async (id: number) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`/api/gonullu?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        alert("Kayıt silindi.");
        fetchData();
      } else {
        alert("Silme hatası: " + result.error);
      }
    } catch (error) {
      alert("Sunucu hatası: " + error);
    }
  };

  // Düzenleme başlat
  const handleEditClick = (k: Gonullu) => {
    setEditId(k.id);
    setEditData({
      tarih: k.tarih,
      saatBasla: k.saatBasla,
      saatBitis: k.saatBitis,
      alan: k.alan,
      catering: k.catering,
      dosyaYolu: k.dosyaYolu,
    });
  };

  // Düzenleme input değişimi
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Düzenleme kaydet
  const handleEditSave = async () => {
    if (!editId) return;

    try {
      const response = await fetch(`/api/gonullu?id=${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Kayıt güncellendi.");
        setEditId(null);
        fetchData();
      } else {
        alert("Güncelleme hatası: " + result.error);
      }
    } catch (error) {
      alert("Sunucu hatası: " + error);
    }
  };

  // Düzenleme iptal
  const handleEditCancel = () => {
    setEditId(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-[#0A406C] mb-4">
        Admin Panel – Gönüllü Kayıtları
      </h1>

      {/* Filtre ve arama */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <input
          type="text"
          placeholder="Alan adına göre ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          className="p-2 border rounded-md w-full md:w-1/3 text-black"
        />
        <input
          type="date"
          value={tarihFiltre}
          onChange={(e) => setTarihFiltre(e.target.value)}
          className="p-2 border rounded-md w-full md:w-1/3 text-black"
        />
        <button
          onClick={handlePdfExport}
          className="bg-[#0A406C] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#09365b] transition w-full md:w-auto"
        >
          PDF Olarak Dışa Aktar
        </button>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto" ref={tabloRef}>
        <table className="min-w-full border text-sm shadow rounded-lg bg-white">
          <thead className="bg-gray-200 text-black font-semibold">
            <tr>
              <th className="px-4 py-2 text-left">Tarih</th>
              <th className="px-4 py-2 text-left">Saat</th>
              <th className="px-4 py-2 text-left">Alan</th>
              <th className="px-4 py-2 text-left">Catering</th>
              <th className="px-4 py-2 text-left">Dosya</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtreliVeriler.map((k) =>
              editId === k.id ? (
                <tr key={k.id} className="border-b bg-yellow-50">
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      name="tarih"
                      value={editData.tarih?.slice(0, 10) || ""}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full text-black"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="time"
                      name="saatBasla"
                      value={editData.saatBasla || ""}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-1/2 text-black"
                    />
                    <input
                      type="time"
                      name="saatBitis"
                      value={editData.saatBitis || ""}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-1/2 text-black"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="alan"
                      value={editData.alan || ""}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full text-black"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      name="catering"
                      value={editData.catering ? "Var" : "Yok"}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          catering: e.target.value === "Var",
                        }))
                      }
                      className="border rounded px-2 py-1 w-full text-black"
                    >
                      <option value="Var">Var</option>
                      <option value="Yok">Yok</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    {editData.dosyaYolu ? (
                      <a
                        href={editData.dosyaYolu}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Görüntüle
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={handleEditSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      İptal
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={k.id} className="border-b hover:bg-gray-100 text-black">
                  <td className="px-4 py-2">{new Date(k.tarih).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-2">
                    {k.saatBasla} - {k.saatBitis}
                  </td>
                  <td className="px-4 py-2">{k.alan}</td>
                  <td className="px-4 py-2">{k.catering ? "Var" : "Yok"}</td>
                  <td className="px-4 py-2">
                    {k.dosyaYolu ? (
                      <a
                        href={k.dosyaYolu}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Görüntüle
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditClick(k)}
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
