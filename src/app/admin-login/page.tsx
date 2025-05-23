"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "teknofest-admin" && password === "teknofest") {
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Kullanıcı adı veya şifre yanlış!");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0A406C] to-[#E72313] px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] p-6 sm:p-8 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center text-[#0A406C] mb-6">
          Admin Girişi
        </h1>

        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 rounded text-black"
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded text-black"
          required
        />

        {error && (
          <p className="text-red-600 text-center" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="bg-[#0A406C] text-white py-3 rounded font-semibold hover:bg-[#09365b] transition"
        >
          Giriş Yap
        </button>
      </form>
    </main>
  );
}
