import React from "react";
import { motion } from "framer-motion";
import { Utensils, Star, Users, Compass, Sparkles, Github, ArrowRight } from "lucide-react";

/**
 * Plateful — About Page (Responsive)
 */
export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 pt-6 sm:pt-8">
      {/* Top banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* subtle background accents */}
          <div className="absolute -top-24 -right-24 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-12 md:pt-24 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mx-auto mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Built for food lovers
            </div>
            <h1 className="text-[28px] leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight">
              Discover, share, and savour with {" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Plateful</span>
            </h1>
            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-slate-600 md:text-lg">
              A community-powered way to explore restaurants, read honest reviews, and find your next favourite bite—fast.
            </p>
            <div className="mt-5 sm:mt-6 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3">
              <a
                href="/"
                className="inline-flex justify-center items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:shadow-xl w-full xs:w-auto"
              >
                Explore restaurants <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/UOA-DCML/se310-plateful"
                target="_blank" rel="noreferrer noopener"
                className="inline-flex justify-center items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 w-full xs:w-auto"
              >
                <Github className="h-4 w-4" /> View code
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              icon: <Compass className="h-5 w-5" />, title: "Smart discovery",
              desc: "Filter by cuisine, vibe, and budget to zero in on what you’re craving."
            },
            {
              icon: <Star className="h-5 w-5" />, title: "Real reviews",
              desc: "No fluff—just helpful insights from people who actually went."
            },
            {
              icon: <Users className="h-5 w-5" />, title: "Tasty community",
              desc: "Follow friends and foodies you trust to keep your list fresh."
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                  {c.icon}
                </span>
                <h3 className="text-base sm:text-lg font-semibold">{c.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission + Stats */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="grid items-stretch md:items-center gap-6 md:gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
          >
            <h2 className="text-xl sm:text-2xl font-bold">Our mission</h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Make dining out simpler and more delightful with up-to-date info, thoughtful reviews, and a friendly community.
              Plateful helps you spend less time scrolling and more time enjoying great food.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['React', 'Tailwind CSS', 'MongoDB', 'Java', 'SpringBoot'].map((t) => (
                <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 grid-cols-2 sm:grid-cols-2"
          >
            {[
              { label: "Restaurants tracked", value: "12k+" },
              { label: "User reviews", value: "85k+" },
              { label: "Cuisines", value: "120+" },
              { label: "Cities", value: "40+" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-14">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">How Plateful works</h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">Three simple steps to your next favourite spot.</p>
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
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-slate-100" />
              <div className="relative flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                  {item.icon}
                </span>
                <div>
                  <div className="text-[10px] sm:text-xs font-mono text-slate-500">{item.step}</div>
                  <h3 className="text-base sm:text-lg font-semibold">{item.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team / ethos */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-14 sm:pb-16">
        <div className="grid gap-6 sm:gap-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm md:grid-cols-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Built by people who love food</h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              We’re engineers, designers, and weekend eaters. We ship fast, listen to feedback, and care about the small
              details like accessibility, speed, and keeping dark mode crisp.

              <br />
              <br />
              <strong>Oorja Gandhi</strong> — <em>“Food is the ingredient that binds us together!”</em>
              <br />
              <strong>Connie Ding</strong> — <em>“Every meal is a new adventure.”</em>
              <br />
              <strong>Chris Kang</strong> — <em>“Great food brings great people together.”</em>
              <br />
              <strong>Kimberley Zhu</strong> — <em>“A dash of creativity makes every dish memorable.”</em>
              <br />
              <strong>Shihoo Park</strong> — <em>“Coding is fun, but eating is better!”</em>
              <br />
              <strong>Richman Tan</strong> — <em>“Strategy is about making choices, trade-offs; it’s about deliberately choosing to be different.”</em>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Fast & accessible",
                "Privacy-first",
                "Community-led",
                "Helpful by default",
              ].map((pill) => (
                <span key={pill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={`https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&auto=format&fit=crop&w=800&ixid=${i}`}
                  alt="Food photography placeholder"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer-ish CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-16 md:pb-20">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-sm">
          <h3 className="text-lg sm:text-xl font-semibold">Ready to find your next favourite?</h3>
          <p className="max-w-xl text-sm text-slate-600">
            Start exploring curated lists, trustworthy reviews, and hidden gems around you.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl w-full xs:w-auto max-w-[420px]"
          >
            Browse Plateful <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
