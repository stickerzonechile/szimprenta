import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Check, Layers, Package, Ruler, Scissors, Shapes, ShieldCheck, Smartphone, Image, User, Mail, Phone } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png.asset.json";
import logoStickerzone from "@/assets/logo-stickerzone.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stickerzone — Calculadora de Stickers" },
      {
        name: "description",
        content:
          "Cotiza stickers en Stickerzone: elige material, tamaño, cantidad y tipo de corte. Recibe el total estimado y contacta por WhatsApp al instante.",
      },
      { property: "og:title", content: "Stickerzone — Calculadora de Stickers" },
      {
        property: "og:description",
        content:
          "Cotiza stickers en Stickerzone: elige material, tamaño, cantidad y tipo de corte. Recibe el total estimado y contacta por WhatsApp al instante.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Material = "brillante" | "tornasol" | "reflectivo";
type Size = "3x3" | "4x4" | "5x5" | "6x6" | "7x7" | "8x8" | "9x9" | "10x10";
type CutType = "pliego" | "unitario";
type DieType = "cuadrado" | "circular" | "contorno";

const SIZES: Size[] = ["3x3", "4x4", "5x5", "6x6", "7x7", "8x8", "9x9", "10x10"];

const SIZE_LABELS: Record<Size, string> = {
  "3x3": " stickers pequeños sin mucha informacion 3x3 cm",
  "4x4": "4x4 cm",
  "5x5": "etiqueta de producto 5x5 cm",
  "6x6": "6x6 cm",
  "7x7": "Para pegar en autos  7x7 cm",
  "8x8": "mas visible en autos 8x8 cm",
  "9x9": "9x9 cm",
  "10x10": "el mas visible en autos y camiones 10x10 cm",
};

const UNITS_PER_SHEET: Record<Material, Record<Size, number>> = {
  brillante: {
    "3x3": 100,
    "4x4": 100,
    "5x5": 100,
    "6x6": 100,
    "7x7": 100,
    "8x8": 100,
    "9x9": 100,
    "10x10": 100,
  },
  tornasol: {
    "3x3": 100,
    "4x4": 100,
    "5x5": 100,
    "6x6": 100,
    "7x7": 100,
    "8x8": 72,
    "9x9": 61,
    "10x10": 55,
  },
  reflectivo: {
    "3x3": 100,
    "4x4": 100,
    "5x5": 100,
    "6x6": 100,
    "7x7": 100,
    "8x8": 72,
    "9x9": 61,
    "10x10": 55,
  },
};

const PRICE_PER_SHEET: Record<Material, Record<Size, number>> = {
  brillante: {
    "3x3": 5000,
    "4x4": 6600,
    "5x5": 7000,
    "6x6": 8500,
    "7x7": 9990,
    "8x8": 11990,
    "9x9": 15990,
    "10x10": 18990,
  },
  tornasol: {
    "3x3": 8990,
    "4x4": 10990,
    "5x5": 15990,
    "6x6": 24990,
    "7x7": 31990,
    "8x8": 31990,
    "9x9": 31990,
    "10x10": 31990,
  },
  reflectivo: {
    "3x3": 8990,
    "4x4": 10990,
    "5x5": 15990,
    "6x6": 24990,
    "7x7": 31990,
    "8x8": 31990,
    "9x9": 31990,
    "10x10": 31990,
  },
};

// Materiales con corte unitario incluido
const CUT_INCLUDED: Material[] = ["tornasol", "reflectivo"];

const MATERIAL_OPTIONS: { value: Material; label: string; description: string }[] = [
  {
    value: "brillante",
    label: "Brillante, Transparente o Mate",
    description: "Mismo valor en los tres acabados. 100 unidades por pliego.",
  },
  {
    value: "tornasol",
    label: "Tornasol",
    description: "Acabado iridiscente. Corte unitario incluido sin costo.",
  },
  {
    value: "reflectivo",
    label: "Reflectivo",
    description: "Alta visibilidad. Corte unitario incluido sin costo.",
  },
];

// Laminado protector (adicional por pliego): proporcional al tamaño,
// $3.500 en 5x5 y $6.000 en 10x10.
const LAMINATION_PER_SHEET: Record<Size, number> = {
  "3x3": 2100,
  "4x4": 2800,
  "5x5": 3500,
  "6x6": 4000,
  "7x7": 4500,
  "8x8": 5000,
  "9x9": 5500,
  "10x10": 6000,
};

const CUT_OPTIONS: { value: CutType; label: string; description: string }[] = [
  {
    value: "pliego",
    label: "Entregado en pliego",
    description: "Sin costo extra.",
  },
  {
    value: "unitario",
    label: "Corte unitario",
    description: "+$2.000 por cada pliego calculado.",
  },
];

const DIE_OPTIONS: { value: DieType; label: string; description: string }[] = [
  {
    value: "cuadrado",
    label: "Troquelado cuadrado",
    description: "Corte recto siguiendo el borde cuadrado del sticker.",
  },
  {
    value: "circular",
    label: "Troquelado circular",
    description: "Corte redondo, ideal para logos y etiquetas.",
  },
  {
    value: "contorno",
    label: "Troquelado por el contorno",
    description: "El corte sigue la forma exacta de tu diseño.",
  },
];

// Galería de ejemplos de diseños
const DESIGN_GALLERY = [
  {
    id: 1,
    title: "Logos empresariales",
    description: "Perfectos para branding",
    colors: ["Brillante", "Tornasol"],
    image: "🏢",
  },
  {
    id: 2,
    title: "Etiquetas de productos",
    description: "Ideal para pequeños negocios",
    colors: ["Brillante", "Reflectivo"],
    image: "🏷️",
  },
  {
    id: 3,
    title: "Stickers para autos",
    description: "Alta visibilidad garantizada",
    colors: ["Reflectivo", "Tornasol"],
    image: "🚗",
  },
  {
    id: 4,
    title: "Decorativos personales",
    description: "Diseños creativos y únicos",
    colors: ["Brillante"],
    image: "✨",
  },
  {
    id: 5,
    title: "Códigos QR personalizados",
    description: "Interactivos y modernos",
    colors: ["Brillante", "Tornasol"],
    image: "📱",
  },
  {
    id: 6,
    title: "Vinil recortado",
    description: "Contornos precisos",
    colors: ["Brillante", "Reflectivo"],
    image: "✂️",
  },
];

function formatCurrency(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

function parseSize(size: Size): { w: number; h: number } {
  const [wStr, hStr] = size.split("x");
  return { w: Number(wStr), h: Number(hStr) };
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.65-2.059-.173-.297-.018-.458.13-.606.12-.12.297-.312.446-.468.149-.156.198-.268.298-.446.099-.179.05-.335-.025-.469-.075-.134-.669-1.612-.916-2.207-.242-.579-.487-.501-.67-.51-.173-.008-.371-.01-.571-.01-.2 0-.523.074-.797.372-.274.298-1.048 1.022-1.048 2.49 0 1.467 1.073 2.89 1.22 3.09.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.71.227 1.355.196 1.864.118.568-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.183 0-5.775 2.588-5.775 5.775 0 1.138.372 2.26 1.088 3.231L1.691 19.586l3.622-1.192c.955.588 2.066.896 3.189.896h.005c3.183 0 5.777-2.588 5.777-5.775 0-1.545-.635-2.993-1.784-4.091-1.149-1.098-2.677-1.703-4.309-1.703M20.447 3.032C18.224.8 15.151 0 12.031 0 5.263 0 0 5.26 0 12.031c0 2.165.556 4.282 1.613 6.154L0 24l6.305-2.035c1.791.956 3.807 1.466 5.926 1.466 6.768 0 12.031-5.263 12.031-12.031 0-3.22-.854-6.293-2.484-8.368"/>
    </svg>
  );
}

function Index() {
  const [material, setMaterial] = useState<Material>("brillante");
  const [size, setSize] = useState<Size>("5x5");
  const [quantity, setQuantity] = useState<number>(100);
  const [cutType, setCutType] = useState<CutType>("pliego");
  const [lamination, setLamination] = useState<boolean>(false);
  const [dieType, setDieType] = useState<DieType>("cuadrado");
  
  // Campos de contacto
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // En tornasol el corte unitario va incluido
  const cutIncluded = CUT_INCLUDED.includes(material);
  const effectiveCutType: CutType = cutIncluded ? "unitario" : cutType;

  const { w, h } = parseSize(size);
  const unitsPerSheet = UNITS_PER_SHEET[material][size];
  const pricePerSheet = PRICE_PER_SHEET[material][size];
  const sheets = Math.max(1, Math.ceil(quantity / unitsPerSheet));
  const subtotal = sheets * pricePerSheet;
  const cutSurcharge =
    !cutIncluded && effectiveCutType === "unitario" ? sheets * 2000 : 0;
  const laminationPerSheet = LAMINATION_PER_SHEET[size];
  const laminationCost = lamination ? sheets * laminationPerSheet : 0;
  const total = subtotal + cutSurcharge + laminationCost;

  const materialLabel = MATERIAL_OPTIONS.find((m) => m.value === material)?.label ?? "";
  const cutLabel =
    cutIncluded
      ? "Corte unitario (incluido)"
      : (CUT_OPTIONS.find((c) => c.value === cutType)?.label ?? "");
  const dieLabel = DIE_OPTIONS.find((d) => d.value === dieType)?.label ?? "";

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Hola Stickerzone, quiero enviar mi pedido de stickers con los siguientes datos:",
      "",
      `👤 Nombre: ${firstName} ${lastName}`,
      `📧 Correo: ${email}`,
      "",
      `Material: ${materialLabel}`,
      `Tamaño: ${size} cm`,
      `Cantidad de stickers: ${quantity.toLocaleString("es-CL")}`,
      `Unidades por pliego: ${unitsPerSheet}`,
      `Pliegos necesarios: ${sheets}`,
      `Precio por pliego: ${formatCurrency(pricePerSheet)}`,
      `Subtotal pliegos: ${formatCurrency(subtotal)}`,
      cutSurcharge > 0 ? `Recargo corte unitario: ${formatCurrency(cutSurcharge)}` : null,
      `Tipo de corte: ${cutLabel}`,
      `Tipo de troquelado: ${dieLabel}`,
      `Laminado protector: ${lamination ? `Sí (+${formatCurrency(laminationCost)})` : "No"}`,
      "",
      `Total estimado: ${formatCurrency(total)}`,
      "",
      "¡Quedo atento!",
    ];
    return encodeURIComponent(lines.filter(Boolean).join("\n"));
  }, [
    firstName,
    lastName,
    email,
    materialLabel,
    size,
    quantity,
    unitsPerSheet,
    sheets,
    pricePerSheet,
    subtotal,
    cutSurcharge,
    cutLabel,
    dieLabel,
    lamination,
    laminationCost,
    total,
  ]);

  const whatsappHref = `https://wa.me/+56990619617?text=${whatsappMessage}`;
  
  // Validar que los campos requeridos estén completos
  const isFormValid = firstName.trim() && lastName.trim() && email.trim();

  // Escala visual del sticker: máximo 220px
  const scale = Math.min(220 / Math.max(w, h), 1);
  const pxW = Math.max(40, w * 10 * scale);
  const pxH = Math.max(40, h * 10 * scale);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              src={logoStickerzone.url}
              alt="Logo Stickerzone Imprenta Digital"
              className="size-10 rounded-xl bg-white object-contain p-1"
            />
            <span className="font-display text-xl font-bold tracking-tight">
               Sticker<span className="text-primary">Zone Imprenta Digital</span>
            </span>
          </div>
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
            Imprenta Digital
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <header className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-card shadow-xl shadow-black/10">
          <div className="relative">
            <img
              src={heroBanner.url}
              alt="Banner de Stickerzone Imprenta Digital"
              width={1536}
              height={768}
              className="h-48 w-full object-cover sm:h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <img
                src={logoStickerzone.url}
                alt="Logo Stickerzone"
                className="mb-4 h-20 w-auto rounded-2xl bg-white/95 object-contain p-2 shadow-lg sm:h-24"
              />
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-3 py-1.5 text-xs font-semibold text-primary mb-3 backdrop-blur-sm">
                <Calculator className="size-3.5" />
                Cotizador en línea
              </div>
              <h1 className="mb-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Calcula tu pedido de stickers
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                 Selecciona el tipo de material, tamaño, cantidad y tipo de corte. Te mostramos el total estimado al instante. y nos envias todo a whatsapp solo presionando el boton
              </p>
            </div>
          </div>
        </header>

        {/* Galería de diseños */}
        <section className="mb-10">
          <div className="mb-6 flex items-center gap-2">
            <Image className="size-6 text-primary" />
            <h2 className="font-display text-2xl font-bold">Galería de Diseños</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESIGN_GALLERY.map((design) => (
              <div key={design.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-card p-4 text-card-foreground shadow-xl shadow-black/5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <div className="mb-4 text-5xl">{design.image}</div>
                <h3 className="font-semibold text-card-foreground mb-1">{design.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{design.description}</p>
                <div className="flex flex-wrap gap-2">
                  {design.colors.map((color) => (
                    <span key={color} className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Inputs */}
          <div className="space-y-5 lg:col-span-7">
            {/* Datos de contacto */}
            <section className="rounded-2xl border border-white/10 bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <User className="size-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-card-foreground/80">
                  Datos de contacto
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Tu apellido"
                      className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="size-4" />
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.email@ejemplo.com"
                    className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>
            </section>

            {/* Material */}
            <section className="rounded-2xl border border-white/10 bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-card-foreground/80">
                  1. Material
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {MATERIAL_OPTIONS.map((option) => {
                  const selected = material === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setMaterial(option.value)}
                      className={cn(
                        "relative flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border border-input bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="mb-2 flex w-full items-center justify-between">
                        <span className="font-semibold">{option.label}</span>
                        {selected && (
                          <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Tamaño */}
            <section className="rounded-2xl border border-white/10 bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Ruler className="size-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-card-foreground/80">
                  2. Tamaño del sticker
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {SIZES.map((s) => {
                  const selected = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "rounded-lg px-2 py-3 text-center text-xs font-semibold transition-all sm:text-sm",
                        selected
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "border border-input bg-surface text-foreground hover:border-primary/50"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                 Medidas en centímetros (ancho × alto). indica siempre tu medida mas grande 
              </p>
            </section>

            {/* Cantidad */}
            <section className="rounded-2xl border border-white/10 bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Layers className="size-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-card-foreground/80">
                  3. Cantidad de stickers
                </h2>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Stickers individuales
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(100000, Number(e.target.value) || 1)))
                    }
                    className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-lg font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="rounded-xl bg-primary/5 px-4 py-3 text-center sm:text-left">
                  <p className="text-xs text-muted-foreground">Unidades por pliego</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    {unitsPerSheet}
                  </p>
                </div>
              </div>
            </section>

            {/* Tipo de corte */}
            <section className="rounded-2xl border border-white/10 bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Scissors className="size-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-card-foreground/80">
                   4. TIPO DE CORTE ( TODOS VIENEN TROQUELADOS POR EL BORDE ,( CORTE DEL STICKER , NO DE LA BASE  )
                </h2>
              </div>
              {cutIncluded ? (
                <div className="flex items-start gap-3 rounded-xl border-2 border-primary bg-primary/5 p-4">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                  <div>
                    <p className="font-semibold">Corte unitario incluido</p>
                    <p className="text-xs text-muted-foreground">
                      En este material el corte unitario va incluido sin costo extra.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CUT_OPTIONS.map((option) => {
                    const selected = cutType === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setCutType(option.value)}
                        className={cn(
                          "relative flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border border-input bg-card hover:border-primary/50"
                        )}
                      >
                        <div className="mb-2 flex w-full items-center justify-between">
                          <span className="font-semibold">{option.label}</span>
                          {selected && (
                            <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                              <Check className="size-3" />
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Tipo de troquelado */}
            <section className="rounded-2xl border border-white/10 bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Shapes className="size-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-card-foreground/80">
                  5. Tipo de troquelado
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {DIE_OPTIONS.map((option) => {
                  const selected = dieType === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setDieType(option.value)}
                      className={cn(
                        "relative flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border border-input bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="mb-2 flex w-full items-center justify-between">
                        <span className="font-semibold">{option.label}</span>
                        {selected && (
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Laminado protector */}
            <section className="rounded-2xl border border-white/10 bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-card-foreground/80">
                  6. Laminado protector (opcional)
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {([
                  { value: false, label: "Sin laminado", description: "Sin costo extra." },
                  {
                    value: true,
                    label: "Con laminado protector",
                    description: `+${formatCurrency(laminationPerSheet)} por pliego (${size} cm). Mayor duración y protección.`,
                  },
                ] as const).map((option) => {
                  const selected = lamination === option.value;
                  return (
                    <button
                      key={String(option.value)}
                      onClick={() => setLamination(option.value)}
                      className={cn(
                        "relative flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border border-input bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="mb-2 flex w-full items-center justify-between">
                        <span className="font-semibold">{option.label}</span>
                        {selected && (
                          <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-card text-card-foreground shadow-xl shadow-black/10">
                <div className="bg-gradient-to-r from-primary to-brand-accent p-5 text-primary-foreground">
                  <h2 className="font-display text-lg font-bold">Resumen de cotización</h2>
                  <p className="text-sm opacity-90">Actualizado en tiempo real</p>
                </div>

                {/* Visualizador */}
                <div className="flex items-center justify-center border-b border-border/50 bg-primary/5 px-6 py-8">
                  <div className="relative">
                    <div
                      className={cn(
                        "relative flex items-center justify-center border-2 border-dashed border-primary/40 bg-white shadow-lg",
                        dieType === "circular"
                          ? "rounded-full"
                          : dieType === "contorno"
                            ? "rounded-[35%_65%_55%_45%/45%_40%_60%_55%]"
                            : "rounded-lg"
                      )}
                      style={{ width: pxW, height: pxH }}
                    >
                      <span className="font-display text-lg font-bold text-primary/80">
                        {size}
                      </span>
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                      {w} cm × {h} cm
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pliegos necesarios</span>
                    <span className="font-display text-lg font-bold text-card-foreground">
                      {sheets}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Precio por pliego</span>
                    <span className="font-semibold text-card-foreground">
                      {formatCurrency(pricePerSheet)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal pliegos</span>
                    <span className="font-semibold text-card-foreground">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {cutSurcharge > 0 && (
                    <div className="flex items-center justify-between text-primary">
                      <span className="text-sm">Recargo corte unitario</span>
                      <span className="font-semibold">+{formatCurrency(cutSurcharge)}</span>
                    </div>
                  )}
                  {cutIncluded && (
                    <div className="flex items-center justify-between text-primary">
                      <span className="text-sm">Corte unitario</span>
                      <span className="font-semibold">Incluido</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Troquelado</span>
                    <span className="font-semibold text-card-foreground">{dieLabel}</span>
                  </div>
                  {lamination && (
                    <div className="flex items-center justify-between text-primary">
                      <span className="text-sm">Laminado protector</span>
                      <span className="font-semibold">+{formatCurrency(laminationCost)}</span>
                    </div>
                  )}

                  <div className="my-4 h-px bg-border/50" />

                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Total estimado
                    </span>
                    <span className="font-display text-3xl font-bold text-primary sm:text-4xl">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {!isFormValid && (
                    <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-3 text-xs text-yellow-600">
                      ⚠️ Por favor completa tu nombre, apellido y correo para enviar el pedido.
                    </div>
                  )}

                  <a
                    href={isFormValid ? whatsappHref : "#"}
                    target={isFormValid ? "_blank" : undefined}
                    rel={isFormValid ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!isFormValid) {
                        e.preventDefault();
                      }
                    }}
                    className={cn(
                      "mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-base font-bold shadow-lg transition-all",
                      isFormValid
                        ? "bg-[#25D366] text-white shadow-[#25D366]/25 hover:bg-[#20ba5c]"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed shadow-gray-400/25"
                    )}
                  >
                    <WhatsAppIcon className="size-6" />
                    ENVIAR MI PEDIDO
                  </a>
                  <p className="text-center text-[10px] text-muted-foreground">
                    Te responderemos en WhatsApp para confirmar tu pedido.
                  </p>
                </div>
              </section>

              {/* Nota informativa */}
              <div className="rounded-2xl border border-white/10 bg-secondary/40 p-5 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Smartphone className="size-4 text-primary" />
                  ¿Cómo se calculan los pliegos?
                </div>
                <p>
                  Dividimos la cantidad de stickers que necesitas por las unidades que caben en cada pliego y redondeamos hacia arriba. Así te aseguras de tener suficientes stickers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function cn(...inputs: (string | false | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
