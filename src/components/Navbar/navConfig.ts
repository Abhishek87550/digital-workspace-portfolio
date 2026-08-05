export interface NavItem {
  label: string;
  id: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Achievements", id: "achievements" },
  { label: "Resume", id: "resume" },
  { label: "Contact", id: "contact" },
];

export const NAV_SECTION_IDS = NAV_ITEMS.map((item) => item.id);
