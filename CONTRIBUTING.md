# Contributing to WiChat

All information related to contributing to the project can be found in this file. It is **mandatory** to read it before contributing to the project in order to follow the conventions and make the development process easier for everyone. Thank you for your understanding!

- [Contributing to WiChat](#contributing-to-wichat)
	- [Getting the Project](#getting-the-project)
	- [Installation \& Launch](#installation--launch)
		- [Via Docker](#via-docker)
			- [Prerequisites](#prerequisites)
				- [Install WSL to use Docker on Windows](#install-wsl-to-use-docker-on-windows)
				- [Install Docker on Linux/WSL](#install-docker-on-linuxwsl)
			- [Launch Docker Composition](#launch-docker-composition)
		- [Locally (not recommended)](#locally-not-recommended)
	- [Technical Design](#technical-design)
		- [Development Environment](#development-environment)
	- [Project Conventions](#project-conventions)
		- [Versioning](#versioning)
		- [Git](#git)
		- [Code](#code)
			- [Indentation](#indentation)
			- [Code Quality](#code-quality)
	- [Documentation Front-end](#documentation-front-end)
		- [Svelte Structure](#svelte-structure)
		- [Application Logic](#application-logic)
	- [API Documentation](#api-documentation)

## Getting the Project

The project is hosted in an online repository. It is recommended to associate your SSH keys with your account to clone the project via SSH for security reasons, but it is also possible to clone it via HTTPS.

Navigate to the folder where you want to clone the project (after creating it):  
On Windows:

```bat
cd %userprofile%\Documents\Projects\WiChat\
```

On Linux:

```bash
cd ~/WiChat/
```

Clone via SSH:  

```bash
git clone git@github.com:WiChatApp/wc-front-svelte.git
```

Clone via HTTPS

```bash
git clone https://github.com/WiChatApp/wc-front-svelte.git
```

## Installation & Launch

### Via Docker

The application can run in a Docker container. To do this, you need to install Docker and Docker Compose, then launch the Docker composition.

Running the project directly locally is less recommended as it requires time-consuming installation and configuration of several applications (Node/NPM/NVM). Therefore, using Docker to launch the application is preferred.

#### Prerequisites

To launch the project via Docker, Docker and Docker Compose must be installed, which are not directly available on Windows (at least not via command line).

##### Install WSL to use Docker on Windows

You can use WSL (Windows Subsystem for Linux) to install Debian on which Docker and Docker Compose will be installed:

```bat
REM Set the WSL version to use (we use version 2 to be able to use Docker)
wsl --set-default-version 2
REM Install WSL
wsl --install -d Debian
REM Launch WSL
wsl
```

##### Install Docker on Linux/WSL

```bash
# Update the package list
sudo apt-get update
# Upgrade already installed packages
sudo apt-get upgrade
# Remove old versions of Docker
sudo apt remove docker docker-engine docker.io containerd runc

# Install necessary dependencies
sudo apt install --no-install-recommends apt-transport-https ca-certificates curl gnupg2
# Get the Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh
# Run the Docker installation script
sudo sh get-docker.sh

# Ensure Docker starts at machine startup
sudo systemctl enable docker
# Start the Docker service
sudo service docker start

# Verify Docker is installed correctly
sudo docker run --rm hello-world
```

To execute Docker-related commands, the user must have docker group rights (or execute as `root`).
If it doesn't already exist, create the docker group:

```bash
sudo groupadd docker
```

Then, add your user to the docker group:

```bash
sudo usermod -aG docker $USER
```

#### Launch Docker Composition

The project is organized to directly identify files related to Docker and those related to the application.
The Dockerfiles are located in a [.docker](.docker/) folder and then in a subfolder related to the concerned image and environment (Example: [.docker/svelte/Dockerfile.dev](.docker/svelte/Dockerfile.dev)). There is a [.docker/docker-compose.yml](.docker/docker-compose.yml) file in the .docker folder that contains the interaction rules between the different containers necessary for the application's operation.
There is also a [.dockerignore](.docker/.dockerignore) file that allows ignoring certain files when copying the application's source files into their respective Docker containers.

To launch the application, navigate to the Docker configuration folder and launch the Docker Compose container via the prepared script:

```bash
cd ./.docker
./docker-start.sh
```

The [docker-compose.yml](.docker/docker-compose.yml) file will then execute the application's Dockerfile configuration (Example: [.docker/svelte/Dockerfile.dev](.docker/svelte/Dockerfile.dev)).

Once the container is launched, it is possible to explore it from the inside and execute commands via the shell:

```bash
sudo docker exec -it wc-svelte sh
```

### Locally (not recommended)

1. Install Node Package Manager (NPM) and Node.js (NVM is recommended for managing Node.js versions)
2. Install dependencies with `npm install` in the [svelte](svelte/) folder
3. Make sure the backend is running and that the adress/ports are configured in [.env.dev](.docker/svelte/.env.dev)
4. Run the application with `npm run dev` in the [svelte](svelte/) folder
5. The application is accessible at `http://localhost:5173`

## Technical Design

### Development Environment

For reference, here are the latest tested versions of the applications used for the project:

| Component     | Version     |
|---------------|-------------|
| Node.js       | 22.1.0      |
| Svelte        | 4.2.18      |

## Project Conventions

### Versioning

This project adheres to [Semantic Versioning](https://semver.org/). The version number is composed of three parts: major, minor, and patch. The version number is incremented according to the following rules:

- Major: making all related apps in previous versions incompatible with the current version
- Minor: added functionality in a backwards-compatible manner
- Patch: backwards-compatible bug fixes

Generally, versions must be incremented according to the following rules:

- breaking change: +1.0.0
- new feature: +0.1.0
- bug fix: +0.0.1
- other (refactor, indentation, ...): +0.0.01

### Git

⚠️ **Warning**: Always test your code and try to remove errors/warnings before commiting and/or submitting a pull request.  

- Commits should clearly describe their content and remain short. The commit message should be in English and include both the type of commit and the scope of the changes. If the change is global or not related to a specific feature/place in the code, the scope is optionnal.  
  ⚠️If the changes are related to an issue, the scope **must** be the issue number.
  - [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
    - `feat(scope)`: new feature (e.g., *feat(#1): authentication*)
    - `fix(scope)`: bug fix (e.g., *fix(#2): fixed communication problem regarding login*)
    - `docs(scope)`: documentation (e.g., *docs(#3): updated README*)
    - `style(scope)`: changes that do not affect the code (spacing, formatting, etc.) (e.g., *style: fixed indentation*)
    - `refactor(scope)`: code changes that neither fix a bug nor add a feature (e.g., *refactor(#5): optimized code*)
    - `perf(scope)`: performance improvement (e.g., *perf(#6): improved speed*)
    - `test(scope)`: adding or modifying tests (e.g., *test(#7): added unit tests*)
    - `conf(scope)`: build configuration changes (e.g., *conf(#8): updated Dockerfile*)
    - `chore(scope)`: changes to the development environment or project organization (e.g., *chore(#9): updated .gitignore*)
- Every branch must be associated with one type of change (see below) and be created from the `develop` branch. Everytime you finish changes on a branch, you must have it reviewed and merged back into `develop` so that the branch can be deleted and the changes can be integrated into the project. When enough features are ready, it is then possible to merge `develop` into `release/x.x.x` depending on the version number, then make small changes on the release branch in case of bugs, and finally merge the release branch into `main` to deploy the changes.
  - [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
    - `feat/xxxx-name-of-the-feature`: New feature referenced by the issue number and a short description (e.g., `feat/1-authentication`)
    - `fix/xxxx-name-of-the-fix`: Bug fix referenced by the issue number and a short description (e.g., `fix/2-login-error`)
    - `docs/xxxx-name-of-the-docs`: Documentation referenced by the issue number and a short description (e.g., `docs/3-readme`)
    - `style/xxxx-name-of-the-style`: Style changes referenced by the issue number and a short description (e.g., `style/4-indentation`)
    - `refactor/xxxx-name-of-the-refactor`: Refactoring referenced by the issue number and a short description (e.g., `refactor/5-optimization`)
    - `perf/xxxx-name-of-the-perf`: Performance improvement referenced by the issue number and a short description (e.g., `perf/6-speed`)
    - `test/xxxx-name-of-the-test`: Test changes referenced by the issue number and a short description (e.g., `test/7-unit`)

### Code

#### Indentation

Indentation must be done with tabs and not spaces.  
Use the [Prettier](https://prettier.io/) code formatter to ensure consistent code style. [Prettier for VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

#### Code Quality

- Use LF line endings
- Your code must be as modulable and easily reusable as possible.
- Files should be grouped into a folder hierarchy according to their role
- Your code must be as self-explanatory as possible. If you cannot find a way to make it so, comment "why" and not "how" you did it
- Explicitly name variables and functions (which should remain short) to avoid the need for comments
- File, folder, variable names, and code in general must be in English
- Comments must be in English
- Variables and functions must follow the conventions of their respective language
  - HTML:
    - [Code Guide](https://codeguide.co/#html-syntax)
    - Headings h1, h2, h3, etc. should be used in order within the same section to maintain a logical hierarchy even without CSS.
  - CSS & SCSS:
    - kebab-case
    - Component isolation (similar to BEM to avoid conflicts in case of global styles)
    - Stylesheets should handle presentation, not logic (which should be delegated to HTML).
  - TypeScript:
    - camelCase
    - Use arrow functions only for anonymous functions.
    - Use the most backwards-compatible features possible.
    - Type variables and functions as much as possible.

## Documentation Front-end

The project is developed in Svelte, a JavaScript framework for building user interfaces. Svelte allows creating reusable components and organizing them in a hierarchy to create dynamic user interfaces (UI), similar to React or Vue.js.

### Svelte Structure

The project is divided into several parts based on the roles of the code:

- [static](svelte/static): static files (images, videos, etc.)  
 NOTE: It is mandatory to use this folder for static files, as Svelte does not detect certain files otherwise (e.g., fonts). Static files are copied into the `public` folder during the application's build process.
- [src](svelte/src): the application's source code
  - [src/common](svelte/src/common): shared utilities, constants & types
    - [src/common/classes](svelte/src/common/classes): shared TypeScript classes (data models, etc.)
    - [src/common/tools](svelte/src/common/tools): shared utility functions
  - [src/components](svelte/src/components): reusable components
    - [src/components/elements](svelte/src/components/elements): basic components (icons, buttons, text fields, etc.)
    - [src/components/structure](svelte/src/components/structure): structural components (navigation bar, footer, etc.)
    - [src/components/composite](svelte/src/components/composite): complex components composed of multiple elements
  - [src/pages](svelte/src/pages): application pages (composed of components)
  - [src/style](svelte/src/style): global style files (CSS, SCSS, etc.), the selected theme, and its associated variables

### Application Logic

Components are supposed to contain only properties, event propagators, and rendering functions. Pages contain the application's logic and use events & data to make components react.  
Data logic is separated as much as possible from the UI logic to facilitate testing and reuse.
When the user logs in with the admin account, they can access the test page by clicking on the card name that appears when clicking the avatar icon in the navigation bar. This test page contains information about data representation and components as well as examples of event reactions. Each component on the test page is fully utilized to serve as an example of reuse.

## API Documentation

This application communicates with a REST API developed in the repository containing its documentation: [wc-back-symfony](https://github.com/WiChatApp/wc-back-symfony).
