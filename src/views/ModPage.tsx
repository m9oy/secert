import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mod, getModById, formatCount, incrementDownloads } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Download, Share2, Heart, Star, ExternalLink } from "lucide-react";

export default function ModPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mod, setMod] = useState<Mod | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeGallery, setActiveGallery] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("desv_favorites") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getModById(id).then((m) => {
      if (!m) setNotFound(true);
      else setMod(m);
      setLoading(false);
    });
  }, [id]);

  function toggleFav() {
    if (!mod) return;
    setFavorites((prev) => {
      const next = prev.includes(mod.id) ? prev.filter((x) => x !== mod.id) : [...prev, mod.id];
      localStorage.setItem("desv_favorites", JSON.stringify(next));
      return next;
    });
  }

  async function handleDownload() {
    if (!mod) return;
    setDownloading(true);
    try {
      await incrementDownloads(mod.id);
      window.open(mod.downloadUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: mod?.name, text: mod?.description, url });
    else { navigator.clipboard.writeText(url); alert("Link copied!"); }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Loading mod...</div>
    </div>
  );

  if (notFound || !mod) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <div style={{ fontSize: "48px" }}>🔍</div>
      <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>Mod not found</div>
      <button onClick={() => navigate("/")} style={{
        padding: "10px 24px", background: "#ff0000", border: "none", borderRadius: "10px",
        color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
      }}>← Go Home</button>
    </div>
  );

  const gallery = (mod.gallery || []).filter(Boolean);
  const isFav = favorites.includes(mod.id);

  return (
    <div style={{
      minHeight: "100vh", background: "#000",
      fontFamily: "'Poppins', sans-serif", color: "#fff",
      backgroundImage: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(255,0,0,.08) 0%, transparent 60%)",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Sticky top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(0,0,0,0.85)", borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)", padding: "12px 16px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <button onClick={() => navigate("/")} style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.name}</div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>desv.online/mod/{mod.id}</div>
        </div>
        <button onClick={handleShare} style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Share2 size={15} />
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 0 100px" }}>

        {/* Banner */}
        <div style={{
          width: "100%", height: "240px",
          background: mod.banner ? `url('${mod.banner}') center/cover no-repeat` : "linear-gradient(135deg,#1a0000,#3d0000)",
          position: "relative",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.9) 100%)" }} />
          <div style={{
            position: "absolute", bottom: "16px", left: "16px", right: "16px",
          }}>
            <div style={{
              display: "inline-block", fontSize: "8px", fontWeight: 700,
              padding: "3px 10px", borderRadius: "20px", marginBottom: "8px",
              background: "rgba(255,0,0,0.25)", border: "1px solid rgba(255,0,0,0.4)",
              color: "#ff8080", letterSpacing: "0.5px",
            }}>{mod.type?.toUpperCase()}</div>
            <div style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1.15 }}>{mod.name}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
              by {mod.publisherName || "Unknown"}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", margin: "0 16px",
          borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)", overflow: "hidden",
          transform: "translateY(-1px)",
        }}>
          {[
            { icon: <Download size={12} />, label: "Downloads", value: formatCount(mod.downloads) },
            { icon: <Star size={12} />,    label: "Rating",    value: mod.rating > 0 ? mod.rating.toFixed(1) : "New" },
            { icon: <span style={{ fontSize: "11px" }}>⚙</span>, label: "Version", value: mod.version || "v1.0" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              flex: 1, padding: "14px 8px", textAlign: "center",
              borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#ff4444", marginBottom: "4px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                {s.icon}{s.value}
              </div>
              <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        {mod.description && (
          <div style={{ padding: "20px 16px 0" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "10px" }}>About</div>
            <div style={{
              fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.8,
              background: "rgba(255,255,255,0.04)", borderRadius: "14px",
              padding: "16px", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              {mod.description}
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div style={{ padding: "20px 16px 0" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "10px" }}>
              Gallery · {activeGallery + 1}/{gallery.length}
            </div>
            <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", marginBottom: "10px" }}>
              <div style={{
                width: "100%", height: "220px",
                background: `url('${gallery[activeGallery]}') center/cover no-repeat`,
                backgroundColor: "#111",
              }} />
              {gallery.length > 1 && (
                <>
                  <button onClick={() => setActiveGallery((i) => (i - 1 + gallery.length) % gallery.length)} style={{
                    position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff", cursor: "pointer", fontSize: "18px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>‹</button>
                  <button onClick={() => setActiveGallery((i) => (i + 1) % gallery.length)} style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff", cursor: "pointer", fontSize: "18px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>›</button>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {gallery.map((img, i) => (
                  <div key={i} onClick={() => setActiveGallery(i)} style={{
                    flexShrink: 0, width: "64px", height: "48px", borderRadius: "8px",
                    background: `url('${img}') center/cover no-repeat`, backgroundColor: "#1a1a1a",
                    border: activeGallery === i ? "2px solid #ff0000" : "2px solid transparent",
                    cursor: "pointer", opacity: activeGallery === i ? 1 : 0.5,
                    transition: "opacity 0.18s, border-color 0.18s",
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hashtags */}
        {mod.hashtags && mod.hashtags.length > 0 && (
          <div style={{ padding: "16px 16px 0", display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {mod.hashtags.map((h, i) => (
              <span key={i} style={{
                padding: "5px 12px", background: "rgba(255,0,0,0.08)",
                border: "1px solid rgba(255,0,0,0.22)", borderRadius: "20px",
                fontSize: "10px", color: "#ff9999", fontWeight: 500,
              }}>{h}</span>
            ))}
          </div>
        )}
      </div>

      {/* Fixed bottom actions */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(0,0,0,0.92)", borderTop: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)", padding: "12px 16px",
        display: "flex", gap: "10px", justifyContent: "center",
      }}>
        <div style={{ width: "min(100%, 600px)", display: "flex", gap: "10px" }}>
          {user && (
            <button onClick={toggleFav} style={{
              width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
              background: isFav ? "rgba(255,0,0,0.15)" : "rgba(255,255,255,0.07)",
              border: isFav ? "1px solid rgba(255,0,0,0.4)" : "1px solid rgba(255,255,255,0.12)",
              color: isFav ? "#ff6666" : "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Heart size={18} fill={isFav ? "#ff6666" : "none"} />
            </button>
          )}
          <button onClick={handleDownload} disabled={downloading} style={{
            flex: 1, height: "48px", borderRadius: "14px",
            background: downloading ? "rgba(255,0,0,0.5)" : "#ff0000",
            border: "none", color: "#fff", fontWeight: 700, fontSize: "13px",
            cursor: downloading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            fontFamily: "inherit", transition: "background 0.18s",
          }}>
            <Download size={16} />
            {downloading ? "Opening..." : "Download Mod"}
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
