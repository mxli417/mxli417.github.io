---
title: "vbot — voice-first LLM interactions"
layout: post
---

Over the past months I’ve been working on a Twilio-based project
(internally dubbed *wappler*), mainly to explore what it actually takes
to build reliable voice-driven applications under real-world constraints.

As part of that work, I decided to step back and investigate a related question:

**How far can one get today with a phone-call-based AI using mostly off-the-shelf components?**

That exploration resulted in **vbot**, also referred to as **scarlett**.

📲 Repository:  
https://github.com/mxli417/vbot


## 💡 Motivation

Voice interfaces are often presented as a solved problem. In practice, they
remain surprisingly brittle once one moves beyond controlled demos:

- latency becomes noticeable very quickly  
- turn-taking is harder than expected  
- speech-to-text and text-to-speech quality strongly influence perceived intelligence  
- conversational flow breaks easily  
- error handling becomes non-trivial  

Using Twilio’s **ConversationRelay**, I wanted to explore how far one can go
using:

- real phone calls
- off-the-shelf speech-to-text (STT) and text-to-speech (TTS)  
- live LLM calls  
- minimal orchestration code  

The goal was not to build a product, but to better understand the
constraints and failure modes of voice-first interaction.  
With the limited credit available in a trial account, I started building 
and experimenting.

## 📡 What `ConversationRelay` actually does

Twilio’s **ConversationRelay** abstracts away much of the low-level complexity
involved in building voice-driven applications.

At a high level, it:

- handles audio streaming for phone calls  
- performs speech-to-text (STT) on incoming audio  
- forwards transcribed text to your backend over WebSockets  
- accepts textual responses from your service  
- converts them back to speech (TTS)  
- streams the synthesized audio back to the caller  

All of this is configured via **TwiML**, Twilio’s XML-based markup language for
controlling call behavior.

Conceptually, the flow looks like this:

```

Caller
↓
Twilio Voice
↓
ConversationRelay
├── Speech-to-Text
├── WebSocket ↔ Your Backend
└── Text-to-Speech
↓
Caller

```

From the application’s perspective, this means you never have to deal with raw
audio — only with text input and output.

This abstraction is powerful, but also constraining: it simplifies development
significantly, while making latency, streaming behavior, and voice quality
largely dependent on the platform.

## 🤖 What vbot (scarlett) actually does

vbot connects these components in the simplest possible way:

- incoming calls are routed via Twilio  
- ConversationRelay handles STT and TTS  
- the backend forwards text to an LLM  
- responses are streamed back as synthesized speech  

It supports:

- near real-time voice interaction with an LLM-backed agent  
- experimentation with different TTS voices  
- rapid iteration on prompt logic  
- minimal abstraction by design  

The agent itself is intentionally minimal.  
My focus was primarily on system behavior: testing Twilio’s capabilities,
evaluating voice quality, and identifying the practical pitfalls of
voice-based interaction.


## 📣 Voice choice and perceived intelligence

One of the most striking observations was how strongly voice choice
influences perceived intelligence, likability, and usability.

In practice:

- latency matters more than model size  
- streaming responses feel dramatically more natural  
- expressive voices significantly improve perceived quality  
- small timing issues can completely break conversational flow  

Twilio ConversationRelay allows selecting voices from multiple providers,
including:

- **Google Cloud TTS**
- **Amazon Polly**
- **ElevenLabs** (including expressive voices such as their
  “Michael Caine”-style models)

This makes it possible to empirically evaluate how different voices affect
interaction quality — something that is difficult to appreciate without
running real calls.

## 🤓 Observations

A few things became clear rather quickly:

- perceived intelligence correlates more with latency than model capability  
- streaming is essential for natural interaction  
- most complexity lies in orchestration, not in the LLM  
- voice-first interfaces expose failure modes that text UIs tend to hide 
- security and proper setup of secure phone call handling offers unique challenges 

In practice, *voice AI* turns out to be much more about **systems engineering**
than about AI models themselves.

## 🛣️ Where this might go

I currently see this project primarily as a research playground for exploring:

- callable “companion” agents  
- task-oriented voice workflows  
- conversational state and memory  
- hybrid human / AI call routing  
- voice-based information access  

Not as a product, but as a way to better understand what voice-first
LLM interaction can realistically support today.


## 💭 Closing thoughts

vbot (scarlett) is intentionally small and incomplete.

It exists to answer a simple question:

> *How usable can an LLM be when the keyboard is removed and everything happens through a phone call?*

So far, the answer is: **more usable than expected — but far from trivial.**

If nothing else, it has been a useful way to explore the practical limits of
current voice + LLM stacks.


## 📚 References

- Twilio ConversationRelay — Overview  
  https://www.twilio.com/docs/voice/conversationrelay  

- ConversationRelay Voice Configuration  
  https://www.twilio.com/docs/voice/conversationrelay/voice-configuration  

- Twilio ConversationRelay Reference Architecture  
  https://www.twilio.com/en-us/blog/developers/tutorials/product/reference-architecture-aws-conversationrelay-voice-ai-app  

- Twilio Markup Language (TwiML)  
  https://www.twilio.com/docs/glossary/what-is-twilio-markup-language-twiml  

- ElevenLabs (voice synthesis)  
  https://elevenlabs.io  
