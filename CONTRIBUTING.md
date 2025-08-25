# Contributing to Plateful

---

## Ground Rules & Code of Conduct

- Be respectful, inclusive, and collaborative.
- Follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
- Discussions should remain constructive and professional.
- All contributions must go through the issue → branch → pull request workflow (no direct commits to `main`).

---

## Filing a Bug Report

- Use the **Bug Report Issue Template**.
- Confirm the bug exists on the latest `main` branch before reporting.
- Provide clear steps to reproduce, expected vs actual behaviour, and screenshots/logs where possible.
- Label as `bug`.

---

## Suggesting a Feature

- Use the **Feature Request Issue Template**.
- Check existing issues to avoid duplication.
- Clearly explain the motivation, proposed solution, and expected impact.
- Label as `enhancement`.

**Note:**
Before creating a new issue or starting work on an existing one, check the open issues to see if there are any dependencies.

- If your work depends on another issue, or if your change blocks another issue, note this in a comment using:

  - `"Depends on #123"`
  - `"Blocks #123"`

- Coordinate with the contributor(s) working on related issues to avoid conflicts.
- Document all coordination and agreements in the issue comments so the whole team has visibility.

---

## Workflow for Code Contributions

We follow the **Fork & Pull Request** model:

1. **Fork and Clone** the repo:

   ```bash
   git clone https://github.com/<your-username>/<repo>.git
   git remote add upstream https://github.com/<team-org>/<repo>.git
   ```

2. **Create a branch** for each issue:

3. Make your **changes**, including tests and documentation

4. **Commit** with a clear message

5. **Pull** from upstream to stay in sync

6. **Push** your branch to your fork

7. Open a Pull Request (PR):

- PR title: short summary of the change (not just issue number).
- PR body: reference the issue (e.g. closes #15), provide more details about what changes have been made, include screenshots if relevant.

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

## Branch Naming Convention

To keep our history clean and consistent, all branches must follow the pattern:

**Types:**

- `feat/` → new features
- `fix/` → bug fixes
- `chore/` → maintenance, setup, tooling, minor changes
- `docs/` → documentation updates
- `test/` → adding or improving tests
- `refactor/` → code refactoring (no feature or bug fix)

**Examples:**

- `feat/add-search-page`
- `fix/navbar-bug`
- `chore/update-dependencies`
- `docs/contributing-guidelines`
- `test/add-auth-service-tests`

---

## Issue Naming Convention

All issues are encouraged to follow a consistent naming pattern:

`[Action] [Feature/Component] ([Scope])`

**Action examples:** Add, Create, Implement, Update, Fix, Refactor, Remove.  
**Feature/Component:** The specific functionality, page, or file being worked on.  
**Scope (optional):** Use `(frontend)`, `(backend)`, or `(documentation)` to clarify the area of work.

**Examples:**

- `Create CONTRIBUTING.md (documentation)`
- `Implement Search API (backend)`
- `Add Filtering UI (frontend)`
- `Fix Footer alignment (frontend)`

---

## Setting Up Your Environment

**Frontend**

1. cd frontend
2. Install dependencies: npm install
3. Run development server: npm run dev

**Backend**

1. cd backend
2. Set up your .env file
   ```bash
   cp .env.example .env
   ```

- Open .env and add your MongoDB Atlas connection string
  **Note:** Do not commit .env. This file contains secrets and is ignored by git. .env.example is there to show you the format.

3. Run the backend (Spring Boot)
   ```bash
   mvn spring-boot:run
   ```
4. The backend will start on http://localhost:8080. You should see logs that say Started BackendApplication and confirm MongoDB connection.

**Note:**

- You need Java 17 and Maven installed.
- If the app fails with MONGODB_URI not set, check that your .env file exists and contains valid credentials.
- For Windows PowerShell, you may need to reload your terminal after creating .env.

---

## Technical Requirements

- Static analysis: Fix issues flagged by SonarLint before committing.
- Security: Dependencies managed via npm (frontend) and maven (backend). Vulnerabilities monitored by Snyk.

---

## Types of Contributions

- Code contributions (features, bug fixes, refactors).
- Documentation improvements (README, wiki, comments).
- Test suite improvements.
- Accessibility, UI/UX improvements.

**Contributions we do not want:**

- Large, unreviewed changes directly to main.
- Low-value commits without tests or documentation.

---

## Getting Started as a Newcomer

- Join discussions in issues before starting work.
- Each contributor may only have one claimed issue at a time to avoid blocking others.

---

## Adding Dependencies to the Project

When introducing a new dependency, it is **your responsibility** to ensure it is added correctly so that other developers can install and use the project without issues.

Before adding a dependency, consider whether it is truly necessary. Unnecessary dependencies can increase bundle size, slow down installs, and introduce security vulnerabilities. Always check if the functionality can be achieved with existing dependencies or native features.

### Commands

Use the following commands when adding dependencies:

```bash
# For dev-only dependencies (e.g., testing, linting, build tools)
npm install <NEW_PACKAGE> --save-dev

# For regular runtime dependencies (packages required in production)
npm install <NEW_PACKAGE> --save
```

---

## Roadmap & Vision

- A1 (current): Core restaurant search app with landing, search, details, about, and contact pages.
- A2 (future): Advanced filters, transport integration, authentication, favourites, recommendations, reviews.
- Open issues are labeled A1 or A2 to indicate their release target.

---

## High-Level Architecture

- Frontend: React + Vite + TailwindCSS
- Backend: Spring Boot + MongoDB
- Quality Tools: SonarLint (IDE), SonarCloud (CI), Snyk (security).

---

## Communication

- Discuss features and bugs through GitHub Issues and Pull Requests.
- Weekly group meetings will be summarised in the Wiki.
- If you need help, comment on the relevant issue or PR and tag teammates.

---

## Search Filter API

All filterable search is done via:
GET /api/restaurants/filter

**Query Parameters**
All params are **optional** and **combinable**.

| Param         | Type               | Example                         | Notes                                                                                                                  |
| ------------- | ------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `query`       | `string`           | `query=pizza`                   | Keyword match on `name`, `description`, `cuisine` (case-insensitive). Applied **in-memory** after structured filters.  |
| `cuisine`     | `string`           | `cuisine=Italian`               | Case-insensitive partial match.                                                                                        |
| `priceMin`    | `number` (1–5)     | `priceMin=2`                    | Filters `price_level >= priceMin`.                                                                                     |
| `priceMax`    | `number` (1–5)     | `priceMax=4`                    | Filters `price_level <= priceMax`. Swaps values if `priceMin > priceMax`.                                              |
| `reservation` | `boolean`          | `reservation=true`              | Matches `reservation_required`.                                                                                        |
| `openNow`     | `boolean`          | `openNow=true`                  | Uses **Pacific/Auckland** time; parses `hours[day]` like `11:00-22:00`, handles overnight spans (e.g., `18:00-02:00`). |
| `city`        | `string[]` (multi) | `city=Auckland&city=Wellington` | Exact (case-insensitive) match on `address.city`. Pass multiple `city` params for OR matching.                         |

> Pagination: **not implemented yet**. You’ll get the full filtered list.

**Quick Examples**

- Basic Keyword Search:
  /api/restaurants/filter?query=sushi

- By cuisine:
  /api/restaurants/filter?cuisine=Italian

- Price range:
  /api/restaurants/filter?priceMin=2&priceMax=4

- Reservation Required:
  /api/restaurants/filter?reservation=true

- Open Now (NZ time):
  api/restaurants/filter?openNow=true

- Filter by one city:
  /api/restaurants/filter?city=Auckland

- Filter by multiple cities:
  /api/restaurants/filter?city=Auckland&city=Wellington

- Combine filters:
  /api/restaurants/filter?city=Auckland&cuisine=Japanese&priceMax=3&openNow=true
  OR
  /api/restaurants/filter?query=ramen&cuisine=Japanese&city=Auckland

**How to test in browser**
http://localhost:8080/api/restaurants/filter?city=Auckland&openNow=true

---

```

```
