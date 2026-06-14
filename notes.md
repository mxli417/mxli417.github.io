---
layout: default
title: "Notes"
permalink: "/notes/"
---

{% if site.show_excerpts %}
  {% include home.html %}
{% else %}
  {% include archive.html title="Notes" category="notes" description="Shorter observations, loose technical thoughts, and things I want to keep around for later." %}
{% endif %}
