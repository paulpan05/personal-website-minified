export const Experience = [
  {
    logo: "/image/Meta_Platforms_Inc._logo.svg",
    company: "Meta",
    employment_time: "Aug 2022 - now",
    role: "Software Engineer",
    description: (
      <>
        <p>
          Most of my work at Meta&apos;s Reality Labs involves improving
          devices&apos; update / data syncing mechanisms. This involves
          understanding Android API&apos;s UpdateManager and PackageManager,
          along with understanding system apps development. I am also
          implementing the syncing mechanism between the iOS phone app and
          another device, which requires me to have a better understanding of
          how to debug iOS, Android, and SQLite tables.
        </p>
        <br />
        <br />
        <p>
          <b>Programming Languages: </b>Kotlin, Java, Swift, Hack
        </p>
        <p>
          <b>Databases: </b>SQLite
        </p>
        <p>
          <b>Tools: </b>DB Browser for SQLite, adb
        </p>
        <p>
          <b>Debugging IDEs: </b>XCode, Android Studio, Visual Studio Code
        </p>
      </>
    ),
  },
  {
    logo: "/image/Amazon_Web_Services_Logo.svg",
    company: "Amazon Web Services",
    employment_time: "June 2021 - Sept 2021",
    role: "Software Development Engineer Intern",
    description: (
      <>
        <p>
          I worked on an internal tool which helps developers automatically be
          granted IAM permissions based on the types of data they are requesting
          / the team they are in. Throughout the internship, I learned how to
          provision server instances at various stages in the pipeline, along
          with how to develop server-side rendered webpages.
        </p>
        <br />
        <br />
        <p>
          <b>Programming Languages: </b>Ruby, JavaScript
        </p>
        <p>
          <b>Frameworks and Databases: </b>Ruby on Rails, PostgreSQL
        </p>
        <p>
          <b>Tools: </b>Amazon S3, Amazon RDS
        </p>
      </>
    ),
  },
];

export const HighlightedProjects = [
  {
    short_description: "numvk and numgpu",
    medium_description:
      "Two parallel computing libraries meant to be hardware agnostic (numvk written \
        using only Vulkan and numgpu written using CUDA, Metal, and Vulkan Kompute)",
    long_description: (
      <>
        <p>
          This project is designed as a GPU alternative to the popular Python
          library numpy. The CUDA implementation uses kernels to run code on the
          GPU while the Metal and Vulkan implementations use MSL and GLSL
          shading languages to perform similar actions. The build automation
          system used here is CMake (which detects which build files to generate
          depending on the SDKs available and the operating system)
        </p>
        <br />
        <br />
        <p>
          <b>Programming Languages: </b>C++, Objective-C++, CUDA
        </p>
        <p>
          <b>Shading Languages: </b>MSL (Metal Shading Language), GLSL (OpenGL
          Shading Language)
        </p>
        <p>
          <b>Build Tools: </b>CMake, Ninja, XCode
        </p>
      </>
    ),
  },
  {
    short_description: "mlp-theano",
    medium_description:
      "Implementation of multi-layer perceptron using Theano, a \
      popular Python tensor library used in ML research.",
    long_description: (
      <>
        <p>
          This project implements the multilayer perceptron uses the library
          Theano. The purpose of this is to allow for GPU offloading of matrix
          operations, which speeds up training compared to numpy as well as
          being more simple to implement / maintain when compared to using
          libraries like PyTorch and Tensorflow.
        </p>
        <br />
        <br />
        <p>
          <b>Programming Languages: </b>Python
        </p>
        <p>
          <b>Libraries: </b>Theano
        </p>
      </>
    ),
  },
];
