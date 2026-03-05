# Single Repository + Vercel Deployment

## MUCH SIMPLER APPROACH ✅

You can deploy **both Stage and Production from the SAME repository** on Vercel. Here's how:

---

## STEP 1: Create ONE Vercel Project

1. **Go to https://vercel.com/dashboard**
2. **Import your repository once:**
   - GitHub: `steven29-test/Jamien-flooring`
   - Project Name: `jamien-flooring` (or similar)
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - **Production branch:** `main`

3. **After project is created, add the Stage environment:**
   - Go to Project Settings → Deployments
   - Add Preview deployment for `Stage` branch
   - OR: Vercel automatically creates preview deployments for all non-main branches

---

## STEP 2: Get Vercel Credentials

You only need **3 secrets** now (not 4):

| Secret Name | Where to get it |
|-------------|-----------------|
| `VERCEL_TOKEN` | Vercel: Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel: Team Settings or account page |
| `VERCEL_PROJECT_ID` | Vercel: Project Settings → General → Project ID |

---

## STEP 3: Add GitHub Secrets

1. **Go to:** https://github.com/steven29-test/Jamien-flooring/settings/secrets/actions
2. **Add these 3 secrets:**
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

---

## STEP 4: How Deployments Work

### Production Deployment:
- Push to `main` branch
- Vercel automatically deploys to **production**
- URL: `https://www.jamienflooring.com.au` (once domain is configured)

### Stage Deployment:
- Push to `Stage` branch
- Vercel automatically creates a **preview deployment**
- URL: `https://jamien-flooring-<random-id>.vercel.app` (or custom Stage domain if configured)

Both deployments happen **automatically** — no extra workflow needed beyond basic push notification!

---

## STEP 5: Configure Production Domain

1. **In Vercel Production project:**
   - Go to Settings → Domains
   - Add domain: `www.jamienflooring.com.au`
   - Configure DNS at your domain registrar
   - Vercel will provide specific DNS instructions

2. **Remove GitHub Pages:**
   - Go to GitHub: Settings → Pages
   - Disable GitHub Pages

---

## STEP 6: (Optional) Configure Stage Domain

If you want a custom domain for Stage instead of the preview URL:

1. **In Vercel project:**
   - Go to Settings → Domains
   - Add domain: `stage.jamienflooring.com.au` (or similar)
   - Add to preview environment (not production)

2. **Update domain registrar DNS**

---

## Workflow Configuration

**Single workflow file** that handles both branches:

- `.github/workflows/deploy-stage.yml` — Triggers on push to `main` or `Stage`
- Vercel action automatically detects the branch
- `--prod` flag ensures all deployments are production builds (not preview)

---

## Advantages of Single-Repo Approach

✅ **Simpler:** One Vercel project instead of two
✅ **Fewer secrets:** 3 instead of 4
✅ **Automatic:** Push to branch = instant deployment
✅ **Cleaner:** No separate deployment repos needed
✅ **Better staging:** Preview deployments built-in
✅ **Less maintenance:** Fewer resources to manage

---

## What Stays the Same

✅ **Stage branch** has updated contact info (Chaplin Drive) + file upload feature
✅ **Main branch** is production with original content
✅ **Complete separation:** Different URLs, different deployments, no conflicts

---

## Quick Checklist

- [ ] Create **ONE** Vercel project (import `steven29-test/Jamien-flooring`)
- [ ] Copy Project ID from Vercel
- [ ] Add **3 GitHub secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- [ ] Verify `main` branch deploys to production
- [ ] Verify `Stage` branch deploys to preview
- [ ] Configure production domain (`www.jamienflooring.com.au`)
- [ ] (Optional) Configure stage domain
- [ ] Merge `Stage` → `main` after testing

---

## Troubleshooting

**Deployments not triggering?**
- Check GitHub secrets are named correctly
- Check Project ID matches Vercel project
- Check GitHub Actions tab for errors

**Wrong branch deploying?**
- Vercel automatically routes main → production, others → preview
- Check Vercel project settings

**Production domain not working?**
- Verify DNS is updated at domain registrar
- Allow 24-48 hours for DNS propagation
- Check Vercel domain verification

---

**Updated workflow is ready! Much simpler now.** 🎉
