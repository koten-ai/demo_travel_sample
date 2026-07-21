/* TravelPlan — search UI with Zeus API */
(function () {
  const $ = (id) => document.getElementById(id);

  let chatId = null;
  let destinations = [];
  let currentView = "grid";
  let activeFilters = [];
  let activeBudget = null;
  let hasSearched = false;

  const TYPE_KEYWORDS = {
    beach: ["beach", "coast", "island", "tropical", "surf", "ocean", "sea"],
    city: ["city", "urban", "metropolis", "downtown", "capital"],
    mountain: ["mountain", "alps", "hiking", "trek", "peak", "ski", "highland"],
    culture: ["culture", "temple", "museum", "historic", "heritage", "ancient", "art"],
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function placeholderImage(name) {
    const letter = (name || "?").charAt(0).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect fill="#e2e8f0" width="600" height="400"/>
      <text x="300" y="220" text-anchor="middle" font-size="72" fill="#64748b" font-family="sans-serif">${letter}</text>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function inferTypes(dest) {
    const text = `${dest.title} ${dest.location} ${dest.description}`.toLowerCase();
    return Object.entries(TYPE_KEYWORDS)
      .filter(([, words]) => words.some((w) => text.includes(w)))
      .map(([type]) => type);
  }

  function parsePrice(value) {
    if (value == null || value === "") return null;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const text = String(value).trim();
    if (!text) return null;
    // Prefer the lower bound of ranges like "€70-120" or "190-2500".
    const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const n = Number(match[1]);
    return Number.isFinite(n) ? n : null;
  }

  function isImageUrl(url) {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("data:image/")) return true;
    return /\.(jpe?g|png|gif|webp|svg)(\?|#|$)/i.test(url);
  }

  /** If description is a JSON hotel blob, unwrap it into flat fields. */
  function unwrapHotelBlob(raw) {
    const out = { ...raw };
    let blob = null;
    const desc = raw.description;
    if (desc && typeof desc === "object" && !Array.isArray(desc)) {
      blob = desc;
    } else if (typeof desc === "string") {
      const t = desc.trim();
      if (t.startsWith("{")) {
        try {
          const parsed = JSON.parse(t);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) blob = parsed;
        } catch (_) {
          /* not JSON */
        }
      }
    }
    if (!blob) return out;

    for (const [k, v] of Object.entries(blob)) {
      if (v == null || v === "" || v === "null") continue;
      if (out[k] == null || out[k] === "" || k === "description") {
        out[k] = v;
      }
    }
    if (typeof out.description === "object") {
      out.description = out.description.description || "";
    } else if (typeof out.description === "string" && out.description.trim().startsWith("{")) {
      try {
        const inner = JSON.parse(out.description);
        out.description = (inner && inner.description) || "";
      } catch (_) {
        out.description = "";
      }
    }
    return out;
  }

  function normalizeResult(raw, index) {
    raw = unwrapHotelBlob(raw || {});
    const title = raw.name || raw.title || "Unknown";
    const location = raw.location || raw.address || "";
    const region = [raw.city, raw.state, raw.country].filter(Boolean).join(", ");
    const tags = Array.isArray(raw.tags)
      ? raw.tags.map(String)
      : typeof raw.tags === "string"
        ? raw.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const imageCandidate = raw.image || raw.image_url || raw.photo || raw.thumbnail || "";
    const priceRaw = raw.price != null && raw.price !== "" ? String(raw.price) : "";
    const dest = {
      id: index + 1,
      title,
      location,
      region,
      address: raw.address || location || "",
      city: raw.city || "",
      state: raw.state || "",
      country: raw.country || "",
      image: isImageUrl(imageCandidate) ? imageCandidate : "",
      price: parsePrice(raw.price),
      priceLabel: priceRaw,
      url: raw.url || raw.website || raw.link || "",
      rating: raw.rating != null ? Number(raw.rating) : null,
      duration: raw.duration || "",
      type: Array.isArray(raw.type) ? raw.type : inferTypes({ title, location, description: raw.description || "" }),
      tags,
      month: raw.month || "",
      description: typeof raw.description === "string" ? raw.description : "",
    };

    // Never show raw JSON as the card blurb.
    if (dest.description.trim().startsWith("{")) {
      dest.description = "";
    }

    if (!dest.image) {
      dest.image = placeholderImage(title);
    }
    return dest;
  }

  function formatPriceBadge(dest) {
    if (dest.priceLabel) {
      return `<div class="absolute top-4 right-4 badge badge-primary badge-lg font-medium">${escapeHtml(dest.priceLabel)}</div>`;
    }
    if (dest.price != null) {
      return `<div class="absolute top-4 right-4 badge badge-primary badge-lg font-medium">$${dest.price}</div>`;
    }
    return "";
  }

  function cardDetailsHtml(dest) {
    const lines = [];
    if (dest.address) {
      lines.push(`<div class="text-xs text-neutral-500"><span class="font-semibold text-neutral-600">Address:</span> ${escapeHtml(dest.address)}</div>`);
    }
    const region = dest.region || [dest.city, dest.state, dest.country].filter(Boolean).join(", ");
    if (region && region !== dest.address) {
      lines.push(`<div class="text-xs text-neutral-500"><span class="font-semibold text-neutral-600">Location:</span> ${escapeHtml(region)}</div>`);
    }
    if (dest.priceLabel) {
      lines.push(`<div class="text-xs text-neutral-500"><span class="font-semibold text-neutral-600">Price:</span> ${escapeHtml(dest.priceLabel)}</div>`);
    }
    if (dest.url) {
      const href = escapeAttr(dest.url);
      lines.push(
        `<div class="text-xs text-neutral-500 truncate"><span class="font-semibold text-neutral-600">Website:</span> ` +
          `<a href="${href}" target="_blank" rel="noopener noreferrer" class="link link-primary">${escapeHtml(dest.url)}</a></div>`
      );
    }
    if (!lines.length) return "";
    return `<div class="mt-3 space-y-1">${lines.join("")}</div>`;
  }

  function setLoading(busy) {
    const btn = $("search-btn");
    const icon = $("search-btn-icon");
    const spinner = $("search-btn-spinner");
    const input = $("searchInput");
    if (!btn || !input) return;
    btn.disabled = busy;
    input.disabled = busy;
    icon?.classList.toggle("hidden", busy);
    spinner?.classList.toggle("hidden", !busy);
  }

  function showError(msg) {
    const el = $("error-alert");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  function hideError() {
    $("error-alert")?.classList.add("hidden");
  }

  function showSummary(text) {
    const block = $("summary-block");
    const textEl = $("summary-text");
    if (!block || !textEl) return;
    if (!text) {
      block.classList.add("hidden");
      return;
    }
    textEl.textContent = text;
    block.classList.remove("hidden");
  }

  function createCard(dest) {
    const img = escapeAttr(dest.image);
    const priceBadge = formatPriceBadge(dest);
    const rating = dest.rating != null
      ? `<div class="flex items-center gap-1 text-amber-500 text-sm font-medium">★ ${dest.rating}</div>`
      : "";
    const tags = dest.tags.length
      ? `<div class="flex flex-wrap gap-1 mt-4">${dest.tags.map((tag) => `<div class="badge badge-sm badge-neutral">${escapeHtml(tag)}</div>`).join("")}</div>`
      : "";
    const duration = dest.duration
      ? `<div class="text-xs text-neutral-500">${escapeHtml(dest.duration)}</div>`
      : "<div></div>";
    const subtitle = dest.location || dest.region || "";

    return `
      <div class="card bg-base-100 shadow-sm hover:shadow-xl border border-base-200 overflow-hidden group">
        <figure class="relative h-56">
          <img src="${img}" class="card-img w-full h-full object-cover" alt="${escapeAttr(dest.title)}"
               loading="lazy" onerror="this.src='${placeholderImage(dest.title)}'">
          ${priceBadge}
        </figure>
        <div class="card-body p-5">
          <div class="flex justify-between items-start gap-2">
            <div>
              <h3 class="font-bold text-lg leading-tight">${escapeHtml(dest.title)}</h3>
              ${subtitle ? `<p class="text-sm text-neutral-500">${escapeHtml(subtitle)}</p>` : ""}
            </div>
            ${rating}
          </div>
          <p class="text-sm text-neutral-600 line-clamp-3 mt-2">${escapeHtml(dest.description || "No description available.")}</p>
          ${cardDetailsHtml(dest)}
          ${tags}
          <div class="card-actions justify-between items-center mt-6">
            ${duration}
            <button type="button" data-book-id="${dest.id}" class="btn btn-primary btn-sm">Book Now</button>
          </div>
        </div>
      </div>
    `;
  }

  function createListItem(dest) {
    const img = escapeAttr(dest.image);
    const price = dest.priceLabel
      ? `<div class="text-xl font-semibold text-primary">${escapeHtml(dest.priceLabel)}</div>`
      : dest.price != null
        ? `<div class="text-2xl font-semibold text-primary">$${dest.price}</div>`
        : "";
    const duration = dest.duration
      ? `<div class="text-xs text-neutral-500">${escapeHtml(dest.duration)}</div>`
      : "";
    const rating = dest.rating != null
      ? `<div class="flex items-center gap-1"><span class="text-amber-500">★</span><span class="font-medium">${dest.rating}</span></div>`
      : "";
    const tags = dest.tags.length
      ? `<div class="flex gap-1">${dest.tags.map((tag) => `<span class="text-xs badge badge-neutral">${escapeHtml(tag)}</span>`).join("")}</div>`
      : "";
    const subtitle = dest.location || dest.region || "";

    return `
      <div class="flex flex-col sm:flex-row gap-6 bg-base-100 border border-base-200 rounded-3xl p-4 hover:shadow-md transition-all">
        <img src="${img}" class="w-full sm:w-52 h-40 object-cover rounded-2xl shrink-0" alt="${escapeAttr(dest.title)}"
             loading="lazy" onerror="this.src='${placeholderImage(dest.title)}'">
        <div class="flex-1 flex flex-col min-w-0">
          <div class="flex justify-between gap-4">
            <div>
              <h3 class="font-bold text-xl">${escapeHtml(dest.title)}</h3>
              ${subtitle ? `<p class="text-neutral-500">${escapeHtml(subtitle)}</p>` : ""}
            </div>
            <div class="text-right shrink-0">
              ${price}
              ${duration}
            </div>
          </div>
          <p class="flex-1 text-neutral-600 mt-2 line-clamp-3">${escapeHtml(dest.description || "No description available.")}</p>
          ${cardDetailsHtml(dest)}
          <div class="flex flex-wrap items-center justify-between gap-3 mt-auto pt-3">
            <div class="flex items-center gap-4">
              ${rating}
              ${tags}
            </div>
            <button type="button" data-book-id="${dest.id}" class="btn btn-primary btn-sm sm:btn-md">Plan This Trip</button>
          </div>
        </div>
      </div>
    `;
  }

  function updateResultsHeader(filtered, query) {
    const title = $("resultsTitle");
    const count = $("resultsCount");
    if (!title || !count) return;

    if (!hasSearched) {
      title.textContent = "Discover Destinations";
      count.textContent = "Search above to find your next adventure";
      return;
    }

    title.textContent = query ? `Results for "${query}"` : "All Destinations";
    const n = filtered.length;
    count.textContent = `${n} place${n === 1 ? "" : "s"} found`;
  }

  function setView(view) {
    currentView = view;
    $("gridBtn")?.classList.toggle("btn-active", view === "grid");
    $("listBtn")?.classList.toggle("btn-active", view === "list");
    $("resultsGrid")?.classList.toggle("hidden", view !== "grid");
    $("resultsList")?.classList.toggle("hidden", view !== "list");
  }

  function renderResults(filteredDestinations) {
    const gridContainer = $("resultsGrid");
    const listContainer = $("resultsList");
    const emptyState = $("emptyState");
    const noResultsState = $("noResultsState");
    const query = $("searchInput")?.value.trim() || "";

    if (!gridContainer || !listContainer) return;

    gridContainer.innerHTML = "";
    listContainer.innerHTML = "";

    if (!hasSearched) {
      emptyState?.classList.remove("hidden");
      noResultsState?.classList.add("hidden");
      gridContainer.classList.add("hidden");
      listContainer.classList.add("hidden");
      updateResultsHeader([], query);
      return;
    }

    emptyState?.classList.add("hidden");
    updateResultsHeader(filteredDestinations, query);

    if (filteredDestinations.length === 0) {
      noResultsState?.classList.remove("hidden");
      gridContainer.classList.add("hidden");
      listContainer.classList.add("hidden");
      return;
    }

    noResultsState?.classList.add("hidden");
    if (currentView === "grid") {
      gridContainer.classList.remove("hidden");
      listContainer.classList.add("hidden");
    } else {
      gridContainer.classList.add("hidden");
      listContainer.classList.remove("hidden");
    }

    filteredDestinations.forEach((dest) => {
      gridContainer.innerHTML += createCard(dest);
      listContainer.innerHTML += createListItem(dest);
    });

    gridContainer.querySelectorAll("[data-book-id]").forEach((btn) => {
      btn.addEventListener("click", () => bookTrip(Number(btn.dataset.bookId)));
    });
    listContainer.querySelectorAll("[data-book-id]").forEach((btn) => {
      btn.addEventListener("click", () => bookTrip(Number(btn.dataset.bookId)));
    });
  }

  function filterResults() {
    const monthFilter = $("monthFilter")?.value || "";

    // Local filters only (type / budget / month / sort). The search input is the
    // agent query, not a substring match against card titles — applying it emptied
    // the grid after NL searches like "Nearest hotels to Paris airports".
    let filtered = destinations;

    if (activeFilters.length > 0) {
      filtered = filtered.filter((dest) => dest.type.some((t) => activeFilters.includes(t)));
    }

    if (activeBudget != null) {
      filtered = filtered.filter((dest) => dest.price == null || dest.price <= activeBudget);
    }

    if (monthFilter) {
      filtered = filtered.filter((dest) => !dest.month || dest.month === monthFilter);
    }

    const sortMode = $("sortSelect")?.value || "relevance";
    filtered = [...filtered];
    if (sortMode === "price-low") {
      filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sortMode === "price-high") {
      filtered.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    } else if (sortMode === "rating") {
      filtered.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    }

    renderResults(filtered);
  }

  function toggleFilter(btn) {
    const filterValue = btn.getAttribute("data-filter");
    if (!filterValue) return;

    if (activeFilters.includes(filterValue)) {
      activeFilters = activeFilters.filter((f) => f !== filterValue);
      btn.classList.remove("badge-primary", "text-white");
      btn.classList.add("badge-outline");
    } else {
      activeFilters.push(filterValue);
      btn.classList.add("badge-primary", "text-white");
      btn.classList.remove("badge-outline");
    }
    filterResults();
  }

  function toggleBudget(btn) {
    const maxPrice = parseInt(btn.getAttribute("data-max"), 10);
    document.querySelectorAll(".budget-btn").forEach((b) => {
      b.classList.remove("btn-primary", "text-white");
      b.classList.add("btn-outline");
    });

    if (activeBudget === maxPrice) {
      activeBudget = null;
    } else {
      activeBudget = maxPrice;
      btn.classList.add("btn-primary", "text-white");
      btn.classList.remove("btn-outline");
    }
    filterResults();
  }

  function resetFilters() {
    activeFilters = [];
    activeBudget = null;

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("badge-primary", "text-white");
      btn.classList.add("badge-outline");
    });
    document.querySelectorAll(".budget-btn").forEach((btn) => {
      btn.classList.remove("btn-primary", "text-white");
      btn.classList.add("btn-outline");
    });
    if ($("monthFilter")) $("monthFilter").value = "";
    filterResults();
  }

  function resetAll() {
    if ($("searchInput")) $("searchInput").value = "";
    resetFilters();
    if (!hasSearched) renderResults([]);
  }

  function bookTrip(id) {
    const dest = destinations.find((d) => d.id === id);
    if (dest) {
      alert(`🎉 Trip to ${dest.title} booked!\n\n(This is a demo — in a real app this would open the booking flow.)`);
    }
  }

  async function performSearch() {
    hideError();
    const query = ($("searchInput")?.value || "").trim();
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, chat_id: chatId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showError(data.error || `Request failed (${res.status})`);
        return;
      }

      chatId = data.chat_id;
      hasSearched = true;
      destinations = (data.results || []).map(normalizeResult);
      // Prefer a short summary; full markdown answer is still in the debug/trace panel.
      const summary =
        (data.structured_answer && (data.structured_answer.context || data.structured_answer.tip)) ||
        (destinations.length
          ? `Found ${destinations.length} matching place${destinations.length === 1 ? "" : "s"}.`
          : data.answer || "");
      showSummary(summary);
      filterResults();

      if (typeof window.appendTraceCard === "function") {
        window.appendTraceCard(query, data);
        window.openDebugPanel?.();
      }
    } catch (err) {
      showError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function init() {
    $("search-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      performSearch();
    });

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => toggleFilter(btn));
    });
    document.querySelectorAll(".budget-btn").forEach((btn) => {
      btn.addEventListener("click", () => toggleBudget(btn));
    });

    $("monthFilter")?.addEventListener("change", filterResults);
    $("sortSelect")?.addEventListener("change", filterResults);
    $("gridBtn")?.addEventListener("click", () => setView("grid"));
    $("listBtn")?.addEventListener("click", () => setView("list"));
    $("reset-filters-btn")?.addEventListener("click", resetFilters);
    $("reset-all-btn")?.addEventListener("click", resetAll);

    renderResults([]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();