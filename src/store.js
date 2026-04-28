const STORAGE_KEY = "mobile-twitter-state-v1";
const MAX_TWEET_LENGTH = 280;

const profileSeeds = [
  {
    id: "you",
    name: "你",
    handle: "mobile_maker",
    avatar: "你",
    bio: "正在打造移动端 Twitter 体验。",
    following: true,
  },
  {
    id: "lin",
    name: "Lin Chen",
    handle: "lin_codes",
    avatar: "L",
    bio: "Frontend engineer, coffee lover.",
    following: true,
  },
  {
    id: "maya",
    name: "Maya",
    handle: "maya_design",
    avatar: "M",
    bio: "Designing useful things for tiny screens.",
    following: true,
  },
  {
    id: "kai",
    name: "Kai",
    handle: "kai_builds",
    avatar: "K",
    bio: "Shipping small apps and learning in public.",
    following: false,
  },
  {
    id: "aria",
    name: "Aria",
    handle: "aria_ai",
    avatar: "A",
    bio: "AI notes, product thoughts, and mobile patterns.",
    following: false,
  },
];

const tweetSeeds = [
  {
    id: "tweet-1",
    authorId: "lin",
    body: "刚把新的移动端时间线做完：底部导航、固定发帖框、轻量交互都在一个屏幕里。 #mobile",
    minutesAgo: 12,
    replies: 8,
    retweets: 21,
    likes: 138,
    liked: false,
    retweeted: false,
  },
  {
    id: "tweet-2",
    authorId: "maya",
    body: "移动社交应用最重要的是节奏：快速发帖、快速反馈、快速切换上下文。",
    minutesAgo: 41,
    replies: 5,
    retweets: 14,
    likes: 92,
    liked: true,
    retweeted: false,
  },
  {
    id: "tweet-3",
    authorId: "kai",
    body: "今天的目标：用本地状态模拟完整 Twitter 核心体验，然后再接后端 API。",
    minutesAgo: 85,
    replies: 3,
    retweets: 7,
    likes: 44,
    liked: false,
    retweeted: false,
  },
  {
    id: "tweet-4",
    authorId: "aria",
    body: "关注流和探索流应该有不同的信息密度。手机屏幕很小，每个像素都要帮用户做决定。",
    minutesAgo: 165,
    replies: 11,
    retweets: 36,
    likes: 210,
    liked: false,
    retweeted: true,
  },
];

export function createInitialState(now = Date.now()) {
  return {
    currentUserId: "you",
    activeTab: "home",
    draft: "",
    query: "",
    profiles: profileSeeds.map((profile) => ({ ...profile })),
    tweets: tweetSeeds.map(({ minutesAgo, ...tweet }) => ({
      ...tweet,
      createdAt: now - minutesAgo * 60 * 1000,
    })),
  };
}

export function createStore(storage = safeLocalStorage(), now = Date.now) {
  let state = loadState(storage);
  const listeners = new Set();

  function setState(nextState) {
    state = nextState;
    saveState(storage, state);
    listeners.forEach((listener) => listener(state));
  }

  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setTab(tab) {
      setState({ ...state, activeTab: tab, query: tab === "search" ? state.query : "" });
    },
    setQuery(query) {
      setState({ ...state, query, activeTab: "search" });
    },
    setDraft(draft) {
      setState({ ...state, draft });
    },
    createTweet(body) {
      const trimmed = body.trim();
      if (!trimmed) {
        return { ok: false, error: "请输入内容后再发布。" };
      }
      if (trimmed.length > MAX_TWEET_LENGTH) {
        return { ok: false, error: `推文不能超过 ${MAX_TWEET_LENGTH} 个字符。` };
      }

      const tweet = {
        id: `tweet-${now()}-${Math.random().toString(16).slice(2)}`,
        authorId: state.currentUserId,
        body: trimmed,
        createdAt: now(),
        replies: 0,
        retweets: 0,
        likes: 0,
        liked: false,
        retweeted: false,
      };

      setState({ ...state, draft: "", tweets: [tweet, ...state.tweets], activeTab: "home", query: "" });
      return { ok: true, tweet };
    },
    toggleLike(tweetId) {
      setState({
        ...state,
        tweets: state.tweets.map((tweet) =>
          tweet.id === tweetId
            ? { ...tweet, liked: !tweet.liked, likes: tweet.likes + (tweet.liked ? -1 : 1) }
            : tweet,
        ),
      });
    },
    toggleRetweet(tweetId) {
      setState({
        ...state,
        tweets: state.tweets.map((tweet) =>
          tweet.id === tweetId
            ? {
                ...tweet,
                retweeted: !tweet.retweeted,
                retweets: tweet.retweets + (tweet.retweeted ? -1 : 1),
              }
            : tweet,
        ),
      });
    },
    addReply(tweetId) {
      setState({
        ...state,
        tweets: state.tweets.map((tweet) =>
          tweet.id === tweetId ? { ...tweet, replies: tweet.replies + 1 } : tweet,
        ),
      });
    },
    toggleFollow(profileId) {
      if (profileId === state.currentUserId) {
        return;
      }
      setState({
        ...state,
        profiles: state.profiles.map((profile) =>
          profile.id === profileId ? { ...profile, following: !profile.following } : profile,
        ),
      });
    },
    reset() {
      setState(createInitialState());
    },
  };
}

export function selectTweets(state) {
  const tweets = [...state.tweets].sort((a, b) => b.createdAt - a.createdAt);
  const query = normalize(state.query);

  if (state.activeTab === "following") {
    const followingIds = new Set(
      state.profiles.filter((profile) => profile.following).map((profile) => profile.id),
    );
    return tweets.filter((tweet) => followingIds.has(tweet.authorId));
  }

  if (state.activeTab === "profile") {
    return tweets.filter((tweet) => tweet.authorId === state.currentUserId);
  }

  if (state.activeTab === "search" && query) {
    return tweets.filter((tweet) => {
      const author = getProfile(state, tweet.authorId);
      return [tweet.body, author?.name, author?.handle].some((value) =>
        normalize(value).includes(query),
      );
    });
  }

  return tweets;
}

export function selectSuggestedProfiles(state) {
  return state.profiles.filter((profile) => profile.id !== state.currentUserId && !profile.following);
}

export function getProfile(state, profileId) {
  return state.profiles.find((profile) => profile.id === profileId);
}

export function formatRelativeTime(timestamp, now = Date.now()) {
  const elapsedMinutes = Math.max(0, Math.floor((now - timestamp) / 60000));
  if (elapsedMinutes < 1) return "刚刚";
  if (elapsedMinutes < 60) return `${elapsedMinutes} 分钟`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} 小时`;
  return `${Math.floor(elapsedHours / 24)} 天`;
}

export { MAX_TWEET_LENGTH };

function loadState(storage) {
  if (!storage) {
    return createInitialState();
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

function saveState(storage, state) {
  if (!storage) {
    return;
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState(state) {
  const initialState = createInitialState();
  return {
    ...initialState,
    ...state,
    draft: typeof state.draft === "string" ? state.draft : initialState.draft,
    profiles: Array.isArray(state.profiles) ? state.profiles : initialState.profiles,
    tweets: Array.isArray(state.tweets) ? state.tweets : initialState.tweets,
  };
}

function normalize(value = "") {
  return value.toString().trim().toLowerCase();
}

function safeLocalStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
