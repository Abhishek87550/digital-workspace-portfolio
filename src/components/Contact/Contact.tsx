import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaGithub, FaTwitter, FaPinterestP, FaInstagram, FaLinkedinIn, FaUser, FaTag, FaCommentDots, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-[var(--text-body)] sm:px-8 md:px-14 lg:px-20 py-24 lg:py-16 lg:h-screen lg:max-h-screen"
    >
      {/* 
        =====================================================================
        BACKGROUND LAYERS (Cinematic Lighting & Corner Matrices)
        =====================================================================
      */}
      {/* Subtle Noise Texture overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
      />
      
      {/* Ambient center bloom */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,var(--nav-shadow)_0%,transparent_70%)]" />

      {/* 1. Top-Left Planet Glow (Orange) */}
      <div className="pointer-events-none absolute -left-[20%] -top-[20%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(circle_at_40%_40%,var(--nav-shadow)_0%,var(--nav-shadow)_40%,transparent_70%)] blur-[90px] z-0" />
      
      {/* 2. Top-Right Dot Matrix */}
      <div className="pointer-events-none absolute right-0 top-0 h-[50%] w-[40%] bg-dot-matrix [mask-image:radial-gradient(ellipse_at_top_right,black_0%,transparent_60%)] opacity-100 z-0" />
      
      {/* 3. Bottom-Left Dot Matrix */}
      <div className="pointer-events-none absolute left-0 bottom-0 h-[50%] w-[40%] bg-dot-matrix [mask-image:radial-gradient(ellipse_at_bottom_left,black_0%,transparent_60%)] opacity-80 z-0" />
      
      {/* 4. Bottom-Right Planet Glow (Grey) */}
      <div className="pointer-events-none absolute -right-[20%] -bottom-[20%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(circle_at_60%_60%,rgba(180,180,180,0.35)_0%,rgba(100,100,100,0.15)_40%,transparent_70%)] blur-[100px] z-0" />

      <div className="z-10 flex h-full w-full max-w-6xl flex-col justify-between">
        {/* Header */}
        <div className="mt-4 text-center shrink-0 relative group">
          {/* Back bloom for text */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--nav-shadow)_0%,transparent_60%)] blur-[40px] -z-10 transition-all duration-700 group-hover:opacity-100 opacity-70" />
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-from)] via-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)]">
            GET IN TOUCH
          </h2>
          {/* Cinematic Light Streak */}
          <div className="mx-auto mt-2 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-[#FAD961] to-transparent opacity-60 shadow-[0_0_15px_#FAD961]"></div>
        </div>

        {/* Info Grid */}
        <div className="grid shrink-0 grid-cols-3 gap-1 pt-6 pb-4 sm:gap-0">
          {/* Phone */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 group">
            <div className="mb-2 sm:mb-3 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[var(--nav-border)] bg-gradient-to-br from-black to-[#E19553]/15 shadow-[0_0_15px_var(--nav-shadow),inset_0_0_10px_var(--nav-shadow)] backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_25px_var(--nav-shadow),inset_0_0_15px_var(--nav-shadow)]">
              <FaPhoneAlt className="text-[10px] sm:text-lg text-[var(--text-highlight)] drop-shadow-[0_0_8px_#FAD961] transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="mb-1 text-[8px] sm:text-xs font-semibold tracking-widest text-[var(--text-secondary-heading)] drop-shadow-[0_0_5px_rgba(242,179,126,0.5)]">PHONE</h3>
            <p className="text-[8px] sm:text-xs text-[var(--text-body)]">+91 95686 13412</p>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 border-x border-[var(--nav-border)] group">
            <div className="mb-2 sm:mb-3 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[var(--nav-border)] bg-gradient-to-br from-black to-[#E19553]/15 shadow-[0_0_15px_var(--nav-shadow),inset_0_0_10px_var(--nav-shadow)] backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_25px_var(--nav-shadow),inset_0_0_15px_var(--nav-shadow)]">
              <FaMapMarkerAlt className="text-[10px] sm:text-lg text-[var(--text-highlight)] drop-shadow-[0_0_8px_#FAD961] transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="mb-1 text-[8px] sm:text-xs font-semibold tracking-widest text-[var(--text-secondary-heading)] drop-shadow-[0_0_5px_rgba(242,179,126,0.5)]">ADDRESS</h3>
            <p className="text-[8px] sm:text-xs text-[var(--text-body)] leading-tight">Himmatpurmalla</p>
            <p className="text-[8px] sm:text-xs text-[var(--text-body)] leading-tight">Haldwani, 263139</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 group">
            <div className="mb-2 sm:mb-3 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[var(--nav-border)] bg-gradient-to-br from-black to-[#E19553]/15 shadow-[0_0_15px_var(--nav-shadow),inset_0_0_10px_var(--nav-shadow)] backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_25px_var(--nav-shadow),inset_0_0_15px_var(--nav-shadow)]">
              <FaEnvelope className="text-[10px] sm:text-lg text-[var(--text-highlight)] drop-shadow-[0_0_8px_#FAD961] transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="mb-1 text-[8px] sm:text-xs font-semibold tracking-widest text-[var(--text-secondary-heading)] drop-shadow-[0_0_5px_rgba(242,179,126,0.5)]">EMAIL</h3>
            <p className="text-[8px] sm:text-xs text-[var(--text-body)] truncate w-full max-w-[80px] sm:max-w-none">b24ch1005@iitj.ac.in</p>
            <p className="text-[8px] sm:text-xs text-[var(--text-body)] truncate w-full max-w-[80px] sm:max-w-none" title="abhisheksharmasharma0000@gmail.com">abhishek...00@gmail.com</p>
          </div>
        </div>

        {/* Quote Divider */}
        <div className="flex shrink-0 flex-col items-center justify-center text-center py-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--nav-shadow)_0%,transparent_50%)] blur-[20px]" />
          <div className="flex items-center gap-4 relative z-10">
            <span className="font-serif text-3xl text-[var(--text-highlight)] drop-shadow-[0_0_10px_var(--nav-shadow)] leading-none">“</span>
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#FAD961]/70 sm:w-16 shadow-[0_0_5px_#FAD961]"></div>
              <span className="text-[10px] sm:text-xs font-medium tracking-widest text-[#F4EFE6] uppercase drop-shadow-[0_0_5px_rgba(244,239,230,0.3)]">
                IF YOU GET ANY QUESTIONS
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#FAD961]/70 sm:w-16 shadow-[0_0_5px_#FAD961]"></div>
            </div>
            <span className="font-serif text-3xl text-[var(--text-highlight)] drop-shadow-[0_0_10px_var(--nav-shadow)] leading-none">”</span>
          </div>
          <p className="mt-1 text-[10px] sm:text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase relative z-10">
            PLEASE DO NOT HESITATE TO SEND ME A MESSAGE.
          </p>
        </div>

        {/* Content Row: Map & Socials + Form */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-2 pb-4 w-full">
          
          {/* Left: Map & Socials */}
          <div className="flex min-h-0 flex-col justify-end order-2 lg:order-1 h-[250px] lg:h-auto">
            <div className="relative mb-4 h-full w-full overflow-hidden rounded-xl border border-[var(--nav-border)] bg-black/40 backdrop-blur-md shadow-[0_0_25px_var(--nav-shadow),inset_0_0_20px_var(--nav-shadow)] group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.05),transparent)] z-20 pointer-events-none" />
              {/* The interactive iframe map */}
              <iframe
                title="Google Map Location"
                src="https://maps.google.com/maps?q=29.2285582,79.4999149&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0 h-full w-full opacity-70 filter contrast-125 saturate-50 sepia-[20%] hue-rotate-[-10deg] transition-all duration-500 group-hover:opacity-90"
              />
              {/* Invisible clickable overlay to open the actual maps link */}
              <a
                href="https://www.google.com/maps/place/Unchapul,+Haldwani,+Uttarakhand+263139/@29.2176051,79.4849839,84m/data=!3m1!1e3!4m6!3m5!1s0x39a09b0c48b42b45:0x11172bdc4350d8b1!8m2!3d29.2285582!4d79.4999149!16s%2Fg%2F1tj9rrp8!5m1!1e4?authuser=3&entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in Google Maps"
                className="absolute inset-0 z-10 cursor-pointer transition-colors duration-300 hover:bg-[var(--map-hover)]"
              />
            </div>

            {/* Social Icons */}
            <div className="flex shrink-0 justify-center gap-3 lg:justify-start">
              {[
                { icon: FaGithub, link: "#" },
                { icon: FaTwitter, link: "#" },
                { icon: FaPinterestP, link: "#" },
                { icon: FaInstagram, link: "#" },
                { icon: FaLinkedinIn, link: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className="group flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--nav-border)] bg-gradient-to-br from-[var(--social-bg-from)] to-[var(--social-bg-to)] backdrop-blur-md shadow-[0_5px_15px_rgba(0,0,0,0.5),inset_0_0_8px_var(--nav-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--text-highlight)] hover:shadow-[0_10px_25px_var(--nav-shadow),inset_0_0_15px_var(--nav-shadow)]"
                >
                  <social.icon className="text-lg text-[var(--text-highlight)] transition-colors duration-300 group-hover:text-[var(--text-highlight)] group-hover:drop-shadow-[0_0_8px_var(--nav-shadow)]" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="flex min-h-0 flex-col justify-end relative z-10 order-1 lg:order-2 h-[350px] lg:h-auto">
            <form action="mailto:b24ch1005@iitj.ac.in" method="post" encType="text/plain" className="flex flex-col gap-3 h-full justify-between">
              
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                  <FaUser className="text-[var(--text-highlight)] text-sm drop-shadow-[0_0_8px_var(--nav-shadow)] transition-all duration-300 group-focus-within:drop-shadow-[0_0_12px_var(--nav-shadow)] group-focus-within:scale-110" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className="block w-full rounded-lg border border-[var(--nav-border)] bg-[var(--input-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] backdrop-blur-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 focus:border-[var(--text-highlight)]/80 focus:bg-[var(--input-focus-bg)] focus:outline-none focus:ring-1 focus:ring-[#FAD961]/50 focus:shadow-[0_0_20px_var(--nav-shadow),inset_0_2px_10px_rgba(0,0,0,0.5)] hover:border-[var(--nav-border)]"
                />
              </div>

              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                  <FaEnvelope className="text-[var(--text-highlight)] text-sm drop-shadow-[0_0_8px_var(--nav-shadow)] transition-all duration-300 group-focus-within:drop-shadow-[0_0_12px_var(--nav-shadow)] group-focus-within:scale-110" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="block w-full rounded-lg border border-[var(--nav-border)] bg-[var(--input-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] backdrop-blur-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 focus:border-[var(--text-highlight)]/80 focus:bg-[var(--input-focus-bg)] focus:outline-none focus:ring-1 focus:ring-[#FAD961]/50 focus:shadow-[0_0_20px_var(--nav-shadow),inset_0_2px_10px_rgba(0,0,0,0.5)] hover:border-[var(--nav-border)]"
                />
              </div>

              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                  <FaTag className="text-[var(--text-highlight)] text-sm drop-shadow-[0_0_8px_var(--nav-shadow)] transition-all duration-300 group-focus-within:drop-shadow-[0_0_12px_var(--nav-shadow)] group-focus-within:scale-110" />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="block w-full rounded-lg border border-[var(--nav-border)] bg-[var(--input-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] backdrop-blur-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 focus:border-[var(--text-highlight)]/80 focus:bg-[var(--input-focus-bg)] focus:outline-none focus:ring-1 focus:ring-[#FAD961]/50 focus:shadow-[0_0_20px_var(--nav-shadow),inset_0_2px_10px_rgba(0,0,0,0.5)] hover:border-[var(--nav-border)]"
                />
              </div>

              <div className="relative flex-1 min-h-[80px] group">
                <div className="pointer-events-none absolute top-3.5 left-0 flex items-start pl-4 z-10">
                  <FaCommentDots className="text-[var(--text-highlight)] text-sm drop-shadow-[0_0_8px_var(--nav-shadow)] transition-all duration-300 group-focus-within:drop-shadow-[0_0_12px_var(--nav-shadow)] group-focus-within:scale-110" />
                </div>
                <textarea
                  name="message"
                  placeholder="Message"
                  required
                  className="block h-full w-full resize-none rounded-lg border border-[var(--nav-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] backdrop-blur-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 focus:border-[var(--text-highlight)]/80 focus:bg-[var(--input-focus-bg)] focus:outline-none focus:ring-1 focus:ring-[#FAD961]/50 focus:shadow-[0_0_20px_var(--nav-shadow),inset_0_2px_10px_rgba(0,0,0,0.5)] hover:border-[var(--nav-border)]"
                />
              </div>

              <button
                type="submit"
                className="shine-sweep group mt-1 flex items-center justify-between rounded-lg bg-gradient-to-r from-[var(--btn-send-from)] via-[var(--btn-send-via)] to-[var(--btn-send-to)] bg-[length:200%_auto] px-6 py-3 text-xs font-bold tracking-widest text-[var(--input-text)] shadow-[0_5px_15px_var(--nav-shadow),inset_0_2px_5px_rgba(255,255,255,0.3)] transition-all duration-500 hover:-translate-y-1 hover:bg-[position:right_center] hover:shadow-[0_10px_35px_var(--nav-shadow),inset_0_2px_8px_rgba(255,255,255,0.5)] md:w-max"
              >
                <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">SEND MESSAGE</span>
                <FaPaperPlane className="relative z-10 ml-4 text-[var(--input-text)] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
