import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    title: 'Build Your Bansawali',
    description: 'Create detailed family trees (बंशावली) with an intuitive visual editor. Add family members, define relationships like buwa-chhora, and watch your family history come to life.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558" />
      </svg>
    ),
    title: 'Collaborate with Parivaar',
    description: 'Invite family members across Nepal and abroad to contribute. Share your tree with relatives in Kathmandu, Pokhara, or overseas and build your bansawali together.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: 'Track Life Events',
    description: 'Record births, bratabandha, bibaha, and other milestones. Keep a rich timeline of sanskar and life events for every family member.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
      </svg>
    ),
    title: 'Photo Gallery',
    description: 'Upload and organize family photos from festivals, weddings, and gatherings. Preserve memories of Dashain, Tihar, and family reunions for generations.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: 'Nata Calculator',
    description: 'Discover how any two people in your tree are related — fupu, mama, bhinaju, jethan, and more. Automatically maps Nepali family relationships.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
    title: 'Import & Export',
    description: 'Import existing family data via GEDCOM or export your bansawali to share at family gatherings or print for your Kuldevta room.',
  },
];

const stats = [
  { label: 'Parivaar Members Tracked', value: '10,000+' },
  { label: 'Bansawalis Created', value: '2,500+' },
  { label: 'Life Events Recorded', value: '50,000+' },
  { label: 'Nepali Families Connected', value: '1,200+' },
];

export default function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm">FT</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900 truncate">Hamro Bansawali</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-gray-100 py-4 space-y-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="block w-full text-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-24 pb-14 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-amber-50 to-rose-50 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
            </svg>
            हाम्रो परिवार, हाम्रो पहिचान
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Every Nepali Family Has a Story.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Preserve Your Bansawali.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Build beautiful, interactive bansawalis. Connect generations from the hills to the Terai,
            preserve memories of Dashain gatherings, and keep your family&apos;s legacy alive for future pusta.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto text-center bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5"
            >
              सुरु गर्नुहोस् — निःशुल्क
            </Link>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 px-6 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-colors"
            >
              कसरी काम गर्छ हेर्नुहोस्
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </a>
          </div>

          {/* Hero visual */}
          <div className="mt-10 sm:mt-16 max-w-4xl mx-auto">
            <div className="relative rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-xl sm:shadow-2xl shadow-gray-200/50 overflow-hidden">
              <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 border-b border-gray-200">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-gray-500 font-mono">Hamro Bansawali</span>
              </div>
              <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                {/* Simulated tree visualization */}
                <div className="flex flex-col items-center gap-3 sm:gap-6">
                  {/* Generation 1 */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <PersonCard name="Ram Bahadur Gurung" year="1935 – 2010" color="indigo" />
                    <div className="hidden sm:block w-8 h-0.5 bg-indigo-300" />
                    <div className="sm:hidden w-0.5 h-4 bg-indigo-300" />
                    <PersonCard name="Sita Devi Gurung" year="1938 – 2015" color="purple" />
                  </div>
                  {/* Connector */}
                  <div className="w-0.5 h-4 sm:h-6 bg-indigo-300" />
                  {/* Generation 2 */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6">
                    <PersonCard name="Hari Prasad Gurung" year="b. 1960" color="blue" />
                    <PersonCard name="Kamala Sharma" year="b. 1963" color="rose" />
                    <PersonCard name="Bikram Gurung" year="b. 1965" color="teal" />
                  </div>
                  {/* Connector */}
                  <div className="w-0.5 h-4 sm:h-6 bg-indigo-300" />
                  {/* Generation 3 */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6">
                    <PersonCard name="Anisha Gurung" year="b. 1990" color="amber" />
                    <PersonCard name="Sujan Gurung" year="b. 1992" color="emerald" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{stat.value}</div>
                <div className="mt-1 text-xs sm:text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-14 sm:py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
              Everything You Need to Preserve Your Kul Parampara
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful tools designed for Nepali families to build, share, and preserve their bansawali — simply and beautifully.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-8 hover:shadow-xl hover:shadow-gray-100 hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
              Get Started in Minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to begin preserving your parivaar ko katha.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { step: '01', title: 'Create Your Bansawali', desc: 'Sign up for free and create your first family tree. Name it after your thar or kul and start adding parivaar members.' },
              { step: '02', title: 'Add Your Parivaar', desc: 'Add family members, define nata like buwa-aama, daju-bhai, didi-bahini, and enrich profiles with sanskar events and photos.' },
              { step: '03', title: 'Share & Collaborate', desc: 'Invite relatives across Nepal or abroad to view or edit the tree. Export and print your bansawali for family gatherings.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto text-lg sm:text-xl font-bold mb-4 sm:mb-5 shadow-lg shadow-indigo-200">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
              Trusted by Nepali Families
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {[
              { name: 'Suman Shrestha', role: 'Kathmandu', text: 'This tool helped me map out five pustas of our Newar family. My daju and bahini in the US can now add their details too. It\'s like a digital bansawali!', avatar: 'SS' },
              { name: 'Anita Tamang', role: 'Pokhara', text: 'I imported our old family records and now the whole parivaar can see how we\'re connected. Even my hajurbuwa\'s stories are preserved here.', avatar: 'AT' },
              { name: 'Rajesh Adhikari', role: 'Dharan', text: 'During Dashain, I showed the bansawali to our whole family. My nati-natini loved seeing everyone connected. The nata calculator is amazing!', avatar: 'RA' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
                तपाईंको जरा खोज्न तयार हुनुहुन्छ?
              </h2>
              <p className="text-indigo-100 text-sm sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
                हजारौं नेपाली परिवारहरूसँग जोडिनुहोस्। आज नै आफ्नो बंशावली बनाउन सुरु गर्नुहोस् — यो पूर्ण रूपमा निःशुल्क छ।
              </p>
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                अहिले सुरु गर्नुहोस्
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">FT</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">Hamro Bansawali</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
              <Link to="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-gray-900 transition-colors">Sign Up</Link>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Hamro Bansawali. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Tiny helper component for the hero visual ──────────── */
function PersonCard({ name, year, color }) {
  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border text-center min-w-0 ${colorMap[color] || colorMap.indigo}`}>
      <div className="text-xs sm:text-sm font-semibold truncate">{name}</div>
      <div className="text-[10px] sm:text-xs opacity-70">{year}</div>
    </div>
  );
}
