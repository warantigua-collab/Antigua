(function(){
  "use strict";

  /* Keep in sync with the same constants in script.js — duplicated
     rather than shared since this site has no build step/modules and
     each HTML page loads its own standalone script. */
  var GITHUB_OWNER = "warantigua-collab";
  var GITHUB_REPO = "Antigua";
  var GITHUB_BRANCH = "main";
  var NEWS_JSON_PATH = "news.json";
  var TOKEN_KEY = "sancristobal_admin_token";

  var API_BASE = "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO;

  /* ---------------------------------------------------------
     Token storage — this device's browser only, never sent
     anywhere but api.github.com, never written to the repo.
  --------------------------------------------------------- */
  function loadToken(){
    try{ return window.localStorage.getItem(TOKEN_KEY) || ""; }
    catch(e){ return ""; }
  }
  function saveToken(tok){
    try{ window.localStorage.setItem(TOKEN_KEY, tok); }
    catch(e){ /* localStorage unavailable — token just won't persist across reloads */ }
  }
  function forgetToken(){
    try{ window.localStorage.removeItem(TOKEN_KEY); }
    catch(e){ /* nothing to do */ }
  }

  function refreshTokenStatus(){
    var tok = loadToken();
    var el = document.getElementById("tokenStatus");
    if(tok){
      el.textContent = "Token saved on this device.";
      el.classList.add("admin-token-ok");
    } else {
      el.textContent = "No token saved on this device.";
      el.classList.remove("admin-token-ok");
    }
  }

  /* ---------------------------------------------------------
     UTF-8-safe base64 helpers — the GitHub Contents API speaks
     base64, and this site's content has plenty of accented
     characters that plain btoa()/atob() mangle.
  --------------------------------------------------------- */
  function utf8ToBase64(str){
    var bytes = new TextEncoder().encode(str);
    var binary = "";
    bytes.forEach(function(b){ binary += String.fromCharCode(b); });
    return btoa(binary);
  }
  function base64ToUtf8(b64){
    var binary = atob(b64.replace(/\n/g, ""));
    var bytes = new Uint8Array(binary.length);
    for(var i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  /* ---------------------------------------------------------
     GitHub API helper — every call goes through here so auth
     headers and error surfacing stay in one place.
  --------------------------------------------------------- */
  function ghFetch(path, opts){
    opts = opts || {};
    var tok = loadToken();
    if(!tok){ return Promise.reject(new Error("No token saved. Add one above first.")); }
    var headers = Object.assign({
      "Authorization": "Bearer " + tok,
      "Accept": "application/vnd.github+json"
    }, opts.headers || {});
    return fetch(API_BASE + path, Object.assign({}, opts, { headers: headers }))
      .then(function(res){
        if(!res.ok){
          return res.json().catch(function(){ return {}; }).then(function(body){
            var msg = "GitHub API error " + res.status;
            if(res.status === 401) msg = "Token rejected (401) — it may be wrong or expired.";
            else if(res.status === 403) msg = "Forbidden (403) — check the token's Contents/Issues permissions, or you may be rate-limited.";
            else if(res.status === 404) msg = "Not found (404) — check the repo name/branch, or the token's repository access.";
            else if(body && body.message) msg += ": " + body.message;
            throw new Error(msg);
          });
        }
        return res.status === 204 ? null : res.json();
      });
  }

  /* ---------------------------------------------------------
     news.json read/write
  --------------------------------------------------------- */
  function getNewsFile(){
    return ghFetch("/contents/" + NEWS_JSON_PATH + "?ref=" + GITHUB_BRANCH).then(function(data){
      var entries = [];
      try{ entries = JSON.parse(base64ToUtf8(data.content)); }
      catch(e){ entries = []; }
      return { entries: Array.isArray(entries) ? entries : [], sha: data.sha };
    });
  }
  function putNewsFile(entries, sha, message){
    return ghFetch("/contents/" + NEWS_JSON_PATH, {
      method: "PUT",
      body: JSON.stringify({
        message: message,
        content: utf8ToBase64(JSON.stringify(entries, null, 2) + "\n"),
        sha: sha,
        branch: GITHUB_BRANCH
      })
    });
  }

  /* ---------------------------------------------------------
     Pending submissions (open GitHub Issues labeled news-submission)
  --------------------------------------------------------- */
  function extractImageAndCleanBody(rawBody){
    var imgRe = /!\[[^\]]*\]\((https:\/\/[^\s)]+)\)/g;
    var match = imgRe.exec(rawBody || "");
    var image = match ? match[1] : null;
    var cleaned = (rawBody || "").replace(/!\[[^\]]*\]\((https:\/\/[^\s)]+)\)/g, "").replace(/\n{3,}/g, "\n\n").trim();
    return { image: image, body: cleaned };
  }
  function cleanTitle(rawTitle){
    var t = (rawTitle || "").replace(/^\[News\]\s*/i, "").trim();
    return t || rawTitle || "Untitled report";
  }

  function loadPending(){
    var list = document.getElementById("pendingList");
    list.innerHTML = '<p class="admin-loading">Loading…</p>';
    ghFetch("/issues?labels=news-submission&state=open&per_page=50")
      .then(function(issues){ renderPending(issues); })
      .catch(function(err){ list.innerHTML = '<p class="admin-error">' + escapeHTML(err.message) + '</p>'; });
  }

  function renderPending(issues){
    var list = document.getElementById("pendingList");
    list.innerHTML = "";
    if(issues.length === 0){
      list.innerHTML = '<p class="admin-empty">No pending reports.</p>';
      return;
    }
    issues.forEach(function(issue){
      var extracted = extractImageAndCleanBody(issue.body);
      var card = document.createElement("div");
      card.className = "admin-entry";
      card.innerHTML =
        '<div class="admin-entry-head">' +
          '<h3 class="admin-entry-title">' + escapeHTML(cleanTitle(issue.title)) + '</h3>' +
          '<span class="admin-entry-date">Reported ' + escapeHTML(issue.created_at.slice(0,10)) + ' · by ' + escapeHTML(issue.user.login) + '</span>' +
        '</div>' +
        '<div class="admin-entry-body">' + escapeHTML(extracted.body) + '</div>' +
        (extracted.image ? '<img class="admin-entry-img" src="' + escapeHTML(extracted.image) + '" alt="">' : '') +
        '<div class="admin-entry-actions">' +
          '<button type="button" class="admin-btn admin-publish-btn">Publish</button>' +
          '<button type="button" class="admin-btn-ghost admin-discard-btn">Discard</button>' +
          '<a class="admin-btn-ghost" href="' + escapeHTML(issue.html_url) + '" target="_blank" rel="noopener noreferrer">View on GitHub</a>' +
        '</div>';
      card.querySelector(".admin-publish-btn").addEventListener("click", function(){ publishIssue(issue, extracted, card); });
      card.querySelector(".admin-discard-btn").addEventListener("click", function(){ discardIssue(issue); });
      list.appendChild(card);
    });
  }

  function setButtonsDisabled(card, disabled){
    card.querySelectorAll("button").forEach(function(b){ b.disabled = disabled; });
  }

  function publishIssue(issue, extracted, card){
    setButtonsDisabled(card, true);
    getNewsFile().then(function(current){
      var entry = {
        id: "issue-" + issue.number,
        date: issue.created_at.slice(0,10),
        title: cleanTitle(issue.title),
        body: extracted.body
      };
      if(extracted.image) entry.image = extracted.image;
      var updated = current.entries.concat([entry]);
      return putNewsFile(updated, current.sha, "Publish news entry from issue #" + issue.number);
    }).then(function(){
      return ghFetch("/issues/" + issue.number + "/comments", {
        method: "POST",
        body: JSON.stringify({ body: "Published — thanks for the report! 📣" })
      });
    }).catch(function(){ /* comment is a nice-to-have, don't block closing on it failing */ })
      .then(function(){
        return ghFetch("/issues/" + issue.number, { method: "PATCH", body: JSON.stringify({ state: "closed" }) });
      }).then(function(){
        loadPending();
        loadPublished();
      }).catch(function(err){
        setButtonsDisabled(card, false);
        alert("Couldn't publish: " + err.message);
      });
  }

  function discardIssue(issue){
    if(!confirm('Discard "' + cleanTitle(issue.title) + '"? This closes the report without publishing it.')) return;
    ghFetch("/issues/" + issue.number, { method: "PATCH", body: JSON.stringify({ state: "closed" }) })
      .then(function(){ loadPending(); })
      .catch(function(err){ alert("Couldn't discard: " + err.message); });
  }

  /* ---------------------------------------------------------
     Published entries (news.json) — list, edit, delete
  --------------------------------------------------------- */
  function loadPublished(){
    var list = document.getElementById("publishedList");
    list.innerHTML = '<p class="admin-loading">Loading…</p>';
    getNewsFile().then(function(current){ renderPublished(current.entries); })
      .catch(function(err){ list.innerHTML = '<p class="admin-error">' + escapeHTML(err.message) + '</p>'; });
  }

  function renderPublished(entries){
    var list = document.getElementById("publishedList");
    list.innerHTML = "";
    if(entries.length === 0){
      list.innerHTML = '<p class="admin-empty">Nothing published yet.</p>';
      return;
    }
    var sorted = entries.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
    sorted.forEach(function(entry){
      var card = document.createElement("div");
      card.className = "admin-entry";
      renderPublishedView(card, entry);
      list.appendChild(card);
    });
  }

  function renderPublishedView(card, entry){
    card.innerHTML =
      '<div class="admin-entry-head">' +
        '<h3 class="admin-entry-title">' + escapeHTML(entry.title) + '</h3>' +
        '<span class="admin-entry-date">' + escapeHTML(entry.date) + '</span>' +
      '</div>' +
      '<div class="admin-entry-body">' + escapeHTML(entry.body) + '</div>' +
      (entry.image ? '<img class="admin-entry-img" src="' + escapeHTML(entry.image) + '" alt="">' : '') +
      '<div class="admin-entry-actions">' +
        '<button type="button" class="admin-btn-ghost admin-edit-btn">Edit</button>' +
        '<button type="button" class="admin-btn-danger admin-delete-btn">Delete</button>' +
      '</div>';
    card.querySelector(".admin-edit-btn").addEventListener("click", function(){ renderPublishedEdit(card, entry); });
    card.querySelector(".admin-delete-btn").addEventListener("click", function(){ deleteEntry(entry, card); });
  }

  function renderPublishedEdit(card, entry){
    card.innerHTML =
      '<div class="admin-edit-form">' +
        '<label>Title</label><input type="text" class="admin-edit-title" value="' + escapeHTML(entry.title) + '">' +
        '<label>Date</label><input type="text" class="admin-edit-date" value="' + escapeHTML(entry.date) + '" placeholder="YYYY-MM-DD">' +
        '<label>Body</label><textarea class="admin-edit-body">' + escapeHTML(entry.body) + '</textarea>' +
        '<label>Image URL or path (optional)</label><input type="text" class="admin-edit-image" value="' + escapeHTML(entry.image || "") + '">' +
        '<div class="admin-entry-actions">' +
          '<button type="button" class="admin-btn admin-save-btn">Save</button>' +
          '<button type="button" class="admin-btn-ghost admin-cancel-btn">Cancel</button>' +
        '</div>' +
      '</div>';
    card.querySelector(".admin-cancel-btn").addEventListener("click", function(){ renderPublishedView(card, entry); });
    card.querySelector(".admin-save-btn").addEventListener("click", function(){
      var updated = {
        id: entry.id,
        date: card.querySelector(".admin-edit-date").value.trim() || entry.date,
        title: card.querySelector(".admin-edit-title").value.trim() || entry.title,
        body: card.querySelector(".admin-edit-body").value.trim()
      };
      var img = card.querySelector(".admin-edit-image").value.trim();
      if(img) updated.image = img;
      saveEntry(entry, updated, card);
    });
  }

  function saveEntry(oldEntry, newEntry, card){
    setButtonsDisabled(card, true);
    getNewsFile().then(function(current){
      var updated = current.entries.map(function(e){ return e.id === oldEntry.id ? newEntry : e; });
      return putNewsFile(updated, current.sha, "Edit news entry " + oldEntry.id);
    }).then(function(){
      renderPublishedView(card, newEntry);
    }).catch(function(err){
      setButtonsDisabled(card, false);
      alert("Couldn't save: " + err.message);
    });
  }

  function deleteEntry(entry, card){
    if(!confirm('Delete "' + entry.title + '"? This removes it from the live site.')) return;
    setButtonsDisabled(card, true);
    getNewsFile().then(function(current){
      var updated = current.entries.filter(function(e){ return e.id !== entry.id; });
      return putNewsFile(updated, current.sha, "Delete news entry " + entry.id);
    }).then(function(){
      card.remove();
    }).catch(function(err){
      setButtonsDisabled(card, false);
      alert("Couldn't delete: " + err.message);
    });
  }

  function escapeHTML(str){ var div = document.createElement("div"); div.textContent = str == null ? "" : str; return div.innerHTML; }

  /* ---------------------------------------------------------
     Wiring
  --------------------------------------------------------- */
  document.getElementById("tokenSave").addEventListener("click", function(){
    var val = document.getElementById("tokenInput").value.trim();
    if(!val){ return; }
    saveToken(val);
    document.getElementById("tokenInput").value = "";
    refreshTokenStatus();
    loadPending();
    loadPublished();
  });
  document.getElementById("tokenForget").addEventListener("click", function(){
    forgetToken();
    refreshTokenStatus();
  });
  document.getElementById("tokenToggle").addEventListener("click", function(){
    var input = document.getElementById("tokenInput");
    input.type = input.type === "password" ? "text" : "password";
  });
  document.getElementById("pendingRefresh").addEventListener("click", loadPending);
  document.getElementById("publishedRefresh").addEventListener("click", loadPublished);

  refreshTokenStatus();
  if(loadToken()){ loadPending(); loadPublished(); }

})();
