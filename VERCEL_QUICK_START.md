# Vercel Migration - QUICK START CHECKLIST

## YOUR ACTION ITEMS (Do These Now)

### 1️⃣ Create Vercel Projects
- [ ] Go to https://vercel.com/dashboard
- [ ] Create project: `jamien-flooring-stage` (GitHub: Stage branch, Vite framework)
- [ ] Create project: `jamien-flooring-prod` (GitHub: main branch, Vite framework)
- [ ] Note down both **Project IDs**

### 2️⃣ Add GitHub Secrets
- [ ] Go to https://github.com/steven29-test/Jamien-flooring/settings/secrets/actions
- [ ] Add secret: `VERCEL_TOKEN` = (your Vercel token)
- [ ] Add secret: `VERCEL_ORG_ID` = (your Vercel org ID)
- [ ] Add secret: `VERCEL_PROJECT_ID_STAGE` = (Stage project ID from step 1)
- [ ] Add secret: `VERCEL_PROJECT_ID_PROD` = (Production project ID from step 1)

### 3️⃣ Test Stage Branch
- [ ] Make a test commit to `Stage` branch and push
- [ ] Check GitHub Actions workflow runs successfully
- [ ] Verify Stage URL shows:
  - Address: "Chaplin Drive Lane Cove, NSW 2066"
  - File upload feature in Contact form

### 4️⃣ Configure Production Domain
- [ ] In Vercel Production project → Settings → Domains
- [ ] Add domain: `www.jamienflooring.com.au`
- [ ] Follow Vercel DNS setup instructions
- [ ] Go to GitHub Settings → Pages → Disable GitHub Pages
- [ ] Verify production deployment works

### 5️⃣ Merge Stage → Main
- [ ] Create PR: `Stage` → `main`
- [ ] Merge PR
- [ ] Verify Production URL works: https://www.jamienflooring.com.au

### 6️⃣ Cleanup
- [ ] Delete unused repos: `jamien-flooring-stage` and `jamien-flooring-prod`

---

## What's Ready Now

✅ GitHub Actions workflows updated (`.github/workflows/`)
✅ Stage branch has all updates (new address, file upload feature)
✅ Main branch is unchanged (ready for production)
✅ Setup guide created: `VERCEL_MIGRATION_SETUP.md`

---

## Key Files Changed

- `.github/workflows/deploy-stage.yml` → Now deploys to Vercel
- `.github/workflows/deploy-prod.yml` → Now deploys to Vercel
- `VERCEL_MIGRATION_SETUP.md` → Detailed setup instructions
- `src/data/catalog.json` → Stage branch has updated contact info (Chaplin Drive)
- `src/pages/Contact.tsx` → Stage branch has file upload feature

---

## Important Reminders

🔴 **DO NOT merge Stage to main until:**
- Both Vercel projects are created
- All GitHub secrets are added
- Stage URL is tested and verified
- Production domain is configured

🟢 **Stage and Production are completely separate:**
- Different Vercel projects
- Different GitHub branches
- Different URLs (once production domain is set)
- No conflicts or redirects

---

## Help & Troubleshooting

**Workflow fails?**
- Check GitHub Actions logs
- Verify all 4 secrets are named correctly
- Check Project IDs match Vercel projects

**Secret detection blocking push?**
- This is GitHub's security feature catching secrets
- Click the provided link to allow/remediate

**Need help?**
- Refer to `VERCEL_MIGRATION_SETUP.md` for detailed steps
- Check Vercel docs: https://vercel.com/docs
- Check GitHub Actions docs: https://docs.github.com/actions
