# Into the Ocean Odyssey


An immersive, cinematic scroll experience that takes you from the sunlit surface of the ocean all the way down to the deepest trench on Earth, Narrated by **Joy**.

Built with React, GSAP, and a lot of love for the deep.

---

## What It Is

**Into the Ocean** is an interactive web experience — not a website, not an app — a *journey*. You scroll, the ocean pulls you deeper. Each section reveals a new layer of the sea, with animated text, ambient sound, creature encounters, and cinematic transitions.

> *"The ocean covers 71% of the Earth. We've explored less than 20% of it."*

---

##  The Journey

| Chapter | Zone | Depth |
|---|---|---|
| Intro | Surface | 0m |
| Chapter One — *Trois Couches* | Overview | — |
| Level 1 | Epipelagic / Sunlight Zone | 0 – 200m |
| Level 2 | Mesopelagic / Twilight Zone | 200 – 1,000m |
| Level 3 | Bathypelagic / Midnight Zone | 1,000 – 4,000m |
| Chapter Two | Interlude | — |
| Level 4 | Abyssopelagic / Abyssal Zone | 4,000 – 6,000m |
| Level 5 | Hadal Zone / Mariana Trench | 6,000 – 11,000m |
| Chapter Three — *The Story Doesn't End Here* | Epilogue | — |
| Conclusion | — | Lights Out |

---

##  Tech Stack

- **React** — component architecture
- **GSAP + ScrollTrigger** — all animations, scroll-driven transitions, cinematic sequences
- **Tailwind CSS** — utility styling
- **Vite** — build tool

---

##  Audio

The experience is designed to be heard. Three tracks play across the journey:

1. **Procrastinating** — starts after the intro sequence
2. **FrEsH** — fades in when the first track ends
3. **i wish it would never stop snowing** — plays after FrEsH, carries you through the conclusion

> 🎧 Use headphones for the best experience.

---

##  Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/into-the-ocean.git

# Install dependencies
cd into-the-ocean
npm install

# Start dev server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── assets/          # Images, GIFs, audio files
├── components/
│   ├── Intro.jsx           # Opening text sequence + whale reveal
│   ├── Loadingscreen.jsx   # Water-fill preloader
│   ├── BubbleButton.jsx    # Interactive bubble button
│   ├── Exploration.jsx     # Chapter One slide
│   ├── LevelOne.jsx        # Epipelagic zone
│   ├── LevelTwo.jsx        # Mesopelagic zone
│   ├── LevelThree.jsx      # Bathypelagic zone + Titanic
│   ├── ChapterTwo.jsx      # Chapter Two interlude
│   ├── LevelFour.jsx       # Abyssopelagic zone
│   ├── LevelFive.jsx       # Hadal zone + Mariana Trench
│   ├── ChapterThree.jsx    # Closing interlude
│   └── Conclusion.jsx      # Final scene + torch cursor + lights out
├── useAudio.js      # Custom hook — audio chain management
├── App.jsx          # Root layout + scroll orchestration
└── index.css        # Global styles + floating animation
```

---

## Features

- **Cinematic text sequences** — word-by-word animations with GSAP
- **Scroll-driven transitions** — pinned sections, black wipes, fade-outs tied to scroll position
- **Ambient audio chain** — waves → music → next track, crossfaded seamlessly
- **Creature reveals** — jellyfish, dolphins, sharks, lanternfish, viperfish, hatchetfish appear alongside their names
- **Bubble animations** — rising bubbles in deeper zones
- **Torch cursor** — after Lights Out, your mouse becomes a flashlight revealing a hidden message
- **Asset preloader** — water-fill loading screen waits for all images and audio before starting

---

## Credits

Made by **Gods Will Khojee**
Used Pinterest for **Images**
Chillhopmusic for **Lofi beats**


*95% of the ocean remains unexplored. The mystery is just beginning.*

