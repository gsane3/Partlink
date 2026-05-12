# 04_SETUP_INSTRUCTIONS.md

## First Setup Instructions

These instructions assume a new empty GitHub repository.

## 1. Clone the empty repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

## 2. Create Next.js app in the repo

Run:

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Recommended answers:
- TypeScript: yes
- ESLint: yes
- Tailwind: yes
- App Router: yes
- src directory: yes
- import alias: `@/*`

## 3. Install useful UI packages

```bash
npm install lucide-react clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-slot
```

## 4. Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Recommended:
- style: new-york or default
- base color: slate
- CSS variables: yes

## 5. Add base shadcn components

```bash
npx shadcn@latest add button card input label badge tabs dropdown-menu dialog sheet separator textarea select checkbox switch table avatar skeleton
```

## 6. Add QR and scanner libraries for later UI phases

```bash
npm install qrcode.react @zxing/browser
```

## 7. Copy the starter markdown files

Copy these into the root of the repo:
- `CLAUDE.md`
- `README.md`

Create folders:
- `docs/`
- `prompts/`

Then copy:
- `docs/00_PRODUCT_RULES.md`
- `docs/01_UI_BUILD_PLAN.md`
- `docs/02_REVIEW_CHECKLIST.md`
- `docs/03_MOCK_DATA_RULES.md`
- `docs/04_SETUP_INSTRUCTIONS.md`
- `prompts/00_SETUP_PROMPT.md`
- `prompts/01_DESIGN_SYSTEM_PROMPT.md`
- `prompts/02_APP_SHELL_PROMPT.md`

## 8. Commit setup

```bash
git add .
git commit -m "Initial Partlink UI setup"
git push origin main
```

## 9. Open Claude Code in the repo

From inside the repo:

```bash
claude
```

## 10. Initialize Ruflo

Use the full Ruflo install path only if you want the complete orchestration loop:

```bash
npx ruflo@latest init --wizard
```

Then check that the generated files did not overwrite your `CLAUDE.md` in a bad way.

If Ruflo modifies `CLAUDE.md`, merge carefully. Do not lose the Partlink rules.

## 11. First Claude + Ruflo task

Give Claude the prompt in:

```text
prompts/00_SETUP_PROMPT.md
```

Do not ask it to build screens yet.

First output should only:
- verify repo structure
- set up constants
- set up mock data structure
- set up route constants
- set up basic folders
- prepare the project for UI work

## 12. After first output

Run:

```bash
npm run lint
npm run build
```

Then commit:

```bash
git add .
git commit -m "Prepare Partlink UI foundation"
git push
```

Send the GitHub link, branch and commit for review.
