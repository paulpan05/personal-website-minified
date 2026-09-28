export interface ExperienceCard {
  logo: string;
  company: string;
  employmentTime: string;
  role: string;
  description: string;
  programmingLanguages: string;
  additionalInfo?: string;
}

export interface HighlightedProjectCard {
  shortDescription: string;
  mediumDescription: string;
  longDescription: string;
  links: { label: string; url: string }[];
}

export const experienceCards: ExperienceCard[] = [
  {
    logo: "/image/Meta_Platforms_Inc._logo.svg",
    company: "Meta",
    employmentTime: "Aug 2022 – Present",
    role: "Software Engineer (Junior → Mid-Level → Senior)",
    description: "Applied AI org (since June 2026); previously Mobile GraphQL Infra. Three years in Reality Labs across Devices, the Companion app, and the Meta AI app platform.",
    programmingLanguages: "Kotlin, Java, Hack, Swift, C++",
    additionalInfo: "June 2026 – Present: Senior, Applied AI org\nAug 2025 – June 2026: Senior, Mobile GraphQL Infra\nMar 2024 – Aug 2025: Mid-Level, Reality Labs (Devices, then Companion App & Meta AI App Platform)\nAug 2022 – Mar 2024: Junior, Reality Labs – Devices (Boston area)",
  },
  {
    logo: "/image/Amazon_Web_Services_Logo.svg",
    company: "Amazon Web Services",
    employmentTime: "June 2021 – Sept 2021",
    role: "Software Development Engineer Intern",
    description: "I worked on an internal tool which helps developers automatically be granted IAM permissions based on the types of data they are requesting / the team they are in. Throughout the internship, I learned how to provision server instances at various stages in the pipeline, along with how to develop server-side rendered webpages.",
    programmingLanguages: "Ruby, JavaScript",
    additionalInfo: "Frameworks and Databases: Ruby on Rails, PostgreSQL\nTools: Amazon S3, Amazon RDS",
  },
];

export const highlightedProjectsCards: HighlightedProjectCard[] = [
  {
    shortDescription: "BibleDevos",
    mediumDescription:
      "Shipped scripture-linked study-notes app on web and iOS, with real-time group collaboration and offline-first reading (Android in closed testing)",
    longDescription:
      "Notes stay anchored to the passages that inspired them: single verses, ranges, and cross-chapter references that open the full text in context. Notes can be shared privately with users or study groups, discussed through real-time comments, or published publicly for discovery. The app ships a built-in KJV/ASV reader, caches content for offline use, and signs in with email, Google, or Apple. The same product ships as a web app and a native iOS app; the Android build is in closed testing (Play approval pending the 12-tester requirement).",
    links: [
      { label: "web app", url: "https://bibledevos.com/" },
      {
        label: "App Store",
        url: "https://apps.apple.com/us/app/bibledevos/id6759275734",
      },
    ],
  },
  {
    shortDescription: "numvk and numgpu",
    mediumDescription:
      "Explorations in hardware-agnostic GPU compute: a Vulkan device bootstrap plus one element-wise kernel across CUDA and HIP backends",
    longDescription:
      "Two related experiments, both early-stage. numvk implements Vulkan instance, physical-device, logical-device, and command-pool setup with a single GLSL power shader and a shader-loading test. numgpu implements vector power across CUDA and HIP, with the Metal and Vulkan/Kompute backends still stubs. CMake build with shader compilation and Catch2 tests.",
    links: [
      { label: "numvk", url: "https://gitlab.com/paulpan05/vulkan-numeric-libraries" },
      { label: "numgpu", url: "https://gitlab.com/paulpan05/gpu-compute-libraries" },
    ],
  },
  {
    shortDescription: "Hackathon wins",
    mediumDescription:
      "Two winner-ribbon builds on Devpost: SideTrack and Platypus, plus iConfession and Easy Tour across four hackathons",
    longDescription:
      "SideTrack — optimized pothole detection through user collaboration (Winner). Platypus — a browser companion surfacing CVEs and vulnerabilities of the sites being visited (Winner). Also built iConfession and Easy Tour.",
    links: [
      { label: "Devpost profile", url: "https://devpost.com/paulpan05" },
      { label: "SideTrack", url: "https://devpost.com/software/sidetrack" },
      { label: "Platypus", url: "https://devpost.com/software/slo-hacks-2020" },
    ],
  },
];