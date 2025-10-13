(function (global) {
  const IMAGE_PATTERN = /\.(?:jpe?g|png|gif|webp|avif|heic|heif)$/i;
  const ASSET_MAP_URL = 'assets-archive-map.json';
  const HEAD_OPTIONS = { method: 'HEAD', cache: 'no-store' };
  const GET_OPTIONS = { cache: 'no-store' };
  let assetMapPromise = null;
  let assetLookup = null;
  let verifyPromise = null;
  let observer = null;

  function isImageSource(src) {
    if (!src) return false;
    const cleaned = `${src}`.split('?')[0];
    return IMAGE_PATTERN.test(cleaned);
  }

  function encodeSpaces(value) {
    return value.includes('%20') ? value : value.replace(/ /g, '%20');
  }

  function toAbsoluteUrl(src) {
    if (!src) return '';
    const raw = `${src}`.trim();
    if (!raw) return '';
    if (/^(?:https?:|data:|blob:|\/\/)/i.test(raw)) {
      return encodeSpaces(raw);
    }
    const base = global.document?.baseURI || global.location?.href || '';
    const cleaned = encodeSpaces(raw.replace(/^(?:\.\/)+/, '').replace(/^\/+/, ''));
    try {
      return new URL(cleaned, base).href;
    } catch (err) {
      console.warn('[archive verifier] Failed to build absolute URL for', src, err);
      return cleaned;
    }
  }

  async function fetchAssetMap() {
    if (assetMapPromise) return assetMapPromise;
    assetMapPromise = (async () => {
      try {
        const resp = await fetch(toAbsoluteUrl(ASSET_MAP_URL), GET_OPTIONS);
        if (!resp.ok) {
          console.warn('[archive verifier] Unable to load asset map:', resp.status);
          return null;
        }
        const json = await resp.json();
        const lookup = new Map();
        const images = Array.isArray(json?.images) ? json.images : [];
        images.forEach((entry) => {
          if (!entry || !entry.path) return;
          lookup.set(entry.path.toLowerCase(), entry.path);
        });
        assetLookup = lookup;
        global.__MOTTO_ARCHIVE_ASSET_MAP__ = json;
        return json;
      } catch (err) {
        console.warn('[archive verifier] Failed to load asset map', err);
        return null;
      }
    })();
    return assetMapPromise;
  }

  async function probeUrl(url) {
    let status = null;
    try {
      const headResp = await fetch(url, HEAD_OPTIONS);
      status = headResp.status;
      if (headResp.ok) {
        return { ok: true, status };
      }
      if (status && status !== 405 && status !== 501) {
        return { ok: false, status };
      }
    } catch (err) {
      if (err && err.name !== 'TypeError') {
        console.warn('[archive verifier] HEAD request failed for', url, err);
      }
    }
    try {
      const getResp = await fetch(url, GET_OPTIONS);
      status = getResp.status;
      return { ok: getResp.ok, status };
    } catch (err) {
      console.warn('[archive verifier] GET request failed for', url, err);
      return { ok: false, status: status ?? 0 };
    }
  }

  function suggestFallback(src) {
    if (!assetLookup || !src) return '';
    const cleaned = src.split('?')[0];
    const lower = cleaned.toLowerCase();
    const base = lower.replace(/\.[^.]+$/, '');
    const ext = lower.slice(base.length + 1);
    if (!ext) return '';
    const candidates = ext === 'png'
      ? [`${base}.jpg`, `${base}.jpeg`]
      : (ext === 'jpg' || ext === 'jpeg')
        ? [`${base}.png`, `${base}.gif`]
        : ext === 'gif'
          ? [`${base}.jpg`, `${base}.png`]
          : [];
    const match = candidates.find((candidate) => assetLookup.has(candidate));
    return match ? assetLookup.get(match) : '';
  }

  function observeArchiveGrid() {
    if (typeof document === 'undefined') return null;
    const grid = document.getElementById('archiveGrid');
    if (!grid) return null;
    const seen = new WeakSet();
    const registerNode = (node) => {
      if (!node || seen.has(node)) return;
      seen.add(node);
      if (node.tagName === 'IMG') {
        const source = node.currentSrc || node.src || node.getAttribute('src');
        node.addEventListener('error', () => {
          console.warn('[archive verifier] image failed to load:', source);
        }, { once: true });
      }
      if (node.children) {
        Array.from(node.children).forEach(registerNode);
      }
    };
    grid.querySelectorAll('img').forEach(registerNode);
    const mut = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((child) => {
          if (!(child instanceof HTMLElement)) return;
          if (child.matches('img')) {
            registerNode(child);
          } else {
            child.querySelectorAll?.('img').forEach(registerNode);
          }
        });
      });
    });
    mut.observe(grid, { childList: true, subtree: true });
    return mut;
  }

  async function runVerification() {
    if (verifyPromise) return verifyPromise;
    verifyPromise = (async () => {
      await fetchAssetMap();
      if (!observer) {
        observer = observeArchiveGrid();
      }
      const entries = Array.isArray(global.__MOTTO_ARCHIVE_FILES__)
        ? global.__MOTTO_ARCHIVE_FILES__
        : [];
      const targets = entries
        .map((entry, index) => (typeof entry === 'string' ? { src: entry, title: '', index } : { ...entry, index }))
        .filter((entry) => isImageSource(entry.src));
      const results = [];
      for (const item of targets) {
        const absoluteUrl = toAbsoluteUrl(item.src);
        const probe = await probeUrl(absoluteUrl);
        const ok = Boolean(probe.ok);
        const suggestion = ok ? '' : suggestFallback(item.src);
        results.push({
          index: item.index,
          title: item.title || '(untitled)',
          src: item.src,
          ok,
          status: probe.status ?? 0,
          suggestion
        });
      }
      const missing = results.filter((row) => !row.ok);
      const tableData = results.map((row) => ({
        Index: row.index,
        Title: row.title,
        Source: row.src,
        Status: row.ok ? 'ok' : `missing (${row.status || 'ERR'})`,
        Suggestion: row.suggestion || ''
      }));
      console.groupCollapsed('[archive verifier] Archive asset summary');
      console.table(tableData);
      console.groupEnd();
      if (missing.length) {
        missing.forEach((row) => {
          console.warn('[archive verifier] Missing asset:', row.src, '→ suggestion:', row.suggestion || 'n/a');
        });
      } else {
        console.info('[archive verifier] All archive image assets resolved successfully.');
      }
      const summary = { results, missing };
      global.__lastArchiveAssetReport__ = summary;
      return summary;
    })();
    return verifyPromise;
  }

  global.__runArchiveAssetVerifier = runVerification;

  if (typeof document !== 'undefined') {
    const kickoff = () => {
      runVerification().catch((err) => {
        console.warn('[archive verifier] Verification failed', err);
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', kickoff, { once: true });
    } else {
      setTimeout(kickoff, 0);
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
