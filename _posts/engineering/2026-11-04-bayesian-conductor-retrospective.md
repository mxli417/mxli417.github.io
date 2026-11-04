---
layout: post
title: "Bayesian Conductor: a Beta–Binomial Shiny prototype"
description: "A retrospective on an early R/Shiny experiment for updating ticket-inspection probabilities with train-specific Beta priors."
categories: [engineering, projects, statistics, r]
toc: true
mathjax: true
---

Bayesian Conductor is an early R/Shiny prototype built to make a small Bayesian
model tangible. Its question is intentionally ordinary: after observing a number
of train rides, how should a prior belief about ticket inspections change in the
light of the recorded data?

The project is best read as a statistical learning exercise and a snapshot of an
older Shiny application—not as a current prediction service.

<p class="home-actions"><a class="btn btn--primary" href="https://github.com/mxli417/Bayesian_Conductor">Browse the Bayesian Conductor repository <span aria-hidden="true">↗</span></a></p>

## The model

For a single train type, let $x$ be the number of rides with an inspection among
$n$ recorded rides. With a Binomial likelihood and a Beta prior,

$$
p \sim \operatorname{Beta}(\alpha,\beta), \qquad
x\mid p \sim \operatorname{Binomial}(n,p),
$$

conjugacy gives the posterior

$$
p\mid x \sim \operatorname{Beta}(\alpha+x,\beta+n-x).
$$

The posterior mean is therefore

$$
\mathbb{E}[p\mid x]=\frac{\alpha+x}{\alpha+\beta+n}.
$$

The prototype assigns different priors to ICE, regional, and S-Bahn services,
then lets a user enter ride totals and inspection counts. It stores the entries
in a table and compares the direct empirical fraction with the posterior estimate
for each train type. The example demonstrates the practical effect of a prior:
it stabilizes an estimate when observations are scarce and gradually yields to
the data as the sample grows.

## What the prototype illustrates

The application connects four pieces that are often taught separately:

- a domain assumption expressed as a prior,
- a Binomial observation model,
- an analytical Beta posterior update,
- and an interface that shows both the raw fraction and the regularized estimate.

That makes it a useful teaching artifact. It also shows why a mathematically
valid update is not automatically a trustworthy population estimate. A single
commuter's rides are a convenience sample: routes, travel times, and reporting
behavior can be strongly unrepresentative. The app therefore cannot estimate a
general inspection probability without a defensible sampling and reporting
design, and it should not be treated as a fare-evasion tool.

## What would need repair before reuse

A current source review exposes two correctness issues in the old prototype.
The update helper chooses a train-specific prior from only the first element of
the supplied train-type vector, which is wrong when an aggregated calculation
contains several types. The durable-estimate plot also constructs one data frame
but later refers to the data frame from another render path. Input validation,
zero-ride handling, date checks, and a precise definition of an inspection event
would also need to be added.

Those limitations are why this remains a retrospective rather than a refreshed
release. The original R code and explanatory material are preserved in the
[Bayesian Conductor repository](https://github.com/mxli417/Bayesian_Conductor).
