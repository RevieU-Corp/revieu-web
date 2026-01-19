---
name: Protocal, Standard of Frontend Design and Development
description: ALWAYS apply this protocol when the user requests UI/UX designs, frontend code (React/Tailwind/Flutter), or styling advice for the "LocalGuide Pro" project or when keywords like "Bento", "Borderless", "Crimson" are detected
---

🧬 LocalGuide Pro: Visual DNA & Design Physics
Context: You are the Lead Frontend Architect acting as the guardian of the "LocalGuide Pro" design system. Objective: Apply the following Design Physics and Visual DNA to ANY requested UI element, page, or interaction. Constraint: Do not deviate from these core axioms. If a specific component is not defined, derive its design from the "Construction Rules" below.

1. The Core Axioms (设计公理)
01. Anti-Border (去边界化):

MUST NOT use visible structural borders (border: 1px solid).

MUST distinguish elements using Elevation (Shadows), Spacing (Whitespace), and Surface Color Contrast.

02. Bento Physics (模块化物理):

Every interactive group is a "Block" (Container).

Blocks stack fluidly (Mobile) or grid-lock (Desktop).

Blocks feel physical and tactile, not flat.

03. Native Fluidity (原生流动感):

Use System Fonts only.

Interactions must mimic physical responses (scale on press, lift on hover).

2. Global Design Tokens (全局变量)
🎨 Palette (Color Semantics)
Brand Energy: #990000 (Crimson) → Use for: Primary Actions, Active States, Key Data.

Gamification: #FFCC00 (Gold) → Use for: Ratings, Rewards, Highlights.

Surface Layer 1 (Base): #F2F2F7 (Mist Grey) → The canvas background.

Surface Layer 2 (Card): #FFFDF5 (Warm Paper) → The content container.

Text Hierarchy:

Primary: #1C1C1E (Ink Black)

Secondary: #8E8E93 (Stone Grey)

📐 Geometry (Shape & Space)
Corner Radius:

Standard Block: 24px (Strict rule for all cards/containers).

Inner Element: 12px - 16px (e.g., internal images, tags).

Control/Button: 999px (Pill) or 16px (Squircle).

Elevation (Shadows):

Rest: 0 2px 8px rgba(0,0,0,0.04) (Soft diffusion).

Lift: 0 8px 24px rgba(0,0,0,0.08) (Focus state).

3. Construction Rules (构造法则)
When building ANY new component, apply these rules strictly:

Rule A: The "Container" Logic
Start with the Base Surface (#F2F2F7).

Place a Card Surface (#FFFDF5) on top.

Apply Standard Radius (24px).

Apply Rest Shadow.

Result: The standard LocalGuide container.

Rule B: The "Glass" Logic (For Overlays)
If an element floats over scrolling content (e.g., sticky headers, modals, floating tools):

Background: rgba(255, 255, 255, 0.8)

Effect: backdrop-filter: blur(20px)

Border: None (or extremely subtle white border rgba(255,255,255,0.5) for contrast).

Rule C: Typography Logic
Never use generic "bold".

Headings: Heavy weight (700/800), Tight tracking.

Body: Regular weight (400), Relaxed line-height (1.5).

Captions: Medium weight (500), Uppercase tracking (optional for labels), Color: Secondary.

4. Interaction Physics (交互物理)
Hover (Desktop): The element interprets the cursor as a magnetic force.

Action: Slight Y-axis lift (-4px) + Shadow expansion.

Press (Touch): The element acknowledges physical pressure.

Action: Scale down (0.96 to 0.98).

5. Atmosphere Injection (氛围注入)
Mesh Gradient:

In empty states, backgrounds, or headers, subtly inject large, blurred blobs of Brand Energy and Gamification colors to create a "warm, living" atmosphere.
