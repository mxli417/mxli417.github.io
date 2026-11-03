---
layout: post
title: "Testing ML, LLM, and agent systems: from model metrics to decision traces"
description: "A practical testing strategy for production ML, generative AI, RAG, and tool-using agents, including drift assessment, trace evaluation, and release gates."
categories: [engineering, machine-learning, evaluation, llm, agents]
toc: true
mathjax: true
---

Traditional software tests ask whether code implements an intended rule. Machine-learning systems add a second source of behavior: a model learns rules from data. Generative systems add further variability through prompts, retrieval, sampling, tools, memory, and multi-step orchestration. A change in any one of these layers can alter the outcome even when the application code is unchanged.

This does not make conventional testing obsolete. Unit, integration, regression, contract, security, and end-to-end tests remain the foundation. It does mean that a production AI system needs a wider assurance strategy: test the code, the data, the model, the workflow, the operating environment, and the monitoring process.

The useful question is therefore not simply *“What was the model's accuracy?”* It is:

> Under which data, configuration, and operating conditions does the complete system behave acceptably—and how will we notice when those conditions change?

Google's early [ML Test Score](https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/) made this production-readiness distinction explicit. The same principle now applies to LLM and agent systems, but the unit under test is often a full trajectory rather than one prediction.

## A layered testing model

No single benchmark or judge is sufficient. I find it more useful to organize tests into six layers.

| Layer | What can fail? | Representative checks |
| --- | --- | --- |
| Software and contracts | Application logic, APIs, schemas, permissions | Unit, integration, type, contract, migration, authorization, and failure-injection tests |
| Data and knowledge | Invalid, leaked, stale, duplicated, or unrepresentative inputs | Schema checks, split integrity, provenance, freshness, retrieval coverage, and label-quality checks |
| Model behavior | Poor quality, calibration, robustness, fairness, or safety | Offline metrics, behavioral tests, counterfactuals, robustness suites, subgroup analysis, and red-team cases |
| Workflow and agents | Wrong routing, tool use, memory, handoff, or state mutation | Trace assertions, sandbox tasks, simulated users and tools, end-state verification, and side-effect checks |
| Production operation | Drift, latency, cost, outages, and feedback failures | Monitoring, canaries, shadow traffic, alert tests, rollback drills, and delayed-outcome evaluation |
| Governance and evidence | An outcome cannot be reproduced, explained, or audited | Versioned decision records, approvals, incident links, evaluation lineage, retention, and access controls |

The layers overlap by design. A wrong answer may originate in the model, an outdated retrieval index, a malformed tool result, a missing permission check, or an ambiguous product requirement. Testing only the final string makes those causes difficult to separate.

## Before training: test the data and learning pipeline

Pre-training tests should fail quickly, before an expensive run begins. Useful checks include:

- schema, type, range, unit, and missing-value contracts;
- uniqueness and referential-integrity constraints;
- duplicate and near-duplicate detection;
- train/validation/test separation at the correct entity and time level;
- leakage checks for labels, timestamps, filenames, document templates, customers, or acquisition sources;
- label vocabulary and annotation-guideline versions;
- expected class and subgroup coverage;
- deterministic preprocessing for a fixed input and configuration;
- data-loader shape, dtype, masking, padding, and batching tests;
- a one-batch overfit test and a short training smoke test;
- gradient, loss-direction, checkpoint-resume, and seed-sensitivity checks where appropriate;
- lineage from raw input through features to the training snapshot.

A random row split is not automatically a valid split. For document AI, pages from one document must not appear in both training and test data. For customer-level prediction, the same customer may need to stay in one partition. For forecasting, validation must respect time. The split should reflect the generalization claim being made.

Reproducibility also means recording the code commit, environment, data snapshot, feature or preprocessing version, hyperparameters, seeds, and produced artifact digest. Re-running training does not have to produce bit-identical floating-point values on every platform, but unexplained differences should be detectable.

## After training: go beyond an aggregate score

Accuracy, F1, log loss, intersection-over-union, BLEU, or another task metric can summarize performance, but an aggregate can hide serious failure modes. Post-training evaluation should include several complementary views.

### Statistical performance

Report uncertainty, not only a point estimate. Use confidence intervals or repeated resampling where the assumptions are appropriate. Break results down by meaningful cohorts, acquisition sources, time windows, document types, languages, and other operational slices. Inspect calibration when downstream decisions use predicted probabilities. Choose thresholds using the cost of false positives, false negatives, abstentions, and review—not an arbitrary default of 0.5.

### Behavioral tests

[CheckList](https://aclanthology.org/2020.acl-main.442/) introduced a useful vocabulary for testing NLP behavior that generalizes well beyond NLP:

- **Minimum functionality tests** check a small, explicit capability with focused examples.
- **Invariance tests** apply changes that should not materially alter the result.
- **Directional expectation tests** apply changes that should move the result in a known direction.

For a document classifier, a minimum functionality test might require a synthetic invoice to be classified as an invoice. An invariance test might vary scan resolution or harmless metadata. A directional test might add increasingly strong evidence for a class and require its score not to decrease. These tests encode product knowledge that a global metric cannot express.

Every production failure worth preventing should become a regression case. Keep a small, fast suite for pull requests and a broader suite for scheduled or release evaluation.

### Training-serving equivalence

An exported model is a new artifact. Compare the training checkpoint with the deployed representation—such as TorchScript, ONNX, or a serving runtime—on a fixed corpus and a documented tolerance. Test preprocessing and postprocessing through the actual inference entry point. A correct model behind inconsistent tokenization, image normalization, label mapping, or threshold logic is still a broken system.

## Testing LLM applications

LLM output is open-ended and often stochastic. Exact string matching is therefore useful for contracts but insufficient for quality. A practical evaluation suite mixes grader types:

1. **Deterministic graders** for schemas, required fields, citations, forbidden actions, calculations, executable code, database state, and other verifiable outcomes.
2. **Reference or rubric-based graders** for task-specific quality dimensions such as correctness, groundedness, completeness, and tone.
3. **Human review** for ambiguous, high-impact, or novel cases and for calibrating automated judges.

Prefer deterministic evidence whenever it exists. An LLM judge should not decide whether code passes tests or whether a refund was actually recorded. It may help assess whether an explanation is clear, but its rubric, model, prompt, and version are themselves test dependencies.

LLM judges can exhibit position, verbosity, self-preference, and other biases. A large study of [position bias in LLM-as-a-judge evaluation](https://aclanthology.org/2025.ijcnlp-long.18/) is a useful reminder to randomize pairwise order, use blinded candidates, include counterexamples, measure agreement with expert labels, and periodically revalidate the judge. A schema-valid judgment is not necessarily a correct judgment.

### Build an evaluation dataset, not a bag of prompts

Each case should contain:

- a stable ID and task version;
- input and relevant context;
- the behavior or outcome being tested;
- one or more explicit grading dimensions;
- expected evidence, reference facts, or valid outcome constraints;
- severity and product cohort;
- provenance: synthetic, expert-authored, production failure, or sampled traffic;
- a policy for whether the case can be used for prompt development.

Separate the development set from the release or holdout set. Otherwise prompt tuning quietly overfits the evaluation. Public benchmarks are useful for orientation, but a product needs private, representative tasks tied to actual user goals and failure costs.

Because results vary across trials, report the number of runs and the sampling configuration. For agents, both *pass@k*—at least one success in (k) attempts—and *pass^k*—all (k) attempts succeed—can be informative. A creative coding assistant may benefit from multiple attempts; a customer-facing action agent may need consistent first-attempt success. Anthropic's current [guide to agent evaluations](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) recommends separating capability suites from near-100%-pass regression suites and combining code, model, and human graders.

### RAG-specific evaluation

Retrieval-augmented generation has at least two systems to test.

For retrieval, measure whether relevant evidence was found: recall at (k), ranking quality, filters, access-control behavior, freshness, deduplication, and robustness to query paraphrases. For generation, test whether material claims are supported by the retrieved evidence, citations point to the correct source passages, uncertainty is communicated, and the answer does not treat absent evidence as evidence of absence.

Evaluate failure modes separately. A faithful answer based on irrelevant documents is a retrieval failure; a claim unsupported by good retrieved evidence is a generation failure. Keep the corpus snapshot, chunking configuration, embedding model, index version, reranker, and retrieval parameters in the evaluation record.

## Testing tool-using and multi-agent systems

An agent is not just a model response. It observes state, chooses actions, invokes tools, changes an environment, and may delegate to other agents. Its test fixture therefore needs an executable environment with controlled initial state and verifiable final state.

For each task, test at least four things:

- **Outcome:** Was the requested end state achieved?
- **Policy:** Were permissions, approvals, budgets, and prohibited actions respected?
- **Trajectory:** Were critical tools and handoffs used correctly, without loops or avoidable retries?
- **Side effects:** Were all mutations intended, idempotent where required, and recoverable?

Do not over-specify one exact tool sequence when several paths are valid. Grade the end state first, then assert only trajectory properties that matter for safety, cost, or policy. OpenAI's [trace grading guidance](https://developers.openai.com/api/docs/guides/trace-grading) uses traces to evaluate tool choices, handoffs, guardrails, and workflow behavior rather than only final text.

Agent tests should include:

- tool timeouts, partial results, malformed responses, rate limits, and retries;
- stale or conflicting memory;
- duplicated events and idempotency keys;
- ambiguous instructions and user corrections mid-task;
- approval accepted, denied, expired, or revoked;
- permission boundaries and least-privilege tool scopes;
- loop, deadlock, excessive-token, and excessive-tool-call limits;
- handoff quality and preservation of relevant context;
- concurrent actions and state conflicts;
- compensation or rollback after a partial failure;
- adversarial content returned by tools or retrieved documents.

Benchmarks such as [τ-bench](https://arxiv.org/abs/2406.12045) emphasize multi-turn interaction, tool use, policy adherence, and consistency. [AgentDojo](https://proceedings.nips.cc/paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html) demonstrates why indirect prompt injection must be tested in the complete tool-using environment: untrusted content can attempt to redirect an agent toward unauthorized actions. Security testing should measure both utility on legitimate tasks and attack success, not merely whether a detector labels text as suspicious.

## Drift assessment: detect change without overclaiming

“Drift” is often used as if it named one problem. It helps to separate several changes:

| Change | What changed? | Example signal |
| --- | --- | --- |
| Covariate or input drift | (P(X)) | Different document layouts, languages, or customer mix |
| Label or prevalence shift | (P(Y)) | A class becomes more or less common |
| Concept drift | (P(Y \mid X)) | The relationship between input and correct outcome changes |
| Prediction drift | Model scores or outputs | Confidence, refusal, tool-use, or class distribution changes |
| Performance drift | Real quality or business outcome | Error, calibration, escalation, or task-success rate changes |
| System drift | Dependencies and operating conditions | Model alias, prompt, index, tool, policy, latency, or cost changes |

When timely labels exist, monitor the metric that matters directly, with cohorts, uncertainty, and time. When labels arrive late, backfill outcome metrics and use leading indicators only for early warning. When labels are unavailable, two-sample tests, population-stability measures, distance metrics, embeddings, novelty detection, or a classifier trained to distinguish reference from current traffic can identify distribution changes.

But an input-only detector cannot establish that (P(Y \mid X)) changed. It may detect covariate shift while missing pure concept drift, or alert on harmless seasonality. A 2024 [benchmark of unsupervised drift detectors](https://link.springer.com/article/10.1007/s41060-024-00620-y) makes this limitation explicit. Drift alerts should therefore trigger diagnosis and targeted labeling, not automatic retraining by default.

A useful monitoring plan specifies:

- reference and comparison windows;
- expected seasonality and known events;
- minimum sample sizes and multiple-testing policy;
- warning and action thresholds;
- slices and cohorts that must not be hidden by aggregates;
- label delay and backfill logic;
- alert owner, investigation playbook, and escalation time;
- possible actions: observe, sample labels, shadow, canary, rollback, recalibrate, update retrieval, or retrain;
- evidence required to close the incident.

For LLM systems, drift can come from a provider model update, prompt or policy change, retrieval corpus, embedding model, tool schema, memory behavior, or traffic mix. Re-run a pinned regression suite whenever any of those dependencies changes. Monitor structured outcomes such as task success, groundedness, tool errors, approval rates, abstention, safety violations, latency, tokens, and cost—not just output embeddings.

## Decision records and traceability

Production debugging requires an answer to: *What exactly happened on this run?* A decision record should connect a user-visible outcome to the code, data, configuration, model calls, retrieval, tool actions, policy checks, and evaluations that produced it.

A practical record includes:

| Area | Suggested fields |
| --- | --- |
| Identity | Trace ID, session/task ID, timestamp, environment, release, correlation IDs |
| Provenance | Code commit, model/provider/version, artifact digest, prompt/template version, policy and guardrail version |
| Data and context | Input schema/version, redacted input reference, feature pipeline, retrieval query, document IDs and corpus/index version, memory version |
| Execution | Model and tool spans, parameters, retries, handoffs, approvals, errors, latency, token use, and cost |
| Outcome | Final response reference, structured result, state mutations, abstention or escalation, rollback status |
| Evaluation | Deterministic checks, grader and rubric version, scores, human feedback, incident or regression-case link |

Use a distributed trace ID across application, model, retrieval, queue, and tool boundaries. The W3C [Trace Context](https://www.w3.org/TR/trace-context-1/) standard defines interoperable propagation, while [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/) provide shared names for spans, metrics, and events. OpenInference adds AI-oriented conventions for [traces, tool calls, and evaluation annotations](https://arize-ai.github.io/openinference/spec/).

Traceability does **not** mean storing everything. Prompts, retrieved documents, model messages, and tool arguments may contain personal data, credentials, proprietary text, or malicious payloads. Record stable identifiers, hashes, structured summaries, and redacted payloads where possible. Define sampling, retention, access controls, and deletion. Do not depend on private chain-of-thought as an audit log; record observable decisions, evidence, actions, approvals, and outcomes.

## Release gates and production feedback

A mature release process combines fast checks with progressively more realistic evidence:

1. **Pull request:** unit, contract, schema, policy, and small deterministic regression suites.
2. **Scheduled evaluation:** larger behavioral, robustness, RAG, security, and repeated-trial suites.
3. **Pre-release:** frozen configuration, holdout evaluation, latency/cost budget, privacy review, and artifact provenance.
4. **Shadow or replay:** production-like traffic without user-visible actions; sensitive traffic requires appropriate controls and consent.
5. **Canary:** limited traffic, explicit stop conditions, and a tested rollback path.
6. **Production:** outcome monitoring, drift assessment, sampled trace review, user feedback, and incident response.

The release decision should be risk-based. A small summarization assistant and an agent that sends messages or moves money should not share the same acceptance criteria. NIST's [Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1) frames evaluation as part of lifecycle risk management, and the AI RMF calls for post-deployment monitoring, incident response, recovery, and change management—not a one-time benchmark before launch.

## Lessons from a document-AI system

My clearest lessons came from building and operating a document-classification pipeline spanning PDF ingestion, annotation, dataset construction, training, model selection, export, and production inference.

The first lesson was that the label schema is an API. Changing how multi-document scans are segmented or how a document category is defined affects annotation instructions, conversion code, dataset versions, loaders, metrics, model outputs, and serving logic. Schema versions and migration tests mattered as much as model code.

The second lesson was to split at the unit that will recur in production. Page-wise random cross-validation would have leaked document-level visual and textual patterns. Splitting by document, source, and sometimes time produced a more honest estimate of generalization.

The third lesson was that the path to production is itself a test target. Shared preprocessing packages reduced training-serving skew. Short training runs caught shape and configuration errors. Exported TorchScript artifacts were compared with their source checkpoints on a fixed sample and numerical tolerance. End-to-end fixtures exercised realistic synthetic documents through the same inference entry point used in production.

Finally, errors often pointed back to data and requirements rather than optimizer choice: insufficient examples for rare categories, annotation noise, inconsistent schemas, and business targets that the available evidence could not support. Evaluation was most useful when it created a feedback loop between data, labels, model behavior, system design, and product expectations.

## A compact starting checklist

For a new ML, LLM, or agent system, I would start with the following:

- define the user outcome and unacceptable failures;
- create 20–50 representative tasks, including real failure cases;
- add deterministic contract and end-state graders first;
- version data, prompts, policies, retrieval, tools, graders, and model configuration;
- run multiple trials for stochastic workflows and report uncertainty;
- validate automated judges against expert review;
- test permissions, side effects, retries, and adversarial tool content;
- instrument traces with privacy-aware decision records;
- monitor real outcomes and drift by meaningful cohort;
- define canary, rollback, incident, and evaluation-refresh procedures;
- promote every material production failure into the regression suite.

The central idea is simple: evaluation is not a final stage after implementation. It is the executable specification of what the system should do, the evidence used to decide whether a release is safe enough, and the feedback mechanism that keeps the system useful as its environment changes.

## Further reading

- Breck et al., [*The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction*](https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/)
- Ribeiro et al., [*Beyond Accuracy: Behavioral Testing of NLP Models with CheckList*](https://aclanthology.org/2020.acl-main.442/)
- NIST, [*Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*](https://doi.org/10.6028/NIST.AI.600-1)
- Anthropic, [*Demystifying evals for AI agents*](https://www.anthropic.com/research/demystifying-evals-for-ai-agents)
- OpenAI, [*Trace grading*](https://developers.openai.com/api/docs/guides/trace-grading)
- Sierra Research, [*τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains*](https://arxiv.org/abs/2406.12045)
- Debenedetti et al., [*AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents*](https://proceedings.nips.cc/paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html)
- OpenTelemetry, [*Semantic Conventions*](https://opentelemetry.io/docs/specs/semconv/)
- OpenInference, [*Specification*](https://arize-ai.github.io/openinference/spec/)
- Lukats et al., [*A benchmark and survey of fully unsupervised concept drift detectors on real-world data streams*](https://link.springer.com/article/10.1007/s41060-024-00620-y)
