---
layout: default
title: Projects
permalink: /projects/
description: Software, interactive tools, and reproducible research artifacts.
classes: [top-level]
---

<article class="featured-work">
  <header class="section-hero">
    <p class="eyebrow">Built work</p>
    <h1>Projects</h1>
    <p class="section-hero__lede">Software, interactive tools, and reusable research artifacts. Explanatory articles live in the <a href="{{ '/blog/' | relative_url }}">Blog</a>; publications and research-led essays live under <a href="{{ '/research/' | relative_url }}">Research</a>.</p>
  </header>
  <section class="project-section" aria-labelledby="applications-title">
  <h2 id="applications-title">Applications &amp; engines</h2>
  <div class="feature-grid">
    <section class="feature-card">
      <span class="eyebrow">Python · Risk &amp; pricing engine</span>
      <h3><a href="{% post_url /engineering/2026-11-04-bookie-risk-pricing-engine %}">Bookie</a></h3>
      <p>A small educational engine for studying fixed-odds pricing, exposure, liability, risk limits, and settlement through deterministic simulations.</p>
      <p><a href="{% post_url /engineering/2026-11-04-bookie-risk-pricing-engine %}">Read the project article <span aria-hidden="true">→</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">Python · Voice transcription</span>
      <h3><a href="{% post_url /engineering/2026-10-17-wappler-whatsapp-voice-transcription %}">Wappler</a></h3>
      <p>A completed Twilio and OpenAI experiment that accepts WhatsApp voice notes through a signed webhook, transcribes the audio, and returns the text.</p>
      <p><a href="{% post_url /engineering/2026-10-17-wappler-whatsapp-voice-transcription %}">Read the project article <span aria-hidden="true">→</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">Pet search &amp; rescue prototype</span>
      <h3><a href="https://github.com/mxli417/flufftrace">FluffTrace</a></h3>
      <p>A cat search-and-rescue project that applies the uncertain-detection and search-allocation ideas developed in OptiSearch to a practical pet-search setting.</p>
      <p><a href="https://github.com/mxli417/flufftrace">View repository <span aria-hidden="true">↗</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">Interactive probability model</span>
      <h3><a href="{% post_url /notes/2026-06-14-looking-for-the-uncertain-theory-of-optimal-search %}">OptiSearch</a></h3>
      <p>An implementation of optimal search allocation: how to divide a limited budget when detection is uncertain and failed searches update the belief state.</p>
      <p><a href="{% post_url /notes/2026-06-14-looking-for-the-uncertain-theory-of-optimal-search %}">Read the interactive explanation <span aria-hidden="true">→</span></a></p>
    </section>
  </div>
  </section>

  <section class="project-section" aria-labelledby="libraries-title">
  <h2 id="libraries-title">Libraries &amp; research artifacts</h2>
  <div class="feature-grid">
    <section class="feature-card">
      <span class="eyebrow">Mini library · LLM evaluation</span>
      <h3><a href="https://github.com/mxli417/likeli">Likeli</a></h3>
      <p>A small library for calculating and working with LLM likelihoods.</p>
      <p><a href="https://github.com/mxli417/likeli">View repository <span aria-hidden="true">↗</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">NLP benchmark &amp; code</span>
      <h3><a href="{% post_url /research/2026-06-14-previous-work %}#benchmarking-language-models-on-survey-responses">Survey-response classification</a></h3>
      <p>Code and benchmark material for comparing logistic regression and pretrained language models on open-ended survey responses.</p>
      <p><a href="{% post_url /research/2026-06-14-previous-work %}#benchmarking-language-models-on-survey-responses">Read the project article <span aria-hidden="true">→</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">R/Shiny prototype</span>
      <h3><a href="{% post_url /engineering/2026-11-04-bayesian-conductor-retrospective %}">Bayesian Conductor</a></h3>
      <p>An exploratory visualization of Beta–Binomial updating using observations of train-ticket inspections.</p>
      <p><a href="{% post_url /engineering/2026-11-04-bayesian-conductor-retrospective %}">Read the project retrospective <span aria-hidden="true">→</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">Early-stage research · For later</span>
      <h3><a href="https://github.com/mxli417/latentlinks">LatentLinks</a></h3>
      <p>An early research direction for inferring networks from coupled latent-state dynamics. The repository is retained as a starting point for later development.</p>
      <p><a href="https://github.com/mxli417/latentlinks">View repository <span aria-hidden="true">↗</span></a></p>
    </section>
  </div>
  </section>
</article>
