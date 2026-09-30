---
layout: post
title: "The state of contextualized German hate-speech research in 2026"
categories: [research]
status: Research discussion
description: A focused review of German-language hate-speech research, from isolated posts to reusable discussion context and operational moderation.
---

One thing about hate-speech classification has kept bothering me: we often ask a model to judge a post after removing much of the situation in which someone wrote it.

Consider a reply as unremarkable as *“Exactly. They should all go.”* Who are “they”? Football players? Members of a government? An ethnic group? The missing information can change the interpretation entirely. A larger language model may be better at guessing, but guessing is still what we are asking it to do.

In an application, that reply may come with a parent comment, an article, a timestamp, or a discussion history. This leaves a question that sits somewhere between NLP research and engineering:

> How much of the problem are we solving when we classify the post, but discard the conversation?

This is a focused reading of the literature available by **30 September 2026**, rather than an exhaustive survey. By “German” I mean German-language research, including work on Austrian and Swiss settings. Hate speech, offensive language, toxicity, and moderation decisions overlap, but their labels are not interchangeable.

## The isolated post is a useful simplification—with a cost

The early shared tasks made German offensive-language detection accessible and comparable. [Wiegand, Siegel and Ruppenhofer's GermEval 2018 overview](https://www.lsv.uni-saarland.de/wp-content/publications/2018/germeval2018_wiegand.pdf) describes tweet classification; the [released files](https://github.com/uds-lsv/GermEval-2018-Data) provide tweet text and labels rather than reconstructed discussions. That is a sensible benchmark boundary. It is also a boundary on what its scores can tell us about conversational understanding.

The distinction matters at annotation time already. A label assigned after reading a thread may require evidence absent from the model's input. Conversely, labels assigned without the thread may encode a different interpretation. Outside German, [Yu, Blanco and Hong (2022)](https://aclanthology.org/2022.naacl-main.433/) demonstrate this directly for hate speech and counterspeech: showing the parent comment changes human judgments, and their contextual models improve over isolated-comment models. [Vidgen et al.'s Contextual Abuse Dataset, CAD (2021)](https://aclanthology.org/2021.naacl-main.182/), likewise makes conversation-aware annotation central to the resource.

This is also where the word *contextualized* can become misleading. BERT contextualizes tokens within the input it receives. It does not thereby recover the discussion that was left out. Encoder-only Transformers can process surrounding messages; an LLM cannot reliably infer a missing parent post merely by being larger.

## German research has already moved beyond isolated text

There is considerably more here than a claim of “missing context research” would suggest. The relevant resources answer different questions:

| Resource | What it contributes to the context question |
| --- | --- |
| [One Million Posts, Schabus et al. (2017)](https://doi.org/10.1145/3077136.3080711) | German-language newspaper discussions with parent links, article information, pseudonymous user IDs, and timestamps. A moderation corpus, not a dedicated binary hate-speech benchmark. |
| [DeTox, Demus et al. (2022)](https://aclanthology.org/2022.woah-1.14/) | 10,278 annotated German comments; about half come from coherent conversation segments. Rich labels include hate speech, toxicity, and targets. |
| [HASOC 2022, Modha et al.](https://ceur-ws.org/Vol-3395/T7-1.pdf) | A conversational task with a small German component alongside Hinglish. Parent posts, comments, and replies matter to the task definition. |
| [HOCON34k, Keller et al. (iiWAS 2024)](https://doi.org/10.1007/978-3-031-78090-5_18) · [Data](https://zenodo.org/records/12665948) | German newspaper comments annotated for hate speech and whether sufficient context is present. Context adequacy is useful information, but is not itself a reconstructed thread. |
| [HICC, Schmid et al. (2025)](https://aclanthology.org/2025.konvens-1.15/) | German X comments paired with the root post and preceding direct replies, collected in a digital-streetwork setting. |
| [ToxiREX, Schouten et al. (2026 preprint)](https://arxiv.org/abs/2606.27981) | Reddit subthreads in six languages, including German, with structured annotations of toxic implications. Training annotations are LLM-generated; test annotations are human-produced. |

The [One Million Posts release](https://ofai.github.io/million-post-corpus/) is particularly relevant to the engineering angle: it preserves relationships between comments and articles instead of reducing everything to independent rows. The accompanying [deployment paper by Schabus and Skowron (2018)](https://aclanthology.org/L18-1253/) describes a moderator-support system and explicitly discusses the differences between academic and industrial requirements. The connection to practice has been part of this literature for years.

More recently, [Krejca et al. (2025, preprint)](https://arxiv.org/abs/2505.20963) use the *Der Standard* corpus to examine context such as user history and article themes. Their CNN and LSTM models benefit, while their zero-shot ChatGPT setup does not. That is evidence for examining which context helps which system; it is not a universal ranking of model families.

HICC addresses the conversational question more directly. The authors report substantial recall gains on some of the hardest examples—up to 19 percentage points—while aggregate gains are smaller and depend on the model. Its intervention-oriented collection and recall-focused main evaluation matter: these findings do not establish the false-positive burden of a general moderation stream. The [paper](https://aclanthology.org/2025.konvens-1.15.pdf) is explicit about that limitation.

There is now directly relevant 2026 evidence as well. [Nienhaus et al., *Leveraging Conversational Context for German Hate Speech Detection With Large Language Models*](https://doi.org/10.1109/ACCESS.2026.3718369), evaluate different context levels on gutefrage.net. They report improvements for GPT-4.1 mini in most context conditions, but no corresponding benefit for Gemma 3 IT 12B under chain-of-thought prompting. Context can clarify stance and targets; it can also encourage false positives in polarized discussions. The [author-uploaded paper](https://www.researchgate.net/publication/411028691_Leveraging_Conversational_Context_for_German_Hate_Speech_Detection_with_Large_Language_Models) gives the conditions behind those results.

ToxiREX extends the discussion to structured interpretations of implicit toxicity. Its multilingual totals should not be mistaken for the size of its German subset, and its annotation scheme is broader than binary hate detection. Together, these studies make the situation fairly clear: **context matters, but its benefits depend on the task, the sample, and the way it is supplied.**

## The remaining gap is also an engineering gap

KIVI is a useful example of why this matters beyond leaderboard scores. Germany's [14 state media authorities use it](https://www.medienanstalt-nrw.de/en/topics/ai-in-media-regulation.html) to support detection and human assessment of potentially unlawful content. The developer describes [prioritized worklists, audiovisual inputs, and links to original sources](https://www.condat.de/erfolgsgeschichten/ki-basiertes-content-monitoring). The authority's [data-processing notice](https://www.medienanstalt-nrw.de/datenschutzerklaerung.html) also lists URLs, dates, regions, and reactions.

Those descriptions establish a workflow richer than isolated text classification. They do **not** reveal whether KIVI's classifiers consume complete threads or particular metadata fields. Nor is regulatory review the same task as newspaper moderation. My point is about the information surrounding the decision, not a claim about KIVI's internal model.

Four different things can get conflated: context exists on a platform; an application can retrieve it; an annotator or reviewer sees it; a model receives it. The distance between these is where a substantial part of the practical problem lives.

Even a contextual dataset may be difficult to reuse. The [DeTox repository](https://github.com/hdaSprachtechnologie/detox) distributes IDs and annotations publicly and directs researchers to request the complete text. The [HICC repository](https://github.com/larscarl/hicc) documents reconstruction through X's API. A paper can preserve the idea of a conversation while a later researcher still struggles to recover its contents. Deleted posts and restricted access then change the evidence available for reproduction.

That is a more precise concern than saying the field has ignored context. We have meaningful contextual resources, but a published result, an accessible dataset, and a reproducible operational input are different achievements.

## What a useful next dataset should preserve

For me, the implication is fairly practical. A new German-language resource would need to add something beyond another collection of labeled posts. It should make the **relationship between the target and its context** usable:

- Preserve parent and root links, reply order, and article or thread identifiers, with a clear account of missing material.
- Document exactly what annotators saw, retain disagreement, and distinguish insufficient evidence from a confident negative label.
- Specify a decision time. Later replies, accumulated reactions, or a subsequent deletion cannot quietly become evidence for an earlier decision.
- Include ordinary non-hateful discussion and difficult counterexamples, so that recovering implicit hate does not hide a growing false-positive workload.
- Provide a documented access route, versioned releases, and thread-separated splits; metadata fields need provenance and a reason to be included.

These are my synthesis of the requirements, not properties I claim every existing resource lacks. The [2023 comparison of German datasets by Bertram, Schäfer and Mandl](https://ceur-ws.org/Vol-3630/LWDA2023-paper19.pdf) is a useful reminder that collection choices and label definitions also shape what transfers between datasets.

And adding all available text is not sufficient. [Bourgeade et al. (2024), *Humans Need Context, What about Machines?*](https://aclanthology.org/2024.lrec-main.740/), examine why incorporating conversation produces inconsistent results. Context has to help interpret the target; a model should not mark an otherwise benign reply hateful merely because its neighbours are hateful.

That is where I think the interesting work now sits. German contextual hate-speech research in 2026 has moved well beyond the isolated post, but making that context consistently accessible, interpretable, and useful remains unfinished. A carefully assembled dataset could contribute here—provided it builds on these resources and preserves the conversation as evidence, rather than treating it as disposable background.
