# Deployment Workflow Guide

## Overview
Your repository now has a two-stage deployment pipeline:
- **Stage Branch** → Stage environment (for testing)
- **Main Branch** → Production environment (live site)

## Workflow Steps

### 1. Development & Testing on Stage

```bash
# Create a feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Make your changes
# Commit and push
git add .
git commit -m "Your commit message"
git push origin feature/your-feature-name
```

### 2. Merge to Stage for Testing

```bash
# Push to Stage branch for automated testing/deployment
git checkout Stage
git pull origin Stage
git merge feature/your-feature-name
git push origin Stage
```

**What happens automatically:**
- GitHub Actions workflow triggers
- HTML validation runs
- Deployment to stage environment (https://stage.jamien-flooring.com)
- Check workflow status in GitHub → Actions tab

### 3. Test in Stage Environment

- Visit https://stage.jamien-flooring.com
- Test all changes thoroughly
- Verify links and assets load correctly
- Confirm responsive design on different devices

### 4. Deploy to Production

Once Stage testing is complete:

```bash
# Merge Stage into main
git checkout main
git pull origin main
git merge Stage
git push origin main
```

**What happens automatically:**
- GitHub Actions workflow triggers
- HTML validation runs
- Deployment to production (https://jamien-flooring.com)
- Live site updates

## Branch Protection (Recommended)

To prevent accidental merges, set up GitHub branch protection:

1. Go to GitHub repository Settings → Branches
2. Add protection rules:
   - Require pull request reviews before merge
   - Require status checks to pass (CI/CD validation)
   - Dismiss stale pull request approvals

## Monitoring Deployments

1. Go to GitHub Actions tab
2. Select the workflow (stage-deploy or prod-deploy)
3. View logs and deployment status
4. Check workflow run times and results

## Rollback (If needed)

If something goes wrong on production:

```bash
# Revert the problematic commit
git checkout main
git revert <commit-hash>
git push origin main
```

The production site will automatically redeploy with the previous version.

## Current Setup

- **Stage Publish Branch:** gh-pages-stage
- **Production Publish Branch:** gh-pages
- **Stage Domain:** stage.jamien-flooring.com (configure in GitHub Pages settings)
- **Production Domain:** jamien-flooring.com

## DNS Configuration (If using custom domains)

For stage.jamien-flooring.com to work, you need:

1. A DNS CNAME record: `stage.jamien-flooring.com → steven29-test.github.io`
2. GitHub Pages settings configured to use the custom domain

Contact your DNS provider to add these records.
