export const ExperienceCards = [
  {
    logo: "/image/Meta_Platforms_Inc._logo.svg",
    company: "Meta",
    employment_time: "Aug 2022 - now",
    role: "Software Engineer",
    description: (
      <>
        <p>
          Currently working on the Meta View App. Previously on device updates and frameworks.
        </p>
        <br />
        <br />
        <p>
          <b>Programming Languages: </b>Kotlin, Java, Hack, Swift, Objective-C, C++
        </p>
        <p>
          <b>Query Languages: </b>SQLite, Presto
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

export const HighlightedProjectsCards = [
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
        <p>
          <b>Links: </b>
          <a href="https://gitlab.com/paulpan05/vulkan-numeric-libraries">
            numvk
          </a>{" "}
          <a href="https://gitlab.com/paulpan05/gpu-compute-libraries">
            numgpu
          </a>
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
        <p>
          <b>Links: </b>
          <a href="https://github.com/paulpan05/mlp-theano">mlp-theano</a>
        </p>
      </>
    ),
  },
];
