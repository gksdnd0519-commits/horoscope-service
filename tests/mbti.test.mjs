import { test } from "node:test";
import assert from "node:assert/strict";
import { SIGNS } from "../site/assets/js/zodiac.js";
import { MBTI, MBTI_TYPES, blend, isMbti, mbtiGroup } from "../site/assets/js/mbti.js";
import { characterSVG, MASCOTS } from "../site/assets/js/characters.js";

test("MBTI 16유형, 찰떡 짝꿍은 서로를 가리킨다", () => {
  assert.equal(MBTI_TYPES.length, 16);
  for (const t of MBTI_TYPES) assert.equal(MBTI[MBTI[t].best].best, t, t);
});

test("MBTI 판별·기질 그룹", () => {
  assert.ok(isMbti("enfp"));
  assert.ok(!isMbti("ABCD"));
  assert.ok(!isMbti(null));
  assert.equal(mbtiGroup("INTJ"), "NT");
  assert.equal(mbtiGroup("ENFP"), "NF");
  assert.equal(mbtiGroup("ISTJ"), "SJ");
  assert.equal(mbtiGroup("ESTP"), "SP");
});

test("12별자리 × 16MBTI 조합이 모두 만들어진다", () => {
  for (const s of SIGNS) {
    for (const t of MBTI_TYPES) {
      const b = blend(s.id, t);
      assert.ok(b.title && b.intro && b.blend && b.group, `${s.id} ${t}`);
      assert.equal(b.partner.sign.element, s.element);
    }
  }
  assert.equal(blend("leo", "ENFP").title, "햇살 같은 사자");
});

test("조사: 받침 있으면 '이에요', 없으면 '예요'", () => {
  assert.match(blend("cancer", "ENFP").intro, /집게링이에요\.$/);
  assert.match(blend("aries", "ENFP").intro, /몽실이예요\.$/);
});

test("모든 별자리 캐릭터 SVG 생성 (MBTI 배지 포함)", () => {
  for (const s of SIGNS) {
    assert.ok(MASCOTS[s.id]);
    const plain = characterSVG(s);
    assert.match(plain, /^<svg[\s\S]*<\/svg>$/);
    assert.doesNotMatch(plain, /NaN|undefined/);
    for (const t of ["INTJ", "ENFP", "ISTJ", "ESTP"]) {
      const svg = characterSVG(s, { mbti: t });
      assert.ok(svg.includes(`>${t}</text>`));
      assert.doesNotMatch(svg, /NaN|undefined/);
    }
  }
});
