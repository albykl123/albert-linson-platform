import React from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { GraduationCap, Briefcase, Award, CheckCircle, ArrowRight, BookOpen, Compass, Code, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-ivory-base text-ivory-charcoal min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-ivory-cream pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-ivory-sage">Personal Storytelling & Journey</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-ivory-charcoal mt-2 tracking-tight">
            About Albert Linson
          </h1>
          <p className="text-gray-700 mt-3 text-base max-w-2xl leading-relaxed">
            {masterProfile.personal.headline} &bull; Based in {masterProfile.personal.location}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Narrative Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Verified Biography */}
            <section className="bg-ivory-cream/60 p-8 rounded-2xl border border-ivory-beige/40">
              <h2 className="text-xl font-bold text-ivory-charcoal mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-ivory-sage" />
                <span>Professional Background</span>
              </h2>
              <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                <p>
                  I am an analytical IT professional holding a Bachelor of Computer Applications (BCA) and currently pursuing my Master of Computer Applications (MCA) at <strong>CHRIST (Deemed to be University), Delhi NCR</strong>.
                </p>
                <p>
                  My professional experience bridges technical engineering and recruitment operations. At <strong>Innova Solutions</strong>, I worked as a US IT Recruiter, managing full-cycle technical candidate sourcing, requirements mapping, and technical competency evaluation across enterprise technology demands. Prior to this, I served as IT Manager at <strong>Herbal Energy</strong>, directing workstation infrastructure, data security, and digital web maintenance, and as a Business Development Executive at <strong>Algo Spark Technologies</strong>, driving B2B client acquisition pipelines and technical presentations.
                </p>
                <p>
                  During my internships at the <strong>Municipal Corporation of Delhi (MCD)</strong> and <strong>METVY LEARN</strong>, I designed and prototyped citizen-centric web portals using Figma, Adobe XD, HTML, CSS, JavaScript, and Bootstrap, while supporting Android UI prototyping in Android Studio.
                </p>
              </div>
            </section>

            {/* 2. Educational Journey */}
            <section className="bg-ivory-cream/60 p-8 rounded-2xl border border-ivory-beige/40">
              <h2 className="text-xl font-bold text-ivory-charcoal mb-4 flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-ivory-sage" />
                <span>Educational Journey</span>
              </h2>
              <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                <p>
                  My foundational education began at <strong>St. Columba's School, New Delhi</strong>, where I completed Class X and Class XII under the CBSE curriculum with a focus on Computer Science and Mathematics. While at St. Columba's, I actively collaborated with the school's IT staff to maintain computer lab equipment, test software deployments, and assist in student IT orientations.
                </p>
                <p>
                  I advanced to <strong>CHRIST (Deemed to be University)</strong> to complete my Bachelor of Computer Applications (BCA) with a Specialization in Advanced Technological Skills (2022–2025). During my undergraduate studies, I served as a Certified Peer Educator and was an active member of the Student Welfare Organization (SWO) Literary Club for two years.
                </p>
                <p>
                  I am currently pursuing my <strong>Master of Computer Applications (MCA)</strong> at Christ University, focusing on Artificial Intelligence, distributed systems, and computational algorithms.
                </p>
              </div>
            </section>

            {/* 3. Research & Development Interests */}
            <section className="bg-ivory-cream/60 p-8 rounded-2xl border border-ivory-beige/40">
              <h2 className="text-xl font-bold text-ivory-charcoal mb-4 flex items-center space-x-2">
                <Code className="h-5 w-5 text-ivory-sage" />
                <span>Development & Research Interests</span>
              </h2>
              <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                <p>
                  My technical exploration spans two primary vectors: <strong>systems software</strong> and <strong>computational machine intelligence</strong>.
                </p>
                <p>
                  On the systems side, I authored <em>Lunova OS</em>—a 32-bit x86 protected-mode educational operating system built in C and assembly, complete with a custom two-stage bootloader and hardware interrupt handlers. In parallel, I developed <em>JARVIS</em>, an offline-first Python and Electron desktop intelligence assistant with wake-word detection and local speech recognition.
                </p>
                <p>
                  My academic research is strictly focused on two manuscripts:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-700">
                  <li><strong>AEGIS-Test:</strong> Adaptive Evidence-Guided Iterative Synthesis for Reliable LLM-Based Software Testing.</li>
                  <li><strong>Breast Cancer Detection in Ultrasound:</strong> A computational perspective fusing acoustic reflectance and vascular Doppler signals.</li>
                </ul>
              </div>
            </section>

            {/* 4. Core Professional Philosophy */}
            <section className="bg-ivory-cream/60 p-8 rounded-2xl border border-ivory-beige/40">
              <h2 className="text-xl font-bold text-ivory-charcoal mb-4 flex items-center space-x-2">
                <HeartHandshake className="h-5 w-5 text-ivory-sage" />
                <span>Personal & Professional Philosophy</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-ivory-base border border-ivory-beige/60">
                  <div className="font-bold text-ivory-charcoal text-sm mb-1">Evidence Over Assumptions</div>
                  <p className="text-xs text-gray-700">
                    Whether screening technical candidates or tuning classification models, decisions must be grounded in verified, reproducible facts.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-base border border-ivory-beige/60">
                  <div className="font-bold text-ivory-charcoal text-sm mb-1">Human-Centric Usability</div>
                  <p className="text-xs text-gray-700">
                    Technology succeeds when it reduces friction for real people, from municipal citizen grievance portals to transparent ATS tools.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-base border border-ivory-beige/60">
                  <div className="font-bold text-ivory-charcoal text-sm mb-1">Deterministic Reliability</div>
                  <p className="text-xs text-gray-700">
                    Prioritizing verifiable rule engines and bounded code execution over unconstrained generative hallucinations.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-base border border-ivory-beige/60">
                  <div className="font-bold text-ivory-charcoal text-sm mb-1">Continuous Learning</div>
                  <p className="text-xs text-gray-700">
                    Actively advancing technical competencies through university coursework, open-source development, and rigorous peer review.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar: Key At-a-Glance Facts */}
          <div className="space-y-6">
            <div className="bg-ivory-cream/80 p-6 rounded-2xl border border-ivory-beige/60">
              <h3 className="font-bold text-sm text-ivory-charcoal uppercase tracking-wider mb-4">
                Fast Facts
              </h3>
              <ul className="space-y-3 text-xs text-gray-800">
                <li className="flex justify-between border-b border-ivory-beige/40 pb-2">
                  <span className="text-gray-600">Full Name</span>
                  <span className="font-semibold text-right">{masterProfile.personal.full_legal_name}</span>
                </li>
                <li className="flex justify-between border-b border-ivory-beige/40 pb-2">
                  <span className="text-gray-600">Current University</span>
                  <span className="font-semibold text-right">CHRIST (Deemed to be University)</span>
                </li>
                <li className="flex justify-between border-b border-ivory-beige/40 pb-2">
                  <span className="text-gray-600">Schooling</span>
                  <span className="font-semibold text-right">St. Columba's School, New Delhi</span>
                </li>
                <li className="flex justify-between border-b border-ivory-beige/40 pb-2">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-right">{masterProfile.personal.location}</span>
                </li>
                <li className="flex justify-between border-b border-ivory-beige/40 pb-2">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-semibold text-right">English, Hindi, Malayalam, German</span>
                </li>
              </ul>
            </div>

            <div className="bg-ivory-cream/80 p-6 rounded-2xl border border-ivory-beige/60">
              <h3 className="font-bold text-sm text-ivory-charcoal uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Compass className="h-4 w-4 text-ivory-sage" />
                <span>Target Career Direction</span>
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                Seeking employment opportunities where I can apply my dual background in technical development and recruitment analytics:
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded bg-ivory-base text-[11px] font-medium border border-ivory-beige/60">Frontend Developer</span>
                <span className="px-2 py-1 rounded bg-ivory-base text-[11px] font-medium border border-ivory-beige/60">UI/UX Engineer</span>
                <span className="px-2 py-1 rounded bg-ivory-base text-[11px] font-medium border border-ivory-beige/60">US IT Recruiter</span>
                <span className="px-2 py-1 rounded bg-ivory-base text-[11px] font-medium border border-ivory-beige/60">Technical Talent Sourcing</span>
                <span className="px-2 py-1 rounded bg-ivory-base text-[11px] font-medium border border-ivory-beige/60">Junior Software Engineer</span>
              </div>
            </div>

            <div className="bg-ivory-cream/80 p-6 rounded-2xl border border-ivory-beige/60 text-center">
              <h4 className="font-bold text-sm text-ivory-charcoal mb-2">Connect Directly</h4>
              <p className="text-xs text-gray-700 mb-4">
                Open to full-time opportunities, technical interviews, and professional connections.
              </p>
              <div className="space-y-2">
                <a
                  href={`mailto:${masterProfile.personal.email}`}
                  className="block w-full py-2.5 px-4 rounded-xl bg-ivory-charcoal text-ivory-base text-xs font-semibold hover:bg-ivory-charcoal/90 transition-colors"
                >
                  Send Email
                </a>
                <Link
                  href="/resume"
                  className="block w-full py-2.5 px-4 rounded-xl border border-ivory-beige text-ivory-charcoal text-xs font-semibold hover:bg-ivory-base transition-colors"
                >
                  View Verified Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
