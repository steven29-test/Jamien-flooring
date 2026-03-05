# DEPLOYMENT TO VERCEL - DONE

## What's Ready

✅ Code: Clean, tested, builds successfully
✅ Workflow: `.github/workflows/deploy.yml` (triggers on Stage + main branch push)
✅ Config: `vercel.json` with build settings
✅ Stage Content: Chaplin Drive address + file upload feature
✅ Production Content: Original address, no file upload

## What You Need (3 steps - 5 minutes)

### 1. Create Vercel Project
- Go: https://vercel.com/dashboard
- Click: "Add New" → "Project"
- Import: steven29-test/Jamien-flooring
- Click Import
- Copy the **Project ID** from project settings

### 2. Add 3 GitHub Secrets
Go: https://github.com/steven29-test/Jamien-flooring/settings/secrets/actions

Secret 1: VERCEL_TOKEN
Secret 2: VERCEL_ORG_ID
Secret 3: VERCEL_PROJECT_ID (from step 1)

Check SETUP_VERCEL.txt in repo for exact values.

### 3. Configure Production Domain
- Vercel project → Settings → Domains
- Add: www.jamienflooring.com.au
- Update DNS at domain registrar

## How It Works After Setup

- Push to Stage branch → Vercel preview deployment
- Push to main branch → Vercel production deployment
- Content stays completely separate

## Verify After Deployment

Stage URL:
- Address: Chaplin Drive Lane Cove, NSW 2066
- Contact form has file upload
- Phone: 0435 116 503

Production URL:
- Address: Unit 1, 123 Pacific Hwy, Artarmon
- Contact form NO file upload
- Phone: 02 8000 0000

---

3 steps. Done.
