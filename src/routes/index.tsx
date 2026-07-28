import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence, useAnimation, useInView, useScroll, useTransform, useMotionValue, animate, type Variants } from "framer-motion";
import { Clock, Users, Award, Trophy, Star, MousePointer2, Type, Palette, BookOpen, Droplet, Eye, ShieldCheck, Layers, Sparkles, Video, Gift } from "lucide-react";

const CHECKOUT = "https://pay.kiwify.com.br/vGNVGop";
const WHATSAPP =
  "https://wa.me/5511998502908?text=Ol%C3%A1%2C%20quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20apostila%20edit%C3%A1vel";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Apostila Editável de Extensão de Cílios — Malinne | by Mayara Alinne" },
      {
        name: "description",
        content:
          "Apostila de extensão de cílios com layout de luxo, 100% editável no Canva. Coloque a sua marca e entregue às suas alunas ainda hoje. Por R$ 27,90.",
      },
      { property: "og:title", content: "Apostila Editável de Extensão de Cílios — Malinne" },
      {
        property: "og:description",
        content:
          "Apostila de curso premium com a sua marca, pronta ainda hoje. Editável no Canva gratuito, layout de luxo, feita por quem já formou 312 alunas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Jost:wght@400;500;600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
});

function Placeholder({ id, label, className = "" }: { id: string; label: string; className?: string }) {
  return (
    <div className={`placeholder ${className}`}>
      <span className="placeholder__id">{id}</span>
      <span className="placeholder__label">{label}</span>
    </div>
  );
}

/* ============ FOTO (tratada para casar com o fundo escuro) ============ */
function Photo({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`photo ${className}`}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
    </div>
  );
}

/* ============ ANIMATED COUNTER ============ */
function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // separa "5 anos" -> ["", "5", " anos"] | "Top 1" -> ["Top ", "1", ""] | "7×" -> ["", "7", "×"]
  const parts = value.match(/^(\D*)(\d+)(.*)$/);
  const target = parts ? parseInt(parts[2], 10) : NaN;
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!inView || isNaN(target)) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, target]);
  if (!parts) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {parts[1]}
      {n}
      {parts[3]}
    </span>
  );
}

/* ============ CYLINDRICAL 3D CAROUSEL ============ */
function Cylindrical({ items }: { items: { id: string; label: string }[] }) {
  const [angle, setAngle] = useState(0);
  const n = items.length;
  const radius = 320;
  useEffect(() => {
    const id = setInterval(() => setAngle((a) => a + 360 / n / 2), 3200);
    return () => clearInterval(id);
  }, [n]);
  return (
    <div className="cyl">
      <motion.div
        className="cyl__stage"
        animate={{ rotateY: -angle }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {items.map((it, i) => {
          const rot = (360 / n) * i;
          return (
            <div
              key={it.id}
              className="cyl__card"
              style={{ transform: `rotateY(${rot}deg) translateZ(${radius}px)` }}
            >
              <div className="glass glass--frame">
                <Placeholder id={it.id} label={it.label} />
              </div>
            </div>
          );
        })}
      </motion.div>
      <div className="cyl__dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`cyl__dot ${Math.round(angle / (360 / n)) % n === i ? "is-on" : ""}`}
            onClick={() => setAngle((360 / n) * i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ INFINITE MARQUEE (testimonials) ============ */
function Marquee({ items, reverse = false }: { items: { id: string; label: string; src?: string }[]; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="marquee">
      <div className={`marquee__track${reverse ? " marquee__track--reverse" : ""}`}>
        {row.map((it, i) => (
          <div key={i} className="marquee__card marquee__card--solid">
            {it.src ? (
              <img
                className="marquee__img"
                src={it.src}
                alt={it.label}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ) : (
              <Placeholder id={it.id} label={it.label} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ TILT CARD ============ */
function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * 10);
        rx.set(-py * 10);
      }}
      onMouseLeave={() => {
        animate(rx, 0, { duration: 0.5 });
        animate(ry, 0, { duration: 0.5 });
      }}
    >
      {children}
    </motion.div>
  );
}

/* ============ ANIM GATE (perf): pausa as animações CSS da seção quando fora da tela ============ */
function AnimGate({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "300px 0px 300px 0px" });
  return (
    <div ref={ref} data-offscreen={inView ? undefined : "true"}>
      {children}
    </div>
  );
}

/* ============ VENOM BUTTON (CTA líquido da hero) ============ */
const LiquidFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </svg>
);

function VenomButton({ href = CHECKOUT, label = "Quero minha apostila", compact = false }: { href?: string; label?: string; compact?: boolean }) {
  const external = href.startsWith("http");
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false); // Track click state
  const buttonRef = useRef<HTMLAnchorElement>(null);
  // perf: o filtro goo é caro; só anima com o botão perto da viewport
  const inViewBtn = useInView(buttonRef, { margin: "200px 0px 200px 0px" });

  // Controles manuais para sequenciar as animações perfeitamente
  const shapeControls = useAnimation();
  const highlightControls = useAnimation();

  // Motion values for tracking mouse position relative to button center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform values to create a subtle 3D tilt effect ONLY when hovered
  const rotateX = useTransform(mouseY, [-50, 50], isHovered ? [10, -10] : [0, 0]);
  const rotateY = useTransform(mouseX, [-50, 50], isHovered ? [-10, 10] : [0, 0]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current || !isHovered) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActive(false); // Reset active state if dragged out
    mouseX.set(0);
    mouseY.set(0);
  };

  const generateTendrilVariants = () => {
    const variants: Record<string, Variants> = {};
    for (let i = 1; i <= 6; i++) {
      variants[`tendril${i}`] = {
        hidden: { scale: 0, opacity: 0, x: 0, y: 0 },
        visible: {
          scale: [0, 1.5, 1],
          opacity: [0, 1, 0],
          x: [0, (Math.random() - 0.5) * 120],
          y: [0, (Math.random() - 0.5) * 120],
          transition: {
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }
        }
      };
    }
    return variants;
  };

  const tendrilVariants = generateTendrilVariants();

  // Determine if the button is in a 'controlled' state (hovered or clicked)
  const isControlled = isHovered || isActive;

  // Efeito para orquestrar a transição suave de volta para o formato de bolha
  useEffect(() => {
    let isMounted = true;

    const animateShape = async () => {
      if (!inViewBtn) {
        shapeControls.stop();
        highlightControls.stop();
        return;
      }
      if (isActive) {
        // Estado Clicado: Encolhe levemente
        shapeControls.start({
          scale: 0.95,
          x: 0, y: 0,
          borderRadius: '12px',
          transition: { duration: 0.15, ease: "easeOut" }
        });
        highlightControls.start({
          opacity: 0.5, y: 2, borderRadius: '6px',
          transition: { duration: 0.15 }
        });
      } else if (isHovered) {
        // Estado Hover (Controlado): Transição mais lenta e fluida para o quadrado
        shapeControls.start({
          scale: 1,
          x: 0, y: 0,
          borderRadius: '12px',
          transition: { duration: 0.6, ease: "easeInOut" }
        });
        highlightControls.start({
          opacity: 0.5, y: 0, borderRadius: '6px',
          transition: { duration: 0.6, ease: "easeInOut" }
        });
      } else {
        // 1. Fase de Recuperação (Derretendo): O "desmanchar" orgânico
        highlightControls.start({
          opacity: 0.2, y: 0, borderRadius: '40%',
          transition: { duration: 1.2, ease: "easeInOut" }
        });

        // Simula o derretimento esparramando antes de juntar na bolha
        await shapeControls.start({
          scale: [1, 1.04, 1],
          x: [0, 0, 0],
          y: [0, 0, 0],
          borderRadius: [
            '12px', // Começa rígido
            '25% 75% 70% 30% / 35% 65% 45% 65%', // Intermediário caótico mais esparramado
            '35% 65% 55% 45% / 50% 60% 45% 55%'  // Encaixa com o primeiro frame da animação contínua
          ],
          transition: {
            duration: 1.2,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }
        });

        // 2. Fase Contínua: Inicia a pulsação animada e BEM visível se o mouse estiver fora
        if (isMounted && !isHovered && !isActive) {
          shapeControls.start({
            scale: [1, 1.03, 0.97, 1.02, 1],
            // Valores extremos para a gosma se mexer bastante,
            // mas sempre somando >= 100 nas verticais para não ter paredes retas nas laterais!
            borderRadius: [
              '35% 65% 55% 45% / 50% 60% 45% 55%',
              '65% 35% 45% 55% / 60% 45% 60% 45%',
              '45% 55% 65% 35% / 55% 55% 50% 50%',
              '55% 45% 35% 65% / 45% 50% 55% 55%',
              '35% 65% 55% 45% / 50% 60% 45% 55%'
            ],
            // Deslocamento sutil para parecer que o peso do líquido está mudando de lado
            x: [0, 3, -2, 2, 0],
            y: [0, -2, 2, -1, 0],
            transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          });
          highlightControls.start({
            opacity: [0.2, 0.5, 0.2],
            y: [0, 3, 0],
            borderRadius: ['40%', '60%', '40%'],
            transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          });
        }
      }
    };

    animateShape();

    return () => { isMounted = false; };
  }, [isHovered, isActive, inViewBtn, shapeControls, highlightControls]);

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group w-full sm:w-auto ${compact ? "px-6 sm:px-10 py-4 sm:py-[18px]" : "px-8 sm:px-12 py-5 sm:py-6"} outline-none inline-flex items-center justify-center no-underline`}
    >
      <LiquidFilter />

      {/* Forma principal (O Simbionte) - Expandida para dar margem à forma orgânica */}
      <motion.div
        className="absolute -inset-1 z-10"
        style={{
          background: 'linear-gradient(145deg, rgba(194,26,34,0.45) 0%, rgba(20,0,0,0.95) 100%)',
          boxShadow: 'inset 0 2px 20px rgba(255,100,100,0.3), inset 0 -2px 20px rgba(0,0,0,0.9), 0 10px 30px rgba(100,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,30,30,0.2)',
          filter: 'url(#goo)'
        }}
        animate={shapeControls}
      />

      {/* Efeito de tentáculos/respingos (Simbionte agoniado) */}
      {/* Aparecem quando NÃO está controlado, para dar sensação de instabilidade */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ filter: 'url(#goo)' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              variants={tendrilVariants[`tendril${i}`]}
              initial="hidden"
              animate={isControlled || !inViewBtn ? "hidden" : "visible"} // Somem ao interagir ou fora da tela
              className="absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 rounded-full bg-[#C21A22] mix-blend-screen"
            />
          ))}
      </div>

      {/* Destaque brilhante superior (reflexo) */}
      <motion.div
         className="absolute inset-x-4 top-2 h-1/4 rounded-full bg-gradient-to-b from-white/30 to-transparent z-20 blur-[1px]"
         animate={highlightControls}
      />

      {/* Conteúdo interno: Texto */}
      <div
        className="relative z-30 flex items-center justify-center pointer-events-none"
        style={{ transform: 'translateZ(20px)' }}
      >
        <motion.span
          className={`text-white font-bold ${compact ? "text-[13.5px] sm:text-base" : "text-[15px] sm:text-lg"} tracking-widest uppercase whitespace-nowrap`}
          style={{ fontFamily: "'Jost', sans-serif" }}
          animate={{
            textShadow: isControlled ? "0 0 20px rgba(255,100,100,1)" : "0 0 5px rgba(200,0,0,0.5)",
            scale: isActive ? 0.95 : 1
          }}
        >
          {label}
        </motion.span>
      </div>
    </motion.a>
  );
}

/* ============ MINI APOSTILA (mockup espiral, fundo transparente) ============ */
const MiniApostila = () => (
  <div className="mini-book">
    <img
      src="/img/capa-apostila-real.webp"
      alt="Apostila Malinne encadernada em espiral"
      loading="lazy"
      decoding="async"
    />
    <span className="mini-book__pages" aria-hidden />
    <span className="mini-book__spiral" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <i key={i} />
      ))}
    </span>
  </div>
);

/* SVG de vídeo (player com play pulsando e progresso) */
const VideoIllustration = () => (
  <svg viewBox="0 0 120 120" className="video-illus" aria-hidden>
    {/* moldura do player */}
    <rect x="12" y="24" width="96" height="66" rx="9" stroke="#C9A38C" strokeWidth="2" fill="rgba(0,0,0,.35)" />
    {/* três pontos da barra superior */}
    <circle cx="23" cy="33" r="1.8" fill="#C9A38C" opacity=".55" />
    <circle cx="30" cy="33" r="1.8" fill="#C9A38C" opacity=".4" />
    <circle cx="37" cy="33" r="1.8" fill="#C9A38C" opacity=".25" />
    {/* botão de play */}
    <circle cx="60" cy="57" r="15" fill="rgba(194,26,34,.22)" stroke="#E4342C" strokeWidth="2" className="video-illus__pulse" />
    <path d="M 56 50 L 68 57 L 56 64 Z" fill="#FF9384" />
    {/* barra de progresso */}
    <line x1="22" y1="82" x2="98" y2="82" stroke="rgba(246,241,239,.22)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="82" x2="98" y2="82" stroke="#C21A22" strokeWidth="2.5" strokeLinecap="round"
      pathLength={1} strokeDasharray={1} className="video-illus__bar" />
    {/* brilho de vidro */}
    <path d="M 16 28 L 52 28 L 24 44 L 16 44 Z" fill="rgba(255,255,255,.06)" />
  </svg>
);

/* SVG de grupo (pessoinhas conectadas conversando) */
const GroupIllustration = () => (
  <svg viewBox="0 0 120 120" className="group-illus" aria-hidden>
    {/* linhas de conexão fluindo */}
    <g stroke="rgba(201,163,140,.55)" strokeWidth="1.6" fill="none" strokeDasharray="3 4" strokeLinecap="round">
      <path d="M 44 52 L 68 42" className="group-illus__link" />
      <path d="M 38 66 L 52 86" className="group-illus__link" style={{ animationDelay: ".4s" }} />
      <path d="M 70 88 L 84 58" className="group-illus__link" style={{ animationDelay: ".8s" }} />
    </g>
    {/* pessoa central-esquerda */}
    <g stroke="#C9A38C" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <circle cx="32" cy="52" r="7.5" fill="rgba(0,0,0,.3)" />
      <path d="M 20 74 C 20 62, 44 62, 44 74" />
    </g>
    {/* pessoa direita (destaque rubi) */}
    <g stroke="#E4342C" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <circle cx="88" cy="44" r="7.5" fill="rgba(0,0,0,.3)" />
      <path d="M 76 66 C 76 54, 100 54, 100 66" />
    </g>
    {/* pessoa embaixo */}
    <g stroke="#C9A38C" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <circle cx="60" cy="92" r="7.5" fill="rgba(0,0,0,.3)" />
      <path d="M 48 114 C 48 102, 72 102, 72 114" />
    </g>
    {/* balões de conversa pipocando */}
    <g className="group-illus__bubble">
      <rect x="38" y="28" width="22" height="14" rx="7" fill="rgba(194,26,34,.28)" stroke="#E4342C" strokeWidth="1.4" />
      <circle cx="45" cy="35" r="1.4" fill="#FF9384" />
      <circle cx="49.5" cy="35" r="1.4" fill="#FF9384" />
      <circle cx="54" cy="35" r="1.4" fill="#FF9384" />
    </g>
    <g className="group-illus__bubble" style={{ animationDelay: "1.6s" }}>
      <rect x="96" y="70" width="18" height="12" rx="6" fill="rgba(201,163,140,.25)" stroke="#C9A38C" strokeWidth="1.4" />
      <circle cx="102" cy="76" r="1.3" fill="#F6F1EF" />
      <circle cx="108" cy="76" r="1.3" fill="#F6F1EF" />
    </g>
    <g className="group-illus__bubble" style={{ animationDelay: "3.2s" }}>
      <rect x="18" y="86" width="18" height="12" rx="6" fill="rgba(201,163,140,.25)" stroke="#C9A38C" strokeWidth="1.4" />
      <circle cx="24" cy="92" r="1.3" fill="#F6F1EF" />
      <circle cx="30" cy="92" r="1.3" fill="#F6F1EF" />
    </g>
  </svg>
);

/* SVG de fornecedores (lista com checks + encomenda) */
const SupplierIllustration = () => (
  <svg viewBox="0 0 120 120" className="supplier-illus" aria-hidden>
    {/* prancheta */}
    <rect x="22" y="18" width="54" height="80" rx="6" stroke="#C9A38C" strokeWidth="2.2" fill="rgba(0,0,0,.35)" />
    <rect x="38" y="12" width="22" height="11" rx="4" stroke="#C9A38C" strokeWidth="2" fill="rgba(0,0,0,.6)" />
    {/* itens da lista com check aparecendo em sequência */}
    {[36, 54, 72].map((y, i) => (
      <g key={y}>
        <circle cx="34" cy={y} r="4.6" stroke="rgba(201,163,140,.6)" strokeWidth="1.6" fill="none" />
        <path
          d={`M 31.6 ${y} L 33.6 ${y + 2} L 36.8 ${y - 2.4}`}
          stroke="#E4342C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
          className="supplier-illus__check" style={{ animationDelay: `${i * 0.6}s` }}
        />
        <line x1="44" y1={y} x2="68" y2={y} stroke="rgba(246,241,239,.35)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="44" y1={y + 6.5} x2="60" y2={y + 6.5} stroke="rgba(246,241,239,.18)" strokeWidth="2" strokeLinecap="round" />
      </g>
    ))}
    {/* caixinha de encomenda */}
    <g className="supplier-illus__box">
      <path d="M 74 78 L 96 70 L 112 78 L 90 86 Z" fill="rgba(194,26,34,.3)" stroke="#E4342C" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M 74 78 L 74 96 L 90 104 L 90 86 Z" fill="rgba(110,23,18,.55)" stroke="#E4342C" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M 90 86 L 90 104 L 112 96 L 112 78 Z" fill="rgba(75,16,13,.55)" stroke="#E4342C" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M 82 74.8 L 104 82.4" stroke="#FF9384" strokeWidth="1.4" />
    </g>
  </svg>
);

/* ============ CARD DE PAGAMENTO (aura premium, rubi) ============ */
const paymentStyles = `
  @keyframes payBeamSpin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes auraRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes auraBeamRotation {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
  /* onda via transform (nada de animar 'left': era o que travava no mobile) */
  @keyframes auraShinery {
    0%, 100% { transform: translateX(-150%) skew(-25deg); opacity: 0; }
    20% { opacity: 1; }
    48% { transform: translateX(560%) skew(-25deg); opacity: 1; }
    51% { opacity: 0; }
  }

  .pay-card {
    position: relative; border-radius: 1rem;
    padding: 26px 24px; width: 100%; max-width: 380px; margin: 36px auto 0;
    background-color: #140303;
    background-image:
      radial-gradient(at 88% 40%, #140303 0px, transparent 85%),
      radial-gradient(at 49% 30%, #140303 0px, transparent 85%),
      radial-gradient(at 14% 26%, #140303 0px, transparent 85%),
      radial-gradient(at 0% 64%, rgba(142,27,21,.95) 0px, transparent 85%),
      radial-gradient(at 41% 94%, rgba(255,147,132,.7) 0px, transparent 85%),
      radial-gradient(at 100% 99%, rgba(228,52,44,.85) 0px, transparent 85%);
    box-shadow: 0px -16px 24px 0px rgba(255,170,155,.13) inset;
  }
  .pay-card__border {
    overflow: hidden; pointer-events: none; position: absolute; z-index: -10;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: calc(100% + 2px); height: calc(100% + 2px);
    background-image: linear-gradient(0deg, #FFE3DA -50%, #4B100D 100%);
    border-radius: 1rem;
  }
  .pay-card__beam {
    pointer-events: none; position: absolute; z-index: 200;
    top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(0deg);
    transform-origin: left; width: 200%; height: 10rem;
    background-image: linear-gradient(0deg, rgba(255,227,218,0) 0%, #FF6B5E 40%, #FFD1C7 60%, rgba(75,16,13,0) 100%);
    animation: payBeamSpin 8s linear infinite;
    will-change: transform;
  }

  /* Botão Aura (rosé claro com texto rubi) */
  .aura-button {
    --speed: 4s;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    clip-path: inset(0 round 20px);
    font-family: 'Jost', sans-serif;
    transform: translateZ(0);
  }
  .aura-button:hover {
    --speed: 2.2s;
    transform: scale(1.02);
    box-shadow: 0 10px 30px -5px rgba(243,210,196,.3);
  }
  .aura-onda {
    background: linear-gradient(10deg, rgba(255,255,255,.5) 12.81%, rgba(255,255,255,0) 66.66%);
    width: 90px; height: 150%;
    position: absolute; top: -25%; left: 0;
    transform: translateX(-150%) skew(-25deg);
    pointer-events: none;
    animation: auraShinery 6s infinite ease-in-out;
    z-index: 4;
    will-change: transform;
  }
  .aura-fundo-white {
    position: absolute; left: 5px; width: 0%; height: calc(100% - 10px);
    background: #ffffff; border-radius: 16px;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 6; opacity: 0; top: 5px;
  }
  .aura-button:hover .aura-fundo-white { width: calc(100% - 10px); opacity: 1; }
  .aura-icone {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #8E1B15 0%, #4B100D 100%);
    border-radius: 14px; z-index: 20;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .aura-button:hover .aura-icone { left: calc(100% - 44px); }
  .aura-texto, .aura-texto-hover {
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    color: #7E120C; font-size: 0.95rem; font-weight: 600;
    letter-spacing: .04em; text-transform: uppercase;
  }
  .aura-texto-hover {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%) translateX(25px);
    opacity: 0;
  }
  @media (max-width: 640px) {
    .aura-texto, .aura-texto-hover { font-size: 0.84rem; letter-spacing: .03em; }
  }
  .aura-button:hover .aura-texto { opacity: 0; transform: translateX(-40px); }
  .aura-button:hover .aura-texto-hover { opacity: 1; transform: translate(-50%, -50%) translateX(-12px); }
  .aura-shimmer-container {
    position: absolute; inset: -50%; width: 200%; height: 200%;
    animation: auraRotate var(--speed) linear infinite;
    will-change: transform;
  }
  .aura-shimmer-gradient {
    position: absolute; inset: 0;
    background: conic-gradient(from 225deg, transparent 0%, rgba(255,255,255,0.8) 10%, transparent 20%);
  }
  .aura-bottom-glow {
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 80%; height: 40%;
    background: radial-gradient(circle at bottom, rgba(255,255,255,.6) 0%, transparent 70%);
    z-index: 2; pointer-events: none; opacity: .7;
  }
  @media (prefers-reduced-motion: reduce) {
    .pay-card__beam, .aura-onda, .aura-shimmer-container { animation: none; }
  }
`;

function PaymentCard() {
  return (
    <div className="pay-card">
      <style>{paymentStyles}</style>

      {/* Borda animada girando */}
      <div className="pay-card__border">
        <div className="pay-card__beam"></div>
      </div>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl border border-[#FF9384]/25 bg-gradient-to-br from-[#C21A22]/25 to-[#4B100D]/30 flex items-center justify-center">
            <BookOpen className="w-[22px] h-[22px] text-[#FF9384]" />
          </div>
          <div>
            <h3 className="text-xl font-medium tracking-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Apostila Completa
            </h3>
            <p className="text-[10px] uppercase tracking-wider text-[#FF9384]/90 font-bold">
              Oferta de lançamento
            </p>
          </div>
        </div>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-medium text-[#F6F1EF]/45 line-through mr-2">R$ 47</span>
          <span className="text-xs font-medium text-[#F6F1EF]/60 mr-1">R$</span>
          <span className="text-4xl font-semibold tracking-tight text-white" style={{ fontFamily: "'Jost', sans-serif" }}>
            27,90
          </span>
        </div>
        <p className="text-xs text-[#F6F1EF]/50 mt-1">Pagamento único · até 6× no cartão · Pix · boleto</p>
      </div>

      {/* O que está incluso */}
      <ul className="space-y-3 text-sm text-[#F6F1EF]/90 mb-8">
        {[
          "Apostila completa editável no Canva",
          "Vídeo passo a passo",
          "Grupo exclusivo de compradoras",
          "Bônus: certificado editável",
          "Bônus: lista de fornecedores",
        ].map((f) => (
          <li key={f} className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-[#FF9384] flex items-center justify-center mt-0.5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#140303" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
            </div>
            {f}
          </li>
        ))}
      </ul>

      {/* Botão Aura */}
      <a
        href={CHECKOUT}
        target="_blank"
        rel="noopener"
        className="aura-button group isolate inline-flex items-center w-full h-[58px] cursor-pointer overflow-hidden rounded-[20px] relative bg-[#F3D2C4] no-underline"
      >
        {/* Shimmer Aura */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
          <div className="aura-shimmer-container">
            <div className="aura-shimmer-gradient"></div>
          </div>
        </div>

        {/* Onda Animada */}
        <div className="aura-onda"></div>

        {/* Fundo Principal */}
        <div className="absolute inset-[1.5px] bg-gradient-to-b from-[#FBE3D8] via-[#F3D2C4] to-[#EBC2B1] rounded-[18px] z-1"></div>

        {/* Glow Inferior */}
        <div className="aura-bottom-glow"></div>

        {/* Hover White State */}
        <div className="aura-fundo-white"></div>

        {/* Ícone Móvel */}
        <div className="aura-icone">
          <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:hidden"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="hidden group-hover:block w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Textos do Botão */}
        <div className="relative z-10 w-full h-full flex items-center justify-center pl-14 pr-4 sm:px-6">
          <span className="aura-texto whitespace-nowrap tracking-wide">
            Garantir minha apostila
          </span>
          <span className="aura-texto-hover whitespace-nowrap">
            Vamos começar?
          </span>
        </div>
      </a>
    </div>
  );
}

/* SVG do selo de garantia (escudo com check e anel pulsante) */
const GuaranteeShield = () => (
  <svg viewBox="0 0 80 80" className="guar-shield" aria-hidden>
    <defs>
      <linearGradient id="guarGrad" x1="20" y1="14" x2="60" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FF9384" />
        <stop offset=".5" stopColor="#E4342C" />
        <stop offset="1" stopColor="#8E1B15" />
      </linearGradient>
    </defs>
    {/* anel pulsante */}
    <circle cx="40" cy="40" r="35" stroke="rgba(201,163,140,.5)" strokeWidth="1.4" fill="none"
      strokeDasharray="3 5" className="guar-shield__ring" />
    {/* escudo */}
    <path d="M 40 13 L 61 21 V 40 C 61 54.5 51.5 63.5 40 69 C 28.5 63.5 19 54.5 19 40 V 21 Z"
      fill="rgba(194,26,34,.18)" stroke="url(#guarGrad)" strokeWidth="2.6" strokeLinejoin="round" />
    {/* brilho de vidro no escudo */}
    <path d="M 40 16 L 57 22.5 V 30 L 40 23 Z" fill="rgba(255,255,255,.14)" />
    {/* check que se desenha */}
    <path d="M 30.5 40.5 L 37.5 47.5 L 50.5 33" stroke="#FFD1C7" strokeWidth="3.4" fill="none"
      strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
      className="guar-shield__check" />
  </svg>
);

/* Onda de transição reutilizável (mesma da história) */
const WaveDivider = () => (
  <div className="wave-top" aria-hidden>
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path
        className="wave-b"
        d="M-120,84 C200,124 460,44 740,74 C1000,102 1240,54 1560,90 L1560,0 L-120,0 Z"
        fill="#0a0202"
        opacity=".55"
      />
      <path
        d="M-120,62 C220,108 480,18 760,50 C1020,80 1240,28 1560,66 L1560,0 L-120,0 Z"
        fill="#0a0202"
      />
    </svg>
  </div>
);

/* Card que acende (efeito da referência) quando o scroll chega nele */
function LitCard({ className, children }: { className: string; children: React.ReactNode }) {
  const [lit, setLit] = useState(false);
  return (
    <motion.div
      className={`${className}${lit ? " is-lit" : ""}`}
      onViewportEnter={() => setLit(true)}
      onViewportLeave={() => setLit(false)}
      viewport={{ amount: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/* ============ TRAJETÓRIA (achievement card) ============ */
// Lista de conquistas baseada na imagem de referência
const achievements = [
  { id: 1, highlight: "5 anos", subtitle: "DE EXTENSÃO DE CÍLIOS", icon: Clock, top: "15%" },
  { id: 2, highlight: "312", subtitle: "ALUNAS FORMADAS", icon: Users, top: "32%" },
  { id: 3, highlight: "30", subtitle: "CERTIFICAÇÕES", icon: Award, top: "49%" },
  { id: 4, highlight: "Top 1", subtitle: "PREMIADA EM CAPPING", icon: Trophy, top: "66%" },
  { id: 5, highlight: "7x", subtitle: "ARTISTA DESTAQUE", icon: Star, top: "83%" },
];

function AchievementCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  // sequência do reveal: card → título (fade longo) → pílulas começam a cruzar
  const inView = useInView(cardRef, { once: true, amount: 0.35 });
  return (
    // Fundo com a identidade visual da página (mesmo radial vinho/rubi das outras seções)
    <div
      className="flex items-center justify-center min-h-screen overflow-hidden font-sans relative"
      style={{
        background:
          "radial-gradient(120% 85% at 72% 12%, #A72A21 0%, #6E1712 26%, #350B08 55%, #0b0202 82%, #060101 100%)",
      }}
    >

      {/* Background Liquid (brilhos rubi em movimento lento, sem imagem) */}
      <motion.div
        whileInView={{
          scale: [1, 1.12, 1],
          x: [-30, 30, -30],
          y: [-15, 15, -15],
        }}
        viewport={{ once: false, margin: "250px 0px 250px 0px" }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(42% 36% at 22% 28%, rgba(194,26,34,.42), transparent 70%), radial-gradient(48% 42% at 80% 68%, rgba(142,27,21,.5), transparent 72%), radial-gradient(36% 30% at 62% 12%, rgba(167,42,33,.35), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Transição esfumaçada vinda da dobra 1: preto do hero dissolvendo + névoa derivando */}
      <div
        className="absolute top-0 left-0 right-0 h-44 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(180deg, #060101 0%, rgba(6,1,1,.6) 48%, transparent 100%)" }}
      />
      <motion.div
        whileInView={{ x: ["-12%", "12%", "-12%"], opacity: [0.45, 0.85, 0.45] }}
        viewport={{ once: false, margin: "250px 0px 250px 0px" }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-8 left-[-15%] right-[-15%] h-64 z-[6] pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 50% at 30% 45%, rgba(246,241,239,.06), transparent 70%), radial-gradient(48% 46% at 72% 55%, rgba(194,26,34,.14), transparent 72%)",
          filter: "blur(34px)",
        }}
      />

      {/* Card: revela com a mesma fumaça sublime da dobra 1, só quando o scroll chega na seção */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 44, scale: 1.02, filter: "blur(8px)" }}
        animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-[min(94vw,460px)] h-[700px] bg-black/30 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] border border-white/10 overflow-hidden flex flex-col items-center backdrop-blur-3xl">

        {/* Luz interna extra no card para dar mais volume de vidro */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-red-500/20 rounded-full blur-[50px] mix-blend-overlay pointer-events-none"></div>

        {}
        <div className="absolute top-8 z-20 flex items-center justify-center w-full">
          <motion.h2
            initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
            animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.35 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-100 via-rose-200 to-red-400 text-[1.3rem] font-extrabold tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]"
          >
            Minha Trajetória
          </motion.h2>
        </div>

        {}
        <div className="w-full h-full relative mt-14">
          {achievements.map((item, i) => {
            const fromLeft = i % 2 === 0;
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className={`absolute w-full flex ${fromLeft ? "justify-start" : "justify-end"} z-10`}
                style={{ top: item.top }}
              >
                {/* aba grudada na borda: entra do próprio lado deslizando (só transform+opacity: liso na GPU) */}
                <motion.div
                  initial={{ x: fromLeft ? -110 : 110, opacity: 0, scale: 0.96 }}
                  animate={inView ? { x: 0, opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                    // começam logo após o título aparecer, em cascata
                    delay: 1.4 + i * 0.3
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className={`flex items-center gap-4 px-6 py-2.5 whitespace-nowrap
                             ${fromLeft ? "rounded-r-full border-l-0 pl-5" : "rounded-l-full border-r-0 pr-5"}
                             bg-gradient-to-br from-white/20 via-black/55 to-black/70
                             border border-white/20 border-t-white/50
                             shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_3px_5px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.4)]`}
                >
                  <IconComponent className="w-6 h-6 text-red-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] shrink-0" />

                  <div className="flex flex-col justify-center items-start leading-tight">
                    <span className="text-gray-100 font-bold text-lg drop-shadow-md" style={{ fontFamily: "'Jost', sans-serif" }}>
                      {item.highlight}
                    </span>
                    <span className="text-[#e2c1b1] font-sans font-medium text-[0.65rem] tracking-[0.2em] uppercase">
                      {item.subtitle}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Máscara invisível nas bordas (fade out dos cards nas pontas) */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none opacity-90"></div>
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none opacity-90"></div>

      </motion.div>
    </div>
  );
}

/* ============ PROBLEMA (pain section — carrossel de cenas) ============ */
const painAnimations = `
  /* respiro sutil compartilhado */
  @keyframes pain-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  /* Cena 1: Domínio — cílios desenhados fio a fio + brilhos */
  @keyframes pain-lash-draw {
    0% { stroke-dashoffset: 1; opacity: 0; }
    6% { opacity: 1; }
    24% { stroke-dashoffset: 0; }
    80% { stroke-dashoffset: 0; opacity: 1; }
    92% { opacity: 0; }
    100% { stroke-dashoffset: 1; opacity: 0; }
  }
  @keyframes pain-twinkle {
    0%, 100% { opacity: 0; transform: scale(.35) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(90deg); }
  }
  @keyframes pain-gaze {
    0%, 26%, 100% { transform: translateX(0); }
    36%, 48% { transform: translateX(2.5px); }
    62%, 78% { transform: translateX(-2px); }
  }

  /* Cena 2: Bloqueio — linha que se escreve e se apaga, cursor, dúvidas */
  @keyframes pain-type-erase {
    0% { stroke-dashoffset: 1; }
    32% { stroke-dashoffset: 0; }
    55% { stroke-dashoffset: 0; }
    85% { stroke-dashoffset: 1; }
    100% { stroke-dashoffset: 1; }
  }
  @keyframes pain-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes pain-doubt {
    0% { opacity: 0; transform: translateY(8px) scale(.7); }
    25% { opacity: .9; transform: translateY(0) scale(1); }
    68% { opacity: .9; }
    100% { opacity: 0; transform: translateY(-12px) scale(.95); }
  }
  @keyframes pain-sway {
    0%, 100% { transform: rotate(0deg); }
    30% { transform: rotate(-1.2deg); }
    70% { transform: rotate(1.2deg); }
  }

  /* Cena 3: Exaustão — ponteiros correndo, vapor subindo, lua */
  @keyframes pain-hand-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pain-steam {
    0% { opacity: 0; transform: translateY(4px); }
    30% { opacity: .75; }
    100% { opacity: 0; transform: translateY(-14px); }
  }
  @keyframes pain-moon { 0%, 100% { opacity: .35; } 50% { opacity: .9; } }

  /* Cena 4: Frustração — layout desalinhando, rabisco, estrela caindo */
  @keyframes pain-slip-r {
    0%, 52%, 100% { transform: none; }
    62% { transform: translateX(6px) rotate(2deg); }
    82% { transform: translateX(4px) rotate(1.2deg); }
  }
  @keyframes pain-slip-l {
    0%, 55%, 100% { transform: none; }
    66% { transform: translateX(-6px) rotate(-2deg); }
    84% { transform: translateX(-3px) rotate(-1deg); }
  }
  @keyframes pain-scribble {
    0%, 48% { stroke-dashoffset: 1; opacity: 0; }
    56% { opacity: 1; }
    74% { stroke-dashoffset: 0; opacity: 1; }
    92% { opacity: 0; }
    100% { stroke-dashoffset: 1; opacity: 0; }
  }
  @keyframes pain-star-on {
    0%, 14% { opacity: .22; }
    22%, 100% { opacity: 1; }
  }
  @keyframes pain-star-flicker {
    0%, 28% { opacity: .22; }
    36% { opacity: 1; }
    44% { opacity: .35; }
    50% { opacity: .9; }
    58%, 100% { opacity: .22; }
  }

  /* Destaque neon: pulso de cor rubi <-> vermelho claro (respiração), com brilho de vidro */
  .neon-liquid {
    font-style: italic; font-weight: 700;
    animation: chameleon-glow 3s linear infinite alternate;
  }
  @keyframes chameleon-glow {
    0%, 10% {
      color: #C21A22; /* rubi forte */
      text-shadow: 0 0 12px rgba(194, 26, 34, 0.4),
                   0 0 24px rgba(194, 26, 34, 0.2),
                   0 1px 0 rgba(255, 255, 255, 0.18);
    }
    90%, 100% {
      color: #F04438; /* vermelho vivo, sem clarear demais */
      text-shadow: 0 0 12px rgba(240, 68, 56, 0.55),
                   0 0 24px rgba(240, 68, 56, 0.35),
                   0 1px 0 rgba(255, 255, 255, 0.18);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pain-anim *, .neon-liquid { animation: none !important; }
  }
`;

const fillBox = { transformBox: "fill-box", transformOrigin: "center" } as const;

// Cena 1: O Domínio — olho humanizado com lash map real, extensões aplicadas fio a fio
const MasteryScene = () => (
  <svg viewBox="0 0 120 120" className="pain-anim w-full h-full text-amber-400 overflow-visible">
    <defs>
      <clipPath id="masteryEyeClip">
        <path d="M 22 64 C 34 42, 72 38, 100 58 C 88 74, 44 76, 22 64 Z" />
      </clipPath>
    </defs>
    <g style={{ ...fillBox, animation: "pain-float 5s ease-in-out infinite" }}>
      {/* vinco da pálpebra */}
      <path d="M 28 48 C 44 31, 78 29, 99 46" stroke="currentColor" strokeWidth="1.8" fill="none"
        strokeLinecap="round" opacity=".3" />
      {/* globo do olho (formato humano, canto externo puxado) */}
      <path d="M 22 64 C 34 42, 72 38, 100 58 C 88 74, 44 76, 22 64 Z" stroke="currentColor"
        strokeWidth="2.6" fill="rgba(0,0,0,.28)" strokeLinejoin="round" />
      {/* íris recortada pela pálpebra, com olhar vivo */}
      <g clipPath="url(#masteryEyeClip)">
        <g style={{ ...fillBox, animation: "pain-gaze 7s ease-in-out infinite" }}>
          <circle cx="58" cy="57" r="12.5" fill="currentColor" opacity=".22" />
          <circle cx="58" cy="57" r="12.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
          <circle cx="58" cy="57" r="5.4" fill="rgba(0,0,0,.85)" />
          <circle cx="58" cy="57" r="5.4" stroke="currentColor" strokeWidth="1" fill="none" opacity=".6" />
          <circle cx="62" cy="52.5" r="2" fill="#FFF5EF" opacity=".95" />
        </g>
      </g>
      {/* delineado com puxado de gatinho */}
      <path d="M 22 64 C 34 42, 72 38, 100 58" stroke="currentColor" strokeWidth="3.6" fill="none"
        strokeLinecap="round" />
      <path d="M 100 58 C 104 55, 108 51, 112 46" stroke="currentColor" strokeWidth="3" fill="none"
        strokeLinecap="round" />
      {/* cílios inferiores discretos */}
      <path d="M 76 72 C 77 75, 79 77, 82 78" stroke="currentColor" strokeWidth="1.5" fill="none"
        strokeLinecap="round" opacity=".5" />
      <path d="M 88 68 C 90 71, 93 73, 96 74" stroke="currentColor" strokeWidth="1.5" fill="none"
        strokeLinecap="round" opacity=".5" />
      {/* lash map: curtos no canto interno, longos e curvados no externo — aplicados fio a fio */}
      {[
        ["M 29 55 C 26 51, 23 47, 19 44", 1.8],
        ["M 39 49 C 37 43, 34 37, 29 32", 2],
        ["M 51 46 C 50 39, 48 31, 44 25", 2.2],
        ["M 64 45 C 65 37, 65 29, 62 21", 2.4],
        ["M 76 47 C 79 39, 83 31, 89 25", 2.4],
        ["M 87 51 C 91 44, 97 38, 104 33", 2.2],
        ["M 95 55 C 100 50, 106 46, 113 43", 2],
      ].map(([d, w], i) => (
        <path
          key={d as string}
          d={d as string}
          stroke="currentColor"
          strokeWidth={w as number}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          style={{ animation: `pain-lash-draw 6s ease-in-out infinite ${i * 0.22}s` }}
        />
      ))}
      {/* brilhos */}
      <path d="M 12 30 L 14 36 L 20 38 L 14 40 L 12 46 L 10 40 L 4 38 L 10 36 Z" fill="currentColor"
        style={{ ...fillBox, animation: "pain-twinkle 3.2s ease-in-out infinite .4s" }} />
      <path d="M 106 20 L 108 26 L 114 28 L 108 30 L 106 36 L 104 30 L 98 28 L 104 26 Z" fill="currentColor"
        style={{ ...fillBox, animation: "pain-twinkle 3.8s ease-in-out infinite 1.8s" }} />
    </g>
  </svg>
);

// Cena 2: O Bloqueio — página em branco, linha que se apaga, cursor piscando
const BlockScene = () => (
  <svg viewBox="0 0 120 120" className="pain-anim w-full h-full text-red-500 overflow-visible">
    <g style={{ ...fillBox, animation: "pain-sway 6s ease-in-out infinite" }}>
      {/* página */}
      <rect x="36" y="28" width="48" height="66" rx="5" stroke="currentColor" strokeWidth="2.5" fill="rgba(0,0,0,.35)" />
      {/* título fixo apagado */}
      <line x1="44" y1="40" x2="66" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".35" />
      {/* linhas que se escrevem e se apagam */}
      <path d="M 44 54 H 76" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
        pathLength={1} strokeDasharray={1} style={{ animation: "pain-type-erase 5s ease-in-out infinite" }} />
      <path d="M 44 64 H 70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
        pathLength={1} strokeDasharray={1} style={{ animation: "pain-type-erase 5s ease-in-out infinite .5s" }} />
      {/* cursor piscando na linha vazia */}
      <line x1="44" y1="72" x2="44" y2="82" stroke="currentColor" strokeWidth="2.5"
        style={{ animation: "pain-cursor 1.1s steps(1) infinite" }} />
    </g>
    {/* dúvidas flutuando */}
    <text x="20" y="36" fontFamily="Jost, sans-serif" fontWeight="600" fontSize="15" fill="currentColor"
      style={{ ...fillBox, animation: "pain-doubt 4.5s ease-in-out infinite" }}>?</text>
    <text x="92" y="28" fontFamily="Jost, sans-serif" fontWeight="600" fontSize="12" fill="currentColor"
      style={{ ...fillBox, animation: "pain-doubt 4.5s ease-in-out infinite 2.2s" }}>?</text>
  </svg>
);

// Cena 3: A Exaustão — relógio acelerado, madrugada, café
const ExhaustionScene = () => (
  <svg viewBox="0 0 120 120" className="pain-anim w-full h-full text-rose-500 overflow-visible">
    <g style={{ ...fillBox, animation: "pain-float 5s ease-in-out infinite" }}>
      {/* relógio */}
      <circle cx="60" cy="56" r="26" stroke="currentColor" strokeWidth="2.5" fill="rgba(0,0,0,.3)" />
      <line x1="60" y1="33" x2="60" y2="37" stroke="currentColor" strokeWidth="2" opacity=".5" />
      <line x1="60" y1="75" x2="60" y2="79" stroke="currentColor" strokeWidth="2" opacity=".5" />
      <line x1="37" y1="56" x2="41" y2="56" stroke="currentColor" strokeWidth="2" opacity=".5" />
      <line x1="79" y1="56" x2="83" y2="56" stroke="currentColor" strokeWidth="2" opacity=".5" />
      {/* ponteiros: minutos voando, hora arrastando */}
      <line x1="60" y1="56" x2="60" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        style={{ transformOrigin: "60px 56px", animation: "pain-hand-fast 3.2s linear infinite" }} />
      <line x1="60" y1="56" x2="72" y2="56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".7"
        style={{ transformOrigin: "60px 56px", animation: "pain-hand-fast 38s linear infinite" }} />
      <circle cx="60" cy="56" r="2" fill="currentColor" />
    </g>
    {/* lua (madrugada) */}
    <path d="M 100 18 A 9 9 0 1 0 104 32 A 7.5 7.5 0 1 1 100 18 Z" fill="currentColor"
      style={{ animation: "pain-moon 4.5s ease-in-out infinite" }} />
    {/* café com vapor */}
    <g stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round">
      <path d="M 16 96 H 36 L 34 108 H 18 Z" fill="rgba(0,0,0,.3)" />
      <path d="M 36 98 Q 43 100, 35 105" />
      <path d="M 22 90 C 20 86, 25 83, 23 78" pathLength={1} strokeDasharray={1}
        style={{ animation: "pain-steam 3.4s ease-out infinite" }} />
      <path d="M 30 90 C 28 86, 33 83, 31 78" pathLength={1} strokeDasharray={1}
        style={{ animation: "pain-steam 3.4s ease-out infinite 1.7s" }} />
    </g>
  </svg>
);

// Cena 4: A Frustração — apostila com layout desmontando + avaliação de 1 estrela
const FrustrationScene = () => {
  const star = (cx: number) =>
    `M ${cx} 98 L ${cx + 2.4} 103.2 L ${cx + 8} 103.8 L ${cx + 3.8} 107.6 L ${cx + 5} 113.2 L ${cx} 110.2 L ${cx - 5} 113.2 L ${cx - 3.8} 107.6 L ${cx - 8} 103.8 L ${cx - 2.4} 103.2 Z`;
  return (
    <svg viewBox="0 0 120 120" className="pain-anim w-full h-full text-neutral-400 overflow-visible">
      <g style={{ ...fillBox, animation: "pain-float 5.5s ease-in-out infinite" }}>
        {/* apostila entregue */}
        <rect x="34" y="16" width="52" height="72" rx="5" stroke="currentColor" strokeWidth="2.5" fill="rgba(0,0,0,.35)" />
        {/* blocos do layout escorregando do lugar */}
        <rect x="42" y="26" width="24" height="7" rx="2" fill="currentColor" opacity=".85"
          style={{ ...fillBox, animation: "pain-slip-r 6s ease-in-out infinite" }} />
        <rect x="42" y="42" width="36" height="3.5" rx="1.75" fill="currentColor" opacity=".55"
          style={{ ...fillBox, animation: "pain-slip-l 6s ease-in-out infinite .2s" }} />
        <rect x="42" y="51" width="30" height="3.5" rx="1.75" fill="currentColor" opacity=".55"
          style={{ ...fillBox, animation: "pain-slip-r 6s ease-in-out infinite .35s" }} />
        <rect x="42" y="60" width="34" height="3.5" rx="1.75" fill="currentColor" opacity=".55"
          style={{ ...fillBox, animation: "pain-slip-l 6s ease-in-out infinite .5s" }} />
        <rect x="42" y="69" width="22" height="3.5" rx="1.75" fill="currentColor" opacity=".55"
          style={{ ...fillBox, animation: "pain-slip-r 6s ease-in-out infinite .65s" }} />
        {/* rabisco de reprovação */}
        <path d="M 40 36 C 54 30, 58 54, 74 40 C 82 34, 76 52, 88 46" stroke="#C21A22" strokeWidth="2.5"
          fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1}
          style={{ animation: "pain-scribble 6s ease-in-out infinite" }} />
      </g>
      {/* a nota da aluna: só 1 estrela acende, a 2ª pisca e apaga */}
      <path d={star(28)} fill="#C21A22" style={{ animation: "pain-star-on 6s ease-in-out infinite" }} />
      <path d={star(44)} fill="#C21A22" style={{ animation: "pain-star-flicker 6s ease-in-out infinite" }} />
      <path d={star(60)} fill="currentColor" opacity=".22" />
      <path d={star(76)} fill="currentColor" opacity=".22" />
      <path d={star(92)} fill="currentColor" opacity=".22" />
    </svg>
  );
};

const painPoints = [
  {
    id: 1,
    AnimationComponent: MasteryScene,
    title: "O Domínio",
    text: "Você domina a técnica. Sabe ensinar. Sua aluna sai atendendo com excelência.",
    color: "from-amber-200 to-amber-500",
    glow: "bg-amber-500/10",
    borderTop: "border-t-amber-500/40"
  },
  {
    id: 2,
    AnimationComponent: BlockScene,
    title: "O Bloqueio",
    text: "Mas na hora de montar o material... trava tudo. A página em branco te encara.",
    color: "from-red-300 to-red-600",
    glow: "bg-red-600/10",
    borderTop: "border-t-red-500/40"
  },
  {
    id: 3,
    AnimationComponent: ExhaustionScene,
    title: "A Exaustão",
    text: "Horas, às vezes dias, tentando organizar. E o resultado fica com cara de improviso.",
    color: "from-rose-400 to-rose-700",
    glow: "bg-rose-700/10",
    borderTop: "border-t-rose-600/40"
  },
  {
    id: 4,
    AnimationComponent: FrustrationScene,
    title: "A Frustração Final",
    text: "A aluna paga pelo seu curso... e recebe um material que não está à altura do seu trabalho.",
    color: "from-neutral-300 to-neutral-500",
    glow: "bg-neutral-600/20",
    borderTop: "border-t-neutral-400/40"
  }
];

function PainSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Auto-play do carrossel — só começa quando a seção entra na tela
  useEffect(() => {
    if (!sectionInView) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % painPoints.length);
    }, 6000); // 6 segundos de leitura por tela
    return () => clearInterval(timer);
  }, [sectionInView]);

  const Scene = painPoints[currentSlide].AnimationComponent;

  return (
    <div ref={sectionRef} className="flex flex-col items-center justify-center min-h-screen bg-[#070202] overflow-hidden relative font-sans p-6">

      {/* Injeta as animações CSS das cenas */}
      <style>{painAnimations}</style>

      {/* Background Liquid Glass: bolhas rubi fortes derivando lentamente */}
      <motion.div
        whileInView={{ x: [-40, 30, -40], y: [-20, 25, -20], scale: [1, 1.15, 1] }}
        viewport={{ once: false, margin: "250px 0px 250px 0px" }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[8%] -left-[18%] w-[90vw] h-[90vw] max-w-[640px] max-h-[640px] rounded-full z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(194,26,34,.52), rgba(110,23,18,.28) 55%, transparent 76%)",
          filter: "blur(55px)",
        }}
      />
      <motion.div
        whileInView={{ x: [30, -30, 30], y: [20, -20, 20], scale: [1.1, 1, 1.1] }}
        viewport={{ once: false, margin: "250px 0px 250px 0px" }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-6%] right-[-16%] w-[80vw] h-[80vw] max-w-[580px] max-h-[580px] rounded-full z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 40%, rgba(142,27,21,.55), rgba(75,16,13,.3) 55%, transparent 78%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        whileInView={{ x: [-20, 20, -20], opacity: [0.55, 0.9, 0.55] }}
        viewport={{ once: false, margin: "250px 0px 250px 0px" }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[36%] left-[22%] w-[62vw] h-[62vw] max-w-[480px] max-h-[480px] rounded-full z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(167,42,33,.4), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#070202]/90 via-transparent to-[#070202] z-10 pointer-events-none"></div>

      {/* Título Principal */}
      <div className="relative z-20 w-full max-w-[420px] sm:max-w-[560px] flex flex-col items-center mt-6">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#cba692] text-[0.65rem] font-medium tracking-[0.3em] uppercase mb-4"
        >
          Você conhece essa cena
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          className="text-center text-[1.6rem] sm:text-[2rem] leading-tight text-[#F6F1EF] drop-shadow-xl"
        >
          Você dá um curso incrível. <br/>
          <span className="neon-liquid">
            Mas a sua apostila não mostra isso.
          </span>
        </motion.h2>
      </div>

      {/* Container do Card Carrossel com Glassmorphism */}
      <div className="relative z-20 w-full max-w-[340px] sm:max-w-[400px] h-[400px] mt-10 perspective-1000">

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* O Card Vidro Líquido */}
            <div className={`w-full h-full rounded-[35px] px-8 py-8 flex flex-col justify-start items-center text-center
                            bg-gradient-to-br from-white/10 via-black/50 to-black/80
                            backdrop-blur-2xl saturate-[1.2]
                            border border-white/10 ${painPoints[currentSlide].borderTop} border-l-white/10
                            shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_3px_rgba(255,255,255,0.2)]
                            relative overflow-hidden transition-colors duration-1000`}
            >
              {/* Brilho interno acompanhando a cor da cena */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[100px] ${painPoints[currentSlide].glow} rounded-full blur-[50px] mix-blend-screen pointer-events-none transition-colors duration-1000`}></div>

              {/* Cena animada em SVG */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-6 mt-2 relative z-10">
                <Scene />
              </div>

              {/* Textos da Cópia */}
              <h3 className={`text-[1.2rem] font-bold tracking-wider uppercase mb-3 text-transparent bg-clip-text bg-gradient-to-r ${painPoints[currentSlide].color}`}>
                {painPoints[currentSlide].title}
              </h3>

              <p className="text-gray-300/90 font-sans text-[0.95rem] leading-relaxed drop-shadow-md">
                {painPoints[currentSlide].text}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Barras de Progresso (Estilo Stories) */}
      <div className="relative z-20 flex gap-2 mt-8">
        {painPoints.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="w-12 h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden relative shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {sectionInView && currentSlide === idx && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: "linear" }}
                style={{ width: "100%", transformOrigin: "left" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#E4342C] to-[#C21A22] shadow-[0_0_10px_rgba(194,26,34,0.9),0_0_22px_rgba(194,26,34,0.5)]"
              />
            )}
            {/* Preenche as barras anteriores */}
            {idx < currentSlide && (
               <div className="absolute top-0 left-0 h-full w-full bg-white/30" />
            )}
          </div>
        ))}
      </div>

      {/* Frase mantida da seção original */}
      <motion.p
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="relative z-20 mt-10 max-w-[540px] text-center italic text-[1.15rem] sm:text-[1.35rem] leading-snug text-[#F6F1EF] px-6 py-5 border-t border-b border-[#C9A38C]/25"
      >
        Material amador derruba a autoridade de qualquer curso.
      </motion.p>

    </div>
  );
}

/* ============ SOLUÇÃO (apostila 3D + benefícios) ============ */
const solutionStyles = `
  .perspective-container {
    perspective: 1200px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }

  /* Efeito de profundidade nas páginas do livro */
  .book-pages {
    transform: translateZ(-15px) translateX(5px);
    box-shadow: inset 4px 0 10px rgba(0,0,0,0.1),
                5px 0px 0px #e5e5e5,
                6px 1px 0px #d4d4d4,
                7px 2px 0px #e5e5e5,
                8px 3px 0px #d4d4d4,
                9px 4px 0px #e5e5e5,
                15px 15px 30px rgba(0,0,0,0.6);
  }
`;

// Diamante rubi facetado (glass liquid) usado como marcador dos benefícios
const RubyIcon = () => (
  <svg className="w-6 h-6 shrink-0 mt-0.5 drop-shadow-[0_0_10px_rgba(194,26,34,0.65)]" viewBox="0 0 24 24" fill="none" aria-hidden>
    <defs>
      <linearGradient id="rubyCrown" x1="4" y1="4" x2="20" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FF8A7A" />
        <stop offset=".5" stopColor="#E4342C" />
        <stop offset="1" stopColor="#8E1B15" />
      </linearGradient>
      <linearGradient id="rubyPavilion" x1="12" y1="9" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#C21A22" />
        <stop offset=".6" stopColor="#8E1B15" />
        <stop offset="1" stopColor="#4B100D" />
      </linearGradient>
    </defs>
    {/* coroa */}
    <path d="M 7 4 H 17 L 21 9 H 3 Z" fill="url(#rubyCrown)" />
    {/* pavilhão */}
    <path d="M 3 9 H 21 L 12 21 Z" fill="url(#rubyPavilion)" />
    {/* facetas */}
    <path d="M 7 4 L 9.5 9 M 17 4 L 14.5 9 M 9.5 9 L 12 21 M 14.5 9 L 12 21" stroke="rgba(255,255,255,.32)" strokeWidth=".7" />
    <path d="M 7 4 L 3 9 M 17 4 L 21 9 M 3 9 H 21" stroke="rgba(255,255,255,.22)" strokeWidth=".6" />
    {/* brilhos de vidro */}
    <path d="M 8.2 4.9 L 10.6 4.9 L 6.4 8.1 L 4.9 8.1 Z" fill="rgba(255,255,255,.55)" />
    <path d="M 10.4 11.2 L 11.6 12.6 L 9.4 14.6 Z" fill="rgba(255,255,255,.35)" />
  </svg>
);

function SolutionSection() {
  return (
    <div className="min-h-screen bg-[#070202] relative overflow-hidden font-sans flex flex-col items-center justify-start py-20 px-6">

      <style>{solutionStyles}</style>

      {/* Background Liquid Glass: bolhas rubi derivando lentamente */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          whileInView={{ x: [-30, 35, -30], y: [-15, 20, -15], scale: [1, 1.12, 1] }}
          viewport={{ once: false, margin: "250px 0px 250px 0px" }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-8%] left-[-14%] w-[88vw] h-[88vw] max-w-[680px] max-h-[680px] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(167,42,33,.5), rgba(110,23,18,.26) 55%, transparent 76%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          whileInView={{ x: [25, -30, 25], y: [15, -20, 15], scale: [1.08, 1, 1.08] }}
          viewport={{ once: false, margin: "250px 0px 250px 0px" }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-8%] right-[-14%] w-[78vw] h-[78vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(circle at 55% 45%, rgba(194,26,34,.48), rgba(75,16,13,.26) 55%, transparent 78%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          whileInView={{ x: [-15, 20, -15], opacity: [0.5, 0.85, 0.5] }}
          viewport={{ once: false, margin: "250px 0px 250px 0px" }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[24%] w-[58vw] h-[58vw] max-w-[460px] max-h-[460px] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(255,122,90,.22), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Transição esfumaçada vinda da seção anterior */}
      <div
        className="absolute top-0 left-0 right-0 h-36 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(180deg, #070202 0%, rgba(7,2,2,.55) 50%, transparent 100%)" }}
      />
      <motion.div
        whileInView={{ x: ["-10%", "10%", "-10%"], opacity: [0.4, 0.8, 0.4] }}
        viewport={{ once: false, margin: "250px 0px 250px 0px" }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 left-[-15%] right-[-15%] h-52 z-[6] pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 50% at 32% 45%, rgba(246,241,239,.05), transparent 70%), radial-gradient(48% 46% at 70% 55%, rgba(194,26,34,.12), transparent 72%)",
          filter: "blur(32px)",
        }}
      />

      {/* base funde no preto da próxima seção */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(0deg, #070202 0%, rgba(7,2,2,.55) 50%, transparent 100%)" }}
      />

      {/* TÍTULO CENTRALIZADO NO TOPO ("MINHA TRAJETÓRIA" STYLE) */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center mb-8">
        <motion.h2
          initial={{ opacity: 0, filter: "blur(15px)", y: 15 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-red-100 via-rose-200 to-red-400 text-[1.6rem] sm:text-[2rem] font-extrabold tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] text-center"
        >
          A Solução
        </motion.h2>

        {/* SETA APONTANDO PARA A APOSTILA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="mt-4 -mb-12 relative z-30"
        >
           {/* SVG de uma seta curva elegante descendo direto para a apostila */}
           <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
              <motion.path
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                viewport={{ once: true }}
                d="M30 0 C44 24, 16 48, 30 73"
                stroke="url(#paint0_linear)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
              <motion.path
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.2 }}
                viewport={{ once: true }}
                d="M30 75 L23 66 M30 75 L37 66"
                stroke="#fda4af"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="paint0_linear" x1="30" y1="0" x2="30" y2="75" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f43f5e" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#fda4af" />
                </linearGradient>
              </defs>
            </svg>
        </motion.div>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 relative z-10 items-center">

        {/* LADO ESQUERDO: APOSTILA 3D ANIMADA */}
        {}
        <div className="relative w-full flex justify-center items-center perspective-container h-[450px]">

          {/* a apostila se revela com fumaça logo depois da setinha terminar de descer */}
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.94, filter: "blur(16px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 1.6 }}
          >
          <motion.div
            whileInView={{
              rotateY: [-20, -10, -20],
              rotateX: [10, 15, 10],
              y: [-15, 15, -15]
            }}
            viewport={{ once: false, margin: "200px 0px 200px 0px" }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-56 sm:w-64 h-80 sm:h-96 preserve-3d"
          >
            {/* Páginas do Livro (Miolo Branco/Cinza) */}
            <div className="absolute inset-0 bg-gray-100 rounded-r-xl book-pages border-y border-r border-gray-300"></div>

            {/* Capa real da apostila (mockup de caderno espiral) */}
            <div className="absolute inset-0 rounded-l-md rounded-r-xl overflow-hidden shadow-[inset_6px_0_18px_rgba(0,0,0,0.55)]">
              <img
                src="/img/capa-apostila-real.webp"
                alt="Capa da apostila Malinne de extensão de cílios"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* sombra da encadernação junto à espiral */}
              <div className="absolute inset-y-0 left-0 w-[26px] bg-gradient-to-r from-black/55 to-transparent pointer-events-none"></div>
              {/* Brilho da Capa (Reflexo do Vidro Superior) */}
              <div className="absolute top-0 left-0 w-[150%] h-[40%] bg-gradient-to-b from-white/10 to-transparent -skew-y-12 transform origin-top-left pointer-events-none z-30"></div>
            </div>

            {/* Espiral dourada da encadernação */}
            <div className="absolute -left-3 top-0 bottom-0 z-40 flex flex-col justify-evenly py-4 pointer-events-none">
              {Array.from({ length: 11 }).map((_, i) => (
                <span
                  key={i}
                  className="block w-7 h-[9px] rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #6f5127 0%, #E8C87A 30%, #FFF2C9 48%, #C9A34C 68%, #5e4420 100%)",
                    boxShadow: "0 2px 3px rgba(0,0,0,.55), inset 0 1px 1px rgba(255,255,255,.55)",
                  }}
                />
              ))}
            </div>

            {/* ELEMENTOS FLUTUANTES (Ferramentas de Edição do Canva) */}
            {/* Ícone de Paleta de Cores */}
            <motion.div
              whileInView={{ y: [0, -10, 0], rotateZ: [0, 5, 0] }}
              viewport={{ once: false, margin: "200px 0px 200px 0px" }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 top-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transform translateZ(30px)"
            >
              <Palette className="text-rose-300 w-5 h-5" />
            </motion.div>

            {/* Ícone de Texto */}
            <motion.div
              whileInView={{ y: [0, 10, 0], rotateZ: [0, -5, 0] }}
              viewport={{ once: false, margin: "200px 0px 200px 0px" }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -left-10 bottom-20 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transform translateZ(40px)"
            >
              <Type className="text-amber-200 w-5 h-5" />
            </motion.div>

            {/* Cursor Flutuante "Clicando" */}
            <motion.div
              whileInView={{
                x: [0, -15, 0],
                y: [0, 15, 0],
                scale: [1, 0.9, 1]
              }}
              viewport={{ once: false, margin: "200px 0px 200px 0px" }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute right-4 bottom-10 transform translateZ(50px) drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
            >
              <MousePointer2 className="text-white w-8 h-8 fill-black" strokeWidth={1.5} />
            </motion.div>

          </motion.div>
          </motion.div>
        </div>

        {/* LADO DIREITO: TEXTOS E BULLET POINTS */}
        {}
        <div className="flex flex-col justify-center">

          <motion.h2
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl sm:text-4xl text-gray-100 leading-tight mb-6 drop-shadow-lg"
          >
            A Apostila Editável <br/>
            <span className="neon-liquid">Malinne</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4 mb-8"
          >
            <p className="text-gray-300/90 text-[0.98rem] leading-relaxed font-light">
              A apostila completa de extensão de cílios para turmas iniciantes: todo o conteúdo na ordem certa, num layout de dar orgulho.
            </p>
            <p className="text-gray-300/90 text-[0.98rem] leading-relaxed font-light">
              <strong className="text-white font-medium">100% editável no Canva gratuito</strong>: troque as cores, coloque sua logo, adicione suas fotos. Em poucos minutos, ela deixa de ser minha e passa a ser <strong className="text-white font-medium">sua</strong>.
            </p>
          </motion.div>

          {/* Lista de Benefícios: cada card revela com fumaça conforme o scroll chega nele */}
          <ul className="space-y-4">
            {[
              "Conteúdo completo de curso iniciante: você não precisa decidir \"o que colocar\"",
              "Layout de luxo, no padrão que você viu nesta página",
              "Editável no Canva gratuito: cores, fontes, fotos e logo",
              "Pronta pra imprimir ou enviar em PDF pra suas alunas",
              "Feita por quem já formou 312 alunas, não por um designer que nunca colou um cílio"
            ].map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 28, scale: 0.95, filter: "blur(12px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: (i % 5) * 0.1 }}
                whileHover={{ y: -3 }}
                className="relative overflow-hidden flex items-start gap-3 rounded-2xl px-4 py-3.5
                           bg-gradient-to-br from-[#C21A22]/25 via-[#4B100D]/35 to-black/60
                           backdrop-blur-2xl saturate-[1.45]
                           border border-[#FF8A7A]/15 border-t-white/25 border-l-white/15
                           shadow-[0_14px_34px_rgba(0,0,0,0.6),0_0_26px_rgba(194,26,34,0.28),inset_0_1px_3px_rgba(255,255,255,0.32),inset_0_-8px_16px_rgba(75,16,13,0.5)]"
              >
                {/* brilho diagonal de vidro */}
                <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.11)_48%,transparent_62%)]" />
                <RubyIcon />
                <span className="text-gray-200/95 text-sm leading-relaxed font-light">
                  {text}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* CTA da seção (mantido da página) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.6 }}
            style={{ marginTop: 36 }}
          >
            <VenomButton href="#oferta" label="Quero a minha por R$ 27,90" />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* ============ OLHE POR DENTRO (carrossel cilíndrico 3D) ============ */
const insideStyles = `
  .perspective-container {
    perspective: 1200px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }

  /* Animação do Cilindro Girando */
  @keyframes spinCylinder {
    0% { transform: rotateX(-10deg) rotateY(0deg); }
    100% { transform: rotateX(-10deg) rotateY(-360deg); }
  }

  .carousel-cylinder {
    animation: spinCylinder 25s infinite linear;
    will-change: transform;
  }

  /* Pausa a animação quando o usuário passa o mouse para ler */
  .carousel-cylinder:hover {
    animation-play-state: paused;
  }

  /* Reflexo extra nos cards */
  .glass-card-inner {
    box-shadow: inset 0 2px 10px rgba(255, 255, 255, 0.15),
                0 15px 35px rgba(0, 0, 0, 0.6);
  }
`;

// Conteúdos que vão aparecer girando no carrossel
const pages = [
  {
    id: 1,
    icon: Eye,
    title: "Mapeamento Perfeito",
    desc: "Aprenda a fazer o Mapping ideal para cada tipo de olho: Fox Eyes, Boneca, Gatinho e Esquilo."
  },
  {
    id: 2,
    icon: Droplet,
    title: "Retenção Química",
    desc: "O segredo dos adesivos. Umidade, temperatura e polimerização explicados de forma simples."
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Biossegurança",
    desc: "Proteja você e sua cliente. Higienização, EPIs e descarte correto de materiais."
  },
  {
    id: 4,
    icon: Layers,
    title: "Isolamento de Fios",
    desc: "A técnica definitiva para separar os fios naturais sem causar danos ou stickies."
  },
  {
    id: 5,
    icon: BookOpen,
    title: "Ficha de Anamnese",
    desc: "Modelo completo incluso para você imprimir e blindar seus atendimentos contra imprevistos."
  },
  {
    id: 6,
    icon: Sparkles,
    title: "Manutenção & Remoção",
    desc: "Como fazer uma remoção mecânica e química segura, e o prazo certo para manutenções."
  }
];

function InsideApostilaSection() {
  return (
    <div className="min-h-screen bg-[#070202] relative overflow-hidden font-sans flex flex-col items-center justify-center py-20 px-4">
      <style>{insideStyles}</style>

      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-red-900/25 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Transição esfumaçada vinda da seção anterior */}
      <div
        className="absolute top-0 left-0 right-0 h-36 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(180deg, #070202 0%, rgba(7,2,2,.55) 50%, transparent 100%)" }}
      />
      <motion.div
        whileInView={{ x: ["-10%", "10%", "-10%"], opacity: [0.4, 0.8, 0.4] }}
        viewport={{ once: false, margin: "250px 0px 250px 0px" }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 left-[-15%] right-[-15%] h-52 z-[6] pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 50% at 34% 45%, rgba(246,241,239,.05), transparent 70%), radial-gradient(48% 46% at 68% 55%, rgba(194,26,34,.12), transparent 72%)",
          filter: "blur(32px)",
        }}
      />

      {/* base funde no preto da próxima seção */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(0deg, #070202 0%, rgba(7,2,2,.55) 50%, transparent 100%)" }}
      />

      {}
      <div className="relative z-20 w-full flex flex-col items-center justify-center mb-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#cba692] text-[0.7rem] font-medium tracking-[0.4em] uppercase mb-4"
        >
          O que tem dentro
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, filter: "blur(15px)", y: 15 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-red-100 via-rose-200 to-red-400 text-2xl sm:text-3xl font-extrabold tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] text-center"
        >
          Conteúdo Completo
        </motion.h2>
      </div>

      {}
      <div className="relative z-10 w-full h-[520px] flex justify-center items-center perspective-container">

        {/* O cilindro que vai girar. Scale p/ mobile e md:scale p/ telas maiores */}
        <div className="relative w-[280px] h-[380px] preserve-3d carousel-cylinder scale-[0.75] sm:scale-90 md:scale-100">

          {[1, 2, 3, 4, 5, 6, 7].map((n, index) => {
            // 7 páginas em 360 graus
            const angle = index * (360 / 7);
            // translateZ empurra o card para fora do centro, criando o raio do cilindro.
            const zDistance = 330;

            return (
              <div
                key={n}
                className="absolute inset-0 preserve-3d flex items-center justify-center"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${zDistance}px)`,
                }}
              >
                {/* Página real da apostila */}
                <div className="relative w-[254px] h-[358px] rounded-[22px] overflow-hidden
                                border border-white/15 border-t-white/30
                                glass-card-inner transition-transform duration-300 hover:scale-105 cursor-grab active:cursor-grabbing"
                >
                  <img
                    src={`/img/apostila-pg-${n}.webp`}
                    alt={`Página real da apostila Malinne (${n} de 7)`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Brilho superior do vidro */}
                  <div className="absolute top-0 left-0 w-full h-[42%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}

function Index() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
        {/* HERO */}
        <AnimGate>
        <header className="hero">
          <div className="hero__bg">
            <img
              src="/img/hero-malinne-v2.webp"
              srcSet="/img/hero-malinne-v2-sm.webp 640w, /img/hero-malinne-v2.webp 941w"
              sizes="(min-width: 900px) 520px, 100vw"
              alt="Mayara Alinne segurando um tablet com a capa da apostila de extensão de cílios Malinne"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero__scrim" aria-hidden />
          <div className="container hero__inner">
            <div className="hero__text">
              <h1 className="hero__title">
                Suas alunas vão achar que você contratou um{" "}
                <em className="accent neon-liquid">designer.</em>
              </h1>
              <ul className="hero__bullets">
                <li>Pronta em 15 minutos no Canva gratuito</li>
                <li>Troque as cores e coloque a sua logo</li>
                <li>Entregue às suas alunas ainda hoje</li>
              </ul>
              <VenomButton compact />
              <p className="micro">R$ 27,90 · Acesso imediato · 7 dias de garantia incondicional</p>
            </div>
          </div>
        </header>
        </AnimGate>

        {/* AUTORIDADE / TRAJETÓRIA */}
        <AnimGate><AchievementCard /></AnimGate>

        {/* PROBLEMA */}
        <AnimGate><PainSection /></AnimGate>

        {/* SOLUÇÃO */}
        <AnimGate><SolutionSection /></AnimGate>

        {/* OLHE POR DENTRO */}
        <AnimGate><InsideApostilaSection /></AnimGate>

        {/* COMO FUNCIONA */}
        <section className="section section--darker">
          <div className="container" data-reveal>
            <span className="eyebrow center">Simples assim</span>
            <h2 className="h2 center">Do checkout à sua apostila pronta em 3 passos</h2>
            <div className="steps">
              {[
                [
                  "Garanta o seu acesso",
                  "Pagamento por Pix, cartão em até 6× ou boleto. Acesso imediato na Kiwify.",
                ],
                [
                  "Abra o link no Canva",
                  "Você recebe o vídeo mostrando exatamente como baixar e usar (dá pra fazer até pelo celular).",
                ],
                [
                  "Personalize e entregue",
                  "Troque cores, logo e fotos. Pronto: apostila com a SUA marca na mão das suas alunas.",
                ],
              ].map(([t, d], i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: i % 2 === 0 ? 90 : -90, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="glass step"
                >
                  <div className="step__n">0{i + 1}</div>
                  <h3 className="step__t">{t}</h3>
                  <p className="step__d">{d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* O QUE VOCÊ RECEBE */}
        <section className="section section--dark">
          <div className="container" data-reveal>
            <span className="eyebrow center">Tudo o que está incluído</span>
            <h2 className="h2 center">Você não leva só a apostila</h2>
            <div className="stack">
              {[
                {
                  chip: "Produto principal",
                  t: "Apostila",
                  ta: "completa",
                  sub: "Extensão de cílios · 100% editável",
                  desc: "O material inteiro do curso iniciante, pronto pra personalizar no Canva.",
                  side: (
                    <img
                      className="mockup-apostila"
                      src="/img/mockup-apostila.webp"
                      alt="Apostila Malinne encadernada em espiral"
                      loading="lazy"
                      decoding="async"
                    />
                  ),
                },
                {
                  chip: "Incluso",
                  t: "Vídeo",
                  ta: "passo a passo",
                  sub: "Do acesso à edição",
                  desc: "Como acessar, baixar e editar sua apostila, mesmo que você nunca tenha usado o Canva.",
                  side: <VideoIllustration />,
                },
                {
                  chip: "Incluso",
                  t: "Grupo",
                  ta: "exclusivo",
                  sub: "Só de compradoras",
                  desc: "Troca de experiências com outras profissionais que também ministram cursos.",
                  side: <GroupIllustration />,
                },
                {
                  chip: "Bônus 1",
                  t: "Certificado",
                  ta: "editável",
                  sub: "Com a sua marca",
                  desc: "Modelo pronto no Canva pra você entregar às suas alunas.",
                  side: (
                    <img
                      className="mockup-cert"
                      src="/img/mockup-certificado.webp"
                      alt="Modelos de certificado editáveis Malinne"
                      loading="lazy"
                      decoding="async"
                    />
                  ),
                },
                {
                  chip: "Bônus 2",
                  t: "Fornecedores",
                  ta: "de materiais",
                  sub: "Lista completa",
                  desc: "Os contatos que você levaria anos pra garimpar.",
                  side: <SupplierIllustration />,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.t}
                  initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (i % 5) * 0.06 }}
                >
                  {/* borda acende (efeito da referência) quando o card está em foco no scroll */}
                  <LitCard className={`prod-card${item.side ? " prod-card--wimg" : ""}`}>
                    <div>
                      <span className="prod-card__chip">{item.chip}</span>
                      <h3 className="prod-card__title">
                        {item.t} <em>{item.ta}</em>
                      </h3>
                      <p className="prod-card__sub">{item.sub}</p>
                      <p className="prod-card__desc">{item.desc}</p>
                    </div>
                    {item.side && <div className="prod-card__side">{item.side}</div>}
                  </LitCard>
                </motion.div>
              ))}
            </div>
            <p className="micro center">
              Acesso por 1 ano. Tudo liberado de uma vez, direto na plataforma.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", justifyContent: "center", marginTop: 26 }}
            >
              <VenomButton href="#oferta" label="Garantir meu bônus" />
            </motion.div>
          </div>
        </section>

        {/* HISTÓRIA */}
        <AnimGate>
        <section className="section section--story story" style={{ paddingBottom: 36 }}>
          <div className="story__bg" aria-hidden>
            <img
              src="/img/mayara-blazer-bracos.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="story__scrim" aria-hidden />
          {/* transição em onda vinda da seção anterior */}
          <div className="story__wave" aria-hidden>
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path
                className="wave-b"
                d="M-120,84 C200,124 460,44 740,74 C1000,102 1240,54 1560,90 L1560,0 L-120,0 Z"
                fill="#0a0202"
                opacity=".55"
              />
              <path
                d="M-120,62 C220,108 480,18 760,50 C1020,80 1240,28 1560,66 L1560,0 L-120,0 Z"
                fill="#0a0202"
              />
            </svg>
          </div>
          <div className="container story__inner" data-reveal>
            <div className="story__content">
              <span className="eyebrow">Quem assina essa apostila</span>
              <h2 className="h2">
                De <span className="num">R$ 2,50</span> por atendimento a{" "}
                <em className="neon-liquid">referência</em> para lash designers
              </h2>
              <div className="story__cards">
                {[
                  "Há cinco anos, no meu primeiro curso de cílios, ouvi que eu não era capaz. Acreditei. Fiquei um ano inteiro sem tocar numa pinça.",
                  "Quando voltei, trabalhei recebendo R$ 2,50 por atendimento, presa num contrato que me impedia de crescer. Até o dia em que tive coragem de sair. E de aparecer.",
                  "Coloquei meu rosto nas redes. E tudo mudou: palestras, premiações, workshops, 312 alunas formadas. Hoje sou reconhecida como referência em tendências, marketing e vendas para lash designers.",
                ].map((txt, i) => (
                  <motion.p
                    key={i}
                    className="story-card"
                    initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {txt}
                  </motion.p>
                ))}
                <motion.p
                  className="story__quote"
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  Essa apostila existe por um motivo simples: eu sei o que é querer entregar um
                  curso profissional sem ter ninguém pra te dar o caminho.
                </motion.p>
                <motion.p
                  className="story-card story-card--final"
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  Você não precisa passar pelo que eu passei. O caminho já está pronto.
                </motion.p>
              </div>
            </div>
          </div>
        </section>{/* fim história */}
        </AnimGate>

        {/* PROVA SOCIAL */}
        <AnimGate>
        <section className="section section--dark" style={{ paddingTop: 48 }}>
          <div className="container" data-reveal>
            <span className="eyebrow center">Quem já usa, aprova</span>
            <h2 className="h2 center">O que as profissionais estão dizendo</h2>
            <div className="proof-wrap">
              <Marquee
                items={[
                  { id: "IMG-05.1", label: "Depoimento 1", src: "/img/dep-real-1.webp" },
                  { id: "IMG-05.2", label: "Depoimento 2", src: "/img/dep-real-2.webp" },
                  { id: "IMG-05.3", label: "Depoimento 3", src: "/img/dep-real-3.webp" },
                ]}
              />
              <Marquee
                items={[
                  { id: "IMG-05.4", label: "Depoimento 4", src: "/img/dep-real-4.webp" },
                  { id: "IMG-05.5", label: "Depoimento 5", src: "/img/dep-real-5.webp" },
                  { id: "IMG-05.6", label: "Depoimento 6", src: "/img/depoimento-6.webp" },
                ]}
                reverse
              />
            </div>
          </div>
        </section>
        </AnimGate>

        {/* OFERTA */}
        <AnimGate>
        <section id="oferta" className="section section--gradient offer" style={{ overflow: "hidden" }}>
          <WaveDivider />
          <div className="container" data-reveal>
            <span className="eyebrow center">Oferta de lançamento</span>
            <h2 className="h2 center">Quanto vale nunca mais montar apostila do zero?</h2>
            <PaymentCard />
            <p className="micro center warn" style={{ marginTop: 22 }}>
              ⚠ Preço promocional por tempo limitado. Pode voltar ao valor normal sem aviso.
            </p>
          </div>
        </section>
        </AnimGate>

        {/* GARANTIA */}
        <AnimGate>
        <section className="section section--darker">
          <div className="container" data-reveal>
            <motion.div
              className="guarantee2"
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="guarantee2__seal">
                <GuaranteeShield />
              </div>
              <div>
                <span className="guarantee2__tag">Garantia incondicional</span>
                <h3 className="guarantee2__title">
                  Risco zero por <em><span className="num">7</span> dias</em>
                </h3>
                <p className="guarantee2__text">
                  Entre, baixe a apostila, edite, use. Se em até 7 dias você achar que não é pra
                  você, devolvemos 100% do valor. Sem perguntas, sem burocracia, direto pela
                  plataforma.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        </AnimGate>

        {/* FAQ */}
        <section className="section section--dark">
          <div className="container narrow" data-reveal>
            <h2 className="h2 center">Perguntas frequentes</h2>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q} className="glass faq__item">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
            <p className="center micro">
              Ficou com alguma dúvida?{" "}
              <a className="link" href={WHATSAPP} target="_blank" rel="noopener">
                Me chama no WhatsApp
              </a>
              .
            </p>
          </div>
        </section>

        {/* RODAPÉ */}
        <footer className="footer">
          <div className="container footer__grid">
            <img
              className="footer__logo"
              src="/img/logo-malinne.webp"
              alt="Malinne Espaço Beauty"
              loading="lazy"
              decoding="async"
            />
            <p>
              Malinne Espaço Beauty ·{" "}
              <a
                className="link"
                href="https://instagram.com/soumayaraalinne_"
                target="_blank"
                rel="noopener"
              >
                @soumayaraalinne_
              </a>
            </p>
            <p className="footer__legal">
              © 2026 Malinne Espaço Beauty. Todos os direitos reservados.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

const FAQ: [string, string][] = [
  [
    "Não sei editar no Canva. Essa apostila serve pra mim?",
    "Serve — e foi feita pensando em você. Junto com a apostila você recebe um vídeo passo a passo mostrando como acessar, baixar e editar tudo, mesmo que seja sua primeira vez no Canva. E dá pra editar na versão gratuita.",
  ],
  [
    "É pra curso de iniciante ou aperfeiçoamento?",
    "O conteúdo é completo para turmas iniciantes — exatamente o que uma aluna que nunca colou um cílio precisa aprender, na ordem certa.",
  ],
  [
    "Consigo baixar e editar pelo celular?",
    "Sim. O Canva funciona no celular, e o vídeo mostra o caminho certinho pra fazer tudo por ele.",
  ],
  [
    "Como recebo o acesso?",
    "Imediatamente após a confirmação do pagamento, direto na Kiwify, com o link da apostila no Canva, o vídeo e os bônus. O acesso fica disponível por 1 ano.",
  ],
  [
    "Posso usar a apostila no meu curso e cobrar por ele?",
    "Sim! É exatamente pra isso que ela existe: você personaliza com a sua marca e usa nas suas turmas, quantas vezes quiser.",
  ],
  [
    "E se eu não gostar?",
    "Você tem 7 dias de garantia incondicional. Não gostou, devolvemos o valor.",
  ],
];

const CSS = `
:root {
  --rubi: #C21A22;
  --vermelho: #8E1B15;
  --vinho: #4B100D;
  --bordo: #2C0806;
  --preto-vinho: #140303;
  --preto: #060101;
  --perola: #F6F1EF;
  --nude: #C9A38C;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--preto); color: var(--perola); }
body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.page { position: relative; overflow-x: hidden; }
a { color: inherit; }
.link { color: var(--nude); text-decoration: none; border-bottom: 1px solid rgba(201,163,140,.4); }
.link:hover { color: var(--perola); }

.container { max-width: 1180px; margin: 0 auto; padding: 0 24px; position: relative; }
.container.narrow { max-width: 780px; }
.center { text-align: center; }

/* Tipografia */
.eyebrow {
  font-family: 'Jost', sans-serif; font-weight: 500;
  text-transform: uppercase; letter-spacing: .3em; font-size: 12px;
  color: var(--nude); display: inline-block; margin-bottom: 18px;
}
.eyebrow.center { display: block; text-align: center; }
.display {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: clamp(36px, 6vw, 64px); line-height: 1.05; letter-spacing: -0.01em;
  margin: 0 0 22px;
}
.display .accent { font-style: italic; color: var(--nude); font-weight: 700; }
.h2 {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: clamp(28px, 4vw, 44px); line-height: 1.15; letter-spacing: -0.01em;
  margin: 0 0 20px;
}
.h3 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 22px; margin: 0 0 8px; }
.lede { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.6; color: rgba(246,241,239,.85); margin: 0 0 28px; }
.prose { font-size: 16px; line-height: 1.7; color: rgba(246,241,239,.82); }
.prose p { margin: 0 0 14px; }
.prose.center { text-align: center; }
.pullquote {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: clamp(20px, 2.4vw, 28px); line-height: 1.4;
  color: var(--perola); text-align: center;
  margin: 40px auto 0; max-width: 720px;
  padding: 28px 24px; border-top: 1px solid rgba(201,163,140,.25);
  border-bottom: 1px solid rgba(201,163,140,.25);
}
.micro { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .06em; color: rgba(246,241,239,.6); margin: 12px 0 0; }
.micro.warn { color: rgba(255,220,215,.75); }

/* Glass */
.glass {
  position: relative;
  background: rgba(255,255,255,.055);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  backdrop-filter: blur(22px) saturate(150%);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 26px;
  box-shadow: 0 30px 70px -30px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.22);
  overflow: hidden;
}
.glass::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.10) 48%, transparent 62%);
}
.glass--frame { padding: 14px; }

/* Placeholder */
.placeholder {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; min-height: 240px; padding: 24px;
  border: 1.5px dashed rgba(201,163,140,.5);
  border-radius: 18px;
  background: rgba(20,3,3,.4);
  text-align: center;
}
.placeholder__id { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .2em; color: var(--nude); }
.placeholder__label { font-family: 'Inter', sans-serif; font-size: 13px; color: rgba(246,241,239,.55); }
.placeholder--logo { min-height: 72px; padding: 12px 20px; }

/* Botão */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Jost', sans-serif; font-weight: 600;
  letter-spacing: .04em; text-transform: uppercase; font-size: 14px;
  padding: 18px 32px; border-radius: 100px; text-decoration: none;
  transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
  cursor: pointer; border: 0;
}
.btn--primary {
  background: linear-gradient(180deg, #C21A22, #8E1B15);
  color: #fff;
  box-shadow: 0 14px 30px -10px rgba(194,26,34,.75), inset 0 1px 0 rgba(255,255,255,.35);
}
.btn--primary:hover { transform: scale(1.03); filter: brightness(1.08); }
.btn--xl { padding: 22px 40px; font-size: 15px; }

/* Blobs */
.blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.blob--1 { width: 620px; height: 620px; background: rgba(194,26,34,.45); top: -180px; right: -180px; }
.blob--2 { width: 520px; height: 520px; background: rgba(75,16,13,.6); bottom: -160px; left: -160px; }

/* Reveal */
[data-reveal] { opacity: 0; transform: translateY(20px); transition: opacity .8s ease, transform .8s ease; }
[data-reveal].is-in { opacity: 1; transform: none; }

/* HERO — 1ª dobra: arte INTEIRA de fundo (com o swirl), copy sobre o espaço vazio inferior */
.hero {
  position: relative; z-index: 1; overflow: hidden;
  min-height: 100vh;
  min-height: 100svh;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 0 0 16px;
  background: var(--preto);
}
@media (min-width: 900px) {
  .hero { min-height: min(94vh, 840px); justify-content: center; padding: 48px 0 72px; }
}
/* arte inteira: topo -6% deixa o wordmark rente à borda superior; base alinhada com o fim da dobra */
.hero__bg { position: absolute; inset: -6% 0 0; z-index: 0; }
.hero__bg img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: 50% 0%;
}
@media (min-width: 900px) {
  /* coluna à direita: corta o espaço vazio inferior da arte */
  .hero__bg { left: auto; right: 3%; top: 0; bottom: 0; width: auto; height: 100%; aspect-ratio: 941 / 1150; }
  .hero__bg img {
    object-position: center top;
    -webkit-mask-image: radial-gradient(84% 84% at 50% 44%, #000 56%, rgba(0,0,0,.6) 80%, transparent 100%);
    mask-image: radial-gradient(84% 84% at 50% 44%, #000 56%, rgba(0,0,0,.6) 80%, transparent 100%);
  }
}
@media (min-width: 1200px) { .hero__bg { right: 6%; } }
/* véu bem leve: swirls continuam aparecendo atrás da copy */
.hero__scrim {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg,
    rgba(6,1,1,0) 0%, rgba(6,1,1,0) 48%,
    rgba(6,1,1,.45) 64%, rgba(6,1,1,.65) 100%);
}
@media (min-width: 900px) {
  .hero__scrim {
    background:
      linear-gradient(90deg, var(--preto) 0%, rgba(6,1,1,.82) 26%, rgba(6,1,1,.25) 44%, transparent 60%),
      linear-gradient(180deg, transparent 68%, rgba(6,1,1,.75) 100%);
  }
}
.hero__inner { position: relative; z-index: 2; }
.hero__brand { margin-bottom: 26px; }
@media (min-width: 900px) { .hero__brand { margin-bottom: 34px; } }
.hero__text { max-width: 600px; position: relative; }
@media (min-width: 900px) { .hero__text { max-width: 560px; } }
/* véu que acompanha o bloco de texto: garante leitura onde ele encostar na arte */
@media (max-width: 899px) {
  .hero__text::before {
    content: ""; position: absolute; left: -24px; right: -24px; top: -48px; bottom: -20px;
    background: linear-gradient(180deg,
      rgba(6,1,1,0) 0%, rgba(6,1,1,.55) 24%, rgba(6,1,1,.75) 52%, rgba(6,1,1,.8) 100%);
    z-index: -1; pointer-events: none;
  }
}
.hero .eyebrow { margin-bottom: 8px; font-size: 13px; }
@media (min-width: 900px) { .hero .eyebrow { margin-bottom: 18px; font-size: 12px; } }
.hero__title {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: clamp(31px, 8.8vw, 50px); line-height: 1.1; letter-spacing: -0.01em;
  margin: 0 0 12px; text-wrap: balance;
}
@media (min-width: 900px) { .hero__title { font-size: clamp(30px, 4vw, 46px); line-height: 1.12; margin-bottom: 18px; } }
.hero__title .accent { font-style: italic; color: var(--nude); font-weight: 700; }
.hero__bullets { list-style: none; padding: 0; margin: 0 0 14px; }
.hero__bullets li {
  position: relative; padding-left: 17px; margin-bottom: 9px;
  font-family: 'Jost', sans-serif; font-weight: 500;
  font-size: clamp(16px, 4.6vw, 19px); line-height: 1.45;
  color: #F6F1EF; opacity: .82;
  animation: heroTopicText 5.4s ease-in-out infinite;
}
@media (min-width: 900px) {
  .hero__bullets { margin-bottom: 26px; }
  .hero__bullets li { padding-left: 18px; margin-bottom: 12px; }
}
/* linha de vidro rubi que ativa cada tópico */
.hero__bullets li::before {
  content: ""; position: absolute; left: 0; top: 2px; bottom: 2px;
  width: 3px; border-radius: 4px;
  background: linear-gradient(180deg, #FF9384, #C21A22 55%, #6E1712);
  /* glow constante; o "acender" é só opacity (composta na GPU, sem repaint) */
  box-shadow: 0 0 14px rgba(194,26,34,.85), 0 0 26px rgba(194,26,34,.4);
  opacity: .3;
  animation: heroTopicLine 5.4s ease-in-out infinite;
  will-change: opacity;
}
.hero__bullets li:nth-child(1), .hero__bullets li:nth-child(1)::before { animation-delay: 0s; }
.hero__bullets li:nth-child(2), .hero__bullets li:nth-child(2)::before { animation-delay: 1.8s; }
.hero__bullets li:nth-child(3), .hero__bullets li:nth-child(3)::before { animation-delay: 3.6s; }
@keyframes heroTopicLine {
  0%, 6% { opacity: .3; }
  14%, 30% { opacity: 1; }
  46%, 100% { opacity: .3; }
}
@keyframes heroTopicText {
  0%, 6% { opacity: .82; }
  14%, 30% { opacity: 1; }
  46%, 100% { opacity: .82; }
}
@media (max-width: 899px) {
  .hero .btn { padding: 15px 28px; }
  .hero .micro { font-size: 12px; margin-top: 8px; }
}
/* telas baixas: compacta os respiros, mas mantém a escrita grande e legível */
@media (max-width: 899px) and (max-height: 760px) {
  .hero__title { font-size: clamp(28px, 7.8vw, 42px); margin-bottom: 8px; }
  .hero__bullets { margin-bottom: 12px; }
  .hero__bullets li { font-size: 15.5px; margin-bottom: 5px; }
  .hero .btn { padding: 14px 26px; font-size: 14px; }
  .hero .micro { font-size: 11px; margin-top: 8px; }
}

/* Entrada esfumaçada: arte se dissipa de um blur, copy sobe em cascata */
@keyframes heroBgIn {
  from { opacity: 0; transform: scale(1.06); filter: blur(18px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}
@keyframes heroVeilIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes heroTextIn {
  from { opacity: 0; transform: translateY(18px); filter: blur(10px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}
.hero__bg { animation: heroBgIn 2s cubic-bezier(.22,1,.36,1) both; }
.hero__scrim { animation: heroVeilIn 2s ease both; }
.hero__text > * { animation: heroTextIn 1.1s cubic-bezier(.22,1,.36,1) backwards; }
.hero__text > *:nth-child(1) { animation-delay: .7s; }
.hero__text > *:nth-child(2) { animation-delay: .85s; }
.hero__text > *:nth-child(3) { animation-delay: 1s; }
.hero__text > *:nth-child(4) { animation-delay: 1.15s; }
.hero__text > *:nth-child(5) { animation-delay: 1.3s; }
@media (prefers-reduced-motion: reduce) {
  .hero__bg, .hero__scrim, .hero__text > *,
  .hero__bullets li, .hero__bullets li::before { animation: none; }
}

/* Wordmark (provisório — substituir pelo arquivo da logo quando houver) */
.wordmark {
  display: block; font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: 21px; letter-spacing: .2em; color: var(--perola); line-height: 1;
}
.wordmark__sub {
  display: block; font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 500;
  letter-spacing: .44em; text-transform: uppercase;
  color: rgba(201,163,140,.9); margin-top: 5px; padding-left: .2em;
}

/* Fotos */
.photo { position: relative; overflow: hidden; border-radius: 18px; background: var(--bordo); }
.photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
.photo::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(115% 85% at 50% 8%, transparent 48%, rgba(44,8,6,.42) 100%),
    linear-gradient(180deg, transparent 58%, rgba(20,3,3,.52) 100%);
}
.photo--cover { aspect-ratio: 246 / 446; }
.photo--story { aspect-ratio: 3 / 4; }

/* Autoridade */
.authority { position: relative; z-index: 2; margin-top: 0; padding: 28px 0 40px; }
@media (min-width: 900px) { .authority { margin-top: -40px; padding: 0 0 40px; } }
.authority__bar {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
  padding: 24px;
}
@media (min-width: 720px) { .authority__bar { grid-template-columns: repeat(5, 1fr); padding: 28px 36px; } }
.authority__item { position: relative; z-index: 1; text-align: center; padding: 8px; }
.authority__num { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(22px, 3vw, 30px); color: var(--perola); }
.authority__label { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: rgba(201,163,140,.85); margin-top: 4px; }

/* Seções — fundos liquid glass variados */
.section { position: relative; padding: 90px 0; z-index: 1; }
.section--dark {
  background:
    radial-gradient(95% 62% at 10% 6%, rgba(110,23,18,.55), transparent 62%),
    radial-gradient(85% 58% at 92% 88%, rgba(142,27,21,.42), transparent 66%),
    var(--preto);
}
.section--darker {
  background:
    radial-gradient(88% 60% at 90% 8%, rgba(142,27,21,.48), transparent 62%),
    radial-gradient(80% 55% at 6% 92%, rgba(167,42,33,.3), transparent 68%),
    var(--preto-vinho);
}
/* transição esfumaçada no topo: dissolve o preto da seção anterior */
.section--dark::before, .section--darker::before {
  content: ""; position: absolute; left: 0; right: 0; top: 0; height: 140px;
  background: linear-gradient(180deg, #070202 0%, rgba(7,2,2,.55) 55%, transparent 100%);
  pointer-events: none;
}
.section--gradient {
  background: radial-gradient(120% 85% at 72% 12%, #A72A21 0%, #6E1712 26%, #350B08 55%, #0b0202 82%, #060101 100%);
}
/* base da seção gradiente dissolve no preto da próxima */
.section--gradient::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 130px;
  background: linear-gradient(0deg, #0a0202 0%, rgba(10,2,2,.5) 55%, transparent 100%);
  pointer-events: none; z-index: 0;
}
.section--gradient > .container { z-index: 1; }
.section--story { background: linear-gradient(180deg, var(--preto), var(--preto-vinho)); }

/* Solução */
.solution__grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; }
@media (min-width: 900px) { .solution__grid { grid-template-columns: 1.1fr .9fr; gap: 64px; } }
.cover-frame { display: block; max-width: 420px; margin: 0 auto; }
.cover-frame .glass { transform: rotate(-1.5deg); }
.bullets { list-style: none; padding: 0; margin: 24px 0 32px; }
.bullets li { position: relative; padding-left: 28px; margin-bottom: 12px; font-size: 16px; line-height: 1.55; color: rgba(246,241,239,.9); }
.bullets li::before { content: "✦"; position: absolute; left: 0; top: 0; color: var(--nude); }
.inside { margin-top: 90px; }
.inside__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 24px; }
@media (min-width: 900px) { .inside__grid { grid-template-columns: repeat(4, 1fr); } }
.inside__grid .placeholder { min-height: 260px; }

/* Steps */
.steps { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 40px; }
@media (min-width: 900px) { .steps { grid-template-columns: repeat(3, 1fr); } }
.step { position: relative; padding: 32px 28px; }
.step > * { position: relative; z-index: 1; }
.step__n { font-family: 'Jost', sans-serif; font-weight: 600; font-size: 52px; color: var(--rubi); line-height: 1; margin-bottom: 12px; }
.step__t { font-family: 'Playfair Display', serif; font-size: 22px; margin: 0 0 10px; }
.step__d { font-size: 15px; line-height: 1.6; color: rgba(246,241,239,.78); margin: 0; }

/* Stack */
.stack { display: grid; grid-template-columns: 1fr; gap: 16px; margin: 40px 0 20px; }
.stack__item { position: relative; display: grid; grid-template-columns: 48px 1fr; gap: 18px; align-items: start; padding: 24px 26px; }
.stack__item > * { position: relative; z-index: 1; }
.stack__item h3 { font-family: 'Playfair Display', serif; font-size: 19px; margin: 0 0 6px; }
.stack__item p { margin: 0; font-size: 15px; line-height: 1.55; color: rgba(246,241,239,.75); }
.stack__ico { font-size: 28px; }
/* medalhão de vidro rubi com ícone (substitui os emojis) */
.stack__medal {
  width: 48px; height: 48px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle at 32% 28%, rgba(194,26,34,.38), rgba(75,16,13,.18) 60%, transparent 100%);
  border: 1px solid rgba(228,52,44,.35);
  animation: medalPulse 3.4s ease-in-out infinite;
}
.stack__medal-icon {
  width: 21px; height: 21px; color: #FF9384;
  filter: drop-shadow(0 0 8px rgba(228,52,44,.7));
}
@keyframes medalPulse {
  0%, 100% { box-shadow: 0 0 8px rgba(194,26,34,.18), inset 0 1px 2px rgba(255,255,255,.18); }
  50% { box-shadow: 0 0 20px rgba(194,26,34,.55), inset 0 1px 2px rgba(255,255,255,.28); }
}
@media (prefers-reduced-motion: reduce) { .stack__medal { animation: none; } }
.stack__item--main { border: 1px solid rgba(201,163,140,.35); }
.stack__item--bonus { grid-template-columns: 48px 1fr; }
@media (min-width: 720px) { .stack__item--bonus { grid-template-columns: 48px 1fr 200px; } }
.stack__side .placeholder { min-height: 120px; }
@media (max-width: 719px) {
  .stack__side { grid-column: 1 / -1; justify-self: center; margin-top: 14px; }
  /* card principal replica o formato do exemplo no mobile: texto à esquerda, apostila à direita */
  .stack__item--main { grid-template-columns: 1fr 148px; align-items: center; padding: 26px 20px; }
  .stack__item--main .stack__medal { display: none; }
  .stack__item--main .stack__side { grid-column: auto; justify-self: end; margin-top: 0; }
}

/* Cards "receive" — réplica do design de referência (zenah), na nossa paleta */
.prod-card {
  position: relative; overflow: hidden;
  padding: 26px 22px;
  border-radius: 2px;
  border: 1px solid rgba(201,163,140,.22);
  background: #100504;
  transition: transform .5s cubic-bezier(.16,1,.3,1), border-color .5s ease, box-shadow .5s ease;
  will-change: transform;
}
@media (min-width: 720px) { .prod-card { padding: 36px 32px; } }
/* efeito da referência: borda dourada + linha no topo + elevação, quando o card está em foco */
.prod-card.is-lit {
  border-color: rgba(201,163,140,.6);
  transform: translateY(-6px);
  box-shadow: 0 20px 60px -20px rgba(201,163,140,.25), 0 8px 30px -15px rgba(201,163,140,.15);
}
.prod-card.is-lit::before { opacity: 1; }
/* linha dourada no topo (acende no hover) */
.prod-card::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--nude), transparent);
  opacity: 0; transition: opacity .5s ease; z-index: 3;
}
.prod-card:hover { transform: translateY(-6px); }
.prod-card:hover::before { opacity: 1; }
.prod-card--wimg {
  display: grid; grid-template-columns: 1fr 108px; gap: 14px; align-items: center;
}
@media (min-width: 720px) { .prod-card--wimg { grid-template-columns: 1fr 150px; gap: 28px; } }
.prod-card__chip {
  display: inline-block; padding: 5px 10px 5px 12px; margin-bottom: 16px;
  font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: .2em; text-transform: uppercase; color: var(--perola);
  background: rgba(244,236,223,.08); border: 1px solid rgba(246,241,239,.2); border-radius: 0;
  white-space: nowrap;
}
@media (min-width: 720px) {
  .prod-card__chip { font-size: 10px; letter-spacing: .3em; padding: 5px 12px; }
}
.prod-card__title {
  font-family: 'Playfair Display', serif; font-weight: 400;
  font-size: 23px; line-height: 1.15; color: var(--perola);
  margin: 0 0 8px;
}
@media (min-width: 720px) { .prod-card__title { font-size: 26px; margin-bottom: 12px; } }
.prod-card__title em { font-style: italic; color: var(--nude); }
.prod-card__sub {
  font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500;
  letter-spacing: .18em; text-transform: uppercase; color: var(--nude);
  margin: 0 0 12px;
}
@media (min-width: 720px) { .prod-card__sub { font-size: 12px; margin-bottom: 18px; } }
.prod-card__desc { font-size: 14px; line-height: 1.6; font-weight: 300; color: rgba(201,188,166,.95); margin: 0; }
@media (min-width: 720px) { .prod-card__desc { font-size: 15px; line-height: 1.65; } }
.prod-card__side { align-self: center; padding: 6px 0; }

/* SVG do player de vídeo */
.video-illus {
  display: block; width: 100%; max-width: 140px; margin: 0 auto;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.5));
}
.video-illus__pulse {
  transform-box: fill-box; transform-origin: center;
  animation: videoPulse 2.8s ease-in-out infinite;
}
@keyframes videoPulse {
  0%, 100% { transform: scale(1); opacity: .85; }
  50% { transform: scale(1.1); opacity: 1; }
}
.video-illus__bar { animation: videoBar 6s linear infinite; }
@keyframes videoBar {
  0% { stroke-dashoffset: 1; }
  75% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .video-illus__pulse, .video-illus__bar { animation: none; }
}

/* SVG do grupo conectado */
.group-illus {
  display: block; width: 100%; max-width: 140px; margin: 0 auto;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.5));
}
.group-illus__link { animation: linkFlow 1.8s linear infinite; }
@keyframes linkFlow { to { stroke-dashoffset: -14; } }
.group-illus__bubble {
  transform-box: fill-box; transform-origin: center bottom;
  animation: bubblePop 4.8s ease-in-out infinite;
  opacity: 0;
}
@keyframes bubblePop {
  0%, 4% { opacity: 0; transform: scale(.4) translateY(4px); }
  10%, 55% { opacity: 1; transform: scale(1) translateY(0); }
  65%, 100% { opacity: 0; transform: scale(.85) translateY(-4px); }
}
@media (prefers-reduced-motion: reduce) {
  .group-illus__link, .group-illus__bubble { animation: none; }
  .group-illus__bubble { opacity: 1; }
}

/* SVG de fornecedores */
.supplier-illus {
  display: block; width: 100%; max-width: 140px; margin: 0 auto;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.5));
}
.supplier-illus__check {
  transform-box: fill-box; transform-origin: center;
  animation: checkPop 5.4s ease-in-out infinite;
  opacity: 0;
}
@keyframes checkPop {
  0%, 5% { opacity: 0; transform: scale(.3); }
  11%, 78% { opacity: 1; transform: scale(1); }
  88%, 100% { opacity: 0; transform: scale(.6); }
}
.supplier-illus__box {
  transform-box: fill-box; transform-origin: center;
  animation: boxBob 4.2s ease-in-out infinite;
}
@keyframes boxBob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(-1.5deg); }
}
@media (prefers-reduced-motion: reduce) {
  .supplier-illus__check { animation: none; opacity: 1; }
  .supplier-illus__box { animation: none; }
}

/* mockup dos certificados (imagem real, bordas fundidas no card) */
.mockup-cert {
  display: block; width: 145%; max-width: 260px; margin: 0 -20%;
  -webkit-mask-image: radial-gradient(94% 90% at 50% 50%, #000 55%, rgba(0,0,0,.5) 76%, transparent 96%);
  mask-image: radial-gradient(94% 90% at 50% 50%, #000 55%, rgba(0,0,0,.5) 76%, transparent 96%);
  filter: drop-shadow(0 12px 20px rgba(0,0,0,.5));
  animation: miniBookFloat 6s ease-in-out infinite;
}

/* mockup da apostila espiral (imagem real, bordas fundidas no card) */
.mockup-apostila {
  display: block; width: 100%; max-width: 155px; margin: 0 auto;
  -webkit-mask-image: radial-gradient(92% 94% at 50% 50%, #000 58%, rgba(0,0,0,.55) 76%, transparent 95%);
  mask-image: radial-gradient(92% 94% at 50% 50%, #000 58%, rgba(0,0,0,.55) 76%, transparent 95%);
  filter: drop-shadow(0 14px 22px rgba(0,0,0,.5));
  animation: miniBookFloat 5.5s ease-in-out infinite;
}

/* Mini apostila espiral (fundo transparente) */
.mini-book {
  position: relative; width: 150px; margin: 0 auto;
  filter: drop-shadow(0 18px 26px rgba(0,0,0,.55));
  animation: miniBookFloat 5.5s ease-in-out infinite;
}
.mini-book img { display: block; width: 100%; border-radius: 6px 10px 10px 6px; }
.mini-book__pages {
  position: absolute; top: 2%; right: -5px; bottom: 1%; width: 5px;
  background: linear-gradient(180deg, #efe9e4, #cfc8c2);
  border-radius: 0 3px 3px 0;
  box-shadow: inset -1px 0 1px rgba(0,0,0,.35);
}
.mini-book__spiral {
  position: absolute; left: -7px; top: 0; bottom: 0;
  display: flex; flex-direction: column; justify-content: space-evenly; padding: 8px 0;
}
.mini-book__spiral i {
  display: block; width: 16px; height: 6px; border-radius: 4px;
  background: linear-gradient(90deg, #6f5127, #E8C87A 30%, #FFF2C9 48%, #C9A34C 68%, #5e4420);
  box-shadow: 0 1px 2px rgba(0,0,0,.5), inset 0 1px 1px rgba(255,255,255,.55);
}
@keyframes miniBookFloat {
  0%, 100% { transform: rotate(2deg) translateY(0); }
  50% { transform: rotate(2deg) translateY(-6px); }
}
@media (prefers-reduced-motion: reduce) { .mini-book { animation: none; } }
.badge { position: absolute; top: 14px; right: 16px; font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--nude); border: 1px solid rgba(201,163,140,.5); padding: 4px 10px; border-radius: 100px; z-index: 2; }

/* For who */
.forwho { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 40px; }
@media (min-width: 900px) { .forwho { grid-template-columns: 1fr 1fr; } }
.forwho__col { padding: 32px; }
.forwho__col > * { position: relative; z-index: 1; }
.forwho__col h3 { font-family: 'Playfair Display', serif; font-size: 22px; margin: 0 0 16px; }
.check, .cross { list-style: none; padding: 0; margin: 0; }
.check li, .cross li { position: relative; padding-left: 32px; margin-bottom: 14px; line-height: 1.5; }
.check li::before { content: "✓"; position: absolute; left: 0; top: 0; color: var(--nude); font-weight: 700; }
.cross li::before { content: "✕"; position: absolute; left: 0; top: 0; color: var(--rubi); font-weight: 700; }

/* História — foto de fundo fundida no escuro, como a hero */
.story { position: relative; overflow: hidden; }
.story__bg { position: absolute; left: 0; right: 0; top: 0; height: min(112vw, 680px); z-index: 0; }
.story__bg img {
  width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%;
  filter: saturate(1.02) contrast(1.02) brightness(.92);
  -webkit-mask-image: radial-gradient(94% 90% at 50% 34%, #000 50%, rgba(0,0,0,.5) 74%, transparent 97%);
  mask-image: radial-gradient(94% 90% at 50% 34%, #000 50%, rgba(0,0,0,.5) 74%, transparent 97%);
}
@media (min-width: 900px) {
  .story__bg { left: auto; right: 0; bottom: 0; height: 100%; width: 46%; }
  .story__bg img {
    object-position: center top;
    -webkit-mask-image: radial-gradient(80% 82% at 50% 42%, #000 48%, rgba(0,0,0,.5) 74%, transparent 96%);
    mask-image: radial-gradient(80% 82% at 50% 42%, #000 48%, rgba(0,0,0,.5) 74%, transparent 96%);
  }
}
.story__scrim {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg,
    rgba(6,1,1,.2) 0%, rgba(6,1,1,0) 16%,
    rgba(6,1,1,0) 40%, rgba(6,1,1,.5) 58%,
    rgba(6,1,1,.88) 74%, rgba(20,3,3,.96) 100%);
}
@media (min-width: 900px) {
  .story__scrim {
    background:
      linear-gradient(90deg, rgba(6,1,1,.95) 0%, rgba(6,1,1,.8) 42%, rgba(6,1,1,.3) 58%, transparent 74%),
      linear-gradient(180deg, transparent 70%, rgba(20,3,3,.85) 100%);
  }
}
/* onda de transição no topo da história (e reutilizável via .wave-top) */
.wave-top {
  position: absolute; top: -1px; left: 0; right: 0;
  height: clamp(70px, 12vw, 130px);
  z-index: 2; pointer-events: none;
  filter: drop-shadow(0 6px 14px rgba(0,0,0,.45));
}
.wave-top svg { display: block; width: 100%; height: 100%; }
.wave-top .wave-b {
  transform-box: fill-box;
  animation: waveDrift 16s ease-in-out infinite alternate;
}
.story__wave {
  position: absolute; top: -1px; left: 0; right: 0;
  height: clamp(70px, 12vw, 130px);
  z-index: 2; pointer-events: none;
  filter: drop-shadow(0 6px 14px rgba(0,0,0,.45));
}
.story__wave svg { display: block; width: 100%; height: 100%; }
.story__wave .wave-b {
  transform-box: fill-box;
  animation: waveDrift 16s ease-in-out infinite alternate;
}
@keyframes waveDrift {
  from { transform: translateX(-2%); }
  to { transform: translateX(2%); }
}
@media (prefers-reduced-motion: reduce) { .story__wave .wave-b { animation: none; } }
.story__inner { position: relative; z-index: 3; }
@media (max-width: 899px) { .story__inner { padding-top: min(78vw, 470px); } }
.story__content { max-width: 620px; }
@media (min-width: 900px) { .story__content { max-width: 560px; } }
.story__img { align-self: start; }
/* história em cards de vidro rubi */
.story__cards { display: flex; flex-direction: column; gap: 14px; }
.story-card {
  position: relative; overflow: hidden; margin: 0;
  padding: 18px 20px; border-radius: 16px;
  font-family: 'Jost', sans-serif;
  font-size: 16px; line-height: 1.7; font-weight: 400;
  color: rgba(246,241,239,.9);
  background: linear-gradient(135deg, rgba(194,26,34,.16), rgba(75,16,13,.24) 45%, rgba(0,0,0,.55));
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgba(255,138,122,.16);
  border-top-color: rgba(255,255,255,.22);
  box-shadow: 0 12px 30px rgba(0,0,0,.5), inset 0 1px 2px rgba(255,255,255,.2), inset 0 -6px 14px rgba(75,16,13,.35);
}
.story-card::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.08) 48%, transparent 62%);
}
.story__cards .story-card:first-child::first-letter {
  font-family: 'Playfair Display', serif;
  font-size: 48px; line-height: .9; font-weight: 700;
  color: var(--nude); float: left;
  padding: 5px 10px 0 0;
}
.story-card--final { font-weight: 500; color: var(--perola); }
.story__quote {
  position: relative;
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 21px; line-height: 1.55; color: var(--perola);
  border-style: solid; border-width: 0 0 0 3px;
  border-image: linear-gradient(180deg, #E4342C, #C9A38C) 1;
  background: linear-gradient(135deg, rgba(194,26,34,.09), rgba(201,163,140,.04));
  padding: 22px 18px 22px 26px; margin: 28px 0;
}
.story__quote::before {
  content: "\\201C"; position: absolute; top: -4px; left: 6px;
  font-family: 'Playfair Display', serif; font-size: 64px; line-height: 1;
  color: rgba(201,163,140,.32); pointer-events: none;
}
.signature { font-family: 'Jost', sans-serif; margin-top: 24px; color: rgba(246,241,239,.8); }
.story__content .signature {
  margin-top: 30px; padding-top: 18px;
  border-top: 1px solid rgba(201,163,140,.28);
  letter-spacing: .04em;
}

/* Prova */
.proof { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 40px; }
@media (min-width: 640px) { .proof { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 900px) { .proof { grid-template-columns: repeat(3, 1fr); } }
.proof__item .placeholder { min-height: 300px; }

/* Oferta */
.offer { padding-top: 100px; padding-bottom: 100px; }
.offer__card { max-width: 720px; margin: 0 auto; padding: 48px 40px; }
.offer__card > * { position: relative; z-index: 1; }
.offer__stack { list-style: none; padding: 0; margin: 32px auto; max-width: 460px; }
.offer__stack li { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 15px; color: rgba(246,241,239,.9); }
.offer__stack li::before { content: "✓ "; color: var(--nude); font-weight: 700; }
.price { text-align: center; margin: 30px 0 6px; }
.price__from { font-family: 'Jost', sans-serif; text-decoration: line-through; color: rgba(246,241,239,.5); font-size: 16px; }
.price__now { font-family: 'Playfair Display', serif; font-weight: 800; font-size: clamp(52px, 8vw, 84px); line-height: 1; color: var(--perola); text-shadow: 0 4px 40px rgba(194,26,34,.5); }
.price__sub { text-align: center; font-family: 'Jost', sans-serif; color: rgba(246,241,239,.7); font-size: 14px; margin: 0 0 28px; }
.offer .btn { display: flex; width: 100%; }

/* Garantia — card de vidro rubi com selo SVG */
.guarantee2 {
  position: relative; overflow: hidden;
  display: grid; grid-template-columns: 100px 1fr; gap: 24px; align-items: center;
  max-width: 780px; margin: 0 auto; padding: 32px 30px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(194,26,34,.15), rgba(75,16,13,.24) 45%, rgba(0,0,0,.55));
  border: 1px solid rgba(255,138,122,.16);
  border-top-color: rgba(255,255,255,.22);
  box-shadow: 0 16px 40px rgba(0,0,0,.5), inset 0 1px 2px rgba(255,255,255,.2), inset 0 -8px 18px rgba(75,16,13,.4);
}
.guarantee2::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg, transparent 32%, rgba(255,255,255,.08) 48%, transparent 62%);
}
@media (max-width: 640px) {
  .guarantee2 { grid-template-columns: 1fr; text-align: center; gap: 14px; }
  .guarantee2__seal { margin: 0 auto; }
}
.guarantee2__seal { width: 100px; height: 100px; }
.guar-shield { display: block; width: 100%; height: 100%; filter: drop-shadow(0 0 16px rgba(194,26,34,.4)); }
.guar-shield__ring {
  transform-box: fill-box; transform-origin: center;
  animation: guarRing 3.6s ease-in-out infinite;
}
@keyframes guarRing {
  0%, 100% { transform: scale(.94) rotate(0deg); opacity: .35; }
  50% { transform: scale(1.02) rotate(12deg); opacity: .85; }
}
.guar-shield__check { animation: guarCheck 5s ease-in-out infinite; }
@keyframes guarCheck {
  0%, 8% { stroke-dashoffset: 1; opacity: 0; }
  13% { opacity: 1; }
  32% { stroke-dashoffset: 0; }
  85% { stroke-dashoffset: 0; opacity: 1; }
  94%, 100% { opacity: 0; }
}
.guarantee2__tag {
  display: inline-block; margin-bottom: 8px;
  font-family: 'Jost', sans-serif; font-size: 10.5px; font-weight: 600;
  letter-spacing: .28em; text-transform: uppercase; color: var(--nude);
}
.guarantee2__title {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: clamp(23px, 5vw, 27px); color: var(--perola); margin: 0 0 10px;
}
.guarantee2__title em { font-style: italic; color: var(--nude); }
.guarantee2__text {
  margin: 0; font-family: 'Jost', sans-serif;
  font-size: 15.5px; line-height: 1.7; color: rgba(246,241,239,.84);
}
@media (prefers-reduced-motion: reduce) {
  .guar-shield__ring, .guar-shield__check { animation: none; }
  .guar-shield__check { opacity: 1; }
}

/* FAQ */
.faq { display: grid; gap: 12px; margin: 32px 0; }
.faq__item { padding: 0; }
.faq__item > * { position: relative; z-index: 1; }
.faq__item summary {
  cursor: pointer; list-style: none;
  padding: 22px 26px; font-family: 'Jost', sans-serif; font-weight: 500;
  font-size: 16px; color: var(--perola);
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
}
.faq__item summary::-webkit-details-marker { display: none; }
.faq__item summary::after { content: "+"; font-size: 24px; color: var(--nude); transition: transform .3s ease; }
.faq__item[open] summary::after { transform: rotate(45deg); }
.faq__item p { padding: 0 26px 24px; margin: 0; color: rgba(246,241,239,.78); line-height: 1.65; }

/* Final */
.final .display { color: var(--perola); }

/* Footer */
.footer { padding: 60px 0 100px; background: var(--preto); border-top: 1px solid rgba(255,255,255,.06); }
.footer__grid { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.footer__grid .placeholder { max-width: 180px; }
.footer p { margin: 0; color: rgba(246,241,239,.7); font-size: 14px; }
.footer__logo { display: block; width: 240px; max-width: 70vw; mix-blend-mode: screen; }
/* números sempre em fonte redonda (Jost), nunca nos numerais da Playfair */
.num { font-family: 'Jost', sans-serif; font-style: normal; font-weight: 600; letter-spacing: .02em; }
.footer__legal { max-width: 720px; color: rgba(246,241,239,.45) !important; font-size: 12px !important; line-height: 1.6; }

/* Mobile CTA full width */
@media (max-width: 640px) {
  .hero .btn, .section .btn:not(.btn--xl) { display: flex; width: 100%; }
}

/* ============ CYLINDRICAL CAROUSEL ============ */
.cyl {
  position: relative;
  margin-top: 40px;
  height: 460px;
  perspective: 1400px;
  perspective-origin: 50% 50%;
}
.cyl__stage {
  position: absolute; inset: 0;
  margin: 0 auto;
  transform-style: preserve-3d;
  width: 320px; left: 0; right: 0;
}
.cyl__card {
  position: absolute; top: 40px; left: 0;
  width: 320px; height: 400px;
  backface-visibility: hidden;
}
.cyl__card .glass { height: 100%; }
.cyl__card .placeholder { min-height: 100%; height: 100%; }
.cyl__dots {
  position: absolute; bottom: -10px; left: 0; right: 0;
  display: flex; justify-content: center; gap: 10px;
}
.cyl__dot {
  width: 8px; height: 8px; border-radius: 50%; border: 0; padding: 0;
  background: rgba(246,241,239,.2); cursor: pointer; transition: all .3s ease;
}
.cyl__dot.is-on { background: var(--rubi); width: 24px; border-radius: 4px; }
@media (max-width: 720px) {
  .cyl { height: 380px; perspective: 900px; }
  .cyl__stage { width: 220px; }
  .cyl__card { width: 220px; height: 320px; top: 20px; }
}

/* ============ PERFORMANCE (mobile) ============ */
/* Fora da viewport (com folga de 300px), TODA animação CSS da seção pausa */
[data-offscreen] *, [data-offscreen] *::before, [data-offscreen] *::after {
  animation-play-state: paused !important;
}
/* Vidro mais leve no mobile: visual ~idêntico, custo de backdrop-filter muito menor */
@media (max-width: 899px) {
  .glass {
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    backdrop-filter: blur(14px) saturate(140%);
  }
  [class*="backdrop-blur"] {
    -webkit-backdrop-filter: blur(14px) saturate(1.35) !important;
    backdrop-filter: blur(14px) saturate(1.35) !important;
  }
}

/* ============ MARQUEE ============ */
.proof-wrap { margin-top: 40px; display: flex; flex-direction: column; gap: 16px; overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.marquee { overflow: hidden; }
/* animação 100% CSS (compositor/GPU): suave no mobile */
.marquee__track {
  display: flex; width: max-content;
  animation: marqueeScroll 52s linear infinite;
  will-change: transform;
  transform: translateZ(0);
}
.marquee__track--reverse { animation-direction: reverse; }
@keyframes marqueeScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) { .marquee__track { animation-play-state: paused; } }
.marquee__card { flex: 0 0 auto; height: min(92vw, 400px); margin-right: 16px; }
.marquee__card .placeholder { min-height: 280px; }
/* card sólido (sem backdrop-filter: era o que travava o scroll no mobile) */
.marquee__card--solid {
  padding: 10px; border-radius: 26px;
  background: rgba(20,6,4,.88);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 18px 40px -18px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.14);
}
/* altura fixa, largura natural de cada print: nada é cortado */
.marquee__img {
  display: block; height: 100%; width: auto;
  border-radius: 18px;
}
`;
