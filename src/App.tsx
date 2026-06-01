import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
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

// Component to handle mode routing
function ModeRouter() {
  const { mode } = useParams<{ mode?: string }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>(() => {
    if (mode && ["home", "search", "publish", "favorites", "settings"].includes(mode)) {
      return mode as Section;
    }
    return "home";
  });

  useEffect(() => {
    if (mode && ["home", "search", "publish", "favorites", "settings"].includes(mode)) {
      setSection(mode as Section);
    }
  }, [mode]);

  const handleSectionChange = (newSection: Section) => {
    setSection(newSection);
    navigate(`/${newSection}`);
  };

  return (
    <AppShell 
      section={section} 
      setSection={handleSectionChange}
    />
  );
}

function AppShell({ 
  section, 
  setSection 
}: { 
  section: Section; 
  setSection: (section: Section) => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("desv_favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [favoriteMods, setFavoriteMods] = useState<Mod[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    localStorage.setItem("desv_favorites", JSON.stringify(favorites));
    if (favorites.length === 0) {
      setFavoriteMods([]);
      return;
    }
    getAllMods().then((all) =>
      setFavoriteMods(all.filter((m) => favorites.includes(m.id)))
    );
  }, [favorites]);

  function toggleFavorite(modId: string) {
    setFavorites((prev) =>
      prev.includes(modId)
        ? prev.filter((id) => id !== modId)
        : [...prev, modId]
    );
  }

  function handleModClick(mod: Mod) {
    navigate(`/mod/${mod.id}`);
  }

  const NAV = [
    {
      key: "home",
      label: "Home",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: "search",
      label: "Search",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      key: "publish",
      label: "Publish",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
    },
    {
      key: "favorites",
      label: "Favorites",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      key: "settings",
      label: "Settings",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "#000000",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "rgba(0,0,0,0.5)",
          borderRight: "1px solid rgba(255,0,0,0.1)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div
          onClick={() => setSection("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #ff0000, #ff6600)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 800,
            }}
          >
            D
          </div>
          Desv Add-ons
        </div>

        {(["home", "search", "publish"] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{
              padding: "12px 16px",
              background: section === s ? "rgba(255,0,0,0.2)" : "transparent",
              border: "1px solid " + (section === s ? "rgba(255,0,0,0.5)" : "transparent"),
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,0,0,0.1)", marginTop: "auto", paddingTop: "20px" }}>
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (!user && ["publish", "favorites", "settings"].includes(item.key)) {
                  setShowAuth(true);
                } else {
                  setSection(item.key as Section);
                }
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: section === item.key ? "rgba(255,0,0,0.2)" : "transparent",
                border: "1px solid " + (section === item.key ? "rgba(255,0,0,0.5)" : "transparent"),
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "280px", flex: 1 }}>
        {section === "home" && <HomeView onModClick={handleModClick} />}
        {section === "search" && <SearchView onModClick={handleModClick} />}
        {section === "publish" && (
          <PublishView
            onPublish={() => {
              setRefreshKey((k) => k + 1);
              setSection("home");
            }}
          />
        )}
        {section === "favorites" && !user && setShowAuth(true)}
        {section === "favorites" && user && (
          <FavoritesView
            mods={favoriteMods}
            onModClick={handleModClick}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        )}
        {section === "settings" && !user && setShowAuth(true)}
        {section === "settings" && user && <SettingsView onLogout={() => setShowAuth(true)} />}
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Home route as default */}
        <Route path="/" element={<ModeRouter />} />
        
        {/* Mode routes */}
        <Route path="/:mode" element={<ModeRouter />} />
        
        {/* Mod detail page */}
        <Route path="/mod/:id" element={<ModPage />} />
        
        {/* Fallback to home */}
        <Route path="*" element={<ModeRouter />} />
      </Routes>
    </AuthProvider>
  );
}
