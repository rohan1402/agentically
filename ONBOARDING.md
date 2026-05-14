# Client Onboarding Requirements
**Healthcare Standards Agent** · Internal Use Only
**Product:** Rohan Pant · **Sales:** Siddhant Rawat

---

## Overview

This document defines everything we need from a new client to get them live. Siddhant collects this during the sales/discovery call. Rohan uses it to set up the environment.

Target: **client live within 1 week of signing.**

---

## Phase 1 — Discovery Call (Siddhant)

Collect the following before any technical work begins:

### 1. Documents
- [ ] What compliance documents do they use? (NIAHO, Joint Commission, CMS, internal SOPs, all of the above?)
- [ ] In what format? (PDF preferred — Word, HTML also supported)
- [ ] How many documents / total pages (rough estimate)?
- [ ] How often do documents get updated? (annually, quarterly, ad hoc?)
- [ ] Who is responsible for keeping documents current on their end?

### 2. Users & Access
- [ ] How many staff will use the agent?
- [ ] What roles? (compliance officers, nurses, administrators, surgeons?)
- [ ] Do different roles need access to different document sets?
- [ ] Any staff who should NOT have access?

### 3. Integration
- [ ] Where do they want the agent to live?
  - [ ] Standalone web app (we host)
  - [ ] Embedded in their intranet/portal
  - [ ] Slack or Microsoft Teams bot
  - [ ] API only (they build their own UI)
- [ ] Do they have an IT team we can coordinate with?
- [ ] Any existing SSO / identity provider? (Okta, Azure AD, Google Workspace?)

### 4. Data & Security
- [ ] Can data leave their servers? (cloud-hosted OK, or must be on-premise?)
- [ ] Any HIPAA / data residency requirements?
- [ ] Do they need SOC 2 compliance from us? (note: we don't have this yet)
- [ ] Who is their data privacy / IT security contact?

### 5. Volume & SLA
- [ ] Expected queries per day / month?
- [ ] Any uptime requirements? (e.g., 99.9% SLA?)
- [ ] Acceptable response time? (our current: 3–8 seconds)

### 6. Budget & Timeline
- [ ] What's their budget range for the pilot?
- [ ] When do they need it live by?
- [ ] Who signs off on the contract?

---

## Phase 2 — Technical Setup (Rohan)

Once discovery is complete and agreement is signed:

### Checklist

- [ ] Receive documents from client (secure transfer — no email attachments for sensitive docs)
- [ ] Run `npm run seed` to index documents into MongoDB Atlas
- [ ] Verify chunk count and section coverage look correct
- [ ] Spin up dedicated web environment (new Vercel project or separate deployment)
- [ ] Configure environment variables for the client's instance
- [ ] Set up basic access control (password protection at minimum for pilot)
- [ ] Run 5–10 test queries against their specific documents to verify quality
- [ ] Share demo URL + login with Siddhant for client handoff

### Time estimates

| Task | Time |
|------|------|
| Document indexing (seeding) | 30 min – 2 hours (depends on doc size) |
| Environment setup | 1–2 hours |
| Testing & QA | 1–2 hours |
| **Total** | **~half a day** |

---

## Phase 3 — Client Handoff (Both)

- [ ] Siddhant schedules a 30-min walkthrough call with the client
- [ ] Rohan joins to demo the agent live and answer technical questions
- [ ] Provide client with:
  - [ ] Login URL
  - [ ] 1-page user guide (how to ask questions, what it can/can't do)
  - [ ] Contact email for support issues
- [ ] Set a check-in for Week 3 (collect feedback)

---

## Red Flags — When to Pause Before Signing

Flag these to discuss before committing:

| Situation | Why it's a risk |
|-----------|----------------|
| Client needs on-premise deployment | We don't have an on-prem setup yet — adds weeks |
| Client needs SSO / SAML integration | Not built yet — 1–2 week addition |
| Client needs SOC 2 / HIPAA BAA | We can't provide this today |
| Client has 1,000+ staff needing access | Need proper auth system first |
| Client wants SLA guarantees | Need monitoring + alerting setup first |
| Documents are not in PDF/Word format | May need custom parsing |

---

## Standard Pilot Agreement Terms (Draft)

- **Duration:** 4 weeks
- **Price:** TBD (suggest: $500–$2,000 flat fee for pilot)
- **Includes:** Setup, indexing, web deployment, one round of revisions
- **Excludes:** Custom integrations, SSO, on-premise deployment
- **Data:** Client retains ownership of all documents; we delete after pilot if not renewed
- **Support:** Email support, 48-hour response time

---

*Fill in red flags and agreement terms with Siddhant before first client call.*
