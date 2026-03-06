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
    employmentTime: "Aug 2022 - now",
    role: "Software Engineer",
    description: "Currently working on the Meta View App. Previously on device updates and frameworks.",
    programmingLanguages: "Kotlin, Java, Hack, Swift, Objective-C, C++",
    additionalInfo: "Query Languages: SQLite, Presto\nDebugging IDEs: XCode, Android Studio, Visual Studio Code",
  },
  {
    logo: "/image/Amazon_Web_Services_Logo.svg",
    company: "Amazon Web Services",
    employmentTime: "June 2021 - Sept 2021",
    role: "Software Development Engineer Intern",
    description: "I worked on an internal tool which helps developers automatically be granted IAM permissions based on the types of data they are requesting / the team they are in. Throughout the internship, I learned how to provision server instances at various stages in the pipeline, along with how to develop server-side rendered webpages.",
    programmingLanguages: "Ruby, JavaScript",
    additionalInfo: "Frameworks and Databases: Ruby on Rails, PostgreSQL\nTools: Amazon S3, Amazon RDS",
  },
];

export const highlightedProjectsCards: HighlightedProjectCard[] = [
  {
    shortDescription: "numvk and numgpu",
    mediumDescription: "Two parallel computing libraries meant to be hardware agnostic (numvk written using only Vulkan and numgpu written using CUDA, Metal, and Vulkan Kompute)",
    longDescription: "This project is designed as a GPU alternative to the popular Python library numpy. The CUDA implementation uses kernels to run code on the GPU while the Metal and Vulkan implementations use MSL and GLSL shading languages to perform similar actions. The build automation system used here is CMake (which detects which build files to generate depending on the SDKs available and the operating system).",
    links: [
      { label: "numvk", url: "https://gitlab.com/paulpan05/vulkan-numeric-libraries" },
      { label: "numgpu", url: "https://gitlab.com/paulpan05/gpu-compute-libraries" },
    ],
  },
  {
    shortDescription: "mlp-theano",
    mediumDescription: "Implementation of multi-layer perceptron using Theano, a popular Python tensor library used in ML research.",
    longDescription: "This project implements the multilayer perceptron uses the library Theano. The purpose of this is to allow for GPU offloading of matrix operations, which speeds up training compared to numpy as well as being more simple to implement / maintain when compared to using libraries like PyTorch and Tensorflow.",
    links: [
      { label: "mlp-theano", url: "https://github.com/paulpan05/mlp-theano" },
    ],
  },
];