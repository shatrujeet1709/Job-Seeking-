import { Link } from 'react-router-dom';
import { ArrowRight, Search, Briefcase, Zap, Sparkles, Brain, Shield, TrendingUp, Users, Star, CheckCircle, Code, Globe, Award, Target, BarChart3, Lock, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay }
});

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* ════════ HERO ════════ */}
      <div className="relative pt-24 pb-16 min-h-[92vh] flex items-center section-hero">
        {/* Decorative blobs */}
        <div className="orb-light w-[500px] h-[500px] bg-indigo-200 top-[-10%] left-[-5%] animate-blob" />
        <div className="orb-light w-[400px] h-[400px] bg-sky-200 bottom-[5%] right-[-5%] animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div {...fadeUp(0)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20"
              >
                <Sparkles size={16} /> Next-Gen AI Career Ecosystem
              </motion.div>

              <motion.h1 {...fadeUp(0.1)}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.08]"
              >
                Find work you
                <br /><span className="gradient-text">truly love.</span>
              </motion.h1>

              <motion.p {...fadeUp(0.2)}
                className="text-lg text-slate-500 mb-8 leading-relaxed max-w-xl"
              >
                Build your profile once. Let our AI analyze thousands of live opportunities
                to find your <strong className="text-slate-700">perfect match</strong> — with detailed
                reasoning for every recommendation.
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-start gap-3">
                <Link to="/register" className="btn-primary text-base px-7 py-3.5 flex items-center gap-2 group">
                  Get Started Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/jobs" className="btn-outline text-base px-7 py-3.5">Explore Jobs</Link>
              </motion.div>

              <motion.div {...fadeUp(0.4)} className="flex items-center gap-5 mt-8 text-slate-400 text-sm">
                <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> Secure</span>
                <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-500" /> 4.9 Rating</span>
                <span className="flex items-center gap-1.5"><Users size={14} className="text-sky-500" /> 50k+ Users</span>
              </motion.div>
            </div>

            {/* Right — Icon Composition (replaces 3D image) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="hero-icon-grid">
                {/* Center piece */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-36 h-36 rounded-3xl bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center shadow-2xl shadow-primary/30 z-10"
                >
                  <Briefcase className="h-16 w-16 text-white" />
                </motion.div>

                {/* Orbiting icons */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-4 right-8 w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-lg"
                >
                  <Brain className="h-8 w-8 text-indigo-500" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-8 left-4 w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-lg"
                >
                  <Search className="h-7 w-7 text-sky-500" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute bottom-4 right-4 w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-lg"
                >
                  <Zap className="h-7 w-7 text-amber-500" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-8 left-8 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg"
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute top-1/2 -right-2 w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-md"
                >
                  <Star className="h-5 w-5 text-rose-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════ ROLE CARDS ════════ */}
      <div className="py-24 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
              One platform, <span className="gradient-text">three superpowers.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Choose your role and let AI work for you.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: 'Job Seekers', desc: 'Build your profile and let Claude AI analyze thousands of jobs to find your perfect match.', link: 'Join as Seeker', color: 'sky', iconBg: 'bg-sky-50 text-sky-600 border-sky-100' },
              { icon: Briefcase, title: 'Recruiters', desc: 'Post jobs and get an AI-ranked list of candidates instantly. No more sifting through resumes.', link: 'Join as Recruiter', color: 'indigo', iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
              { icon: Zap, title: 'Freelancers', desc: 'Create gigs, showcase work, and get paid securely with our escrow-backed payments.', link: 'Join as Freelancer', color: 'amber', iconBg: 'bg-amber-50 text-amber-600 border-amber-100' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeIn(i * 0.1)}
                whileHover={{ y: -6 }}
                className="card p-8 group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border ${item.iconBg}`}>
                  <item.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 mb-5 leading-relaxed text-sm">{item.desc}</p>
                <Link to="/register" className={`inline-flex items-center text-sm font-semibold text-${item.color}-600 hover:text-${item.color}-700 group-hover:translate-x-1 transition-transform`}>
                  {item.link} <ArrowRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ AI FEATURE ════════ */}
      <div className="py-24 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Feature visual (replaces image) */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="feature-visual">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Brain, label: 'AI Analysis', value: '97%', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                    { icon: Target, label: 'Match Rate', value: '92%', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                    { icon: BarChart3, label: 'Skills Mapped', value: '150+', color: 'bg-sky-50 text-sky-600 border-sky-100' },
                    { icon: Award, label: 'Placements', value: '10K+', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className={`card p-5 text-center border ${item.color} rounded-2xl`}
                    >
                      <item.icon size={28} className="mx-auto mb-2" />
                      <p className="text-2xl font-black text-slate-900">{item.value}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-primary text-sm font-semibold mb-5 border border-indigo-100">
                <Brain size={16} /> AI Engine
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                Powered by <span className="gradient-text">Claude AI.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-6">
                Our engine deeply understands your profile — skills, experience, aspirations — and maps it to the most relevant opportunities worldwide.
              </p>
              <div className="space-y-3 mb-7">
                {[
                  { icon: TrendingUp, text: 'Match scores with detailed reasoning', color: 'text-emerald-600' },
                  { icon: Sparkles, text: 'Personalized skill gap analysis', color: 'text-indigo-600' },
                  { icon: Shield, text: 'Results cached for instant replay', color: 'text-sky-600' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600">
                    <div className={`w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center ${f.color}`}>
                      <f.icon size={16} />
                    </div>
                    <span className="text-sm font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                Try AI Matching <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════ SECURITY FEATURE ════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-5 border border-emerald-100">
                <Lock size={16} /> Enterprise Security
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                Your data is <span className="gradient-text">fortress-protected.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-7">
                Every account is secured with email verification, encrypted communications, and enterprise-grade infrastructure.
              </p>
              <div className="space-y-3 mb-7">
                {[
                  { icon: Shield, text: 'Email verification on every account', color: 'text-emerald-600' },
                  { icon: Lock, text: 'JWT + bcrypt encryption', color: 'text-indigo-600' },
                  { icon: CheckCircle, text: 'Rate limiting & NoSQL injection prevention', color: 'text-sky-600' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600">
                    <div className={`w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center ${f.color}`}>
                      <f.icon size={16} />
                    </div>
                    <span className="text-sm font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn-outline inline-flex items-center gap-2">
                Create Secure Account <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* Security visual — replaces image */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -top-3 right-[-2rem] w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
                    <Lock className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div className="absolute -bottom-3 left-[-2rem] w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 -left-8 w-4 h-4 rounded-full bg-emerald-300"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-2 -left-4 w-3 h-3 rounded-full bg-indigo-300"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════ FREELANCE FEATURE ════════ */}
      <div className="py-24 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Freelance visual — replaces image */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/25">
                    <Zap className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-6 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
                    <Code className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div className="absolute -bottom-3 -left-6 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
                    <Globe className="h-6 w-6 text-sky-500" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm font-semibold mb-5 border border-amber-100">
                <Zap size={16} /> Marketplace
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                Freelance with <span className="gradient-text-warm">confidence.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-7">
                Post your services, set your prices, and get paid securely through our escrow-backed payment system.
              </p>
              <Link to="/freelance" className="btn-outline inline-flex items-center gap-2">
                Browse Gigs <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════ STATS ════════ */}
      <div className="py-20 section-stats text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10k+', label: 'Active Jobs' },
              { value: '50k+', label: 'Job Seekers' },
              { value: '2k+', label: 'Companies' },
              { value: '1M+', label: 'AI Matches' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-5xl md:text-6xl font-black mb-1">{stat.value}</p>
                <p className="text-indigo-200 font-medium tracking-wide uppercase text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ RECRUITER CTA ════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Recruiter visual — replaces image */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-sky-500/25">
                    <Briefcase className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-6 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div className="absolute -bottom-3 -left-6 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-6 w-6 text-emerald-500" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 text-sm font-semibold mb-5 border border-sky-100">
                <Briefcase size={16} /> For Recruiters
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                Hire smarter, <span className="gradient-text">not harder.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-7">
                Post a job and get an AI-ranked shortlist of candidates in seconds. View match scores, send messages, and manage your pipeline.
              </p>
              <Link to="/register" className="btn-secondary inline-flex items-center gap-2">
                Start Hiring <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════ FINAL CTA ════════ */}
      <div className="py-28 section-alt text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            Ready to transform your career?
          </h2>
          <p className="text-xl text-slate-500 mb-9">Join thousands of professionals already using AI to find better opportunities.</p>
          <Link to="/register" className="btn-primary text-lg px-9 py-4 inline-flex items-center gap-2 group">
            Create Free Account
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
