import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_TWEET_LENGTH,
  createInitialState,
  createStore,
  formatRelativeTime,
  selectSuggestedProfiles,
  selectTweets,
} from "../src/store.js";

function memoryStorage(initial = null) {
  const values = new Map(initial ? [["mobile-twitter-state-v1", JSON.stringify(initial)]] : []);
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

test("createTweet adds a valid tweet to the top of the home timeline", () => {
  const store = createStore(memoryStorage());
  const result = store.createTweet("  Hello mobile Twitter  ");

  assert.equal(result.ok, true);
  assert.equal(store.getState().tweets[0].body, "Hello mobile Twitter");
  assert.equal(store.getState().tweets[0].authorId, "you");
  assert.equal(selectTweets(store.getState())[0].id, result.tweet.id);
});

test("createTweet rejects blank or over-limit content", () => {
  const store = createStore(memoryStorage());
  const blank = store.createTweet("   ");
  const tooLong = store.createTweet("x".repeat(MAX_TWEET_LENGTH + 1));

  assert.equal(blank.ok, false);
  assert.equal(tooLong.ok, false);
  assert.equal(store.getState().tweets.length, createInitialState().tweets.length);
});

test("timeline selectors support following and search views", () => {
  const store = createStore(memoryStorage());

  store.setTab("following");
  assert.ok(selectTweets(store.getState()).every((tweet) => tweet.authorId !== "kai"));

  store.setQuery("design");
  assert.deepEqual(
    selectTweets(store.getState()).map((tweet) => tweet.authorId),
    ["maya"],
  );
});

test("like, retweet, reply, and follow actions update counts safely", () => {
  const store = createStore(memoryStorage());
  const tweetId = store.getState().tweets[0].id;

  store.toggleLike(tweetId);
  store.toggleRetweet(tweetId);
  store.addReply(tweetId);
  store.toggleFollow("kai");

  const tweet = store.getState().tweets.find((item) => item.id === tweetId);
  assert.equal(tweet.liked, true);
  assert.equal(tweet.retweeted, true);
  assert.equal(tweet.replies, 9);
  assert.equal(selectSuggestedProfiles(store.getState()).some((profile) => profile.id === "kai"), false);
});

test("formatRelativeTime renders compact Chinese relative labels", () => {
  const now = new Date("2026-04-28T07:48:00Z").getTime();

  assert.equal(formatRelativeTime(now, now), "刚刚");
  assert.equal(formatRelativeTime(now - 12 * 60 * 1000, now), "12 分钟");
  assert.equal(formatRelativeTime(now - 2 * 60 * 60 * 1000, now), "2 小时");
  assert.equal(formatRelativeTime(now - 3 * 24 * 60 * 60 * 1000, now), "3 天");
});
