import {
  MAX_TWEET_LENGTH,
  createStore,
  formatRelativeTime,
  getProfile,
  selectSuggestedProfiles,
  selectTweets,
} from "./store.js";

const store = createStore();
const app = document.querySelector("#app");

function render() {
  const state = store.getState();
  app.innerHTML = `
    <main class="shell">
      ${renderHeader(state)}
      ${renderStats(state)}
      ${renderTabs(state)}
      ${state.activeTab === "compose" ? renderComposer(state) : ""}
      ${state.activeTab === "search" ? renderSearch(state) : ""}
      ${renderTimeline(state)}
      ${renderSuggestions(state)}
      ${renderBottomNav(state)}
    </main>
  `;
  bindEvents();
}

function renderHeader(state) {
  const user = getProfile(state, state.currentUserId);
  return `
    <header class="app-header">
      <button class="profile-button" type="button" data-tab="profile" aria-label="打开个人资料">
        <span class="avatar">${escapeHtml(user.avatar)}</span>
      </button>
      <div class="header-title">
        <p>Mobile Twitter</p>
        <h1>${titleForTab(state.activeTab)}</h1>
      </div>
      <button class="icon-button" type="button" data-action="reset" aria-label="重置演示数据">↻</button>
    </header>
  `;
}

function renderStats(state) {
  const followingCount = state.profiles.filter((profile) => profile.following).length - 1;
  const myTweets = state.tweets.filter((tweet) => tweet.authorId === state.currentUserId).length;
  const totalLikes = state.tweets.reduce((sum, tweet) => sum + tweet.likes, 0);
  return `
    <section class="status-bar" aria-label="账号概览">
      <div class="stat-card"><span class="stat-value">${myTweets}</span><span class="stat-label">我的推文</span></div>
      <div class="stat-card"><span class="stat-value">${followingCount}</span><span class="stat-label">正在关注</span></div>
      <div class="stat-card"><span class="stat-value">${totalLikes}</span><span class="stat-label">总点赞</span></div>
    </section>
  `;
}

function renderTabs(state) {
  const tabs = [
    ["home", "推荐"],
    ["following", "关注"],
    ["search", "探索"],
    ["profile", "我的"],
  ];
  return `
    <nav class="tabs" aria-label="时间线筛选">
      ${tabs
        .map(
          ([tab, label]) => `
            <button class="tab ${state.activeTab === tab ? "is-active" : ""}" type="button" data-tab="${tab}">
              ${label}
              ${tab === "following" ? `<span class="tab-badge">${selectTweets({ ...state, activeTab: "following" }).length}</span>` : ""}
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

function renderComposer(state) {
  const remaining = MAX_TWEET_LENGTH - state.draft.length;
  return `
    <form class="composer" data-form="compose">
      <span class="avatar">${escapeHtml(getProfile(state, state.currentUserId).avatar)}</span>
      <div class="composer-body">
        <textarea name="draft" maxlength="${MAX_TWEET_LENGTH}" placeholder="有什么新鲜事？" aria-label="输入推文">${escapeHtml(state.draft)}</textarea>
        <div class="composer-actions">
          <div class="composer-tools" aria-hidden="true"><span>#</span><span>◎</span><span>GIF</span></div>
          <span class="${remaining < 24 ? "danger" : ""}">${remaining}</span>
          <button class="primary-button" type="submit" ${state.draft.trim() ? "" : "disabled"}>发布</button>
        </div>
      </div>
    </form>
  `;
}

function renderSearch(state) {
  return `
    <section class="search-panel">
      <label class="search-box">
        <span>搜索</span>
        <input type="search" name="query" value="${escapeHtml(state.query)}" placeholder="搜索推文、用户或话题" />
      </label>
      <div class="trend-list">
        ${["#MobileUX", "#LocalFirst", "#BuildInPublic"]
          .map((tag) => `<button type="button" data-query="${tag}">${tag}</button>`)
          .join("")}
      </div>
    </section>
  `;
}

function renderTimeline(state) {
  const tweets = selectTweets(state);
  return `
    <section class="timeline" aria-live="polite">
      ${tweets.length ? tweets.map((tweet) => renderTweet(tweet, state)).join("") : renderEmptyState(state)}
    </section>
  `;
}

function renderTweet(tweet, state) {
  const author = getProfile(state, tweet.authorId);
  const isCurrentUser = tweet.authorId === state.currentUserId;
  return `
    <article class="tweet-card" data-tweet-id="${tweet.id}">
      <span class="avatar-large">${escapeHtml(author.avatar)}</span>
      <div class="tweet-main">
        <header class="tweet-header">
          <div>
            <strong>${escapeHtml(author.name)}</strong>
            <span>@${escapeHtml(author.handle)} · ${formatRelativeTime(tweet.createdAt)}</span>
          </div>
          ${
            isCurrentUser
              ? `<span class="you-badge">你</span>`
              : `<button class="follow-button ${author.following ? "is-following" : ""}" type="button" data-action="follow" data-profile-id="${author.id}">${author.following ? "已关注" : "关注"}</button>`
          }
        </header>
        <p class="tweet-body">${linkify(escapeHtml(tweet.body))}</p>
        <footer class="tweet-actions">
          <button type="button" data-action="reply">💬 ${tweet.replies}</button>
          <button class="${tweet.retweeted ? "is-active" : ""}" type="button" data-action="retweet">↻ ${tweet.retweets}</button>
          <button class="${tweet.liked ? "is-active" : ""}" type="button" data-action="like">♥ ${tweet.likes}</button>
          <button type="button" data-action="share">↗</button>
        </footer>
      </div>
    </article>
  `;
}

function renderSuggestions(state) {
  const suggestions = selectSuggestedProfiles(state);
  if (state.activeTab === "following" || suggestions.length === 0) {
    return "";
  }
  return `
    <section class="suggestions">
      <h2>推荐关注</h2>
      ${suggestions
        .map(
          (profile) => `
            <article class="profile-row">
              <span class="avatar-small">${escapeHtml(profile.avatar)}</span>
              <div>
                <strong>${escapeHtml(profile.name)}</strong>
                <p>@${escapeHtml(profile.handle)} · ${escapeHtml(profile.bio)}</p>
              </div>
              <button class="follow-button" type="button" data-action="follow-profile" data-profile-id="${profile.id}">关注</button>
            </article>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderBottomNav(state) {
  const items = [
    ["home", "⌂", "首页"],
    ["search", "⌕", "探索"],
    ["compose", "+", "发布"],
    ["profile", "◉", "我的"],
  ];
  return `
    <nav class="bottom-nav" aria-label="主导航">
      ${items
        .map(
          ([tab, icon, label]) => `
            <button class="${state.activeTab === tab ? "is-active" : ""}" type="button" data-tab="${tab}">
              <span>${icon}</span>${label}
            </button>
          `,
        )
        .join("")}
    </nav>
    <button class="fab" type="button" data-tab="compose" aria-label="发布推文">+</button>
  `;
}

function renderEmptyState(state) {
  return `
    <div class="empty-state">
      <h2>没有找到推文</h2>
      <p>${state.query ? `换个关键词试试：“${escapeHtml(state.query)}”` : "发布第一条推文或关注更多用户。"}</p>
    </div>
  `;
}

function bindEvents() {
  app.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      store.setTab(button.dataset.tab);
      render();
      if (button.dataset.tab === "compose") {
        app.querySelector("textarea")?.focus();
      }
    });
  });

  app.querySelector("[name='draft']")?.addEventListener("input", (event) => {
    store.setDraft(event.target.value);
    render();
    app.querySelector("textarea")?.focus();
  });

  app.querySelector("[data-form='compose']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = store.createTweet(store.getState().draft);
    if (!result.ok) {
      window.alert(result.error);
    }
    render();
  });

  app.querySelector("[name='query']")?.addEventListener("input", (event) => {
    store.setQuery(event.target.value);
    render();
    app.querySelector("[name='query']")?.focus();
  });

  app.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      store.setQuery(button.dataset.query);
      render();
    });
  });

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-tweet-id]");
      const tweetId = card?.dataset.tweetId;
      const profileId = button.dataset.profileId;
      handleAction(button.dataset.action, { tweetId, profileId });
    });
  });
}

function handleAction(action, { tweetId, profileId }) {
  if (action === "like") store.toggleLike(tweetId);
  if (action === "retweet") store.toggleRetweet(tweetId);
  if (action === "reply") store.addReply(tweetId);
  if (action === "follow" || action === "follow-profile") store.toggleFollow(profileId);
  if (action === "reset") store.reset();
  if (action === "share") shareTweet(tweetId);
  render();
}

function shareTweet(tweetId) {
  const tweet = store.getState().tweets.find((item) => item.id === tweetId);
  if (tweet && navigator.share) {
    navigator.share({ text: tweet.body }).catch(() => {});
  }
}

function titleForTab(tab) {
  return {
    home: "首页",
    following: "关注流",
    search: "探索",
    compose: "发布推文",
    profile: "我的主页",
  }[tab];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function linkify(text) {
  return text.replace(/(^|\s)(#[a-z0-9_]+)/gi, '$1<span class="hashtag">$2</span>');
}

render();
