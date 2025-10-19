import React from "react";
import { motion } from "framer-motion";
import { Utensils, Star, Users, Compass, Sparkles, Github, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * Plateful — About Page
 */
export default function About() {
  const { isDark } = useTheme();
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const track = (name) =>
    window?.gtag?.("event", name) || console.debug("[track]", name);

  const team = [
    { name: "Oorja Gandhi", role: "Backend & Search", github: "oorjagandhi", quote: "Food binds us together." },
    { name: "Connie Ding", role: "Filters & UI", github: "connieding", quote: "Every meal is an adventure." },
    { name: "Chris Kang", role: "Footer & Tooling", github: "jkan172", quote: "Great food brings great people together." },
    { name: "Kimberly Zhu", role: "Maps & Pages", github: "kimkimz", quote: "A dash of creativity makes every dish memorable." },
    { name: "Shihoo Park", role: "Data & Endpoints", github: "shewho1119", quote: "Coding is fun, but eating is better!" },
    { name: "Richman Tan", role: "About Page & UX", github: "Richman-Tan", quote: "Deliberately choosing to be different." },
    { name: "Johnson Zhang", role: "UI Design & Backend Support", github: "ZingZing001", quote: "Def jamming some food after this project :_)" },
    { name: "Gibson Gao", role: "UX & Backend Support", github: "TrapezoidaI", quote: "I shid my pants." },
    { name: "Ibrahim Waheed", role: "Login Page Support", github: "iwah144", quote: "..." },
    { name: "Aolin Yang", role: "Backend Design & Voting System", github: "aolin12138", quote: "..." },
    { name: "Joshua Zhang", role: "API Development & Integration", github: "joshua56789", quote: "bruh..." }

  ];

  const faq = [
    { q: "Is Plateful free?", a: "Yes — core features are free. We may add optional pro features later." },
    { q: "Where do reviews come from?", a: "From our community. We highlight recency and credibility signals." },
    { q: "How are filters different?", a: "They reflect real dining choices: vibe, distance, budget, and cuisine." },
  ];

  return (
    <div
      className="min-h-screen text-slate-800"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #0f172a, #1e293b, #0f172a)'
          : 'linear-gradient(to bottom, #f8fafc, #ffffff, #f8fafc)',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:m-3 focus:rounded-lg focus:px-3 focus:py-2"
        style={{
          backgroundColor: isDark ? '#f1f5f9' : '#0f172a',
          color: isDark ? '#0f172a' : '#ffffff'
        }}
      >
        Skip to content
      </a>

      <main id="content" className="pt-6 sm:pt-8">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div
              className="hidden sm:block absolute -top-24 -right-24 h-56 w-56 sm:h-72 sm:w-72 rounded-full blur-3xl"
              style={{
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(191, 219, 254, 0.3)'
              }}
            />
            <div
              className="hidden sm:block absolute -bottom-24 -left-24 h-56 w-56 sm:h-72 sm:w-72 rounded-full blur-3xl"
              style={{
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(167, 243, 208, 0.3)'
              }}
            />
          </div>

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-12 md:pt-24 md:pb-16">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div
                className="mx-auto mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium shadow-sm backdrop-blur"
                style={{
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  backgroundColor: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(255, 255, 255, 0.6)',
                  color: isDark ? '#cbd5e1' : '#475569'
                }}
              >
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Built for food lovers
              </div>
              <h1 className="text-[28px] leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight">
                Discover, share, and savour with {" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Plateful</span>
              </h1>
              <p
                className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg"
                style={{ color: isDark ? '#cbd5e1' : '#475569' }}
              >
                A community-powered way to explore restaurants, read honest reviews, and find your next favourite bite—fast.
              </p>
              <div className="mt-5 sm:mt-6 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3">
                <a
                  href="/"
                  onClick={() => track("about_explore_click")}
                  className="inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2.5 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl w-full xs:w-auto"
                  style={{
                    backgroundColor: isDark ? '#f1f5f9' : '#0f172a',
                    color: isDark ? '#0f172a' : '#ffffff',
                    boxShadow: isDark ? '0 10px 15px -3px rgba(241, 245, 249, 0.1)' : '0 10px 15px -3px rgba(15, 23, 42, 0.1)'
                  }}
                >
                  Explore restaurants <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/UOA-DCML/se310-plateful"
                  target="_blank" rel="noreferrer noopener"
                  className="inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2.5 shadow-sm transition w-full xs:w-auto"
                  style={{
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#e2e8f0' : '#374151'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#ffffff'}
                >
                  <Github className="h-4 w-4" /> View code
                </a>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-12">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                icon: <Compass className="h-5 w-5" />, title: "Smart discovery",
                desc: "Filter by cuisine, vibe, and budget to zero in on what you’re craving.",
              },
              {
                icon: <Star className="h-5 w-5" />, title: "Real reviews",
                desc: "No fluff—just helpful insights from people who actually went.",
              },
              {
                icon: <Users className="h-5 w-5" />, title: "Tasty community",
                desc: "Follow friends and foodies you trust to keep your list fresh.",
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="group rounded-2xl p-5 sm:p-6 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff'
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                    style={{
                      backgroundColor: isDark ? '#f1f5f9' : '#0f172a',
                      color: isDark ? '#0f172a' : '#ffffff'
                    }}
                  >
                    {c.icon}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold">{c.title}</h3>
                </div>
                <p
                  className="mt-3 text-sm leading-6"
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                >
                  {c.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-12">
          <div className="grid items-stretch md:items-center gap-6 md:gap-8 md:grid-cols-2">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, x: -12 }}
              whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-5 sm:p-6 shadow-sm"
              style={{
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                backgroundColor: isDark ? '#1e293b' : '#ffffff'
              }}
            >
              <h2 className="text-xl sm:text-2xl font-bold">Our mission</h2>
              <p
                className="mt-3 text-sm sm:text-base"
                style={{ color: isDark ? '#cbd5e1' : '#475569' }}
              >
                Make dining out simpler and more delightful with up-to-date info, thoughtful reviews, and a friendly community.
                Plateful helps you spend less time scrolling and more time enjoying great food.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "Tailwind CSS", "MongoDB", "Java", "SpringBoot"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                      color: isDark ? '#cbd5e1' : '#334155'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, x: 12 }}
              whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid gap-4 grid-cols-2"
            >
              {[
                { label: "Restaurants tracked", value: "12k+" },
                { label: "User reviews", value: "85k+" },
                { label: "Cuisines", value: "120+" },
                { label: "Cities", value: "40+" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 sm:p-6 text-center shadow-sm"
                  style={{
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff'
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</div>
                  <div
                    className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider"
                    style={{ color: isDark ? '#64748b' : '#64748b' }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-14">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold">How Plateful works</h2>
            <p
              className="mt-2 text-sm sm:text-base"
              style={{ color: isDark ? '#cbd5e1' : '#475569' }}
            >
              Three simple steps to your next favourite spot.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Search by what matters",
                text: "Cuisine, price, mood, distance—use filters that reflect how you actually dine.",
                icon: <Compass className="h-5 w-5" />,
              },
              {
                step: "02",
                title: "Scan honest reviews",
                text: "Quick takes and rich details from real people—not just star spam.",
                icon: <Star className="h-5 w-5" />,
              },
              {
                step: "03",
                title: "Book or bookmark",
                text: "Lock it in now or save it to lists for your next outing with friends.",
                icon: <Utensils className="h-5 w-5" />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-sm"
                style={{
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff'
                }}
              >
                <div
                  className="absolute -right-6 -top-6 h-16 w-16 sm:h-20 sm:w-20 rounded-full"
                  style={{ backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }}
                />
                <div className="relative flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                    style={{
                      backgroundColor: isDark ? '#f1f5f9' : '#0f172a',
                      color: isDark ? '#0f172a' : '#ffffff'
                    }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div
                      className="text-[10px] sm:text-xs font-mono"
                      style={{ color: isDark ? '#64748b' : '#64748b' }}
                    >
                      {item.step}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">{item.title}</h3>
                  </div>
                </div>
                <p
                  className="mt-3 text-sm leading-6"
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-10 sm:pb-12">
          <div
            className="rounded-2xl p-5 sm:p-6 shadow-sm"
            style={{
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              backgroundColor: isDark ? '#1e293b' : '#ffffff'
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold">Built by people who love food</h2>
            <p
              className="mt-3 text-sm sm:text-base"
              style={{ color: isDark ? '#cbd5e1' : '#475569' }}
            >
              We’re engineers, designers, and weekend eaters. We ship fast, listen to feedback, and sweat the details like
              accessibility and performance.
            </p>
            <div className="mt-5 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <a
                  key={m.name}
                  href={`https://github.com/${m.github}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-4 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  style={{
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    backgroundColor: isDark ? '#0f172a' : '#ffffff'
                  }}
                >
                  <img
                    src={`https://github.com/${m.github}.png?size=120`}
                    alt={`${m.name} avatar`}
                    className="h-14 w-14 rounded-full"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div
                      className="text-sm"
                      style={{ color: isDark ? '#64748b' : '#64748b' }}
                    >
                      {m.role}
                    </div>
                    <div
                      className="mt-1 text-sm italic"
                      style={{ color: isDark ? '#94a3b8' : '#475569' }}
                    >
                      "{m.quote}"
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-10 sm:pb-12">
          <div className="grid gap-3 sm:gap-4 grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] overflow-hidden rounded-xl"
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              >
                <img
                  src={`https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&auto=format&fit=crop&w=1200`}
                  srcSet={`https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&auto=format&fit=crop&w=480 480w, https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&auto=format&fit=crop&w=768 768w, https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&auto=format&fit=crop&w=1200 1200w`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  alt="Food photography"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-10 sm:pb-12">
          <h2 className="text-xl sm:text-2xl font-bold">FAQ</h2>
          <div
            className="mt-4 rounded-xl"
            style={{
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderTop: 'none'
            }}
          >
            {faq.map((f, i) => (
              <details
                key={i}
                className="group p-4"
                style={{
                  borderTop: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="font-medium">{f.q}</span>
                  <span
                    className="group-open:rotate-180 transition"
                    style={{ color: isDark ? '#64748b' : '#64748b' }}
                  >
                    ⌄
                  </span>
                </summary>
                <p
                  className="mt-2"
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 md:pb-20">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Roadmap", desc: "What we’re building next", href: "https://github.com/UOA-DCML/se310-plateful/issues" },
              { title: "Changelog", desc: "Highlights of recent releases", href: "/changelog" },
              { title: "License", desc: "Open-source details", href: "/LICENSE" },
            ].map((l) => (
              <a
                key={l.title}
                href={l.href}
                className="rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                style={{
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff'
                }}
              >
                <div className="font-semibold">{l.title}</div>
                <div
                  className="text-sm"
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                >
                  {l.desc}
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Plateful",
            description: "Community-powered restaurant discovery.",
            isPartOf: { "@type": "WebSite", name: "Plateful" },
          }),
        }}
      />
    </div>
  );
}
