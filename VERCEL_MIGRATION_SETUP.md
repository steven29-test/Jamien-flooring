# Vercel Migration Setup Guide

## CRITICAL: Action Items for YOU

You must complete these steps manually on GitHub and Vercel to finish the migration.

---

## STEP 1: Create Vercel Projects

1. **Go to https://vercel.com/dashboard**
2. **Create TWO projects:**
   - **Project 1: Stage Deployment**
     - Import from GitHub: `steven29-test/Jamien-flooring` → `Stage` branch
     - Project Name: `jamien-flooring-stage` (or similar)
     - Framework Preset: Vite
     - Root Directory: `./` (default)
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - **DO NOT deploy yet** — just create it and copy the Project ID
   
   - **Project 2: Production Deployment**
     - Import from GitHub: `steven29-test/Jamien-flooring` → `main` branch
     - Project Name: `jamien-flooring-prod` (or similar)
     - Framework Preset: Vite
     - Root Directory: `./` (default)
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - **DO NOT deploy yet** — just create it and copy the Project ID

---

## STEP 2: Get Your Vercel Credentials

From Vercel account settings (https://vercel.com/account/tokens):
- **VERCEL_TOKEN:** Your personal access token
- **VERCEL_ORG_ID:** Your organization/team ID

From each Vercel project (Project Settings → General):
- **VERCEL_PROJECT_ID_STAGE:** Project ID from Stage deployment project
- **VERCEL_PROJECT_ID_PROD:** Project ID from Production deployment project

---

## STEP 3: Add GitHub Repository Secrets

1. **Go to:** https://github.com/steven29-test/Jamien-flooring/settings/secrets/actions
2. **Add these 4 secrets:**

   | Secret Name | Where to get it |
   |-------------|-----------------|
   | `VERCEL_TOKEN` | From Vercel: Account Settings → Tokens |
   | `VERCEL_ORG_ID` | From Vercel: Team Settings or account page |
   | `VERCEL_PROJECT_ID_STAGE` | From Vercel: Stage project → Settings → General → Project ID |
   | `VERCEL_PROJECT_ID_PROD` | From Vercel: Production project → Settings → General → Project ID |

---

## STEP 4: Configure Production Domain

1. **For Production project on Vercel:**
   - Go to Project Settings → Domains
   - Add domain: `www.jamienflooring.com.au`
   - Update your domain registrar DNS to point to Vercel
   - (Vercel will provide DNS instructions during setup)

2. **Remove old GitHub Pages setup:**
   - Go to https://github.com/steven29-test/Jamien-flooring/settings/pages
   - Disable GitHub Pages
   - Delete old CNAME file from repository (if still present)

---

## STEP 5: Test Deployments

Once secrets are configured:

### Test Stage Deployment:
1. Make a small commit to the `Stage` branch and push
2. Watch the workflow at: https://github.com/steven29-test/Jamien-flooring/actions
3. Verify deployment completes
4. **VERIFY STAGE URL** shows:
   - ✅ Contact address: "Chaplin Drive Lane Cove, NSW 2066"
   - ✅ File upload feature visible in Contact form
   - ✅ All Stage-specific updates present

### Test Production Deployment:
1. Make a small commit to the `main` branch and push
2. Watch the workflow at: https://github.com/steven29-test/Jamien-flooring/actions
3. Verify deployment completes
4. **VERIFY PRODUCTION URL** (https://www.jamienflooring.com.au) shows:
   - ✅ Contact address shows original content
   - ✅ NO file upload feature (only original form)
   - ✅ All production content unchanged

---

## STEP 6: Merge Stage → Main (ONLY after Step 5 passes)

Once Stage is fully tested and verified:
1. Create Pull Request: `Stage` → `main`
2. Review changes (should only be workflow files)
3. Merge PR
4. Verify Production deployment succeeds and content matches Stage

---

## After Migration Complete

- ✅ Delete unused repos: `jamien-flooring-stage` and `jamien-flooring-prod` (when you have admin access)
- ✅ Monitor GitHub Actions for any workflow failures
- ✅ Test both sites regularly to ensure deployments work

---

## Quick Reference: Workflow Architecture

**Stage Branch:** 
- Triggers: Push to `Stage` branch
- Deploys to: Vercel Stage project
- URL: (Check Vercel project settings for deployment URL)

**Main Branch:**
- Triggers: Push to `main` branch
- Deploys to: Vercel Production project
- URL: https://www.jamienflooring.com.au

**Separation:** Each workflow uses separate Vercel project IDs, ensuring zero conflicts between Stage and Production.

---

## Troubleshooting

If workflows fail:
1. Check GitHub Actions tab for error messages
2. Verify all 4 secrets are added correctly (no typos, exact names)
3. Verify Vercel Project IDs are correct (copy from Vercel project settings)
4. Check Vercel project settings:
   - Stage project linked to `Stage` branch
   - Production project linked to `main` branch
5. Ensure build settings match (npm run build, output: dist)

---

## Workflows Updated

Updated `.github/workflows/deploy-stage.yml` and `.github/workflows/deploy-prod.yml` to use Vercel deployment.

Both workflows:
- Install dependencies: `npm ci`
- Build: `npm run build`
- Deploy to Vercel with `--prod` flag (production deployment)
- Use environment secrets for authentication

**Workflows are ready to use once you add the GitHub secrets!**
