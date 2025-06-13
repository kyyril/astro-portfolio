import { useState, useEffect } from "react";
import { contactInfo } from "../../data/portfolio";
import Terminal from "../Terminal.tsx";

const roles = [
  "Full Stack Developer",
  "Web Designer",
  "UI/UX Enthusiast",
  "Problem Solver",
];

function ProfileContent() {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let currentRoleIndex = 0;
    let currentText = "";
    let isDeleting = false;
    const typingSpeed = 150;
    const delayBetweenRoles = 2000;

    const handleTyping = () => {
      const fullText = roles[currentRoleIndex];
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setTypedText(currentText);

      let currentTypingSpeed = typingSpeed;
      if (isDeleting) {
        currentTypingSpeed /= 2;
      }

      if (!isDeleting && currentText === fullText) {
        currentTypingSpeed = delayBetweenRoles;
        isDeleting = true;
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      }

      setTimeout(handleTyping, currentTypingSpeed);
    };

    handleTyping();
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Profile Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Khairil
            </h1>
            <div className="text-xl sm:text-2xl text-white/80 font-mono h-8">
              {typedText}
              <span className="animate-pulse">|</span>
            </div>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              Crafting digital experiences with modern technologies. Passionate
              about clean code, performance optimization, and beautiful user
              interfaces.
            </p>
          </div>

          {/* Contact Links */}
          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
            >
              <span>Email</span>
            </a>
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg text-gray-300 hover:text-gray-200 transition-all duration-200"
            >
              <span>GitHub</span>
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
            >
              <span>LinkedIn</span>
            </a>
            <a
              href={contactInfo.cv}
              download
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 transition-all duration-200"
            >
              <span>Download CV</span>
            </a>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 text-white/60">
            <div className="flex items-center gap-2">
              <span>Remote / Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Available for hire</span>
            </div>
          </div>
        </div>

        {/* Terminal Profile */}
        <div className="lg:ml-8">
          <Terminal title="~/profile" variant="glass">
            <div className="space-y-4 text-green-400">
              <div>
                <span className="text-blue-400">$</span> cat about.me
              </div>
              <div className="pl-4 space-y-2 text-white/80">
                <div>
                  <span className="text-yellow-400">name:</span> "Khairil"
                </div>
                <div>
                  <span className="text-yellow-400">role:</span> "Full Stack
                  Developer"
                </div>
                <div>
                  <span className="text-yellow-400">experience:</span> "3+
                  years"
                </div>
                <div>
                  <span className="text-yellow-400">location:</span> "Remote"
                </div>
                <div>
                  <span className="text-yellow-400">languages:</span>{" "}
                  ["TypeScript", "Python", "Rust"]
                </div>
                <div>
                  <span className="text-yellow-400">focus:</span> "Performance &
                  UX"
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-400">$</span>{" "}
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </Terminal>
        </div>
      </div>
    </section>
  );
}

export default ProfileContent;
