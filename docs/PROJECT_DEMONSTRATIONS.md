# TECHNICAL PROJECT DEMONSTRATIONS & RESEARCH EXPLORER
**Platform:** Albert Linson Professional Intelligence Platform  
**Component:** `apps/web/src/components/ProjectDemosModal.tsx`  
**Routes:** `/projects` and `/research`  

---

## 1. Interactive Sandbox Environments

Instead of passive text descriptions, the platform features 3 client-side sandboxes allowing recruiters to test Albert's software architectures live:

### 1.1. JARVIS Voice & OS Automation Assistant
* **Implementation:** Safe browser-based interactive command shell (`$`).
* **Supported Commands:** `status` (edge latency, memory, D1 status), `skills`, `experience`, `audit` (FactualityGuard verification), `help`, `clear`.
* **Security Guardrail:** Isolated browser simulation. Zero execution of host operating system commands on the visitor's machine. Clearly labeled `SANDBOX_ISOLATED`.

### 1.2. AURIVA Audio-Visual Studio
* **Implementation:** HTML5 Canvas visualizer rendering real-time simulated Fast Fourier Transform (FFT) frequency bands.
* **Capabilities:** Play/pause audio wave oscillator, track metadata display, algorithmic BPM synthesis. Zero third-party copyright streams.

### 1.3. CINEMATRIX Semantic Video & Recommendation Engine
* **Implementation:** Semantic vector similarity matrix using TF-IDF and cosine similarity simulation.
* **Capabilities:** Evaluates query movies (e.g. *Inception*, *The Social Network*, *Ex Machina*) against multi-dimensional feature vectors (Plot, Tone, Scene BPM) and computes confidence scores (90–98%).

---

## 2. Interactive Academic Research Paper Explorer

Featured on `/projects#research` and `/research`:
* **Strict Scope:** Exactly the two approved peer-reviewed manuscripts:
  1. *AEGIS-Test: Adaptive Evidence-Guided Iterative Synthesis for Reliable LLM-Based Software Testing*
  2. *A Computational Perspective on Breast Cancer Detection in Ultrasound: Fusion of Multi-Image Modalities*
* **Mathematical Formulations:** Rendered with KaTeX formulas detailing the objective functions for test suite diversity and multi-modal feature fusion.
* **1-Click Citation Copying:**
  - **Copy IEEE Citation:** `A. K. Linson et al., "AEGIS-Test...", Dept. of CS, Christ University, 2025.`
  - **Copy BibTeX:** Formatted `@article{linson2025aegis...}` ready for LaTeX insertion.
