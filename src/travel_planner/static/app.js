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

  function normalizeResult(raw, index) {
    const title = raw.name || raw.title || "Unknown";
    const tags = Array.isArray(raw.tags)
      ? raw.tags.map(String)
      : typeof raw.tags === "string"
        ? raw.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const dest = {
      id: index + 1,
      title,
      location: raw.location || "",
      image: raw.image || "",
      price: raw.price != null ? Number(raw.price) : null,
      rating: raw.rating != null ? Number(raw.rating) : null,
      duration: raw.duration || "",
      type: Array.isArray(raw.type) ? raw.type : inferTypes({ title, location: raw.location || "", description: raw.description || "" }),
      tags,
      month: raw.month || "",
      description: raw.description || "",
    };

    if (!dest.image) {
      dest.image = placeholderImage(title);
    }
    return dest;
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
    const priceBadge = dest.price != null
      ? `<div class="absolute top-4 right-4 badge badge-primary badge-lg font-medium">$${dest.price}</div>`
      : "";
    const rating = dest.rating != null
      ? `<div class="flex items-center gap-1 text-amber-500 text-sm font-medium">★ ${dest.rating}</div>`
      : "";
    const tags = dest.tags.length
      ? `<div class="flex flex-wrap gap-1 mt-4">${dest.tags.map((tag) => `<div class="badge badge-sm badge-neutral">${escapeHtml(tag)}</div>`).join("")}</div>`
      : "";
    const duration = dest.duration
      ? `<div class="text-xs text-neutral-500">${escapeHtml(dest.duration)}</div>`
      : "<div></div>";

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
              ${dest.location ? `<p class="text-sm text-neutral-500">${escapeHtml(dest.location)}</p>` : ""}
            </div>
            ${rating}
          </div>
          <p class="text-sm text-neutral-600 line-clamp-2 mt-2">${escapeHtml(dest.description || "No description available.")}</p>
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
    const price = dest.price != null
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

    return `
      <div class="flex flex-col sm:flex-row gap-6 bg-base-100 border border-base-200 rounded-3xl p-4 hover:shadow-md transition-all">
        <img src="${img}" class="w-full sm:w-52 h-40 object-cover rounded-2xl shrink-0" alt="${escapeAttr(dest.title)}"
             loading="lazy" onerror="this.src='${placeholderImage(dest.title)}'">
        <div class="flex-1 flex flex-col min-w-0">
          <div class="flex justify-between gap-4">
            <div>
              <h3 class="font-bold text-xl">${escapeHtml(dest.title)}</h3>
              ${dest.location ? `<p class="text-neutral-500">${escapeHtml(dest.location)}</p>` : ""}
            </div>
            <div class="text-right shrink-0">
              ${price}
              ${duration}
            </div>
          </div>
          <p class="flex-1 text-neutral-600 mt-2">${escapeHtml(dest.description || "No description available.")}</p>
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
    const searchTerm = ($("searchInput")?.value || "").toLowerCase().trim();
    const monthFilter = $("monthFilter")?.value || "";

    let filtered = destinations;

    if (searchTerm) {
      filtered = filtered.filter((dest) =>
        dest.title.toLowerCase().includes(searchTerm) ||
        dest.location.toLowerCase().includes(searchTerm) ||
        dest.description.toLowerCase().includes(searchTerm) ||
        dest.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

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
      showSummary(data.answer || "");
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

    $("searchInput")?.addEventListener("input", () => {
      if (hasSearched) filterResults();
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