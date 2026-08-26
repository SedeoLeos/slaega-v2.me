/**
 * Certifications — shown on the site (About) and in generated CVs.
 *
 * Names are proper nouns (language-neutral) so they render identically in FR
 * and EN CVs. Only REAL certifications provided by the owner are listed here —
 * never invented. `verified: false` marks entries whose exact title still needs
 * confirmation (the credential page was not machine-readable from here).
 */

export type Certification = {
  /** Certificate / course title. */
  name: string;
  /** Issuing organisation. */
  issuer: string;
  /** Year obtained, if known. */
  year?: string;
  /** Public verification URL. */
  url?: string;
  /** Short topic tag (helps ordering / relevance in the CV). */
  topic?: string;
  /** false = exact title still to be confirmed by the owner. */
  verified?: boolean;
};

// Ordered most-relevant first (DevOps / cloud / backend lead the profile).
export const CERTIFICATIONS: Certification[] = [
  {
    name: "DevOps 101: What is DevOps?",
    issuer: "Simplilearn (SkillUp)",
    year: "2024",
    topic: "DevOps",
    url: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiIzMjc1IiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvdGh1bWJfNzM5MjUyMV8xNzI2OTA5MTQ4LnBuZyIsInVzZXJuYW1lIjoiU1x1MDBlOWJhIEdlZGVvbiBNYXRzb3VsYSBNYWxvIn0%3D",
    verified: true,
  },
  {
    name: "Jenkins, From Zero To Hero",
    issuer: "Udemy",
    topic: "CI/CD",
    url: "https://www.udemy.com/certificate/UC-3b76194e-e281-40f6-ad8a-12bab7e10a02/",
    verified: false,
  },
  {
    name: "Grafana",
    issuer: "Udemy",
    topic: "Observability",
    url: "https://www.udemy.com/certificate/UC-503605cc-6b44-4e49-8e6b-43eb2c70dd98/",
    verified: false,
  },
  {
    name: "Git & GitHub",
    issuer: "Udemy",
    topic: "DevOps",
    url: "https://www.udemy.com/certificate/UC-e2aaf5f5-b260-4a11-959d-ab6b1034c8bb/",
    verified: false,
  },
  {
    name: "Cisco — Networking / Security badge",
    issuer: "Cisco",
    topic: "Networking",
    url: "https://www.credly.com/badges/399d8011-05c7-4596-a300-5e8c6c039d8a/public_url",
    verified: false,
  },
  {
    name: "API Fundamentals Student Expert",
    issuer: "Postman",
    topic: "API",
    url: "https://badges.parchment.com/public/assertions/O1mgJRzESuWbiPCJYrOvfA",
    verified: false,
  },
  {
    name: "Back End Development and APIs",
    issuer: "freeCodeCamp",
    topic: "Backend",
    url: "https://www.freecodecamp.org/certification/Slaega/back-end-development-and-apis",
    verified: true,
  },
  {
    name: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    topic: "JavaScript",
    url: "https://www.freecodecamp.org/certification/Slaega/javascript-algorithms-and-data-structures",
    verified: true,
  },
  {
    name: "Go (Golang)",
    issuer: "Great Learning",
    topic: "Backend",
    url: "https://www.mygreatlearning.com/certificate/ZMJZLEJZ",
    verified: false,
  },
  {
    name: "HackerRank — Skill Certificate",
    issuer: "HackerRank",
    topic: "Software Engineering",
    url: "https://www.hackerrank.com/certificates/ca17e731f27a",
    verified: false,
  },
  {
    name: "HackerRank — Skill Certificate",
    issuer: "HackerRank",
    topic: "Software Engineering",
    url: "https://www.hackerrank.com/certificates/87cc6ec64f67",
    verified: false,
  },
];
