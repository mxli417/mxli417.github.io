---
layout: post
title: "Wappler: transcribing WhatsApp voice notes"
description: "A completed Twilio and OpenAI experiment that turns WhatsApp voice notes into text through a signed webhook and background worker."
categories: [engineering, projects, voice, transcription]
toc: true
---

Wappler was an experiment in turning a WhatsApp voice note into a text reply
using Twilio and OpenAI. The complete path worked with a real phone through the
Twilio Sandbox and an ngrok tunnel on 17 October 2026. The experiment is now
finished and retained as an engineering reference rather than a hosted service.

<p class="home-actions"><a class="btn btn--primary" href="https://github.com/mxli417/wappler">Browse the Wappler repository <span aria-hidden="true">↗</span></a></p>

## The message flow

The visible interaction is short: send a voice note and receive its transcript.
Behind that interaction, Wappler has to coordinate two external providers and
several failure boundaries:

1. Twilio sends the incoming WhatsApp message to a public webhook.
2. The API verifies the Twilio signature and checks the configured sender,
   media type, and size limits.
3. A database-backed queue stores a transcription job and duplicate protection
   prevents the same webhook from creating repeated work.
4. A background worker downloads the audio and sends it to the transcription
   API.
5. The resulting text is returned through Twilio as a WhatsApp message.

Keeping the webhook and transcription work separate is important. Provider
webhooks should be acknowledged quickly, while downloading media and waiting for
a model response may take much longer. Persisting the job also makes the state
visible when one side of the workflow fails.

## Reliability and testing

The repository includes quotas, media limits, duplicate handling, background
workers, and tests around the Twilio and OpenAI boundaries. The normal test suite
uses dummy settings and blocks external HTTP calls; paid-provider checks remain
explicit opt-in integration tests. SQLite is sufficient for the local demo,
while an unused hosting plan anticipated PostgreSQL.

The most instructive part of the project was not the transcription call itself.
It was the contract around it: exact webhook URLs, signature verification,
provider credentials, idempotency, queued work, and a clean distinction between
unit tests and tests that contact real services.

## Where the experiment stops

Wappler is a Sandbox demonstration, not a production messaging product. It
handles one supported audio attachment at a time and does not implement delivery
callbacks or a complete automatic retry policy. Audio passes through both
Twilio and OpenAI, and a static frontend cannot safely hold the credentials
required by this architecture.

Running the same workflow as a long-lived service would also require a registered
WhatsApp Business Account, operational monitoring, retention rules for private
audio, provider migration planning, and a deliberate privacy model. For a
personal transcription tool, a local-first phone application with on-device
speech recognition may be the more appropriate design.

The code, architecture notes, security guidance, and reproducible local setup
are available in the [Wappler repository](https://github.com/mxli417/wappler).
