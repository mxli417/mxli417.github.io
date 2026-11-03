(function () {
  "use strict";

  function uniqueHeadingId(heading, usedIds) {
    if (heading.id) {
      usedIds.add(heading.id);
      return heading.id;
    }

    var base = heading.textContent
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
    var id = base;
    var suffix = 2;

    while (usedIds.has(id) || document.getElementById(id)) {
      id = base + "-" + suffix;
      suffix += 1;
    }

    heading.id = id;
    usedIds.add(id);
    return id;
  }

  document.querySelectorAll("[data-generate-toc]").forEach(function (toc) {
    var article = toc.closest("article");
    var content = article && article.querySelector(".e-content");
    var list = toc.querySelector("ol");

    if (!content || !list) return;

    var headings = content.querySelectorAll("h2, h3");
    if (!headings.length) return;

    var usedIds = new Set();
    headings.forEach(function (heading) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      var id = uniqueHeadingId(heading, usedIds);

      item.className = "toc-level-" + heading.tagName.slice(1);
      link.href = "#" + id;
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.hidden = false;
  });
})();
