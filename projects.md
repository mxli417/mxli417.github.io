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
      <h3><a href="https://github.com/mxli417/bookie">Bookie</a></h3>
      <p>A small educational engine for studying fixed-odds pricing, exposure, liability, risk limits, and settlement through deterministic simulations.</p>
      <p><a href="https://github.com/mxli417/bookie">View repository <span aria-hidden="true">↗</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">Python · Voice transcription</span>
      <h3><a href="https://github.com/mxli417/wappler">Wappler</a></h3>
      <p>A completed Twilio and OpenAI experiment that accepts WhatsApp voice notes through a signed webhook, transcribes the audio, and returns the text.</p>
      <p><a href="https://github.com/mxli417/wappler">View repository <span aria-hidden="true">↗</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">Pet search &amp; rescue prototype</span>
      <h3><a href="https://github.com/mxli417/flufftrace">FluffTrace</a></h3>
      <p>A cat search-and-rescue project that applies the uncertain-detection and search-allocation ideas developed in OptiSearch to a practical pet-search setting.</p>
      <p><a href="https://github.com/mxli417/flufftrace">View repository <span aria-hidden="true">↗</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">Interactive probability model</span>
      <h3><a href="https://github.com/mxli417/optisearch">OptiSearch</a></h3>
      <p>An implementation of optimal search allocation: how to divide a limited budget when detection is uncertain and failed searches update the belief state.</p>
      <p><a href="{% post_url /notes/2026-06-14-looking-for-the-uncertain-theory-of-optimal-search %}">Try the interactive explanation <span aria-hidden="true">→</span></a></p>
    </section>
  </div>

  <section class="bookie-showcase" aria-labelledby="bookie-showcase-title">
    <div class="bookie-showcase__intro">
      <div>
        <p class="eyebrow">Bookie dashboard</p>
        <h3 id="bookie-showcase-title">From market pricing to settlement</h3>
      </div>
      <p>The current prototype makes the complete deterministic simulation visible: translating probabilities into offered odds, accepting or rejecting bets against a risk floor, monitoring the bookmaker position, and settling the resulting book. Select any screenshot to inspect it at full resolution.</p>
    </div>
    <div class="screenshot-gallery">
      <figure class="screenshot-gallery__overview">
        <a href="{{ '/assets/imgs/bookie_dashboard_upper.png' | relative_url }}">
          <img src="{{ '/assets/imgs/bookie_dashboard_upper.png' | relative_url }}" width="1896" height="883" loading="lazy" alt="Bookie dashboard showing market parameters, offered odds, and the probability-to-odds calculation">
        </a>
        <figcaption>Market configuration and transparent probability-to-odds pricing.</figcaption>
      </figure>
      <figure>
        <a href="{{ '/assets/imgs/bookie_dashboard_upper_mid.png' | relative_url }}">
          <img src="{{ '/assets/imgs/bookie_dashboard_upper_mid.png' | relative_url }}" width="1848" height="751" loading="lazy" alt="Bookie dashboard showing fair versus offered odds and a rejected bet request">
        </a>
        <figcaption>Order entry with a deterministic risk-limit rejection.</figcaption>
      </figure>
      <figure>
        <a href="{{ '/assets/imgs/bookie_dashboard_lower_mid.png' | relative_url }}">
          <img src="{{ '/assets/imgs/bookie_dashboard_lower_mid.png' | relative_url }}" width="1895" height="670" loading="lazy" alt="Bookie dashboard showing accepted bets, stake volume, expected profit and loss, and worst-case profit and loss">
        </a>
        <figcaption>Live position, expected edge, and worst-case P&amp;L.</figcaption>
      </figure>
      <figure>
        <a href="{{ '/assets/imgs/bookie_dashboard_lower_foot.png' | relative_url }}">
          <img src="{{ '/assets/imgs/bookie_dashboard_lower_foot.png' | relative_url }}" width="1895" height="894" loading="lazy" alt="Bookie dashboard charts for outcome-conditioned profit and loss, liabilities, stake exposure, and the acceptance feed">
        </a>
        <figcaption>Outcome exposure, liabilities, and the acceptance/rejection audit feed.</figcaption>
      </figure>
      <figure>
        <a href="{{ '/assets/imgs/bookie_dashboard_footer.png' | relative_url }}">
          <img src="{{ '/assets/imgs/bookie_dashboard_footer.png' | relative_url }}" width="1900" height="898" loading="lazy" alt="Bookie dashboard showing a simulated outcome, realized bookmaker result, player result, payout, and settled bets">
        </a>
        <figcaption>Simulated outcome and bet-by-bet settlement.</figcaption>
      </figure>
    </div>
  </section>
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
      <h3><a href="https://github.com/mxli417/co_benchmark">Survey-response classification</a></h3>
      <p>Code and benchmark material for comparing logistic regression and pretrained language models on open-ended survey responses.</p>
      <p><a href="{{ '/research/' | relative_url }}#papers">Paper and citation <span aria-hidden="true">→</span></a></p>
    </section>
    <section class="feature-card">
      <span class="eyebrow">R/Shiny prototype</span>
      <h3><a href="https://github.com/mxli417/Bayesian_Conductor">Bayesian Conductor</a></h3>
      <p>An exploratory visualization of Beta–Binomial updating using observations of train-ticket inspections.</p>
      <p><a href="https://github.com/mxli417/Bayesian_Conductor">View repository <span aria-hidden="true">↗</span></a></p>
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
