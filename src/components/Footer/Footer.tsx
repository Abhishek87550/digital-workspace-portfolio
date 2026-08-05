const Footer = () => {
  return (
    <footer className="w-full py-8 bg-[var(--bg-primary)] text-center text-sm text-[var(--text-muted)] border-t border-[var(--nav-border)]">
      <p>© {new Date().getFullYear()} Abhishek Sharma. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
