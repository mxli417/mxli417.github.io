---
layout: default
title: Blog
permalink: /blog/
---

{% assign welcome = site.posts | where: "slug", "welcome-to-my-page" %}
{% assign mlflow = site.posts | where: "slug", "mlflow-to-go" %}
{% assign vbot = site.posts | where: "slug", "my-first-voice-bot" %}
{% assign remaining = site.posts | where_exp: "post", "post.slug != 'welcome-to-my-page' and post.slug != 'mlflow-to-go' and post.slug != 'my-first-voice-bot'" %}
{% assign blog_posts = welcome | concat: mlflow | concat: vbot | concat: remaining %}
{% include archive.html title="Blog" posts=blog_posts %}

<article>
  <header><h2>Project notes</h2></header>
  <div markdown="1">

Small implementations and interactive examples in probabilistic modelling and applied NLP.

## Optimal search

How should a limited search budget be divided between two possible locations when a search can miss its target? An interactive article connects the two-drawer problem to optimal search allocation. Adjust the assumptions to see how they change the solution.

[Read the article and try the example]({% post_url /notes/2026-06-14-looking-for-the-uncertain-theory-of-optimal-search %})

## Survey-response classification

The code and benchmark accompanying our 2021 ICAART paper on classifying open-ended survey responses. The paper compares logistic regression with pre-trained language models on responses from the American National Election Study.

[Code and benchmark](https://github.com/mxli417/co_benchmark) · [Paper and citation]({{ '/research/' | relative_url }}#papers)

## Bayesian Conductor

An earlier R/Shiny prototype illustrating Beta–Binomial updating through observations of train-ticket inspections. It is an exploratory project; the estimates depend on the prior and on how observations were collected.

[View the original prototype](https://github.com/mxli417/Bayesian_Conductor)

## In progress

Current personal projects include search allocation ([OptiSearch](https://github.com/mxli417/optisearch)), entropy-based dataset sampling, and network estimation from time series. Another idea is LLM-assisted annotation in Label Studio, with suggested labels for human review. These are unfinished projects, with no package release announced.

  </div>
</article>
