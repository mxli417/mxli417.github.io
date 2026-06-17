---
title: "🔍 Looking for the uncertain: the Theory of Optimal Search (Stone, 1975)"
layout: post
categories: [notes, optimal-search, bayesian-search, statistics]
---

<link rel="stylesheet" href="/assets/css/bayesian-search.css">

## Ideas living rent-free

Since I started my journey in applied statistics, one topic in particular has
kept pulling me back in. For years now, the *Theory of Optimal Search* (also
known as *Bayesian search*) and its applications to search-and-rescue
operations, vessel finding, and disaster recovery have been living rent-free in
my head.

After stumbling over one of the rare copies of Lawrence Stone's 1975 monograph
at TUM Munich, I realized that I had already brushed against the same material
in a variety of forms earlier:

- in the search for the SS Central America, which I first encountered in a book
  I read as a tech-loving child,
- in the search for the lost A-bomb near Palomares (1966),
- in the disaster recovery and search operations after Air France Flight 447,
- and in SAROPS, the search-and-rescue planning software also reported to have
  been used around the Deepwater Horizon disaster.

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
is hidden in one of two drawers. The searcher **assumes** (a-prioir) that the probability 
distribution of either drawer to hold the coin is:

|drawer 1| drawer 2|
|:-----:|:-----:|
| p(1)  | p(2)  |
| $\frac{2}{3}$ | $\frac{1}{3}$|

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
An interesting choice[1] is the exponential function $b(z)=1-e^{-z}$ where $z \ge 0$ is the time spent looking, measured in hours
* an **allocation** $f$ where $f(j)$ is the amount of time spent looking in cell $j$ for $j=1,2$
* an **objective function**: 
$$ \\ P[f] \\ p(1)b(f(1)) + p(2)b(f(2)) \\ $$
which gives the overall probability of detection
* and a **cost function**: $\\ C[f] \\ f(1)+f(2) \\$ which measures the total search effort associated with the allocation.

The optimization problem can now be stated compactly as:
$$ \max_f P[f] $$

subject to

$$ C[f] \le K $$

In words:

> Among all feasible allocations of search effort, find the one that maximizes the probability of detection.

At first glance, the answer seems obvious. Drawer 1 is twice as likely to contain the coin as drawer 2, so why not spend all available effort searching drawer 1?

The catch is that searching is imperfect. Even if the coin is present, it may be overlooked. Moreover, the detection function exhibits diminishing returns: the first few minutes spent searching a location are usually more valuable than the last few.

This immediately suggests that there might be situations where it becomes advantageous to spend some effort in the less likely drawer.

---

With this, we can solve for:

max pf here

Then special soution for this form of detection function.

Storyline for next section: But - is this really an optimal solution or rather a myopic approach? 

--- 

### Deriving the allocation rule

Stone's key observation is surprisingly simple.

Suppose we spend a tiny additional amount of effort $\Delta z$ searching drawer $j$. The resulting increase in probability of detection is approximately

$$ p(j)b'(f(j))\Delta z $$

The quantity

$$ p(j)b'(f(j)) $$

therefore measures the **marginal return** of spending another unit of effort in drawer $j$.

For the exponential detection function,

$$
b'(z)=e^{-z},
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

The optimal allocation must therefore satisfy

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

Stone explicitly addresses this concern:

> "[...] it still remains to show that the policy that yields the maximum short-term gain also produces an optimal long-term policy."

This is the point where the concavity of the detection function becomes crucial.

Because the marginal returns

$$
p(j)b'(f(j))
$$

decrease continuously as effort is accumulated, every additional unit of search effort becomes less valuable than the previous one. Whenever one location offers a larger marginal return than another, effort can be shifted toward the better location and the objective function increases.

The optimal allocation is therefore characterized by equal marginal returns across all actively searched locations. Once that equilibrium is reached, no local redistribution of effort can improve the probability of detection.

For concave detection functions such as the exponential model, this condition is not merely necessary—it is sufficient. The greedy allocation rule and the globally optimal allocation coincide.

In other words:

> Equalizing marginal returns is not a heuristic. It is the optimal search policy.

This seemingly simple observation forms the foundation of much of Bayesian search theory.

## Exploring the solution

The mathematics above is compact, but it is easier to build intuition by experimenting with the model directly.

The widget below computes the probability of detection for a large number of feasible allocations and visualizes the resulting search landscape as a heatmap. The red point indicates the numerically optimal allocation, while grey regions violate the budget constraint.

Try changing:

* the prior probability of the drawers,
* the total search budget,
* the search costs,
* and the detection rates.

A particularly interesting experiment is to gradually increase the search budget. Observe how the optimal allocation eventually transitions from "search only drawer 1" to a strategy that allocates effort to both drawers.

<div id="two-drawer-widget" class="search-widget">
  <h3>Interactive two-drawer Bayesian search</h3>

  <p class="widget-description">
    Adjust the prior probability, search budget, search costs and detection rates.
    The heatmap shows the probability of successful detection for each feasible
    allocation of search effort.
  </p>

  <div class="search-controls">
    <div class="search-control">
      <label for="two-drawer-p1">
        Prior probability drawer 1:
        <span id="two-drawer-p1-value" class="value-display">0.60</span>
      </label>
      <input
        id="two-drawer-p1"
        type="range"
        min="0.01"
        max="0.99"
        step="0.01"
        value="0.60"
      >
      <span class="value-display">
        Prior probability drawer 2:
        <span id="two-drawer-p2-value">0.40</span>
      </span>
    </div>

    <div class="search-control">
      <label for="two-drawer-budget">
        Total search budget:
        <span id="two-drawer-budget-value" class="value-display">10.0</span>
      </label>
      <input
        id="two-drawer-budget"
        type="range"
        min="1"
        max="30"
        step="0.1"
        value="10"
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
        value="0.35"
      >
    </div>

    <div class="search-control">
      <label for="two-drawer-a2">Detection rate in drawer 2, a₂</label>
      <input
        id="two-drawer-a2"
        type="number"
        min="0.01"
        step="0.01"
        value="0.25"
      >
    </div>
  </div>

  <div class="heatmap-wrapper">
    <canvas id="two-drawer-heatmap" width="720" height="520"></canvas>
  </div>

  <div id="two-drawer-result" class="search-result"></div>

  <div class="search-formula">
    The red point marks the numerically optimal feasible allocation.
    Grey regions violate the budget constraint.
  </div>
</div>

<script src="/assets/js/two-drawer-search.js"></script>

## Why is this called the theory of **optimal** search?

**TBD**

The question Stone tries to answer is: 
> [..] it still remains to show that the policy that yields the maximum short-term gain also produces an optimal long-term policy [..]

--- 

Lagrange approach and optimality proof TBD

Optimality questions and notes 

--- 

## Where things become interesting

The two-drawer example is almost comically small. Yet most of the machinery required for real-world Bayesian search is already present:

* a prior describing where the target may be,
* a detection model describing how likely we are to find it,
* a constrained optimization problem,
* and an allocation policy derived from marginal returns.

The hard part is scaling these ideas.

In real search-and-rescue operations, the prior is rarely given. Instead, it must be constructed from drift models, historical incidents, witness reports, environmental conditions, terrain information, expert judgement, and increasingly sophisticated statistical models.

Likewise, the search does not end after a single allocation. Every unsuccessful search generates new information. Bayesian updating allows us to revise the posterior probability distribution and construct a new search plan based on what we have learned.

Finally, many real targets do not remain stationary. Missing vessels drift. Aircraft debris fields move with ocean currents. Submarines maneuver. Lost persons walk. Searching for moving targets transforms the problem into a dynamic state-estimation problem involving stochastic processes, filtering, and prediction.

This is precisely the territory where Bayesian search theory grew from an elegant mathematical curiosity into an operational discipline. The search for the hydrogen bomb lost near Palomares, the recovery of the SS Central America, the location of Air France Flight 447, and modern systems such as SAROPS all build on the same underlying idea:

> Search effort is a limited resource. Use probability theory to spend it where it matters most.

# References

- Stone, L. (1975): The Theory of Optimal Search

# Notes

- [1]: The exponential function is not justified further and hence somewhat arbitrary w.r.t. the example, but it has handy features. First, it models the possibility that the target will be overlooked with a (small) positive probability despite the search effort, i.e. the searcher can "overlook" a coin with that detection function, which feels natural and reasonable. Second, the more time the searcher spends on a cell, the slower the rate of increase of probability of detection b.c. $b`(z) = e^{-z}$ is decreasing. This saturation effect or law of diminishing returns is utilized in other areas of research as well. Additionally, the exponential detection function is **memoryless**, i.e. 
$Pr(detection \: time \: z + h \:|\: failure \:to \:detect\:by\:time\:z) = \frac{b(z+h)-b(z)}{1-b(z)} = 1 - e^{-h}$ so the probability of detecting the target in the next time increment $h$ is independent from the previous time spent searching $z$. Note that this function is of the **concave** kind.
