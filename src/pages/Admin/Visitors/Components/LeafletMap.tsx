import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface LeafletMapProps {
  visitors: Array<{
    id: string;
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
    countryCode?: string;
    activePageTitle?: string;
    ip?: string;
    lastActive: string | Date;
  }>;
}

// Custom pulsing pin creator
const createMarkerIcon = (isActive: boolean) => {
  const color = isActive ? "#10b981" : "#f59e0b"; // emerald-500 vs amber-500
  const ringColor = isActive ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.3)";

  const html = `
    <div style="position: relative; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">
      <!-- Pulsing ring -->
      <span style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: ${ringColor}; pointer-events: none; animation: leaflet-radar-pulse 1.8s infinite ease-in-out;"></span>
      <!-- Core circle -->
      <span style="display: block; width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; border: 1.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25);"></span>
    </div>
    <style>
      @keyframes leaflet-radar-pulse {
        0% { transform: scale(0.6); opacity: 1; }
        100% { transform: scale(1.6); opacity: 0; }
      }
    </style>
  `;

  return L.divIcon({
    html,
    className: "custom-visitor-pin",
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function LeafletMap({ visitors }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const [isThemeDark, setIsThemeDark] = useState(false);

  // 1. Load Leaflet CSS dynamically from CDN
  useEffect(() => {
    const linkId = "leaflet-css-cdn";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  // 2. Track theme switches
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsThemeDark(isDark);
    };

    checkTheme();
    
    // Set up a MutationObserver to watch class changes on documentElement
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 1.5,
      zoomControl: true,
      maxBounds: [
        [-85, -180],
        [85, 180]
      ],
      maxBoundsViscosity: 0.9
    });

    mapRef.current = map;

    // Feature group to collect all active visitor markers
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 4. Update Tile Layer on theme switch
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old tile layer if it exists
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    // Determine target tiles based on light vs dark theme
    const tileUrl = isThemeDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark Matter map
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"; // Positron light map

    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    const tiles = L.tileLayer(tileUrl, {
      attribution,
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    tileLayerRef.current = tiles;
  }, [isThemeDark]);

  // 5. Update Markers when visitor session data updates
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear previous markers
    markersGroup.clearLayers();

    if (visitors.length === 0) return;

    const latLngs: L.LatLng[] = [];

    visitors.forEach((visitor) => {
      const lat = visitor.latitude;
      const lon = visitor.longitude;

      if (lat === undefined || lon === undefined) return;

      // Determine active state (lastActive within 20s)
      const isActive = new Date().getTime() - new Date(visitor.lastActive).getTime() < 20000;
      
      // Create Marker
      const latLng = L.latLng(lat, lon);
      latLngs.push(latLng);

      const marker = L.marker(latLng, {
        icon: createMarkerIcon(isActive)
      });

      // Bind dynamic tooltip
      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 11px; color: #1e293b; padding: 2px;">
          <div style="font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px; display: flex; justify-content: space-between; gap: 8px;">
            <span>${visitor.city || "Unknown City"}</span>
            <span style="color: #64748b;">${visitor.countryCode || ""}</span>
          </div>
          <div style="margin-bottom: 2px;"><span style="color: #94a3b8;">Viewing:</span> <span style="font-weight: 550;">${visitor.activePageTitle || "Store Page"}</span></div>
          <div><span style="color: #94a3b8;">IP:</span> <code style="background-color: #f1f5f9; padding: 1px 3px; border-radius: 3px;">${visitor.ip || "127.0.0.1"}</code></div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        offset: [0, -5]
      });

      // Add to feature group
      markersGroup.addLayer(marker);
    });

    // Auto-fit bounds of map to contain all pins
    if (latLngs.length > 0) {
      try {
        const bounds = L.latLngBounds(latLngs);
        // Add padding so pins aren't clipped on edges
        map.fitBounds(bounds, {
          padding: [40, 40],
          maxZoom: 6
        });
      } catch (err) {
        console.error("Leaflet fitBounds error:", err);
      }
    }
  }, [visitors]);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800/80">
      {/* Target Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[360px] bg-slate-50 dark:bg-slate-950 z-0" 
      />
    </div>
  );
}
