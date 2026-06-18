# Tally ARS

**Live audience response, no app required.**

Tally turns any room into an interactive one. Attendees join in seconds by scanning a QR code or typing a five-character code — no app store, no download, no account. You run the show from a single dashboard: ask a question, watch the votes land in real time, and move to the next one with a tap or a press of the spacebar.

Built for event hosts, trainers, and speakers who want a polished audience-response experience without renting clicker hardware or wrestling with a bloated enterprise tool.

---

## Why Tally

**Zero friction for attendees.** A phone and a browser is all it takes. No app installs, no sign-ups, no QR-scan-into-app-store dead ends.

**A dashboard built for the person actually running the room.** A live preview shows you exactly what your audience sees, side by side with your controls — so you're never guessing what's on their screen. Keyboard shortcuts let you keep the room moving without breaking eye contact with your laptop.

**Polls and slides, one deck.** Mix voting questions with full-screen images, audio clips, or plain announcement slides — build a complete session flow, not just a string of multiple-choice questions.

**Built-in AI assistance.** Generate a batch of poll questions on any topic in seconds, or tighten the wording of a question you've already written — both powered by your own Groq API key, stored only on your device.

**Your data, your control.** Every session can be exported to a portable file the moment it ends. Reload a past session's questions anytime, and optionally compare new results against the old ones side by side.

**Installable, works like a native app.** Add Tally to your home screen on desktop or mobile for a full-screen, app-like experience — no browser chrome, no address bar, just the tool.

---

## How it works

1. **Build** — Assemble your deck: polls, slides, or both, in any order. Use Speed Card to generate a batch of questions on a topic, or write them by hand.
2. **Start** — Starting a session generates a join code and QR. Attendees scan or type it on their own phone.
3. **Run** — Open one item at a time. Votes tally live, with a real-time preview of the attendee view right next to your controls.
4. **End & Export** — Ending a session produces a full report and exports your data, then clears it from the live system.

---

## Setting up AI features

Speed Card (question generation) and Improve Wording (question polish) are both optional and require a free [Groq](https://groq.com) API key, added in **Settings → AI**. The key is stored only in your browser — it is never written into the app's files, never included in exports, and never sent anywhere except directly to Groq when you use one of these features.

---

## Installing as an app

Tally is a Progressive Web App. Open it in a modern browser and look for an "Install" or "Add to Home Screen" option — on desktop Chrome/Edge, this appears in the address bar; on mobile, it's in the browser's share or menu options. Once installed, Tally launches in its own window with its own icon, just like a native app.

---

## Notes for self-hosting

This package is a static site — `index.html`, `manifest.json`, `sw.js`, and the `icons/` folder all need to be deployed together, served from the same origin (GitHub Pages, Netlify, or any static host all work). Live sync runs on Firebase Realtime Database; the project's connection details live inside `index.html` and are safe to expose publicly, since access is controlled by database rules rather than by hiding the configuration.

---

*Tally ARS — a LAZLAB Creations project.*
