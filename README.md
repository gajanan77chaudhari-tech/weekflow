# Weekflow

A responsive, installable personal planner for college, Zepto deliveries, study and sketching.

## Files
- `index.html`: complete planner
- `manifest.webmanifest`: home-screen app metadata
- `sw.js`: service worker for offline access after the app has loaded online
- `icon-192.png` and `icon-512.png`: iPhone and Android home-screen icons

## GitHub Pages deployment
1. Create a new GitHub repository named `weekflow` (public for free GitHub Pages).
2. Extract this ZIP and upload its contents to the repository root; include both PNG icons.
3. In repository Settings > Pages, choose Deploy from a branch, branch `main`, folder `/ (root)`, then Save.
4. Open the deployed HTTPS URL shown by GitHub Pages.

No build step, API key or external package is required. Relative URLs also work under a GitHub Pages repository subpath.

## Install
- iPhone: open the HTTPS website in Safari > Share > Add to Home Screen. Enable Open as Web App if offered.
- Android: open the HTTPS website in Chrome > Install Weekflow, or browser menu > Install app / Add to home screen.

This is a progressive web app, not an APK or IPA. Native store publication would be a separate task.
Progress saves in localStorage on the current browser/device. It does not sync across devices or website domains. Clearing site data removes saved progress. Moving from the Sites URL to GitHub Pages starts a separate progress store.
Offline access requires the site to load online and its service worker to control a visit first; site sign-in may still require internet on a private host.
Opening index.html from Files can show the planner, but installation and service workers require HTTPS hosting (or localhost during development).

## Schedule assumptions
Monday 10 AM–5 PM; home at 6 PM. Tuesday home at 5 PM, Wednesday home at 6 PM, with 10 AM starts assumed. Thursday college starts at 1 PM, home at 6 PM. Friday uses a conservative 6 PM arrival.
Delivery: 35.5h/week at an estimated ₹80/hour = ₹2,840; actual amounts are entered manually. Study: 9.25h/week. Sketching: 2.5h/week.

## Local preview
Run `python3 -m http.server 8000` from this directory and open http://localhost:8000.
