This project is associated with the University of Auckland SOFTENG 310.

<!-- Improved compatibility of back to top link: See: https://github.com/UOA-DCML/se310-plateful/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/UOA-DCML/se310-plateful">
    <img width="334" height="317" alt="image" src="https://github.com/user-attachments/assets/8084cd0a-6953-463c-a70a-24266a1f876f" />
  </a>

  <h3 align="center">Plateful</h3>

  <p align="center">
    Plateful is a full-stack web application for discovering restaurants. It helps users find restaurants by name, cuisine, tags, and more, with a modern, responsive interface and a robust backend API.
    <br />
    <a href="https://github.com/UOA-DCML/se310-plateful/wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/UOA-DCML/se310-plateful/issues/new?template=bug_report.md">Report Bug</a>
    &middot;
    <a href="https://github.com/UOA-DCML/se310-plateful/issues/new?template=feature_request.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

<img width="2940" height="1458" alt="image" src="https://github.com/user-attachments/assets/24ceb135-54c4-4885-a62e-e0b346e7e95c" />

**Plateful** is a full-stack web app for discovering restaurants with search, filter, and favorites functionality.  
Built with a modern tech stack, it connects a React frontend, Spring Boot backend, and MongoDB database to deliver a smooth and responsive user experience.

**Key Features:**

- 🍽️ Search & filter restaurants by cuisine, tags, or name  
- ⭐ Save favorites for quick access  
- 🗺️ Map integration for location-based search  
- 📱 Responsive design with a clean UI  

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

- [![React][React.js]][React-url]
- [![Vite][Vite.js]][Vite-url]
- [![Spring Boot][SpringBoot]][SpringBoot-url]
- [![MongoDB][MongoDB]][MongoDB-url]
- [![TomTom][TomTom]][TomTom-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- Node.js & npm

  Download from [Node.js official site](https://nodejs.org/en) (v18+ recommended). Verify installation:

  ```sh
  node -v
  npm -v
  ```

- Java 17

  Install from [Oracle JDK](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html). Verify installation:

  ```sh
  java -version
  ```

- Maven 3.8+

  Download from [Maven official site](https://maven.apache.org/download.cgi). Verify installation:

  ```sh
  mvn -v
  ```

- MongoDB

  We use a MongoDB Atlas cluster to store user data. Contact a team member to get the connection string. Add it to your .env as:

  ```sh
  MONGODB_URI=<connection string>
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

#### Quick Start (Recommended)

1. Clone the repo

   ```sh
   git clone https://github.com/UOA-DCML/se310-plateful
   cd se310-plateful
   ```

2. Install dependencies

   ```sh
   npm run install:all
   ```

3. Start both frontend and backend

   ```sh
   npm start
   ```

4. Open your browser to <http://localhost:5173/>

That's it! Both services are now running. See [ROOT_COMMANDS.md](ROOT_COMMANDS.md) for all available commands.

#### Manual Installation (Alternative)

If you prefer to run services separately:

1. Clone the repo

   ```sh
   git clone https://github.com/UOA-DCML/se310-plateful
   ```

2. Navigate to the frontend folder and install npm packages

   ```sh
   cd frontend
   npm install
   ```

3. Now, make a new terminal and navigate to the backend folder and run SpringBoot

   ```sh
   cd backend
   mvn spring-boot:run
   ```

4. Go back to the frontend terminal, and start the application

   ```sh
   npm run dev
   ```

5. You can click the link on the terminal or can type <http://localhost:5173/> in your own browser

6. To test on other devices and host website

    ```sh
    npm run dev -- --host
    ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Available Commands

All commands can be run from the project root directory.

#### Installation

| Command | Description |
|---------|-------------|
| `npm run install:frontend` | Install frontend dependencies |
| `npm run install:all` | Install all project dependencies |

#### Development

| Command | Description |
|---------|-------------|
| `npm start` | Start both frontend & backend |
| `npm run dev:all` | Start both services (same as start) |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |

#### Building

| Command | Description |
|---------|-------------|
| `npm run build:all` | Build both (parallel) |
| `npm run build:sequential` | Build both (one after another) |
| `npm run build:frontend` | Build frontend only |
| `npm run build:backend` | Build backend only |

#### Testing

| Command | Description |
|---------|-------------|
| `npm run test:all` | Run all tests (parallel) |
| `npm run test:frontend` | Run frontend tests |
| `npm run test:backend` | Run backend tests |

#### Cleaning

| Command | Description |
|---------|-------------|
| `npm run clean:all` | Clean all build artefacts |
| `npm run clean:frontend` | Clean frontend (dist, node_modules) |
| `npm run clean:backend` | Clean backend (Maven clean) |

#### Other

| Command | Description |
|---------|-------------|
| `npm run lint:frontend` | Run ESLint on frontend |
| `npm run preview:frontend` | Preview production build |

For more detailed information, see [ROOT_COMMANDS.md](ROOT_COMMANDS.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### .env File

In order for Sonar to work, a .env file containing the API key must be placed in the backend folder. Please contact us (<jkan172@aucklanduni.ac.nz>) in order to get this .env file.

<!-- ROADMAP -->
## Roadmap

- [x] A1 Feature
- [x] A1 Feature
- [ ] A2 Feature
  - [ ] Feature
  - [ ] Feature

See the [open issues](https://github.com/UOA-DCML/se310-plateful/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors

<a href="https://github.com/UOA-DCML/se310-plateful/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=UOA-DCML/se310-plateful" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

- [Best-README_Template](https://github.com/UOA-DCML/se310-plateful?tab=readme-ov-file)
- Kelly Blincoe the GOAT!!! 🐐

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/UOA-DCML/se310-plateful.svg?style=for-the-badge
[contributors-url]: https://github.com/UOA-DCML/se310-plateful/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/UOA-DCML/se310-plateful.svg?style=for-the-badge
[forks-url]: https://github.com/UOA-DCML/se310-plateful/network/members
[stars-shield]: https://img.shields.io/github/stars/UOA-DCML/se310-plateful.svg?style=for-the-badge
[stars-url]: https://github.com/UOA-DCML/se310-plateful/stargazers
[issues-shield]: https://img.shields.io/github/issues/UOA-DCML/se310-plateful.svg?style=for-the-badge
[issues-url]: https://github.com/UOA-DCML/se310-plateful/issues
[license-shield]: https://img.shields.io/github/license/UOA-DCML/se310-plateful.svg?style=for-the-badge
[license-url]: https://github.com/UOA-DCML/se310-plateful/blob/master/LICENSE.txt
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/

[SpringBoot]: https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[SpringBoot-url]: https://spring.io/projects/spring-boot

[MongoDB]: https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/

[TomTom]: https://img.shields.io/badge/TomTom-FF0033?style=for-the-badge&logo=tomtom&logoColor=white
[TomTom-url]: https://developer.tomtom.com/

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
