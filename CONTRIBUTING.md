# Contributing to Plateful

Thank you for helping improve Plateful! This document provides guidelines to help you get involved.

---

## Table of Contents

- [Ground Rules & Code of Conduct](#ground-rules--code-of-conduct)
- [Types of Contributions We're Looking For](#types-of-contributions-were-looking-for)
- [Getting Started as a Newcomer](#getting-started-as-a-newcomer)
- [Setting Up Your Environment](#setting-up-your-environment)
- [Technical Requirements](#technical-requirements)
- [High-Level Architecture](#high-level-architecture)
- [When Contributing (General Workflow)](#when-contributing-general-workflow)
- [When Creating Branches](#when-creating-branches)
- [Code Review Process](#code-review-process)
- [Running Tests](#running-tests)
- [Suggesting Features](#suggesting-features)
- [Reporting a bug](#reporting-a-bug)
- [Roadmap & Vision](#roadmap--vision)
- [License](#license)
- [Getting in Touch](#getting-in-touch)

---

## Ground Rules & Code of Conduct

- Be respectful, inclusive, and collaborative.
- Follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
- Discussions should remain constructive and professional.
- All contributions must go through the issue → branch → pull request workflow → review → squash merge.(no direct commits to `main`).

---

## Types of Contributions We're Looking For

- Code contributions (features, bug fixes, refactors).
- Documentation improvements (README, wiki, comments).
- Test and tooling improvements.
- Accessibility, UI/UX improvements.

**Contributions we do not want:**

- Large, unreviewed changes directly to main.
- Low-value commits without tests or documentation.

---

## Getting Started as a Newcomer

1. Find an issue labeled good first issue or help wanted.
2. Comment to claim it. Each contributor may only have one claimed issue at a time to avoid blocking others.
3. Join discussions to clarify questions on the issue before you start.

---

## Setting Up Your Environment

**Frontend** (React + Vite + Tailwind)

1. `cd frontend`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

**Backend** (Spring Boot + MongoDB)

1. `cd backend`
2. Set up your .env file: `cp .env.example .env`
   **Note:** Do not commit .env. This file contains secrets and is ignored by git. .env.example is there to show you the format.
3. `mvn spring-boot:run`

---

## Technical Requirements

- Secret hygiene: no API keys or .env files in git.
- Static analysis: fix issues flagged by SonarLint/linters before committing.
- Security: keep dependencies updated (npm & Maven).
- Tests: If possible, changes should include or update tests where relevant.

---

## High-Level Architecture

- Frontend: React(Vite) + TailwindCSS
- Backend: Spring Boot + MongoDB
- Quality Tools: SonarLint (IDE), SonarCloud (CI), Snyk (security).

---

## When Contributing (General Workflow)

1. **Fork and Clone** the repo, if its your first time working on an issue:

   ```bash
   git clone https://github.com/<your-username>/<repo>.git
   git remote add upstream https://github.com/<team-org>/<repo>.git
   ```

2. Ensure there’s an issue describing the problem or feature.

3. **Create a branch** for each issue from `upstream/main` (see next section)

4. Make your **changes**, including tests and documentation

5. Keep rebasing to stay current with `upstream/main`.

6. **Commit** with a clear message

7. Open a Pull Request (PR):

- PR Title: succinct summary of WHAT changed.
- PR Body: WHY + WHAT, with context and testing notes if needed.
- Must include: `Closes #<issue number>`.

8. Address review comments and squash merge when approved(enforced by branch protection).

---

## When Creating Branches

- Base all work on upstream/main
- Rebase early/often:
  ```bash
  git fetch upstream
  git rebase upstream/main
  ```
- Naming:
  - `feat/<short-desc>`
  - `fix/<short-desc>`
  - `docs/…`, `chore/…`, `test/…`, `refactor/…`
  - Examples: `feat/search-filters`, `fix/navbar-overlap`

---

## Code Review Process

Reviewers will:

1. Run the test suite and the application.
2. Check code readability, maintainability, and adherence to style.
3. Verify that commits are squashed and conflicts resolved.
4. Only merge once approval is granted.

**Important:**

- Every PR must be reviewed by at least one other team member before merging.
- Do not merge your own pull request without approval.

**Note:**

- All contributors have merge access to this repository.
- This decision was agreed upon by the entire team to ensure everyone can take ownership of their contributions and the review process.

---

## Running Tests

**Backend**

```bash
cd backend
mvn clean test
```

---

## Suggesting Features

- Use the **Feature Request Issue Template**.

**Before you start**

- Check existing issues to avoid duplication and to see if there are any dependencies.
- Coordinate with the contributor(s) working on related issues to avoid conflicts.
- Document all coordination and agreements in the issue comments so the whole team has visibility.

**Title format (Issue Naming Convention)**
Use a consistent, scannable title:
`[Action] [Feature/Component] ([Scope])`

**Examples**

- `Create CONTRIBUTING.md (documentation)`
- `Implement Search API (backend)`
- `Add Filtering UI (frontend)`
- `Fix Footer alignment (frontend)`

---

## Reporting a bug

- Use the **Bug Report Issue Template**.
- Confirm the bug exists on the latest `main` branch before reporting.
- Provide clear steps to reproduce, expected vs actual behaviour, and screenshots/logs where possible.
- Label as `bug`.

---

## Roadmap & Vision

- A1 (current): Core restaurant search app with landing, search, details, about, and contact pages.
- A2 (future): Advanced filters, transport integration, authentication, favourites, recommendations, reviews.
- Open issues are labeled A1 or A2 to indicate their release target.

---

## License

By contributing, you agree your contributions are licensed under the project’s LICENSE.
When you submit code changes, your submissions are understood to be under the same MIT License that covers the project. Feel free to contact the maintainers if that's a concern.

---

## Getting in Touch

- Create or comment on GitHub Issues or Pull Requests for technical discussions.
- Weekly group meetings will be summarised in the Wiki.
- If you need help, comment on the relevant issue or PR and tag teammates.

[↑ Back to top](#table-of-contents)

---
