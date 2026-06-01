import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import HomeView from "@/views/HomeView";
import SearchView from "@/views/SearchView";
import PublishView from "@/views/PublishView";
import FavoritesView from "@/views/FavoritesView";
import SettingsView from "@/views/SettingsView";
import ModPage from "@/views/ModPage";
import { Mod, getAllMods } from "@/lib/firestore";

type Section = "home" | "search" | "publish" | "favorites" | "settings";

function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("home");
  const [showAuth, setShowAuth] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("desv_favorites") || "[]"); } catch { return []; }
  });
  const [favoriteMods, setFavoriteMods] = useState<Mod[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    localStorage.setItem("desv_favorites", JSON.stringify(favorites));
    if (favorites.length === 0) { setFavoriteMods([]); return; }
    getAllMods().then((all) => setFavoriteMods(all.filter((m) => favorites.includes(m.id))));
  }, [favorites]);

  function toggleFavorite(modId: string) {
    setFavorites((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  }

  function handleModClick(mod: Mod) {
    navigate(`/mod/${mod.id}`);
  }

  const NAV = [
    { key: "home", label: "Home", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { key: "search", label: "Search", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> },
    { key: "publish", label: "Publish", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg> },
    { key: "favorites", label: "Favorites", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> },
    { key: "settings", label: "Settings", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24" /></svg> },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#000000", color: "#ffffff", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "20px 14px 80px", backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,0,0,.1) 0%, transparent 70%)" }}>
      <div style={{ width: "min(100%, 560px)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "14px 18px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "22px 22px 0 0", backdropFilter: "blur(22px)" }}>
          <div onClick={() => setSection("home")} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "rgba(255,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: 900 }}>D</div>
            Desv Add-ons
          </div>
          <div style={{ display: "flex", gap: "2px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "3px" }}>
            {(["home", "search", "publish"] as Section[]).map((s) => (
              <button key={s} onClick={() => setSection(s)} style={{ border: 0, background: section === s ? "#ff0000" : "transparent", color: section === s ? "#fff" : "rgba(255,255,255,0.6)", fontSize: "10px", fontFamily: "inherit", padding: "6px 10px", borderRadius: "7px", cursor: "pointer", fontWeight: 500 }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", minHeight: "180px", padding: "50px 28px 30px", backgroundImage: "url('https://cdn.discordapp.com/attachments/1452754320322990092/1510334200820007054/file_000000009908720a8ee18dd03a9d187b.png?ex=6a1dc156&is=6a1c6fd6&hm=7873d60916f35aa05483ec0ddde2ed21cf035f4895ea8a232e13997d551f5f4a&')", backgroundSize: "cover", backgroundPosition: "center", borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ width: "fit-content", margin: "0 auto 14px", padding: "4px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "9px", position: "relative", zIndex: 2, fontWeight: 500 }}>Welcome to Mods Site</div>
          <h1 style={{ textAlign: "center", fontSize: "clamp(24px,5vw,30px)", fontWeight: 700, letterSpacing: "-1px", lineHeight: 0.96, color: "#fff", marginBottom: "10px", position: "relative", zIndex: 2 }}>
            <span style={{ background: "linear-gradient(90deg,#fff 0%,#ff0000 30%,#fff 55%,#000 72%,#fff 100%)", backgroundSize: "220% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shine 3.2s linear infinite" }}>Desv Add-ons</span>
          </h1>
          <div style={{ textAlign: "center", maxWidth: "300px", margin: "0 auto", fontSize: "10.5px", lineHeight: 1.75, color: "rgba(255,255,255,0.6)", position: "relative", zIndex: 2 }}>latest add-ons and updates</div>
        </div>
        <div style={{ background: "#000000", border: "1px solid rgba(255,255,255,0.1)", borderTop: 0, borderRadius: "0 0 22px 22px", padding: "18px 18px 28px" }}>
          {section === "home"      && <HomeView key={refreshKey} onModClick={handleModClick} />}
          {section === "search"    && <SearchView onModClick={handleModClick} />}
          {section === "publish"   && <PublishView onAuthRequired={() => setShowAuth(true)} onSuccess={() => { setRefreshKey((k) => k + 1); setSection("home"); }} />}
          {section === "favorites" && <FavoritesView mods={favoriteMods} onModClick={handleModClick} onAuthRequired={() => setShowAuth(true)} />}
          {section === "settings"  && <SettingsView onAuthRequired={() => setShowAuth(true)} />}
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "70px", background: "rgba(0,0,0,0.85)", borderTop: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "center", zIndex: 998 }}>
        <div style={{ width: "min(100%, 560px)", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {NAV.map((item) => (
            <button key={item.key} onClick={() => setSection(item.key as Section)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", flex: 1, height: "100%", background: section === item.key ? "rgba(255,0,0,0.08)" : "transparent", border: 0, color: section === item.key ? "#ff0000" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "10px", fontFamily: "inherit", padding: "8px 0" }}>
              {item.icon}
              <span style={{ fontSize: "9px", fontWeight: 600 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100%; background: #000; }
        input, textarea, select { color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.4); }
        select option { background: #111; color: #fff; }
        .form-input { width: 100%; padding: 10px 12px; background: transparent; border: 0; outline: 0; color: #fff; font-family: 'Poppins', sans-serif; font-size: 11px; }
        @keyframes shine { 0% { background-position: 220% center; } 100% { background-position: 0% center; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: rgba(255,0,0,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/mod/:id" element={<ModPage />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </AuthProvider>
  );
}
