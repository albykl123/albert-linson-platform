import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpRight, 
  Shield, 
  Sparkles,
  MessageCircle,
  Phone
} from "lucide-react";
import { masterProfile } from "@/lib/profileData";
import { InteractiveAvatar } from "@/components/InteractiveAvatar";

export default function HomePage() {
  return (
    <div className="bg-swiss-white text-swiss-navy min-h-screen">
      {/* 1. Hero Section (Swiss Editorial + Interactive 3D Avatar Stage) */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Executive Credentials & CTAs */}
          <div className="lg:col-span-7">
            {/* Subtle Credential Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-swiss-divider bg-swiss-light text-swiss-navy text-xs font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-swiss-blue"></span>
              <span>Verified Professional Profile &bull; MCA (Pursuing), Christ University</span>
            </div>

            {/* Headline & Name */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-swiss-navy leading-[1.08]">
              {masterProfile.personal.name}
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-medium text-swiss-blue tracking-tight">
              {masterProfile.personal.headline}
            </p>

            <p className="mt-6 text-base text-gray-700 leading-relaxed max-w-2xl">
              {masterProfile.summary}
            </p>

            {/* Action Call-to-Actions */}
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <Link
                href="/matcher"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-swiss-navy text-swiss-white hover:bg-swiss-navy/90 text-sm font-semibold shadow-sm transition-all"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Match Your JD</span>
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-swiss-divider bg-swiss-light hover:bg-swiss-divider/50 text-swiss-navy text-sm font-semibold transition-all"
              >
                <span>Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/experience"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-swiss-divider bg-swiss-white hover:bg-swiss-light text-swiss-navy text-sm font-semibold transition-all"
              >
                <Briefcase className="h-4 w-4 text-swiss-blue" />
                <span>Experience</span>
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-swiss-divider bg-swiss-white hover:bg-swiss-light text-swiss-navy text-sm font-semibold transition-all"
              >
                <FileText className="h-4 w-4 text-swiss-blue" />
                <span>Resume</span>
              </Link>

              <a
                href="https://wa.me/919910705796?text=Hi%20Albert,%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-semibold transition-all shadow-sm"
                title="Chat with Albert on WhatsApp (+91 9910705796)"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp: +91 9910705796</span>
              </a>

              <a
                href={`mailto:${masterProfile.personal.email}`}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-swiss-divider bg-swiss-white hover:bg-swiss-light text-gray-700 text-sm font-medium transition-all"
              >
                <Mail className="h-4 w-4 text-gray-500" />
                <span>Email</span>
              </a>
            </div>

            {/* Verified Facts Bar */}
            <div className="mt-12 pt-6 border-t border-swiss-divider grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Location</div>
                <div className="text-sm font-semibold text-swiss-navy mt-1">{masterProfile.personal.location}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Education</div>
                <div className="text-sm font-semibold text-swiss-navy mt-1">MCA (Pursuing) & BCA</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Core Expertise</div>
                <div className="text-sm font-semibold text-swiss-navy mt-1">Full-Stack & Recruitment</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Research</div>
                <div className="text-sm font-semibold text-swiss-navy mt-1">2 Focused Manuscripts</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Holographic Interactive Avatar Stage */}
          <div className="lg:col-span-5 flex justify-center order-first lg:order-last mb-8 lg:mb-0">
            <div className="w-full max-w-sm sm:max-w-md">
              <InteractiveAvatar />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Areas of Verified Expertise */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-swiss-divider bg-swiss-light">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-swiss-blue">Competencies</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-swiss-navy mt-1 tracking-tight">
            Verified Areas of Professional Expertise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-swiss-white border border-swiss-divider shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-swiss-light border border-swiss-divider flex items-center justify-center text-swiss-blue mb-4">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-swiss-navy">US IT Recruitment</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Full-cycle technical candidate sourcing, requirements mapping, competency screening, and talent pipeline management with ATS workflows.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-swiss-white border border-swiss-divider shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-swiss-light border border-swiss-divider flex items-center justify-center text-swiss-blue mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-swiss-navy">Frontend & UI/UX Design</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Responsive web interfaces using React, Next.js, HTML5/CSS3, Bootstrap, Tailwind CSS, and Figma prototyping compliant with usability standards.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-swiss-white border border-swiss-divider shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-swiss-light border border-swiss-divider flex items-center justify-center text-swiss-blue mb-4">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-swiss-navy">Systems & OS Development</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Low-level software development including 32-bit protected-mode x86 kernels in C and assembly, interrupt handlers, and desktop automation.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-swiss-white border border-swiss-divider shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-swiss-light border border-swiss-divider flex items-center justify-center text-swiss-blue mb-4">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-swiss-navy">Computational Research</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Quantitative methodology in medical ultrasound multi-modal fusion and evidence-guided iterative prompt synthesis for LLM test reliability.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Software Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-swiss-divider">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-blue">Portfolio Highlights</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-swiss-navy mt-1 tracking-tight">
              Featured Software Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-sm font-semibold text-swiss-blue hover:text-swiss-navy transition-colors"
          >
            <span>View all 8 projects</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {masterProfile.projects.slice(0, 4).map((proj) => (
            <div
              key={proj.id}
              className="p-8 rounded-xl bg-swiss-white border border-swiss-divider hover:border-swiss-blue/40 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="px-2.5 py-0.5 rounded font-medium bg-swiss-light border border-swiss-divider text-swiss-navy">
                    {proj.status}
                  </span>
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-gray-500 hover:text-swiss-navy transition-colors"
                    >
                      <span className="text-[11px]">Repository</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <h3 className="text-xl font-bold text-swiss-navy tracking-tight">{proj.title}</h3>
                <p className="text-xs font-semibold text-swiss-blue mt-1">{proj.tagline}</p>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">{proj.description}</p>

                {proj.architecture && (
                  <div className="mt-4 p-3 rounded-lg bg-swiss-light border border-swiss-divider text-[11px] text-gray-700">
                    <span className="font-semibold text-swiss-navy">Architecture: </span>
                    {proj.architecture}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-swiss-divider flex flex-wrap gap-1.5">
                {proj.technologies.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[11px] rounded bg-swiss-light text-gray-700 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Academic Research (EXACTLY TWO PAPERS) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-swiss-divider bg-swiss-light">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-blue">Scholarly Inquiries</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-swiss-navy mt-1 tracking-tight">
              Academic Research
            </h2>
          </div>
          <Link
            href="/projects?tab=research"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-sm font-semibold text-swiss-blue hover:text-swiss-navy transition-colors"
          >
            <span>Read full methodologies & manuscripts</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {masterProfile.research.map((paper) => (
            <div
              key={paper.id}
              className="p-8 rounded-xl bg-swiss-white border border-swiss-divider shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-swiss-blue">{paper.category}</span>
                  <span className="px-2 py-0.5 rounded bg-swiss-light border border-swiss-divider text-gray-700 text-[11px]">
                    {paper.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-swiss-navy leading-snug tracking-tight">
                  {paper.title}
                </h3>

                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  {paper.abstract}
                </p>

                <div className="mt-4 p-3 rounded-lg bg-swiss-light border border-swiss-divider text-[11px] text-gray-700">
                  <span className="font-semibold text-swiss-navy">Methodology: </span>
                  {paper.methodology}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-swiss-divider flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">{paper.role}</span>
                {paper.paper_url && paper.paper_url !== "#" ? (
                  <a
                    href={paper.paper_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 font-semibold text-swiss-blue hover:text-swiss-navy"
                  >
                    <span>View Manuscript</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-gray-400">Manuscript Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Leadership, Event Management & Campus Engagement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-swiss-divider">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-blue">Institutional Impact</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-swiss-navy mt-1 tracking-tight">
              Leadership & Event Management
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {masterProfile.leadership?.length || 14} verified roles across event operations, public relations, peer education, student welfare, media, and sustainability.
            </p>
          </div>
          <Link
            href="/leadership"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-sm font-semibold text-swiss-blue hover:text-swiss-navy transition-colors"
          >
            <span>View all {masterProfile.leadership?.length || 14} records</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-swiss-divider bg-swiss-white hover:border-swiss-blue/40 shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-swiss-blue">Corporate Club</span>
                <span className="font-mono text-[11px] bg-swiss-light px-2 py-0.5 rounded">2026 – Present</span>
              </div>
              <h3 className="text-base font-bold text-swiss-navy">Overall Event Management Head</h3>
              <p className="text-xs text-gray-500 mt-0.5">School of Sciences, Christ University</p>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Directs overall event planning, committee coordination, and execution teams for corporate interface events and speaker symposiums.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-swiss-divider flex flex-wrap gap-1">
              <span className="text-[10px] bg-swiss-light text-gray-700 px-1.5 py-0.5 rounded">Event Operations</span>
              <span className="text-[10px] bg-swiss-light text-gray-700 px-1.5 py-0.5 rounded">Team Leadership</span>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-swiss-divider bg-swiss-white hover:border-swiss-blue/40 shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-swiss-blue">CCHS Christ University</span>
                <span className="font-mono text-[11px] bg-swiss-light px-2 py-0.5 rounded">2026 – 2028</span>
              </div>
              <h3 className="text-base font-bold text-swiss-navy">Advanced Peer Educator</h3>
              <p className="text-xs text-gray-500 mt-0.5">Centre for Counselling & Health Services</p>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Mentors junior peer educators and coordinates campus mental health and stress mitigation initiatives following 3 years of service as Peer Educator.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-swiss-divider flex flex-wrap gap-1">
              <span className="text-[10px] bg-swiss-light text-gray-700 px-1.5 py-0.5 rounded">Peer Mentoring</span>
              <span className="text-[10px] bg-swiss-light text-gray-700 px-1.5 py-0.5 rounded">Student Well-being</span>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-swiss-divider bg-swiss-white hover:border-swiss-blue/40 shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-swiss-blue">St. Columba&apos;s School</span>
                <span className="font-mono text-[11px] bg-swiss-light px-2 py-0.5 rounded">2019 – 2022</span>
              </div>
              <h3 className="text-base font-bold text-swiss-navy">Event Head & Overall Core Team Head</h3>
              <p className="text-xs text-gray-500 mt-0.5">St. Columba&apos;s School, New Delhi</p>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Headed core event management operations for major institutional functions, annual celebrations, and inter-house competitions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-swiss-divider flex flex-wrap gap-1">
              <span className="text-[10px] bg-swiss-light text-gray-700 px-1.5 py-0.5 rounded">Event Planning</span>
              <span className="text-[10px] bg-swiss-light text-gray-700 px-1.5 py-0.5 rounded">Student Leadership</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Experience & Education Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-swiss-divider">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Career Highlights */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-swiss-blue">Work History</span>
                <h2 className="text-2xl font-bold text-swiss-navy mt-1">Professional Experience</h2>
              </div>
              <Link href="/experience" className="text-xs font-semibold text-swiss-blue hover:underline">
                All Roles &rarr;
              </Link>
            </div>

            <div className="space-y-6">
              {masterProfile.experience.slice(0, 3).map((exp) => (
                <div key={exp.id} className="p-5 rounded-xl border border-swiss-divider bg-swiss-white hover:bg-swiss-light/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-swiss-navy">{exp.company}</span>
                    <span>{exp.period}</span>
                  </div>
                  <div className="text-sm font-bold text-swiss-blue mt-1">{exp.role}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {exp.highlights[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Highlights */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-swiss-blue">Academic Path</span>
                <h2 className="text-2xl font-bold text-swiss-navy mt-1">Education Credentials</h2>
              </div>
              <Link href="/education" className="text-xs font-semibold text-swiss-blue hover:underline">
                Full Details &rarr;
              </Link>
            </div>

            <div className="space-y-6">
              {masterProfile.education.slice(0, 3).map((edu) => (
                <div key={edu.id} className="p-5 rounded-xl border border-swiss-divider bg-swiss-white hover:bg-swiss-light/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-swiss-navy">{edu.institution}</span>
                    <span>{edu.period}</span>
                  </div>
                  <div className="text-sm font-bold text-swiss-navy mt-1">{edu.degree}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recruiter Contact & Resume Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-swiss-divider bg-swiss-light rounded-2xl mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-swiss-blue">Reach Out To Me &bull; Direct Outreach</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-swiss-navy mt-2 tracking-tight">
            Interested in discussing an engineering or technical recruitment opportunity?
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
            I am actively pursuing roles in Frontend Development, UI/UX Engineering, Software Development, and Technical Recruitment. Connect directly with me on WhatsApp, email, or telephone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919910705796?text=Hi%20Albert,%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp: +91 9910705796</span>
            </a>
            <a
              href={`mailto:${masterProfile.personal.email}`}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-swiss-navy text-swiss-white hover:bg-swiss-navy/90 text-sm font-semibold shadow-sm transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>Email: {masterProfile.personal.email}</span>
            </a>
            <a
              href="tel:+919910705796"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border border-swiss-divider bg-swiss-white hover:bg-swiss-light text-swiss-navy text-sm font-semibold shadow-sm transition-all"
            >
              <Phone className="h-4 w-4 text-swiss-blue" />
              <span>Call: +91 9910705796</span>
            </a>
            <Link
              href="/resume"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border border-swiss-divider bg-swiss-white hover:bg-swiss-light text-swiss-navy text-sm font-semibold shadow-sm transition-all"
            >
              <FileText className="h-4 w-4 text-swiss-blue" />
              <span>Download Verified Resume</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
