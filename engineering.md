---
layout: default
title: "Engineering"
permalink: "/engineering/"
---

{% if site.show_excerpts %}
  {% include home.html %}
{% else %}
  {% include archive.html title="Engineering" category="engineering" description="Build notes, small systems, tooling experiments, and project write-ups from the engineering side of my work." %}
{% endif %}
