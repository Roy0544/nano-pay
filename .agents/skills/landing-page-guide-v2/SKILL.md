---
name: landing-page-guide-v2
description: Create distinctive, high-converting landing pages that combine proven conversion elements with exceptional design quality. Build beautiful, memorable landing pages using Next.js 14+ and ShadCN UI that avoid generic AI aesthetics while following the 11 essential elements framework.
---

# Landing Page Guide V2

## Overview

This skill enables creation of **distinctive, high-converting landing pages** that combine:
- **Proven Conversion Framework**: 11 essential elements from DESIGNNAS for high conversion rates
- **Exceptional Design Quality**: Bold aesthetic choices that create unforgettable brand experiences
- **Production-Ready Code**: Next.js 14+ with ShadCN UI, TypeScript, and performance optimization

**Philosophy**: A landing page must convert visitors AND make them remember your brand. Generic, template-looking pages fail at both. This skill ensures your landing pages are functionally effective and visually extraordinary.

## When to Use This Skill

Use this skill when users request:
- Creation of landing pages, marketing pages, or product pages
- Next.js or React-based promotional websites
- Pages that need to convert visitors into customers AND stand out visually
- Professional marketing pages with exceptional design quality
- Landing pages that avoid generic "template" aesthetics
- Brand experiences that are both conversion-optimized and memorable

## Design Thinking: Before You Code

Before implementing any landing page, commit to a **BOLD aesthetic direction** that aligns with the brand and product:

### 1. Understand Context
- **Purpose**: What problem does this product solve? Who is the target audience?
- **Brand Personality**: Is this brand playful, professional, luxury, minimalist, bold, technical?
- **Industry**: What visual language does this industry expect (or should we break)?
- **Differentiation**: What makes this brand unforgettable? What's the ONE thing visitors will remember?

### 2. Choose an Aesthetic Direction

Pick an extreme direction and commit fully. Examples:

**Minimalist & Refined**
- Brutally clean layouts, generous whitespace
- Sophisticated typography with large scale contrasts
- Monochromatic or limited color palette (2-3 colors max)
- Subtle micro-interactions, elegant transitions
- Examples: Luxury products, professional services, premium SaaS

**Bold & Maximalist**
- Rich, complex visual layers
- Dynamic animations and scroll effects
- Gradient meshes, textures, and overlapping elements
- Vibrant color palettes with high contrast
- Examples: Creative agencies, entertainment, youth brands

**Retro-Futuristic**
- Nostalgic elements with modern execution
- Geometric patterns, neon accents
- Glitch effects, scanlines, grain textures
- Monospace or display fonts with character
- Examples: Gaming, tech startups, creative tools

**Organic & Natural**
- Soft, flowing shapes and gradients
- Nature-inspired colors (earth tones, pastels)
- Smooth animations mimicking natural motion
- Rounded corners, soft shadows
- Examples: Wellness, sustainability, food

**Editorial & Magazine**
- Strong typographic hierarchy
- Grid-breaking asymmetric layouts
- Large, impactful imagery
- Bold use of whitespace and negative space
- Examples: Content platforms, media, education

**Brutalist & Raw**
- Unconventional layouts, intentional "ugly"
- System fonts or deliberately basic typography
- High contrast, limited color
- Minimal or no animations
- Examples: Art, fashion, anti-establishment brands

**CRITICAL**: Choose ONE clear direction. Bold maximalism and refined minimalism both work - the key is **intentionality**, not intensity. Execute your chosen direction with precision and consistency across all 11 elements.

### 3. Define Your Design System

Before coding, define these core decisions:

**Typography Choices**
- **Display Font**: Choose something distinctive and memorable (NOT Inter, Roboto, Arial, or system fonts)
  - Consider: Space Grotesk, Clash Display, Cabinet Grotesk, Syne, DM Serif Display, Zodiak, Fraunces, Archivo Black, Unbounded, Outfit
  - Or use Google Fonts wisely: Playfair Display, Crimson Pro, Libre Baskerville, Epilogue, Plus Jakarta Sans
  - **NEVER** converge on common choices - vary fonts across different projects
- **Body Font**: Refined, readable choice that complements display font
  - Consider: DM Sans, General Sans, Switzer, Geist, Manrope, Karla, Work Sans
- **Scale**: Establish clear hierarchy (e.g., H1: 4rem → H2: 3rem → H3: 2rem → Body: 1rem)

**Color Palette**
- **Dominant Color**: Your primary brand color (60% usage)
- **Accent Color**: High-contrast color for CTAs (10% usage)
- **Neutral Palette**: Grays or earth tones (30% usage)
- **Background Strategy**: Solid, gradient, texture, or pattern?
- Define as CSS variables for consistency

**Motion Strategy**
- **Page Load**: Staggered reveals with animation-delay for hero elements
- **Scroll Interactions**: Fade-ups, parallax, or scroll-triggered animations?
- **Hover States**: Subtle scale, color shift, or dramatic transformations?
- **CTA Animations**: How do buttons attract attention without being annoying?

**Spatial Approach**
- **Layout Style**: Centered and symmetric? Asymmetric and dynamic? Grid-breaking?
- **Spacing System**: Tight and dense? Generous and airy?
- **Section Flow**: Traditional stacked? Diagonal? Overlapping?

## The 11 Essential Elements Framework

Every effective landing page must include these 11 essential elements. These are based on DESIGNNAS's proven framework for high-converting landing pages.

**Each element has TWO requirements:**
1. **Functional requirement** (for conversion) - Must be included
2. **Design excellence** (for memorability) - Must be distinctive and beautiful

### Element-by-Element Design Guide

#### 1. URL with Keywords
**Functional**: SEO-optimized, descriptive URL structure
**Design**: N/A (SEO-focused)

#### 2. Company Logo (Header)
**Functional**: Brand identity placed prominently (top-left)
**Design Excellence**:
- Consider animated logo on page load
- Sticky header with smooth scroll transitions
- Logo mark variation for different scroll states
- Header background: transparent → solid with backdrop blur
- Navigation typography that matches your display font choice

#### 3. SEO-Optimized Title and Subtitle (Hero)
**Functional**: Clear value proposition with keywords
**Design Excellence**:
- **Typography**: Make this MASSIVE and unforgettable (4rem-6rem+)
- Use your distinctive display font here
- Consider gradient text, outlined text, or text shadows for impact
- Animate title words with staggered fade-in (animation-delay)
- Subtitle should be 50% the size of title, different weight or font
- Add visual rhythm with line breaks and spacing

#### 4. Primary CTA (Hero)
**Functional**: Main call-to-action button in hero section
**Design Excellence**:
- Make it IMPOSSIBLE to miss: size, color contrast, position
- Avoid boring rectangles: consider pill shapes, unique borders, or geometric shapes
- Add micro-interactions: hover scale, shadow expansion, color shift
- Consider dual CTAs with primary/secondary hierarchy
- Entrance animation that draws the eye (delay after title)
- Add visual cues: arrows, icons, or pulsing effects

#### 5. Social Proof (Hero)
**Functional**: Reviews, ratings, user statistics
**Design Excellence**:
- Numbers should be HUGE and animated on load (count-up effect)
- Statistics cards with gradient backgrounds or subtle borders
- Customer avatars in overlapping circles
- Star ratings with custom styling (not default yellow stars)
- "As featured in" logos with proper spacing and opacity treatment
- Consider rotating testimonials or animated social proof carousel

#### 6. Images or Videos (Media Section)
**Functional**: Visual demonstration of product/service
**Design Excellence**:
- **CRITICAL**: Never use placeholder or generic images
- Product screenshots with device mockups (laptop/phone frames)
- Add depth: shadows, reflections, 3D tilt effects
- Consider: Floating screenshots, parallax scroll effects, video backgrounds
- Image reveal animations on scroll (fade-up, slide-in)
- For videos: Custom play button design, ambient background glow
- Grid layouts: Asymmetric, overlapping, or bento box style

#### 7. Core Benefits/Features
**Functional**: 3-6 key advantages with icons
**Design Excellence**:
- **Icons**: Custom designed or carefully selected (NOT generic line icons)
- Consider: Gradient fills, animated icons on hover, 3D-style illustrations
- Card design variations: glassmorphism, neumorphism, gradient borders, subtle shadows
- Staggered animation as user scrolls to this section
- Asymmetric layout instead of boring 3-column grid
- Background elements: subtle patterns, gradients, or decorative shapes
- Typography: Feature titles in your display font, bold and prominent

#### 8. Customer Testimonials
**Functional**: 4-6 authentic reviews with photos
**Design Excellence**:
- Photo treatment: Circular avatars with gradient borders or unique shapes
- Card backgrounds: Subtle gradients, frosted glass, or elevated shadows
- Quote marks: Oversized, decorative, or custom styled
- Layout: Masonry grid, carousel, or staggered vertical
- Rating stars: Custom colors matching brand palette
- Hover effects: Lift up, expand, or glow
- Customer names and titles: Refined typography

#### 9. FAQ Section
**Functional**: 5-10 common questions with accordion UI
**Design Excellence**:
- Accordion animations: Smooth expand/collapse with easing
- Icons: Custom chevrons or plus/minus signs with rotation
- Hover states on questions
- Typography: Questions in bold or different font weight
- Consider: Two-column layout on desktop, side-by-side Q&A pairs
- Background: Subtle color shift from previous section
- Spacing: Generous padding inside accordion items

#### 10. Final CTA
**Functional**: Bottom call-to-action for second chance conversion
**Design Excellence**:
- **Make it a HERO moment**: This is the last chance
- Full-width section with dramatic background (gradient, pattern, or color)
- CTA button even BIGGER than hero CTA
- Add urgency: Countdown timers, limited spots, scarcity indicators
- Surround with compelling copy and micro-benefits
- Animation: Parallax background, floating elements, or scroll-triggered effects
- Consider: Email input + button combo for newsletter/waitlist

#### 11. Contact Information/Legal Pages (Footer)
**Functional**: Footer with complete information, legal links
**Design Excellence**:
- Multi-column layout with clear information hierarchy
- Social icons: Hover effects (color shift, scale, or rotate)
- Newsletter signup: Styled input with inline button
- Typography: Smaller but still readable (14-16px)
- Background: Darker than body or distinct color
- Separator from content: Subtle gradient line or decorative divider
- Bottom bar: Copyright and legal links with proper spacing

**Critical:** All 11 elements must be included in every landing page. No exceptions.

For detailed explanations of each element, refer to `references/11-essential-elements.md`.

## Design Aesthetics Guidelines

### Typography Excellence
- **NEVER** use generic fonts: Inter, Roboto, Arial, Helvetica, system-ui
- **Display fonts** should be distinctive and memorable
- **Pair wisely**: Display font for headings + refined body font for text
- **Scale dramatically**: Create clear hierarchy with size jumps (not subtle differences)
- **Letter spacing**: Adjust for display fonts (often needs tighter tracking)
- **Line height**: Display = 1.1-1.2, Body = 1.6-1.8

### Color & Visual Coherence
- **Define CSS variables** for all colors (maintain consistency)
- **Dominant color** should appear throughout (not just CTAs)
- **Accent colors** must have sufficient contrast for accessibility (WCAG AA minimum)
- **Avoid**: Purple gradients on white (overused AI aesthetic)
- **Backgrounds**: Create atmosphere with gradients, meshes, patterns, or textures
  - Gradient meshes: Multi-color smooth gradients
  - Noise textures: Subtle grain for depth
  - Geometric patterns: Dots, lines, or shapes at low opacity
  - Layered transparencies: Overlapping colored sections

### Motion & Animation
- **Page load**: One well-orchestrated entrance with staggered reveals
  - Hero title words fade in sequentially (animation-delay: 0ms, 100ms, 200ms)
  - Subtitle follows (delay: 300ms)
  - CTA appears last (delay: 500ms) with emphasis
- **Scroll animations**: Sections fade up as they enter viewport
  - Use Intersection Observer API or Framer Motion's scroll triggers
  - Cards stagger in (

