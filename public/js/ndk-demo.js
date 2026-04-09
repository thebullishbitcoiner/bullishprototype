import NDK from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

const RELAY_URLS = [
    "wss://relay.damus.io",
    "wss://relay.primal.net"
];

const ndk = new NDK({
    explicitRelayUrls: RELAY_URLS
});

let relayStatusTimer = null;
let suppressRelayDrivenStatus = false;
let lastRenderedEvents = [];

const KIND_OPTIONS = [
    [0, "0 — Profile metadata"],
    [1, "1 — Short note"],
    [2, "2 — Recommend relay"],
    [3, "3 — Contacts"],
    [4, "4 — Encrypted DM"],
    [5, "5 — Event deletion"],
    [6, "6 — Repost"],
    [7, "7 — Reaction"],
    [40, "40 — Channel create"],
    [41, "41 — Channel metadata"],
    [42, "42 — Channel message"],
    [43, "43 — Channel hide"],
    [44, "44 — Channel mute"],
    [9735, "9735 — Zap"],
    [10002, "10002 — Relay list (NIP-65)"],
    [1984, "1984 — Report"],
    [30023, "30023 — Long-form article"],
    [30078, "30078 — App-specific data"],
    [30402, "30402 — Classified listing"],
    [31989, "31989 — Handler recommendation"],
    [31990, "31990 — Handler information"]
];

function escapeHtml(s) {
    if (s == null) return "";
    const d = document.createElement("div");
    d.textContent = String(s);
    return d.innerHTML;
}

function formatTimestamp(ts) {
    if (ts == null) return "—";
    const d = new Date(ts * 1000);
    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function npubToHex(npubStr) {
    const trimmed = npubStr.trim();
    const decoded = nip19.decode(trimmed);
    if (decoded.type !== "npub") {
        throw new Error("Expected an npub (npub1…)");
    }
    return decoded.data;
}

function hexToNpub(hexPubkey) {
    if (!hexPubkey) return "—";
    try {
        return nip19.npubEncode(hexPubkey);
    } catch {
        return hexPubkey;
    }
}

function buildEventModalHtml(ev) {
    const raw = typeof ev.rawEvent === "function" ? ev.rawEvent() : null;
    const npubAuthor = hexToNpub(ev.pubkey);
    const sig = ev.sig || "";
    const sigShort = sig ? `${sig.slice(0, 20)}…${sig.slice(-16)}` : "—";

    const tags = ev.tags ?? [];
    const tagRows =
        tags.length > 0
            ? tags
                  .map(
                      (tag, i) =>
                          `<tr><td class="text-muted text-nowrap">${i}</td><td><code class="small user-select-all">${escapeHtml(JSON.stringify(tag))}</code></td></tr>`
                  )
                  .join("")
            : '<tr><td colspan="2" class="text-muted small">No tags</td></tr>';

    const rawJson = JSON.stringify(raw ?? {}, null, 2);

    return `
        <div class="row g-3">
            <div class="col-sm-4">
                <div class="ndk-field-label">Kind</div>
                <div><span class="badge bg-secondary">${escapeHtml(String(ev.kind))}</span></div>
            </div>
            <div class="col-sm-8">
                <div class="ndk-field-label">Created</div>
                <div>${escapeHtml(formatTimestamp(ev.created_at))}
                    <span class="text-muted small">(${escapeHtml(String(ev.created_at ?? "—"))})</span></div>
            </div>
            <div class="col-12">
                <div class="ndk-field-label">Event id</div>
                <code class="small user-select-all d-block text-break">${escapeHtml(ev.id || "")}</code>
            </div>
            <div class="col-12">
                <div class="ndk-field-label">Author (hex)</div>
                <code class="small user-select-all d-block text-break">${escapeHtml(ev.pubkey || "")}</code>
            </div>
            <div class="col-12">
                <div class="ndk-field-label">Author (npub)</div>
                <code class="small user-select-all d-block text-break">${escapeHtml(npubAuthor)}</code>
            </div>
            <div class="col-12">
                <div class="ndk-field-label">Signature</div>
                <div class="small font-monospace">${escapeHtml(sigShort)}</div>
                ${
                    sig
                        ? `<details class="mt-2"><summary class="small text-muted">Show full signature</summary>
                <code class="small user-select-all d-block text-break mt-2">${escapeHtml(sig)}</code></details>`
                        : ""
                }
            </div>
        </div>
        <hr class="border-secondary my-3" />
        <div class="ndk-field-label">Tags</div>
        <div class="table-responsive mb-3">
            <table class="table table-sm table-bordered border-secondary mb-0">
                <thead><tr><th scope="col" class="text-muted small">#</th><th scope="col" class="text-muted small">Tag</th></tr></thead>
                <tbody>${tagRows}</tbody>
            </table>
        </div>
        <div class="ndk-field-label">Content</div>
        <pre class="ndk-content-pre bg-body-secondary p-3 rounded border border-secondary">${escapeHtml(ev.content ?? "")}</pre>
        <details class="mt-3">
            <summary class="small text-muted">Raw JSON</summary>
            <pre class="bg-black bg-opacity-25 p-3 rounded small mt-2 mb-0 text-break" style="max-height: 220px; overflow: auto;">${escapeHtml(rawJson)}</pre>
        </details>`;
}

function openEventModal(ev) {
    const body = document.getElementById("event-detail-modal-body");
    const title = document.getElementById("event-detail-modal-title");
    const modalEl = document.getElementById("event-detail-modal");
    if (!body || !title || !modalEl) return;

    const idShort = (ev.id || "").slice(0, 12);
    title.textContent = idShort ? `Kind ${ev.kind} · ${idShort}…` : `Kind ${ev.kind}`;
    body.innerHTML = buildEventModalHtml(ev);

    if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
}

function setOverallStatus(kind, message) {
    const badge = document.getElementById("ndk-overall-status");
    const msg = document.getElementById("ndk-status-message");
    if (!badge || !msg) return;

    badge.className = "badge";
    if (kind === "connecting") {
        badge.classList.add("bg-warning", "text-dark");
        badge.textContent = "Connecting";
    } else if (kind === "connected") {
        badge.classList.add("bg-success");
        badge.textContent = "Connected";
    } else if (kind === "degraded") {
        badge.classList.add("bg-warning", "text-dark");
        badge.textContent = "Partial";
    } else if (kind === "error") {
        badge.classList.add("bg-danger");
        badge.textContent = "Error";
    } else {
        badge.classList.add("bg-secondary");
        badge.textContent = "Idle";
    }
    if (message != null) msg.textContent = message;
}

function renderRelayList() {
    const host = document.getElementById("ndk-relay-list");
    if (!host || !ndk.pool) return;

    const urls = typeof ndk.pool.urls === "function" ? ndk.pool.urls() : [...ndk.pool.relays.keys()];
    const rows = urls.map((url) => {
        const ok = ndk.pool.isRelayConnected(url);
        const label = ok ? "Connected" : "Disconnected";
        const cls = ok ? "text-success" : "text-secondary";
        return `
            <div class="relay-row">
                <code class="flex-grow-1">${escapeHtml(url)}</code>
                <span class="${cls} small text-nowrap">${label}</span>
            </div>`;
    });
    host.innerHTML = rows.length ? rows.join("") : '<p class="text-muted small mb-0">No relays configured.</p>';

    if (!suppressRelayDrivenStatus) {
        const connected = urls.filter((u) => ndk.pool.isRelayConnected(u)).length;
        if (urls.length && connected === 0) {
            setOverallStatus("degraded", "No relay connections yet — searches may return few results.");
        } else if (urls.length && connected < urls.length) {
            setOverallStatus("degraded", `Connected to ${connected} of ${urls.length} relays.`);
        } else if (urls.length && connected === urls.length) {
            setOverallStatus("connected", "All configured relays reported connected.");
        }
    }
}

function startRelayStatusPolling() {
    if (relayStatusTimer) clearInterval(relayStatusTimer);
    relayStatusTimer = setInterval(renderRelayList, 3000);
}

async function connectInBackground() {
    suppressRelayDrivenStatus = false;
    setOverallStatus("connecting", "Connecting to relays in the background…");
    renderRelayList();
    try {
        await ndk.connect(12_000);
        setOverallStatus("connected", "Initial relay connection pass completed.");
    } catch (err) {
        suppressRelayDrivenStatus = true;
        setOverallStatus("error", `Connection issue: ${err?.message || err}`);
    }
    renderRelayList();
}

function populateKindSelect(selectEl) {
    selectEl.innerHTML = KIND_OPTIONS.map(
        ([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`
    ).join("");
    const defaults = new Set([1, 0]);
    for (const opt of selectEl.options) {
        if (defaults.has(Number(opt.value))) opt.selected = true;
    }
}

function setSearchLoading(loading) {
    const btn = document.getElementById("search-button");
    if (!btn) return;
    const sp = btn.querySelector(".spinner-border");
    btn.disabled = loading;
    if (sp) sp.classList.toggle("d-none", !loading);
}

function clearResults() {
    const empty = document.getElementById("search-results-empty");
    const wrap = document.getElementById("search-results-table-wrap");
    const tbody = document.getElementById("search-results-tbody");
    if (tbody) tbody.innerHTML = "";
    if (empty) empty.classList.remove("d-none");
    if (wrap) wrap.classList.add("d-none");
    lastRenderedEvents = [];
}

function renderResults(events) {
    const empty = document.getElementById("search-results-empty");
    const wrap = document.getElementById("search-results-table-wrap");
    const tbody = document.getElementById("search-results-tbody");
    if (!empty || !wrap || !tbody) return;

    tbody.innerHTML = "";

    if (!events.length) {
        empty.textContent = "No events matched your query.";
        empty.classList.remove("d-none");
        wrap.classList.add("d-none");
        return;
    }

    empty.classList.add("d-none");
    wrap.classList.remove("d-none");

    lastRenderedEvents = events;

    events.forEach((ev, index) => {
        const previewSource = ev.content ?? "";
        const preview =
            previewSource.length > 140 ? `${previewSource.slice(0, 140)}…` : previewSource;

        const mainTr = document.createElement("tr");
        mainTr.dataset.eventIndex = String(index);
        mainTr.setAttribute("role", "button");
        mainTr.setAttribute("tabindex", "0");
        mainTr.setAttribute("aria-label", "View full event");
        mainTr.innerHTML = `
            <td><span class="badge bg-secondary">${escapeHtml(ev.kind)}</span></td>
            <td class="text-nowrap small">${escapeHtml(formatTimestamp(ev.created_at))}</td>
            <td class="event-preview small" title="${escapeHtml(previewSource)}">${escapeHtml(preview)}</td>`;

        tbody.appendChild(mainTr);
    });
}

function initNDKPage() {
    const form = document.getElementById("ndk-search-form");
    const kindSelect = document.getElementById("kind-select");
    const npubInput = document.getElementById("search-npub");
    const limitInput = document.getElementById("search-limit");
    const tbody = document.getElementById("search-results-tbody");

    if (!form || !kindSelect || !npubInput || !limitInput) {
        console.warn("NDK page elements not found; skipping init");
        return;
    }

    populateKindSelect(kindSelect);

    if (tbody) {
        tbody.addEventListener("click", (e) => {
            const tr = e.target.closest("tr[data-event-index]");
            if (!tr || !tbody.contains(tr)) return;
            const idx = Number(tr.dataset.eventIndex);
            const ev = lastRenderedEvents[idx];
            if (ev) openEventModal(ev);
        });
        tbody.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const tr = e.target.closest("tr[data-event-index]");
            if (!tr || !tbody.contains(tr)) return;
            e.preventDefault();
            const idx = Number(tr.dataset.eventIndex);
            const ev = lastRenderedEvents[idx];
            if (ev) openEventModal(ev);
        });
    }

    void connectInBackground();
    renderRelayList();
    startRelayStatusPolling();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const npub = npubInput.value.trim();
        const kinds = Array.from(kindSelect.selectedOptions).map((o) => Number(o.value));

        if (!npub) {
            alert("Please enter an npub.");
            return;
        }
        if (!kinds.length) {
            alert("Select at least one kind.");
            return;
        }

        let authorHex;
        try {
            authorHex = npubToHex(npub);
        } catch (err) {
            alert(err?.message || "Invalid npub.");
            return;
        }

        let limit = parseInt(limitInput.value, 10);
        if (Number.isNaN(limit) || limit < 1) limit = 100;
        if (limit > 500) limit = 500;

        setSearchLoading(true);
        clearResults();

        try {
            const filters = { kinds, authors: [authorHex], limit };
            const set = await ndk.fetchEvents(filters, { closeOnEose: true });
            const list = [...set].sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
            renderResults(list);
        } catch (err) {
            console.error(err);
            const empty = document.getElementById("search-results-empty");
            if (empty) {
                empty.classList.remove("d-none");
                empty.textContent = `Search failed: ${err?.message || err}`;
            }
        } finally {
            setSearchLoading(false);
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNDKPage);
} else {
    initNDKPage();
}
