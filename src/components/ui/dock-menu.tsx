import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import {
  Home,
  Briefcase,
  Users,
  Phone,
  BookOpen,
  Code2,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface DockItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
  href?: string;
}

const DockItem = ({ icon: Icon, label, active, onClick, href }: DockItemProps) => {
  const content = (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex flex-col items-center justify-center w-16 h-16 rounded-xl",
        "transition-colors duration-300",
        active 
          ? "text-primary" 
          : "text-white/70 hover:text-white"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "absolute inset-2 rounded-lg transition-all duration-300",
        active ? "bg-primary/20 backdrop-blur-sm" : "hover:bg-white/10"
      )} />
      <div className="relative z-10">
        <Icon className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
        {content}
      </a>
    );
  }

  return content;
};

export function DockMenu() {
  const [activeSection, setActiveSection] = React.useState("home");
  const [isVisible, setIsVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  const menuItems = [
    { id: "home", icon: Home, label: "Início" },
    { id: "services", icon: Briefcase, label: "Serviços" },
    { id: "solutions", icon: Sparkles, label: "Soluções" },
    { id: "clients", icon: Users, label: "Projetos" },
    { id: "contact", icon: Phone, label: "Contato" },
    { id: "blog", icon: BookOpen, label: "Blog", href: "https://blog.elvio.com.br" },
    { id: "nocode", icon: Code2, label: "No-Code", href: "https://semcodigobr.com.br" }
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Find current section
      const sections = menuItems
        .filter(item => !item.href)
        .map(item => ({
          id: item.id,
          element: document.getElementById(item.id)
        }))
        .filter(section => section.element);

      let activeSection = sections[0]?.id;
      let minDistance = Infinity;

      sections.forEach(section => {
        if (!section.element) return;
        const rect = section.element.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance) {
          minDistance = distance;
          activeSection = section.id;
        }
      });

      if (activeSection) {
        setActiveSection(activeSection);
      }

      // Check if we're near the footer
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const isNearFooter = footerRect.top <= window.innerHeight - 120;
        setIsVisible(!isNearFooter);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = window.innerHeight / 3;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-6 pointer-events-none z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="glass-card rounded-2xl p-2 shadow-2xl flex items-center gap-1 pointer-events-auto"
      >
        {menuItems.map((item) => (
          <DockItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => item.href ? null : scrollToSection(item.id)}
            href={item.href}
          />
        ))}
      </motion.div>
    </div>
  );
}