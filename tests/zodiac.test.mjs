import { test } from "node:test";
import assert from "node:assert/strict";
import { SIGNS, signFromDate, signPeriod } from "../site/assets/js/zodiac.js";
import { dailyFortune, compatibility, todayKST } from "../site/assets/js/fortune.js";

test("별자리 경계일 판별 (레퍼런스 기간 기준)", () => {
  const cases = [
    [1, 1, "capricorn"], [1, 19, "capricorn"], [1, 20, "aquarius"],
    [2, 18, "aquarius"], [2, 19, "pisces"], [2, 29, "pisces"],
    [3, 20, "pisces"], [3, 21, "aries"], [4, 19, "aries"], [4, 20, "taurus"],
    [5, 21, "gemini"], [6, 22, "cancer"], [7, 23, "leo"], [8, 23, "virgo"],
    [9, 23, "virgo"], [9, 24, "libra"], [10, 23, "scorpio"],
    [11, 22, "scorpio"], [11, 23, "sagittarius"], [12, 24, "sagittarius"],
    [12, 25, "capricorn"], [12, 31, "capricorn"],
  ];
  for (const [m, d, id] of cases) assert.equal(signFromDate(m, d)?.id, id, `${m}/${d}`);
});

test("잘못된 날짜는 null", () => {
  for (const [m, d] of [[0, 1], [13, 1], [2, 30], [4, 31], [1, 0], [NaN, 1]]) {
    assert.equal(signFromDate(m, d), null, `${m}/${d}`);
  }
});

test("1년 366일이 빠짐없이 12별자리에 배정된다", () => {
  const counts = {};
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= new Date(2000, m, 0).getDate(); d++) {
      const id = signFromDate(m, d).id;
      counts[id] = (counts[id] ?? 0) + 1;
    }
  }
  assert.equal(Object.keys(counts).length, 12);
  assert.equal(Object.values(counts).reduce((a, b) => a + b), 366);
});

test("기간 표기", () => {
  assert.equal(signPeriod(SIGNS.find((s) => s.id === "capricorn")), "12월 25일 ~ 1월 19일");
  assert.equal(signPeriod(SIGNS.find((s) => s.id === "aquarius")), "1월 20일 ~ 2월 18일");
});

test("오늘의 운세는 같은 날·같은 별자리면 항상 같고, 날짜가 바뀌면 달라진다", () => {
  const a = dailyFortune("leo", "2026-10-12");
  assert.deepEqual(a, dailyFortune("leo", "2026-10-12"));
  const otherDays = ["2026-10-13", "2026-10-14", "2026-10-15"].map((d) => dailyFortune("leo", d));
  assert.ok(otherDays.some((f) => JSON.stringify(f.categories) !== JSON.stringify(a.categories)));
  for (const c of a.categories) assert.ok(c.score >= 1 && c.score <= 5 && c.text);
  assert.ok(a.lucky.number >= 1 && a.lucky.number <= 45);
});

test("KST 날짜: UTC 15시 이후는 다음 날", () => {
  assert.equal(todayKST(new Date("2026-10-12T14:59:00Z")), "2026-10-12");
  assert.equal(todayKST(new Date("2026-10-12T15:00:00Z")), "2026-10-13");
});

test("궁합: 같은 원소는 천생연분, 대칭성", () => {
  assert.equal(compatibility("aries", "leo").title, "천생연분");
  assert.equal(compatibility("aries", "libra").distance, 6);
  assert.equal(compatibility("pisces", "aries").distance, 1);
  assert.equal(compatibility("leo", "aquarius").score, compatibility("aquarius", "leo").score);
});
