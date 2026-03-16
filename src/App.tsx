/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronDown,
  Code,
  Palette,
  Layout,
  Globe,
  Database,
  Zap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      animate={{
        x: position.x - 8,
        y: position.y - 8,
        scale: isHovering ? 4 : 1,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-bg z-[10000] flex flex-col items-center justify-center p-6"
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          <span>Initializing System</span>
          <span>{progress}%</span>
        </div>
        <div className="h-px w-full bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-8 font-mono text-[10px] text-ink/20 space-y-1">
          <p>{progress > 20 ? "> Loading kernel modules..." : ""}</p>
          <p>{progress > 40 ? "> Establishing secure connection..." : ""}</p>
          <p>{progress > 60 ? "> Fetching user data: NAGENDRA_BABU" : ""}</p>
          <p>{progress > 80 ? "> Rendering interface..." : ""}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Software', href: '#software' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "bg-bg/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.a 
          href="#" 
          className="text-2xl font-serif italic font-bold tracking-tighter"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Nagendra.
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-accent transition-colors uppercase tracking-widest"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {link.name}
            </motion.a>
          ))}
          <motion.button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2 bg-ink text-bg rounded-full text-sm font-bold hover:bg-accent hover:text-white transition-all cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            Let's Talk
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-ink"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-serif italic hover:text-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const downloadResume = () => {
    const resumeText = `BOPPA NAGENDRA BABU
Email: nb8747512@gmail.com
Phone: 9494633443
Location: Pamarru, pamarru mandalam, krishna district

ABOUT ME
Motivated and detail-oriented Computer Science student with a strong interest in software development, web technologies, and artificial intelligence. Skilled in Python, HTML, CSS, and JavaScript with experience building projects such as web applications, OpenCV-based tools, and data structure visualizations. Passionate about learning new technologies and solving real-world problems through innovative and efficient solutions.

SKILLS
- Languages: C, Python, JavaScript
- Web Technologies: HTML, CSS
- Tools/Libraries: OpenCV

EDUCATION
Computer Science and Engineering
Dhanekula Institute of Engineering and Technology (2024-2028)`;

    const element = document.createElement("a");
    const file = new Blob([resumeText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Boppa_Nagendra_Babu_Resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="relative min-height-[100vh] flex flex-col justify-center items-center px-6 pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <motion.div 
        style={{ y: y1, opacity }}
        className="text-center max-w-5xl"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-accent font-mono text-sm tracking-[0.3em] uppercase mb-6"
        >
          Available for freelance
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[12vw] md:text-[8vw] font-serif leading-[0.9] tracking-tighter mb-8"
        >
          NAGENDRA <br />
          <span className="text-stroke italic">BABU</span> <br />
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-ink/60 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
        >
          I'm a motivated Computer Science student at Dhanekula Institute, based in Pamarru. 
          I specialize in Python and Web Technologies, building innovative solutions 
          ranging from OpenCV tools to high-performance web applications.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a 
            href="#contact" 
            className="group flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold hover:scale-105 transition-all"
          >
            Get in Touch
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button 
            onClick={downloadResume}
            className="px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
          >
            Download Resume
            <ExternalLink size={16} />
          </button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink/40">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Code className="text-accent" size={32} />,
      title: "Web Development",
      description: "Building high-performance, responsive websites using modern frameworks like React and Next.js."
    },
    {
      icon: <Globe className="text-accent" size={32} />,
      title: "SEO & Strategy",
      description: "Optimizing your digital presence to ensure your message reaches the right people at the right time."
    }
  ];

  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-serif italic mb-8">What I Do</h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="tech-card"
            >
              <div className="scanline" />
              <div className="mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif italic mb-4">{service.title}</h3>
              <p className="text-ink/60 font-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const categories = [
    {
      title: "Languages",
      skills: ["C", "Python", "JavaScript", "TypeScript"]
    },
    {
      title: "Web Technologies",
      skills: ["HTML", "CSS", "React", "Next.js", "Tailwind CSS"]
    },
    {
      title: "Tools & Software",
      skills: ["VS Code", "Postman", "Docker", "Figma", "Git", "OpenCV"]
    }
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="tech-card"
            >
              <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-accent mb-8">{cat.title}</h3>
              <div className="flex flex-wrap gap-3">
                {cat.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs font-mono text-ink/60 hover:border-accent/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SoftwareStack = () => {
  const [softwares, setSoftwares] = useState<{ id: number, name: string, category: string, icon: string }[]>([]);

  useEffect(() => {
    fetch('/api/softwares')
      .then(res => res.json())
      .then(data => setSoftwares(data))
      .catch(err => console.error("Failed to fetch softwares:", err));
  }, []);

  return (
    <section id="software" className="py-32 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-accent mb-4">Software Stack</h3>
          <h2 className="text-4xl md:text-6xl font-serif italic">Tools of the Trade</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {softwares.map((sw) => (
            <motion.div
              key={sw.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="tech-card flex flex-col items-center justify-center text-center p-6"
            >
              <div className="text-accent mb-4">
                {sw.name === "Git" && <Github size={32} />}
                {sw.name === "VS Code" && <Code size={32} />}
                {sw.name === "Postman" && <Globe size={32} />}
                {sw.name === "Docker" && <Layout size={32} />}
                {sw.name === "Figma" && <Palette size={32} />}
                {sw.name === "PostgreSQL" && <Database size={32} />}
                {sw.name === "Redis" && <Zap size={32} />}
                {sw.name === "Vercel" && <Globe size={32} />}
              </div>
              <span className="text-sm font-bold">{sw.name}</span>
              <span className="text-[10px] uppercase tracking-widest text-ink/40 mt-1">{sw.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-7xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/10 to-transparent -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-8xl font-serif italic mb-12 tracking-tighter">
            Let's create <br /> something <span className="text-stroke">extraordinary</span>.
          </h2>
          
          <p className="text-xl text-ink/60 mb-16 max-w-2xl mx-auto font-light">
            Have a project in mind? I'm always open to discussing new opportunities 
            and creative collaborations.
          </p>

          <div className="flex flex-col items-center justify-center gap-8">
            <a 
              href="mailto:nb8747512@gmail.com" 
              className="group flex items-center gap-4 text-3xl md:text-5xl font-serif italic hover:text-accent transition-colors"
            >
              nb8747512@gmail.com
              <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform" />
            </a>
            <a 
              href="tel:9494633443" 
              className="group flex items-center gap-4 text-3xl md:text-5xl font-serif italic hover:text-accent transition-colors"
            >
              +91 9494633443
              <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          <div className="mt-24 flex justify-center gap-8">
            <a href="#" className="p-4 rounded-full border border-white/10 hover:bg-accent hover:border-accent transition-all">
              <Twitter size={24} />
            </a>
            <a href="#" className="p-4 rounded-full border border-white/10 hover:bg-accent hover:border-accent transition-all">
              <Linkedin size={24} />
            </a>
            <a href="#" className="p-4 rounded-full border border-white/10 hover:bg-accent hover:border-accent transition-all">
              <Github size={24} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-ink/40 text-sm font-mono">
          &copy; {new Date().getFullYear()} Boppa Nagendra Babu. All rights reserved.
        </p>
        <div className="flex gap-8 text-sm uppercase tracking-widest font-bold text-ink/40">
          <a href="#" className="hover:text-ink transition-colors">Privacy</a>
          <a href="#" className="hover:text-ink transition-colors">Terms</a>
          <a href="#" className="hover:text-ink transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="selection:bg-accent selection:text-white">
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          <CustomCursor />
          <Navbar />
          <main>
            <Hero />
            <Skills />
            <SoftwareStack />
            <Services />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
