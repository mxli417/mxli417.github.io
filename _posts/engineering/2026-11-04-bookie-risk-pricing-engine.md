---
layout: post
title: "Bookie: a small risk and pricing engine"
description: "An educational fixed-odds engine for studying pricing, exposure, liability, risk limits, and deterministic settlement."
categories: [engineering, projects, statistics]
toc: true
---

Bookie is a deliberately small fixed-odds engine for exploring how prices, bets,
liabilities, and settlement fit together. It is an educational simulation—not a
gambling service, payment system, or financial product.

The project started from a simple engineering question: what is the smallest
model that still makes a bookmaker's decisions inspectable from end to end? A
useful answer needs more than a function that converts probability to odds. It
also needs to preserve the price accepted by each bet, calculate the result under
every possible outcome, reject orders that violate a risk limit, and explain the
realized result after settlement.

<p class="home-actions"><a class="btn btn--primary" href="https://github.com/mxli417/bookie">Browse the Bookie repository <span aria-hidden="true">↗</span></a></p>

## From probability to a quoted market

The pricing pipeline begins with explicit outcomes and fair probabilities. Fair
decimal odds are the reciprocal of those probabilities. A configurable margin,
or overround, increases the implied probabilities before the engine converts
them back to the lower odds offered to a player.

Keeping this transformation explicit matters. The probability estimate, the
commercial margin, and the final quote are different objects and should remain
separable in code and in the interface. Once a bet is accepted, Bookie stores its
quoted odds on the bet itself so that later market changes cannot rewrite the
settlement contract.

## Risk before acceptance

For every possible outcome, the engine calculates the bookmaker's scenario
profit and loss:

```text
PnL(outcome) = stakes on losing outcomes - liability on the winning outcome
```

The acceptance policy evaluates a candidate bet on a copy of the current book.
It accepts the bet only when the lowest resulting scenario P&amp;L stays at or above
the configured risk floor. This makes the decision deterministic and easy to
test: the same book, candidate bet, and policy parameters always produce the
same answer.

The implementation keeps the core independent from the presentation layer.
Pricing, risk, acceptance, and settlement live in small engine modules; a
simulation runner and Streamlit interface call into them. The current web demo
uses a fictional two-outcome career market and play points, while the underlying
toy simulation also supports an explicit three-outcome 1X2 market.

## Dashboard walkthrough

The dashboard exposes the complete simulation: probability-to-odds pricing,
order entry, acceptance decisions, the live risk book, and final settlement.
Select any screenshot to inspect it at full resolution.

<section class="bookie-showcase" aria-labelledby="bookie-showcase-title">
  <div class="bookie-showcase__intro">
    <div>
      <p class="eyebrow">Bookie dashboard</p>
      <h3 id="bookie-showcase-title">From market pricing to settlement</h3>
    </div>
    <p>The same deterministic engine drives every stage. The interface makes the quote, exposure, rejection reason, and realized result visible rather than hiding them behind one aggregate number.</p>
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

## What the project does not do

Bookie currently keeps state in memory, handles one toy market at a time, and
uses fixed external probabilities. It has no accounts, authentication, payments,
persistence, correlated outcomes, or real-money functionality. Those constraints
are intentional: the present version is a compact environment for testing the
mathematics and the boundaries between pricing, risk, and settlement.

Possible extensions include comparing risk policies through Monte Carlo
simulation, exposure-aware requoting, additional market types, and probabilistic
pricing models. They are roadmap ideas, not implemented features.

The source, tests, setup instructions, and current limitations are available in
the [Bookie repository](https://github.com/mxli417/bookie).
