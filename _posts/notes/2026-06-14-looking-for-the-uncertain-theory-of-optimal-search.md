---
title: "Looking for the uncertain: the Theory of Optimal Search (Stone, 1975)"
layout: post
toc: true
mathjax: true
description: An illustrated derivation of optimal search allocation, from the two-drawer problem to unequal search costs and Bayesian updating.
categories: [notes, optimal-search, bayesian-search, statistics]
---

<link rel="stylesheet" href="/assets/css/bayesian-search.css">

## Intro

Since I started my journey in applied statistics, one topic in particular has
kept pulling me back in. For years now, the *Theory of Optimal Search* (also
known as *Bayesian search*) and its applications to search-and-rescue
operations, vessel finding, and disaster recovery have been living rent-free in
my head.

After stumbling over one of the rare copies of Lawrence Stone's 1975 monograph
at TUM Munich, I realized that I had already brushed against the same material
in a variety of forms earlier:

- in the search for the SS Central America, which I first encountered in a book years ago,
- in the disaster recovery and search operations after Air France Flight 447,
- and in SAROPS, the search-and-rescue planning software also reported to have been used around the Deepwater Horizon disaster.

The surprising thing about Bayesian search is that it solves a problem most of us
encounter intuitively:

> Given limited resources, where should I look first?

The same question appears in search-and-rescue operations, military surveillance,
mine hunting, archaeological expeditions, debugging software, document review,
and even everyday tasks such as looking for misplaced keys.

Since I never found a web introduction on the topic that quite scratched the
itch, I decided to finally have a go myself. So here goes my personal intro and
summary of Stone's first optimal-search example: **the two-drawer search problem**.
This is of course a simplistic intro, but it will sketch the necessary tooling that can be then easily reused to solve much more complex problems.

I proceed as follows: I will quickly outline the problem, present the solution
derived by Stone, briefly elaborate on its *optimality* (which is rarely touched
in public notes on the topic; see, for example,
the [wiki](https://en.wikipedia.org/wiki/Bayesian_search_theory) page on the topic
), and then later on solve the example with my own implementation, using a small Python package I'm currently writing and plan to put on PyPI.

## Introductory example: the two-drawer search problem

The two-drawer problem is a minimal example for optimal search planning.
Stone assumes in the introduction to his book that the **target**, a valuable coin,
is hidden in one of two drawers. The searcher **assumes** (a priori) that the probability
distribution of either drawer to hold the coin is:

|drawer 1| drawer 2|
|:-----:|:-----:|
| p(1) = $\frac{2}{3}$    | p(2) =$\frac{1}{3}$ |


with $p(1)+p(2) = 1$. Suppose there is a fixed amount of time $K$ to look for the target. The main question the theory
of optimal search tries to solve, is this:

>How should the available time be divided between the two locations in order to maximize the probability of detecting the target?

### Tools

Stone reasons that in order to answer the question, we need a specialized
toolkit which allows us to model the problem properly. We need:

* a **prior** (or: **prior distribution**) $p(j)$: this should encode our belief
and all available information as to where we expect the target to reside
* a **detection function** $b(z)$ which relates time spent searching in a cell
to the probability of detecting the target given that it is in the cell.
An interesting choice[^exponential] is the exponential function $b(z)=1-e^{-z}$ where $z \ge 0$ is the time spent looking, measured in hours
* an **allocation** $f$ where $f(j)$ is the amount of time spent looking in cell $j$ for $j=1,2$
* an **objective function** which gives the overall probability of detection:
$$ P[f] = p(1)b(f(1)) + p(2)b(f(2)) $$
* and a **cost function** which measures the total search effort associated with the allocation: $C[f] = f(1)+f(2)$

The optimization problem can now be stated compactly as:
$$ \max_f P[f] \: s.t. \: C[f] \le K $$

Spelled out:

> Among all feasible allocations of search effort, find the one that maximizes the probability of detection.

At first glance, the answer seems obvious. Drawer 1 is twice as likely to contain the coin as drawer 2, so why not spend all available effort searching drawer 1?

The catch is that searching is imperfect. Even if the coin is present, it may be overlooked. Moreover, the detection function exhibits diminishing returns: the first few minutes spent searching a location are usually more valuable than the last few.

This immediately suggests that there might be situations where it becomes advantageous to spend some effort in the less likely drawer.

### Deriving the allocation rule

Stone's key observation is surprisingly simple.

Suppose we spend a tiny additional amount of effort $\Delta z$ searching drawer $j$. The resulting increase in probability of detection is approximately

$$ p(j)b^{\prime}(f(j))\Delta z $$

The quantity

$$ p(j)b^{\prime}(f(j)) $$

therefore measures the **marginal return** of spending another unit of effort in drawer $j$.

For the exponential detection function,

$$
b^{\prime}(z)=e^{-z},
$$

so the marginal return becomes

$$ p(j)e^{-f(j)}. $$

Initially, drawer 1 yields the larger return because

$$ \frac{2}{3} > \frac{1}{3} $$

Consequently, the first increment of search effort should be assigned to drawer 1.

However, every additional unit of effort decreases the marginal return because the exponential detection function is concave. Eventually, the return obtained from searching drawer 1 falls to the same level as the return obtained from searching drawer 2.

At that point,

$$
p(1)e^{-f(1)} = p(2)e^{-f(2)}
$$

Stone argues that any allocation violating this condition cannot be optimal. If one drawer offered a larger marginal return than the other, we could simply move a small amount of effort from the worse location to the better one and increase the overall probability of detection.

When both drawers receive positive effort, the optimal allocation must satisfy

$$
p(1)e^{-f(1)} = p(2)e^{-f(2)}
$$

together with

$$ f(1)+f(2)=K $$

Solving the system yields

$$
f(1)=\frac{K+\log\left(\frac{p(1)}{p(2)}\right)}{2}
$$

and

$$
f(2) = \frac{K-\log\left(\frac{p(1)}{p(2)}\right)}{2}$$

For the specific prior

$$
p(1)=\frac23,\qquad p(2)=\frac13,
$$

the solution becomes

$$
f(1)=\frac{K+\log 2}{2}, f(2) = \frac{K-\log 2}{2} $$

Interestingly, this implies that if

$$
K < \log 2,
$$

the formula produces a negative value for $f(2)$, which is impossible. In that regime the optimal strategy is simply to spend the entire budget searching drawer 1.

Only once the available search effort exceeds $\log 2$ does it become worthwhile to allocate time to both drawers.

## But is this really optimal?

The derivation above has a slightly suspicious flavor.

We compared the *next* infinitesimal unit of search effort and repeatedly assigned it to whichever location offered the largest immediate gain. This feels more like a greedy algorithm than a proof of global optimality.

The question is whether maximizing the next increment of detection probability also maximizes detection over the entire budget.

This is the point where the concavity of the detection function becomes crucial.

Because the marginal returns

$$
p(j)b^{\prime}(f(j))
$$

decrease continuously as effort is accumulated, every additional unit of search effort becomes less valuable than the previous one. Whenever one location offers a larger marginal return than another, effort can be shifted toward the better location and the objective function increases.

The optimal allocation is therefore characterized by equal marginal returns across all actively searched locations. Once that equilibrium is reached, no local redistribution of effort can improve the probability of detection.

For concave detection functions such as the exponential model, this condition is not merely necessary—it is sufficient. The greedy allocation rule and the globally optimal allocation coincide.

In other words:

> Equalizing marginal returns is not a heuristic. It is the optimal search policy.

This seemingly simple observation forms the foundation of much of Bayesian search theory.

### A global optimality proof

Write $t_j=f(j)$. With unequal detection rates $a_j>0$ and costs $c_j>0$, the same problem becomes

$$ P(t)=\sum_{j=1}^2 p_j(1-e^{-a_jt_j}),\qquad t_j\geq0,\quad \sum_{j=1}^2 c_jt_j\leq K. $$

The Lagrangian is $L=P(t)-\lambda(\sum_j c_jt_j-K)+\sum_j\mu_jt_j$ with $\lambda,\mu_j\geq0$.[^lagrange] Its stationarity and complementary-slackness conditions give

$$ \frac{p_ja_je^{-a_jt_j}}{c_j}=\lambda\quad\text{if }t_j>0,\qquad \frac{p_ja_j}{c_j}\leq\lambda\quad\text{if }t_j=0. $$

Thus we equalize marginal gain **per unit of cost** in searched drawers. An unsearched drawer must offer no larger initial gain. Because detection increases with effort, an optimum uses the whole budget.

For completeness, concavity gives a direct global certificate. For any feasible allocation $t$ and a candidate $t^*$ satisfying these conditions,

$$ P(t)\leq P(t^*)+\nabla P(t^*)^\top(t-t^*)\leq P(t^*)+\lambda\sum_jc_j(t_j-t_j^*)\leq P(t^*). $$

The middle inequality uses the marginal bound at unused drawers and $t_j\geq0$ there. This proves global optimality, including boundary solutions. For positive priors and rates, the objective is strictly concave, so the allocation is unique. This conclusion assumes a stationary target, separable detection functions,[^separable] divisible effort, and no switching costs.

For the original example this yields the complete rule:

$$ (f(1),f(2))=\begin{cases}(K,0),&0\leq K\leq\log 2,\\((K+\log 2)/2,(K-\log 2)/2),&K>\log 2.\end{cases} $$

## Exploring the solution

The mathematics above is compact, but it is easier to build intuition by experimenting with the model directly.

The widget below computes the probability of detection for a large number of feasible allocations and visualizes the resulting search landscape as a heatmap. The red point indicates the analytically optimal allocation, while grey regions violate the budget constraint.

Try changing:

* the prior probability of the drawers,
* the total search budget,
* the search costs,
* and the detection rates.

A particularly interesting experiment is to gradually increase the search budget. Observe how the optimal allocation eventually transitions from "search only drawer 1" to a strategy that allocates effort to both drawers.

### How the visualization maps to the drawers

The axes are allocations, **not physical locations**: each point represents one plan $(t_1,t_2)=(f(1),f(2))$. Color is the overall probability of finding the coin under that plan, not the probability that the coin is in a particular drawer. Darker purple means a higher detection probability; grey is over budget. The black line uses the entire budget, $c_1t_1+c_2t_2=K$.

The default is exactly the article's model: $p_1=2/3$, $p_2=1/3$, $a_1=a_2=c_1=c_2=1$, with an illustrative budget $K=2$. It gives $t_1\approx1.347$, $t_2\approx0.653$, and $P\approx0.653$. Try $K=0.5$: all effort goes to drawer 1. The transition is at $K=\log 2\approx0.693$.

Changing costs or rates explores the generalized problem above. The widget solves it exactly by clipping the stationary point to the feasible interval:

$$ t_1^*=\operatorname{clip}\left(\frac{\log\left(\frac{p_1a_1/c_1}{p_2a_2/c_2}\right)+a_2K/c_2}{a_1+a_2c_1/c_2},0,K/c_1\right),\qquad t_2^*=\frac{K-c_1t_1^*}{c_2}. $$

If the entire search fails, Bayes' rule gives

$$ p_j^{\prime}=\frac{p_je^{-a_jt_j}}{p_1e^{-a_1t_1}+p_2e^{-a_2t_2}}. $$

If instead we search only one drawer and do not detect the coin, the same calculation becomes a particularly transparent negative-observation update.[^drawer-update] Under the default interior solution the two posteriors are equal. With unequal costs or rates, equal marginal gains per cost do not generally imply equal posteriors. These updates assume the coin is in one of the drawers and remains there throughout the search.

<div id="two-drawer-widget" class="search-widget">
  <h3>Interactive two-drawer Bayesian search</h3>

  <p class="widget-description">
    Adjust the prior probability, search budget, search costs and detection rates.
    The heatmap shows the probability of successful detection for each feasible
    allocation of search effort.
  </p>

  <button id="two-drawer-reset" type="button">Reset to the article example</button>
  <noscript>Enable JavaScript to explore allocations. The default solution is t₁ = 1.347, t₂ = 0.653, with detection probability 65.3%.</noscript>
  <div class="search-controls">
    <div class="search-control">
      <label for="two-drawer-p1">
        Prior probability drawer 1:
        <span id="two-drawer-p1-value" class="value-display">0.667</span>
      </label>
      <input
        id="two-drawer-p1"
        type="range"
        min="0.01"
        max="0.99"
        step="any"
        value="0.6666666666666666"
      >
      <span class="value-display">
        Prior probability drawer 2:
        <span id="two-drawer-p2-value">0.333</span>
      </span>
    </div>

    <div class="search-control">
      <label for="two-drawer-budget">
        Total search budget:
        <span id="two-drawer-budget-value" class="value-display">2.0</span>
      </label>
      <input
        id="two-drawer-budget"
        type="range"
        min="0.1"
        max="30"
        step="0.1"
        value="2"
      >
    </div>

    <div class="search-control">
      <label for="two-drawer-c1">Cost per effort in drawer 1, c₁</label>
      <input
        id="two-drawer-c1"
        type="number"
        min="0.1"
        step="0.1"
        value="1.0"
      >
    </div>

    <div class="search-control">
      <label for="two-drawer-c2">Cost per effort in drawer 2, c₂</label>
      <input
        id="two-drawer-c2"
        type="number"
        min="0.1"
        step="0.1"
        value="1.0"
      >
    </div>

    <div class="search-control">
      <label for="two-drawer-a1">Detection rate in drawer 1, a₁</label>
      <input
        id="two-drawer-a1"
        type="number"
        min="0.01"
        step="0.01"
        value="1"
      >
    </div>

    <div class="search-control">
      <label for="two-drawer-a2">Detection rate in drawer 2, a₂</label>
      <input
        id="two-drawer-a2"
        type="number"
        min="0.01"
        step="0.01"
        value="1"
      >
    </div>
  </div>

  <div class="heatmap-wrapper">
    <canvas id="two-drawer-heatmap" width="720" height="520" role="img" aria-label="Detection probability by effort in each drawer; the optimal allocation is reported below."></canvas>
  </div>

  <div id="two-drawer-result" class="search-result" role="status" aria-live="polite" aria-atomic="true"></div>

  <div class="search-formula">
    The red point marks the analytically optimal feasible allocation.
    Darker purple means higher detection probability. The black line uses the full budget.
    Grey regions violate the budget constraint.
  </div>
</div>

<script src="/assets/js/two-drawer-search.js"></script>

## OptiSearch: from the example to a package

This browser example is a self-contained demonstration. I am developing **OptiSearch**, a Python package for search-allocation experiments; implementation, reproducible examples, and release preparation remain in progress. Follow the [project overview]({{ "/projects/" | relative_url }}) for its scope.

## Where things become interesting

The two-drawer example is almost comically small. Yet most of the machinery required for real-world Bayesian search is already present:

* a prior describing where the target may be,
* a detection model describing how likely we are to find it,
* a constrained optimization problem,
* and an allocation policy derived from marginal returns.

In real search-and-rescue operations, the prior is rarely given. Instead, it must be constructed from drift models, historical incidents, witness reports, environmental conditions, terrain information, expert judgement, and increasingly sophisticated statistical models.

Likewise, the search does not end after a single allocation. Every unsuccessful search generates new information. Bayesian updating allows us to revise the posterior probability distribution and construct a new search plan based on what we have learned.[^production-update]

Finally, many real targets do not remain stationary: missing vessels drift, lost persons move on their own, and submarines maneuver. Searching for moving targets transforms the problem into a dynamic state-estimation problem involving stochastic processes, filtering, and prediction.

This is precisely the territory where Bayesian search theory grew from an elegant mathematical curiosity into an operational discipline. The search for the hydrogen bomb lost near Palomares, the recovery of the SS Central America, the location of Air France Flight 447, and modern systems such as SAROPS all build on the same underlying idea:

> Search effort is a limited resource. Use probability theory to spend it where it matters most.

# References

- Stone, L. (1975): The Theory of Optimal Search

# Notes

[^exponential]: The exponential function is not justified further and is therefore somewhat arbitrary for this example, but it has useful properties. It allows the target to be overlooked despite positive search effort, and its derivative $b^{\prime}(z)=e^{-z}$ decreases with $z$, expressing diminishing returns. It is also **memoryless**:
    $\Pr(\text{detection by }z+h\mid\text{not detected by }z)=\frac{b(z+h)-b(z)}{1-b(z)}=1-e^{-h}$.
    Thus the conditional chance of detection during the next increment $h$ does not depend on the effort already spent. The function is increasing and concave.

[^lagrange]: The multiplier method turns the constrained problem into an unconstrained expression whose stationary points also respect the constraints. Differentiating $L$ with respect to $t_j$ gives $\partial P/\partial t_j-\lambda c_j+\mu_j=0$. Complementary slackness adds $\lambda(\sum_jc_jt_j-K)=0$ and $\mu_jt_j=0$. If drawer $j$ receives positive effort, then $\mu_j=0$ and $(\partial P/\partial t_j)/c_j=\lambda$; every searched drawer therefore has the same marginal detection gain per unit cost. At an unused drawer, $\mu_j\geq0$ implies $(\partial P/\partial t_j)/c_j\leq\lambda$, so starting to search it cannot improve the solution. The multiplier $\lambda$ is also the *shadow value* of budget: locally, one additional unit of $K$ improves the optimal detection probability by approximately $\lambda$. These Karush--Kuhn--Tucker conditions are necessary here and, because the objective is concave and the feasible set is convex, sufficient for global optimality.

[^separable]: A function is **separable** when it can be written as a sum of terms that each depend on only one decision variable. Here $P(t)=\sum_j p_jb_j(t_j)$: effort $t_j$ changes the contribution of drawer $j$ but not the detection function of another drawer. Consequently, the marginal return for a drawer is the one-dimensional derivative $p_jb_j^{\prime}(t_j)$, and if every $b_j$ is concave, their weighted sum is concave. This is what lets the equal-marginal-return/KKT conditions certify the global optimum. Overlapping sensor coverage, target motion between cells, shared-resource effects, or switching costs make the objective non-separable; then one drawer's effort can change another drawer's value, and the simple equalization rule must be replaced by a coupled optimization.

[^drawer-update]: Let $H_j$ denote that the coin is in drawer $j$, and let $F_1(t)$ mean that a search of duration $t$ in drawer 1 produced no detection. Under the article's imperfect exponential detection model, $\Pr(F_1(t)\mid H_1)=e^{-a_1t}$, whereas $\Pr(F_1(t)\mid H_2)=1$ because searching drawer 1 cannot find a coin in drawer 2. Bayes' rule therefore gives
    $\Pr(H_1\mid F_1(t))=\frac{p_1e^{-a_1t}}{p_1e^{-a_1t}+p_2}$ and $\Pr(H_2\mid F_1(t))=\frac{p_2}{p_1e^{-a_1t}+p_2}$.
    With $p_1=2/3$, $p_2=1/3$, and $a_1=1$, these reduce to $p_1^{\prime}=\frac{2e^{-t}}{2e^{-t}+1}$ and $p_2^{\prime}=\frac{1}{2e^{-t}+1}$. After $t=\log 2$ hours without detection, both drawers have posterior probability $1/2$. A perfectly exhaustive inspection is a different observation model: if failure would be impossible when the coin is present, its likelihood is zero and the posterior probability of that drawer collapses to zero.

[^production-update]: A production system would usually maintain probabilities over many spatial cells, routes, or state particles rather than two drawers. Each completed search action would produce a coverage record and observations; a calibrated sensor model would assign a likelihood such as $\Pr(\text{no detection}\mid\text{target state},\text{coverage},\text{conditions})$. The service would multiply every prior weight by that likelihood, normalize the weights into a posterior, propagate them through a motion model when the target can move, and optimize the next allocation. An occupancy-grid filter, hidden Markov model, or particle filter can implement this loop. Operationally, the system also needs timestamped and versioned inputs, explicit treatment of false positives and missed detections, correlated or overlapping searches, model-calibration monitoring, and an audit trail linking each posterior change to the evidence and model version that produced it. Reusing $e^{-at}$ without validating those assumptions would make the update numerically neat but operationally unreliable.
