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
            <div className="text-xl sm:text-2xl text-[var(--color-text)] font-mono h-8">
              {typedText}
              <span className="animate-pulse">|</span>
            </div>
            <p className="text-lg text-[var(--color-text)] leading-relaxed max-w-2xl">
              Crafting digital experiences with modern technologies. Passionate
              about clean code, performance optimization, and beautiful user
              interfaces.
            </p>
          </div>

          {/* Contact Links */}
          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: "var(--color-primary-rgb, 53, 132, 228, 0.2)",
                borderColor: "var(--color-primary-rgb, 53, 132, 228, 0.3)",
                color: "var(--color-primary)",
              }}
            >
              <span>Email</span>
            </a>
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor:
                  "var(--color-secondary-rgb, 153, 193, 241, 0.2)",
                borderColor: "var(--color-secondary-rgb, 153, 193, 241, 0.3)",
                color: "var(--color-secondary)",
              }}
            >
              <span>GitHub</span>
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: "var(--color-accent-rgb, 246, 211, 45, 0.2)",
                borderColor: "var(--color-accent-rgb, 246, 211, 45, 0.3)",
                color: "var(--color-accent)",
              }}
            >
              <span>LinkedIn</span>
            </a>
            <a
              href={contactInfo.cv}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: "var(--color-primary-rgb, 53, 132, 228, 0.2)",
                borderColor: "var(--color-primary-rgb, 53, 132, 228, 0.3)",
                color: "var(--color-primary)",
              }}
            >
              <span>Download CV</span>
            </a>
          </div>

          {/* Quick Info */}
          <div
            className="flex flex-wrap gap-6"
            style={{ color: "var(--color-text)" }}
          >
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
            <div className="space-y-4" style={{ color: "var(--color-accent)" }}>
              <div>
                <span style={{ color: "var(--color-primary)" }}>$</span> cat
                about.me
              </div>
              <div
                className="pl-4 space-y-2"
                style={{ color: "var(--color-text)" }}
              >
                <div>
                  <span style={{ color: "var(--color-secondary)" }}>name:</span>{" "}
                  "Khairil"
                </div>
                <div>
                  <span style={{ color: "var(--color-secondary)" }}>role:</span>{" "}
                  "Full Stack Developer"
                </div>
                <div>
                  <span style={{ color: "var(--color-secondary)" }}>
                    experience:
                  </span>{" "}
                  "3+ years"
                </div>
                <div>
                  <span style={{ color: "var(--color-secondary)" }}>
                    location:
                  </span>{" "}
                  "Remote"
                </div>
                <div>
                  <span style={{ color: "var(--color-secondary)" }}>
                    languages:
                  </span>{" "}
                  ["TypeScript", "Python", "Rust"]
                </div>
                <div>
                  <span style={{ color: "var(--color-secondary)" }}>
                    focus:
                  </span>{" "}
                  "Performance & UX"
                </div>
              </div>
              <div className="mt-4">
                <span style={{ color: "var(--color-primary)" }}>$</span>{" "}
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
