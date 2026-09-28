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
    role: "Software Engineer",
    description: "Currently working on the Meta View App. Previously on device updates and frameworks.",
    programmingLanguages: "Kotlin, Java, Hack, Swift, Objective-C, C++",
    additionalInfo: "Query Languages: SQLite, Presto\nDebugging IDEs: XCode, Android Studio, Visual Studio Code",
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
      "Shipped iOS/iPad app for scripture-linked study notes with real-time group collaboration and offline-first reading",
    longDescription:
      "Notes stay anchored to the passages that inspired them: single verses, ranges, and cross-chapter references that open the full text in context. Notes can be shared privately with users or study groups, discussed through real-time comments, or published publicly for discovery. The app ships a built-in KJV/ASV reader, caches content for offline use, and signs in with email, Google, or Apple. Live on the App Store with a companion website.",
    links: [
      { label: "website", url: "https://bibledevos.com/" },
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
];