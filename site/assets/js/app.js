// 화면 렌더링과 이벤트 처리. 상태는 URL(?sign=leo&mbti=ENFP&tab=blend&with=aries)에 담아 공유 가능하게 한다.

import { SIGNS, ELEMENTS, getSign, signFromDate, signPeriod } from "./zodiac.js";
import { dailyFortune, compatibility, todayKST } from "./fortune.js";
import { characterSVG, MASCOTS } from "./characters.js";
import { MBTI_TYPES, isMbti, blend } from "./mbti.js";

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
};

const today = todayKST();
const state = { sign: null, tab: "today", with: null, mbti: null };
const TABS = ["today", "blend", "profile", "match"];

function stars(score) {
  const wrap = el("span", "stars");
  wrap.setAttribute("aria-label", `5점 중 ${score}점`);
  wrap.append("★".repeat(score));
  wrap.append(el("span", "off", "★".repeat(5 - score)));
  return wrap;
}

/* ---------- 입력 ---------- */
function setupForm() {
  const month = $("#birth-month");
  const day = $("#birth-day");
  month.append(new Option("월", ""));
  for (let m = 1; m <= 12; m++) month.append(new Option(`${m}월`, m));
  const fillDays = () => {
    const keep = day.value;
    const max = month.value ? new Date(2000, Number(month.value), 0).getDate() : 31;
    day.replaceChildren(new Option("일", ""));
    for (let d = 1; d <= max; d++) day.append(new Option(`${d}일`, d));
    if (keep && Number(keep) <= max) day.value = keep;
  };
  month.addEventListener("change", fillDays);
  fillDays();
  const mbti = $("#birth-mbti");
  mbti.append(new Option("모름", ""));
  for (const t of MBTI_TYPES) mbti.append(new Option(t, t));

  $("#birth-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const sign = signFromDate(Number(month.value), Number(day.value));
    if (!sign) return toast("태어난 달과 날을 선택해 주세요.");
    if (mbti.value) state.mbti = mbti.value;
    select(sign.id, mbti.value ? "blend" : "today");
  });
}

function setupGrid() {
  const grid = $("#sign-grid");
  for (const s of SIGNS) {
    const btn = el("button", "sign-btn");
    btn.type = "button";
    btn.dataset.sign = s.id;
    btn.setAttribute("role", "listitem");
    btn.setAttribute("aria-pressed", "false");
    const pic = el("span", "char-sm");
    pic.innerHTML = characterSVG(s);
    btn.append(pic, el("span", "nm", s.name), el("span", "dt", signPeriod(s, { short: true })));
    btn.addEventListener("click", () => select(s.id, state.tab));
    grid.append(btn);
  }
}

function setupTabs() {
  for (const btn of document.querySelectorAll("[role=tab]")) {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.tab;
      render();
    });
  }
  const sel = $("#match-select");
  for (const s of SIGNS) sel.append(new Option(`${s.symbol} ${s.name}`, s.id));
  sel.addEventListener("change", () => {
    state.with = sel.value;
    render();
  });
  const blendSel = $("#blend-select");
  blendSel.append(new Option("MBTI를 골라 주세요", ""));
  for (const t of MBTI_TYPES) blendSel.append(new Option(t, t));
  blendSel.addEventListener("change", () => {
    state.mbti = blendSel.value || null;
    render();
  });
  $("#share-btn").addEventListener("click", share);
}

function select(signId, tab) {
  state.sign = signId;
  state.tab = tab;
  render();
  $("#result").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- 렌더링 ---------- */
function renderToday(sign) {
  const f = dailyFortune(sign.id, today);
  const panel = document.querySelector('[data-panel="today"]');
  const list = el("ul", "fortune-list");
  for (const c of f.categories) {
    const item = el("li", "fortune-item");
    const head = el("header");
    head.append(el("h3", null, c.label), stars(c.score));
    item.append(head, el("p", null, c.text));
    list.append(item);
  }
  const lucky = el("dl", "lucky");
  for (const [k, v] of [["행운의 색", f.lucky.color], ["행운의 숫자", f.lucky.number], ["행운 아이템", f.lucky.item]]) {
    const box = el("div");
    box.append(el("dt", null, k), el("dd", null, String(v)));
    lucky.append(box);
  }
  panel.replaceChildren(list, lucky);
}

function renderBlend(sign) {
  $("#blend-select").value = state.mbti ?? "";
  const box = $("#blend-result");
  if (!state.mbti) {
    box.replaceChildren(el("p", "muted", "MBTI를 고르면 별자리와 섞인 나만의 캐릭터가 나타나요."));
    return;
  }
  const b = blend(sign.id, state.mbti);
  const card = el("div", "blend-card");
  const pic = el("div", "char-lg");
  pic.innerHTML = characterSVG(sign, { mbti: b.mbti });
  const chips = el("div", "chips");
  chips.append(
    el("span", "chip", `${b.group.name} · ${b.group.item}`),
    el("span", "chip", `${b.element}의 별자리`),
    ...b.strengths.map((k) => el("span", "chip", `#${k}`)),
  );
  const partner = el("div", "partner");
  const pPic = el("div", "char-sm");
  pPic.innerHTML = characterSVG(b.partner.sign, { mbti: b.partner.mbti });
  const pText = el("div");
  pText.append(
    el("strong", null, "찰떡 짝꿍"),
    el("p", null, `${b.partner.mbti} ${b.partner.sign.name} · ${b.partner.title}`),
  );
  partner.append(pPic, pText);
  card.append(
    pic,
    el("p", "blend-kicker", `${b.mbti} × ${sign.name}`),
    el("h3", "blend-title", `${b.title} ‘${b.mascot.name}’`),
    chips,
    el("p", null, b.intro),
    el("p", null, b.blend),
    partner,
  );
  box.replaceChildren(card);
}

function renderProfile(sign) {
  const panel = document.querySelector('[data-panel="profile"]');
  const chips = el("div", "chips");
  const e = ELEMENTS[sign.element];
  chips.append(
    el("span", "chip", `${e.name}의 별자리 · ${e.desc}`),
    el("span", "chip", `수호성 ${sign.ruler}`),
    ...sign.keywords.map((k) => el("span", "chip", `#${k}`)),
  );
  const blocks = [
    ["성격", sign.profile.personality],
    ["연애", sign.profile.love],
    ["직업", sign.profile.career],
    ["건강", sign.profile.health],
    ["행운요소", `색 ${sign.lucky.color} · 숫자 ${sign.lucky.number} · ${sign.lucky.day} · 보석 ${sign.lucky.stone}`],
  ].map(([title, text]) => {
    const b = el("section", "profile-block");
    b.append(el("h3", null, title), el("p", null, text));
    return b;
  });
  panel.replaceChildren(chips, ...blocks);
}

function renderMatch(sign) {
  const sel = $("#match-select");
  if (!state.with) state.with = SIGNS[(SIGNS.indexOf(sign) + 4) % 12].id;
  sel.value = state.with;
  const m = compatibility(sign.id, state.with);
  const card = el("div", "match-card");
  const pair = el("div", "match-pair");
  pair.innerHTML = characterSVG(m.a) + `<span aria-hidden="true">♥</span>` + characterSVG(m.b);
  const meter = el("div", "meter");
  const bar = el("span");
  bar.style.width = `${m.score}%`;
  meter.append(bar);
  card.append(
    pair,
    el("p", "muted", `${m.a.name} × ${m.b.name} · ${m.elements}`),
    el("div", "match-score", `${m.score}점`),
    meter,
    el("h3", null, m.title),
    el("p", null, m.text),
  );
  $("#match-result").replaceChildren(card);
}

function render() {
  syncUrl();
  if (!state.sign) return;
  const sign = getSign(state.sign);
  $("#result").hidden = false;
  $("#result-char").innerHTML = characterSVG(sign, { mbti: state.mbti ?? undefined });
  $("#result-name").textContent = `${sign.name} ${MASCOTS[sign.id].name}`;
  $("#result-meta").textContent = `${signPeriod(sign)} · ${ELEMENTS[sign.element].name}의 별자리`;
  document.title = `${sign.name} 오늘의 운세 · 별빛 운세`;

  for (const b of document.querySelectorAll(".sign-btn")) {
    b.setAttribute("aria-pressed", String(b.dataset.sign === sign.id));
  }
  for (const t of document.querySelectorAll("[role=tab]")) {
    t.setAttribute("aria-selected", String(t.dataset.tab === state.tab));
  }
  for (const p of document.querySelectorAll(".panel")) p.hidden = p.dataset.panel !== state.tab;

  if (state.tab === "today") renderToday(sign);
  else if (state.tab === "blend") renderBlend(sign);
  else if (state.tab === "profile") renderProfile(sign);
  else renderMatch(sign);
}

/* ---------- URL·공유 ---------- */
function readUrl() {
  const p = new URLSearchParams(location.search);
  if (getSign(p.get("sign"))) state.sign = p.get("sign");
  if (TABS.includes(p.get("tab"))) state.tab = p.get("tab");
  if (isMbti(p.get("mbti"))) state.mbti = p.get("mbti").toUpperCase();
  if (getSign(p.get("with"))) state.with = p.get("with");
}

function syncUrl() {
  const p = new URLSearchParams();
  if (state.sign) p.set("sign", state.sign);
  if (state.mbti) p.set("mbti", state.mbti);
  if (state.sign && state.tab !== "today") p.set("tab", state.tab);
  if (state.tab === "match" && state.with) p.set("with", state.with);
  const qs = p.toString();
  history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
}

async function share() {
  const url = location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast("링크를 복사했어요");
  } catch (err) {
    if (err.name !== "AbortError") toast("링크 복사에 실패했어요"); // 공유 창을 닫은 경우는 무시
  }
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- 시작 ---------- */
const [, mo, d] = today.split("-");
$("#today-label").textContent = `${Number(mo)}월 ${Number(d)}일 오늘의 별자리 운세`;
setupForm();
setupGrid();
setupTabs();
readUrl();
render();
