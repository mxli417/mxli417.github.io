---
title: "Selected research: NLP benchmarks, synthetic data, and retrieval-based ICL"
layout: post
categories: research
description: Three applied NLP and Document AI projects spanning benchmark design, synthetic training data, and retrieval-based in-context learning.
toc: true
---

My published work has followed a recurring question: how well does an NLP or
Document AI method hold up once it meets a concrete task, limited data, and the
cost of real errors? The projects below move from supervised benchmarking to
synthetic training data and retrieval-based in-context learning. Across all
three, the useful result is not just the best score, but a clearer account of
where a method helps, what it should be compared against, and where it remains
unsafe to rely on.

## Benchmarking language models on survey responses

The 2021 ICAART paper with Matthias Aßenmacher presents a benchmark for
classifying open-ended responses from the American National Election Study. It
compares logistic regression with BERT, RoBERTa, and XLNet, asking when pretrained
language models provide enough practical benefit to justify their additional
complexity.

[Read the paper](https://epub.ub.uni-muenchen.de/75923/1/102551.pdf) · [DOI](https://doi.org/10.5220/0010255108660873) · [Code and benchmark repository](https://github.com/mxli417/co_benchmark)

## Synthetic training data for Document AI

The 2025 IEEE BigData paper examines synthetically generated training data for
real-estate document classification. This shifts the evaluation from a public
language benchmark to an applied Document AI setting, where labeled examples can
be scarce and documents contain both textual and visual structure.

[Publisher record](https://ieeexplore.ieee.org/abstract/document/11400789) · [Open-access manuscript](https://bonndoc.ulb.uni-bonn.de/xmlui/bitstream/handle/20.500.11811/13972/2025_Leveraging_Classification.pdf?sequence=3)

## Retrieval-based in-context learning for legal classification

The 2026 GermEval shared-task paper with Kristin Gnadt and Matthias Aßenmacher
studies retrieval-based in-context learning for detecting defamatory offences in
German social-media posts. Few-shot prompting improves on zero-shot prompting,
but retrieval offers only marginal gains over random examples and trails an
optimized static demonstration set. Concrete legal knowledge helps, while model
choice has the largest effect. The remaining false negatives make the evaluated
systems more appropriate for triage than autonomous moderation.

[Read the paper on arXiv](https://arxiv.org/abs/2609.09791) · [DOI](https://doi.org/10.48550/arXiv.2609.09791)

## A common thread

These projects use different model families and data regimes, but they share an
evaluation principle: compare against credible baselines, inspect errors that
matter in the application, and state the limits of the evidence. That principle
also informs my work on testing ML, LLM, RAG, and agent systems.

Full citations are collected in the [Papers section]({{ '/research/' | relative_url }}#papers), alongside [selected technical writing]({{ '/research/' | relative_url }}#selected-writing).
