---
layout: default
title: "Research"
permalink: "/research/"
---

<article>
  <header><h1>Research interests</h1></header>
  <p>Research collects my publications and research-led essays in applied NLP, statistical modelling, and AI evaluation. Implemented software and repositories are listed under <a href="{{ '/projects/' | relative_url }}">Projects</a>; the complete chronological article archive is the <a href="{{ '/blog/' | relative_url }}">Blog</a>.</p>
  <h2 id="papers">Papers</h2>
  <p><a href="{% post_url /research/2026-06-14-previous-work %}">Selected research: NLP benchmarks, synthetic data, and retrieval-based ICL</a> connects the questions and evaluation principles behind these projects. Citations, manuscripts, and available code are collected below.</p>
  <div markdown="1">

{% include papers.md %}

  </div>
  <h2 id="selected-writing">Selected writing</h2>
  <div class="feature-grid">
    {% assign testing_posts = site.posts | where: "title", "Testing ML, LLM, and agent systems: from model metrics to decision traces" %}
    {% assign testing_post = testing_posts | first %}
    {% if testing_post %}
    <section class="feature-card">
      <p class="eyebrow">Evaluation engineering</p>
      <h3><a href="{{ testing_post.url | relative_url }}">{{ testing_post.title }}</a></h3>
      <p>A practical assurance strategy spanning code, data, models, RAG, agent trajectories, drift, and release decisions.</p>
    </section>
    {% endif %}
    <section class="feature-card">
      <p class="eyebrow">Research review</p>
      <h3><a href="{% post_url /research/2026-09-30-context-from-benchmarks-to-moderation %}">Contextualized German hate-speech research in 2026</a></h3>
      <p>From isolated-post classification to conversation-aware datasets and the requirements of a real moderation workflow.</p>
    </section>
  </div>
</article>
