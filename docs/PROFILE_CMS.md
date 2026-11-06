# DYNAMIC PROFILE CMS & FACTUALITY ENFORCEMENT
**Platform:** Albert Linson Professional Intelligence Platform  
**Endpoint:** `/api/profile/cms`  
**Interface:** `/admin?tab=cms`  

---

## 1. Objectives & Publishing Lifecycle

The CMS enables Albert to update his professional profile, headline, summary, skills, and leadership involvement without modifying source code or triggering manual rebuilds.

### Publishing State Machine
$$\text{Draft} \longrightarrow \text{Under Review} \longrightarrow \text{Verified} \longrightarrow \text{Approved} \longrightarrow \text{Published}$$

* **Draft:** Private exploratory notes or unverified submissions.
* **Under Review:** Awaiting validation or date confirmation.
* **Verified:** Internal records verified against certificates or employment documents.
* **Approved:** Staged for public presentation.
* **Published:** Live on public pages, Resume Builder, and Digital Twin knowledge graph.

---

## 2. Factuality Guardrails

1. **Strict Research Paper Limit:** The CMS explicitly enforces that the `research` section must contain **strictly exactly two research papers**:
   - (1) *AEGIS-Test: Adaptive Evidence-Guided Iterative Synthesis for Reliable LLM-Based Software Testing*
   - (2) *A Computational Perspective on Breast Cancer Detection in Ultrasound: Fusion of Multi-Image Modalities*
   Any attempt to insert a 3rd paper is rejected by the API with an unprocessable entity error. All other technical implementations belong under Projects.
2. **Leadership Preservation:** Preserves confirmed institutional names and dates (e.g. *School of Sciences Corporate Club*, *Centre for Counselling & Health Services (CCHS)*, *St. Columba's School*).
