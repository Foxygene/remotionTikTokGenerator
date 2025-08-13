import React, { useState } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  StaticFile,
  OffthreadVideo,
  AbsoluteFill,
  Img,
  staticFile,
  Video,
  getRemotionEnvironment,
} from "remotion";
import { z } from "zod";
import type { CSSProperties } from "react";
import { TitleText } from "../components/TitleText";
import { SpotInfo } from "../components/SpotInfo";
import { toEuroString, toEuroStringFromUsdLike } from "../utils/currency";

export const spotSchema = z.object({
  Id: z.number().optional(),
  name: z.string(),
  country: z.string(),
  cost_eur: z.union([z.string(), z.number()]).optional(),
  star_rating: z.union([z.string(), z.number()]).optional(),
  temparature_C: z.union([z.string(), z.number()]).optional(),
  temperature_C: z.union([z.string(), z.number()]).optional(),
  pros_fr: z.string().optional(),
  pros: z.string().optional(),
  cons_fr: z.string().optional(),
  cons: z.string().optional(),
  hotel_m: z.union([z.string(), z.number()]).optional(),
  diner: z.union([z.string(), z.number()]).optional(),
  mobile_data: z.union([z.string(), z.number()]).optional(),
  taxi_price: z.union([z.string(), z.number()]).optional(),
  airbnb_m: z.union([z.string(), z.number()]).optional(),
});

const fontStyle: CSSProperties = {
  textShadow:
    "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
  willChange: "opacity",
};

type BaseBackgroundProps = { videoBg: StaticFile; children?: React.ReactNode };
const RenderVideo = ({ src, style }: { src: string; style?: React.CSSProperties }) => {
  const isRendering = getRemotionEnvironment().isRendering;
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        style={{
          ...style,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
          transition: "none",
          animation: "none",
          opacity: 1,
        }}
      />
    );
  }

  // Force OffthreadVideo also in preview for remote media that need range requests
  const supportsRange = src.startsWith("/");

  if (isRendering || !supportsRange) {
    return (
      <OffthreadVideo
        pauseWhenBuffering
        src={src}
        style={{
          ...style,
          transition: "none",
          animation: "none",
          opacity: 1,
        }}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <Video
      loop
      muted
      src={src}
      style={{
        ...style,
        transition: "none",
        animation: "none",
        opacity: 1,
      }}
      onError={() => setErrored(true)}
    />
  );
};

const BaseBackground = ({ videoBg, children }: BaseBackgroundProps) => (
  <AbsoluteFill>
    <RenderVideo
      src={videoBg.src}
      style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: -1, transition: "none", animation: "none", opacity: 1 }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
        zIndex: 0,
      }}
    />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        paddingLeft: 60,
        paddingRight: 60,
        zIndex: 1,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

// util removed (unused)

const pickRandomItems = (list: string[], count: number): string[] => {
  const filtered = list.map((s) => s.trim()).filter(Boolean);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

type SectionHeaderProps = {
  name: string;
  section: string;
  icon?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ name, section, icon }) => {
  return (
    <div
      style={{
        ...fontStyle,
        color: "white",
        marginBottom: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <TitleText titleText={name} />
      <div
        style={{
          position: "relative",
          padding: "10px 26px",
          borderRadius: 9999,
          background: "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.18)",
          textTransform: "uppercase",
          letterSpacing: 2,
          fontWeight: 800,
          fontSize: 42,
          lineHeight: 1.1,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {section}
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            bottom: -6,
            height: 4,
            borderRadius: 8,
            background:
              "linear-gradient(90deg, #60a5fa 0%, #a78bfa 40%, #f472b6 100%)",
            filter: "blur(0.3px)",
          }}
        />
      </div>
    </div>
  );
};

export const SpotOverview: React.FC<{ videoBg: StaticFile; spot: z.infer<typeof spotSchema> }> = ({ videoBg, spot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const infoSpring = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const translateY = interpolate(titleSpring, [0, 1], [150, 0]);

  const temperatureC = spot.temparature_C ?? spot.temperature_C;
  const infoItems = [
    { label: "Pays", value: spot.country },
    { label: "Coût (EUR/mois)", value: toEuroString(spot.cost_eur) },
    // Affichage étoiles: star_rating est déjà sur 5 → arrondir à l'entier le plus proche
    { label: "Note Globale", value: `${spot.star_rating ?? "N/A"}`, isRating: true },
    { label: "Température", value: temperatureC != null ? `${temperatureC}` : "N/A" },
  ];

  console.log(spot.star_rating);

  return (
    <BaseBackground videoBg={videoBg}>
      <div style={{ transform: `translateY(${translateY}px)`, opacity: titleSpring, ...fontStyle, color: "white" }}>
        <TitleText titleText={spot.name} />
      </div>
      <div style={{ marginTop: 40, opacity: infoSpring, transform: `translateY(${interpolate(infoSpring, [0,1], [50,0])}px)` }}>
        {/* Sticker identique à SpotIntro pour garder la DA */}
        <div className="flex items-center justify-center mb-8">
          <Img src={staticFile("spotIntro.png")} style={{ width: "600px", height: "auto", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }} />
        </div>
        {infoItems.map((item, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            <SpotInfo label={item.label} value={String(item.value)} isAlternate={index % 2 === 1} isRating={item.isRating as boolean | undefined} />
          </div>
        ))}
      </div>
    </BaseBackground>
  );
};

export const SpotCost: React.FC<{ videoBg: StaticFile; spot: z.infer<typeof spotSchema> }> = ({ videoBg, spot }) => {
  const costs = [
    // Ces champs sont USD dans la DB (sauf cost_eur). Convertir à l’affichage.
    { label: "Hôtel (mois)", value: toEuroStringFromUsdLike(spot.hotel_m) },
    { label: "Airbnb (mois)", value: toEuroStringFromUsdLike(spot.airbnb_m) },
    { label: "Repas (dîner)", value: toEuroStringFromUsdLike(spot.diner) },
    { label: "Données mobiles(~10GB)", value: `${toEuroStringFromUsdLike(spot.mobile_data)}/mois` },
    { label: "Taxi (trajet 3km)", value: toEuroStringFromUsdLike(spot.taxi_price) },
  ];
  return (
    <BaseBackground videoBg={videoBg}>
      <SectionHeader name={`${spot.name}`} section="Les coûts" />
      <div>
        {costs.map((c, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <SpotInfo label={c.label} value={String(c.value)} isAlternate={i % 2 === 1} />
          </div>
        ))}
      </div>
    </BaseBackground>
  );
};

export const SpotPros: React.FC<{ videoBg: StaticFile; spot: z.infer<typeof spotSchema> }> = ({ videoBg, spot }) => {
  const prosRaw = spot.pros_fr ?? spot.pros ?? "";
  const prosList = prosRaw.split("|");
  const picks = pickRandomItems(prosList, 7);
  return (
    <BaseBackground videoBg={videoBg}>
      <SectionHeader name={`${spot.name}`} section="Les plus !" />
      <div>
        {picks.map((p, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <SpotInfo value={p} isAlternate={i % 2 === 1} />
          </div>
        ))}
      </div>
    </BaseBackground>
  );
};

export const SpotCons: React.FC<{ videoBg: StaticFile; spot: z.infer<typeof spotSchema> }> = ({ videoBg, spot }) => {
  const consRaw = spot.cons_fr ?? spot.cons ?? "";
  const consList = consRaw.split("|");
  const picks = pickRandomItems(consList, 7);
  return (
    <BaseBackground videoBg={videoBg}>
      <SectionHeader name={`${spot.name}`} section="Les moins" />
      <div>
        {picks.map((c, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <SpotInfo value={c} isAlternate={i % 2 === 1} />
          </div>
        ))}
      </div>
    </BaseBackground>
  );
};

// Backward-compat export name kept for imports, but not used in new flow
export const SpotProfile = SpotOverview;
