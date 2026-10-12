// 12별자리 마스코트 캐릭터 (자체 제작 SVG).
// 모든 캐릭터는 같은 얼굴(점 눈 + 볼터치 + w 입)과 외곽선을 공유해 한 세트처럼 보이게 한다.

const INK = "#3a2f4a";
const O = `stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;

export const MASCOTS = {
  aries: { name: "몽실이", animal: "양" },
  taurus: { name: "우뭉이", animal: "황소" },
  gemini: { name: "반짝이들", animal: "쌍둥이별" },
  cancer: { name: "집게링", animal: "꽃게" },
  leo: { name: "갈기", animal: "사자" },
  virgo: { name: "보리", animal: "소녀" },
  libra: { name: "밸리", animal: "토끼" },
  scorpio: { name: "꼬리꼬리", animal: "전갈" },
  sagittarius: { name: "쏘쏘", animal: "조랑말" },
  capricorn: { name: "뿔뿔이", animal: "염소" },
  aquarius: { name: "찰랑이", animal: "물병" },
  pisces: { name: "뻐끔이", animal: "물고기" },
};

const BG = { fire: "#ffe4d6", earth: "#e6f2da", air: "#e4ebff", water: "#dcf2fa" };

function face(cx, cy, s = 1, { eyes = true } = {}) {
  const eye = (x) =>
    `<circle cx="${x}" cy="${cy}" r="${4.2 * s}" fill="${INK}"/>` +
    `<circle cx="${x - 1.3 * s}" cy="${cy - 1.5 * s}" r="${1.4 * s}" fill="#fff"/>`;
  const blush = (x) =>
    `<ellipse cx="${x}" cy="${cy + 8 * s}" rx="${5 * s}" ry="${3 * s}" fill="#ff7f9c" opacity=".5"/>`;
  return (
    (eyes ? eye(cx - 10 * s) + eye(cx + 10 * s) : "") +
    blush(cx - 17 * s) + blush(cx + 17 * s) +
    `<path d="M${cx - 4 * s} ${cy + 5 * s} q${2 * s} ${3 * s} ${4 * s} 0 q${2 * s} ${3 * s} ${4 * s} 0" ` +
    `fill="none" stroke="${INK}" stroke-width="${1.8 * s}" stroke-linecap="round"/>`
  );
}

// 외곽선이 있는 굵은 선 (팔, 다리, 꼬리)
const limb = (d, color, w = 4) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4.8}" stroke-linecap="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;

// 원을 빙 둘러 붙여 몽글몽글한 털/갈기를 만든다
function fluff(cx, cy, radius, count, r, color) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    out += `<circle cx="${(cx + radius * Math.cos(a)).toFixed(1)}" cy="${(cy + radius * Math.sin(a)).toFixed(1)}" r="${r}" fill="${color}" ${O}/>`;
  }
  return out + `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}"/>`;
}

// 열린 집게발 (opening 방향 각도, 도 단위)
function claw(cx, cy, r, dir, color) {
  const rad = (d) => (d * Math.PI) / 180;
  const p = (d) => `${(cx + r * Math.cos(rad(d))).toFixed(1)} ${(cy + r * Math.sin(rad(d))).toFixed(1)}`;
  return `<path d="M${cx} ${cy} L${p(dir + 22)} A${r} ${r} 0 1 1 ${p(dir - 22)} Z" fill="${color}" ${O}/>`;
}

const star = (cx, cy, r, color) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }
  return `<path d="${d}Z" fill="${color}" ${O}/>`;
};

const heart = (cx, cy, s, color) =>
  `<path d="M${cx} ${cy + 6 * s} C${cx - 9 * s} ${cy}, ${cx - 6 * s} ${cy - 8 * s}, ${cx} ${cy - 3 * s} ` +
  `C${cx + 6 * s} ${cy - 8 * s}, ${cx + 9 * s} ${cy}, ${cx} ${cy + 6 * s}Z" fill="${color}" ${O}/>`;

const drop = (cx, cy, s, color) =>
  `<path d="M${cx} ${cy - 8 * s} C${cx + 7 * s} ${cy}, ${cx + 5 * s} ${cy + 6 * s}, ${cx} ${cy + 6 * s} ` +
  `C${cx - 5 * s} ${cy + 6 * s}, ${cx - 7 * s} ${cy}, ${cx} ${cy - 8 * s}Z" fill="${color}" ${O}/>`;

const DRAW = {
  aries: () =>
    fluff(60, 64, 30, 10, 14, "#fffaf2") +
    `<circle cx="30" cy="54" r="10" fill="#e3ad72" ${O}/><path d="M30 54 m-5 0 a5 5 0 1 1 5 5" fill="none" ${O}/>` +
    `<circle cx="90" cy="54" r="10" fill="#e3ad72" ${O}/><path d="M90 54 m5 0 a5 5 0 1 0 -5 5" fill="none" ${O}/>` +
    `<ellipse cx="60" cy="68" rx="22" ry="20" fill="#fde6d0" ${O}/>` +
    face(60, 66, 0.85),

  taurus: () =>
    `<path d="M40 40 q-12 -6 -9 -20 q6 9 17 11z" fill="#fff3c4" ${O}/>` +
    `<path d="M80 40 q12 -6 9 -20 q-6 9 -17 11z" fill="#fff3c4" ${O}/>` +
    `<ellipse cx="28" cy="54" rx="11" ry="6" transform="rotate(-20 28 54)" fill="#e8a27a" ${O}/>` +
    `<ellipse cx="92" cy="54" rx="11" ry="6" transform="rotate(20 92 54)" fill="#e8a27a" ${O}/>` +
    `<ellipse cx="60" cy="64" rx="32" ry="30" fill="#f2b98c" ${O}/>` +
    [0, 72, 144, 216, 288].map((a) => `<circle cx="${(72 + 5 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(36 + 5 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="4" fill="#ffa3c0" ${O}/>`).join("") +
    `<circle cx="72" cy="36" r="3" fill="#ffd84d"/>` +
    face(60, 66, 0.95),

  gemini: () =>
    `<path d="M42 48 L38 30" fill="none" ${O}/><path d="M78 48 L82 30" fill="none" ${O}/>` +
    star(38, 27, 7, "#ffd84d") + star(82, 27, 7, "#ffd84d") +
    `<circle cx="42" cy="70" r="23" fill="#ffe680" ${O}/>` +
    `<circle cx="78" cy="70" r="23" fill="#a8e6cf" ${O}/>` +
    face(42, 68, 0.7) + face(78, 68, 0.7),

  cancer: () =>
    limb("M32 84 L20 92", "#ff8b7b", 3.5) + limb("M36 92 L28 102", "#ff8b7b", 3.5) +
    limb("M88 84 L100 92", "#ff8b7b", 3.5) + limb("M84 92 L92 102", "#ff8b7b", 3.5) +
    limb("M34 62 L26 48", "#ff8b7b", 4) + limb("M86 62 L94 48", "#ff8b7b", 4) +
    claw(24, 40, 12, 270, "#ff8b7b") + claw(96, 40, 12, 270, "#ff8b7b") +
    limb("M50 56 L47 42", "#ff8b7b", 3) + limb("M70 56 L73 42", "#ff8b7b", 3) +
    `<ellipse cx="60" cy="74" rx="33" ry="24" fill="#ff8b7b" ${O}/>` +
    `<circle cx="47" cy="39" r="6.5" fill="#fff" ${O}/><circle cx="73" cy="39" r="6.5" fill="#fff" ${O}/>` +
    `<circle cx="48" cy="40" r="3.2" fill="${INK}"/><circle cx="72" cy="40" r="3.2" fill="${INK}"/>` +
    face(60, 70, 0.9, { eyes: false }),

  leo: () =>
    fluff(60, 64, 30, 12, 13, "#f59e42") +
    `<circle cx="40" cy="42" r="8" fill="#ffd77a" ${O}/><circle cx="80" cy="42" r="8" fill="#ffd77a" ${O}/>` +
    `<circle cx="60" cy="66" r="25" fill="#ffd77a" ${O}/>` +
    face(60, 62, 0.9),

  virgo: () =>
    `<circle cx="27" cy="76" r="11" fill="#8b5e3c" ${O}/><circle cx="93" cy="76" r="11" fill="#8b5e3c" ${O}/>` +
    `<circle cx="60" cy="62" r="34" fill="#8b5e3c" ${O}/>` +
    `<circle cx="60" cy="70" r="25" fill="#ffe0cc" ${O}/>` +
    `<path d="M34 64 q3 -28 26 -28 q23 0 26 28 q-8 -9 -14 -7 q-5 -8 -12 -6 q-7 -2 -12 6 q-6 -2 -14 7z" fill="#8b5e3c" ${O}/>` +
    `<path d="M80 34 L94 18" fill="none" ${O}/>` +
    [[84, 28], [88, 23], [92, 18]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="5" transform="rotate(40 ${x} ${y})" fill="#f4c542" ${O}/>`).join("") +
    `<circle cx="42" cy="38" r="4" fill="#fff" ${O}/><circle cx="42" cy="38" r="1.6" fill="#ffd84d"/>` +
    face(60, 74, 0.85),

  libra: () =>
    `<path d="M20 78 L100 78" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M20 78 L11 92 M20 78 L29 92 M100 78 L91 92 M100 78 L109 92" fill="none" stroke="${INK}" stroke-width="1.6"/>` +
    `<path d="M8 92 a12 6 0 0 0 24 0z" fill="#ffd56b" ${O}/><path d="M88 92 a12 6 0 0 0 24 0z" fill="#ffd56b" ${O}/>` +
    `<ellipse cx="48" cy="32" rx="7" ry="18" fill="#fdf2f8" ${O}/><ellipse cx="48" cy="33" rx="3" ry="11" fill="#ffb3cb"/>` +
    `<ellipse cx="72" cy="32" rx="7" ry="18" fill="#fdf2f8" ${O}/><ellipse cx="72" cy="33" rx="3" ry="11" fill="#ffb3cb"/>` +
    `<circle cx="60" cy="72" r="27" fill="#fdf2f8" ${O}/>` +
    face(60, 68, 0.9),

  scorpio: () =>
    limb("M50 90 C10 96, 6 30, 40 22", "#b28ef0", 8) +
    heart(44, 21, 1.1, "#ff6fa5") +
    limb("M84 62 L94 58", "#b28ef0", 4) + limb("M84 80 L94 86", "#b28ef0", 4) +
    claw(100, 56, 9, 0, "#b28ef0") + claw(100, 88, 9, 0, "#b28ef0") +
    `<circle cx="60" cy="70" r="26" fill="#c9a9ff" ${O}/>` +
    face(60, 68, 0.9),

  sagittarius: () =>
    `<path d="M98 26 Q116 64 98 102" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
    `<path d="M98 26 Q116 64 98 102" fill="none" stroke="#c98a4b" stroke-width="3.5" stroke-linecap="round"/>` +
    `<path d="M98 26 L98 102" stroke="${INK}" stroke-width="1.4"/>` +
    limb("M76 64 L106 64", "#c98a4b", 2.5) +
    `<path d="M104 58 L114 64 L104 70Z" fill="#ff8b7b" ${O}/>` +
    `<path d="M36 46 L40 22 L54 38z" fill="#c9b6ff" ${O}/><path d="M84 46 L80 22 L66 38z" fill="#c9b6ff" ${O}/>` +
    `<ellipse cx="60" cy="64" rx="30" ry="28" fill="#ddd0ff" ${O}/>` +
    `<circle cx="51" cy="38" r="8" fill="#7c5cd6" ${O}/><circle cx="69" cy="38" r="8" fill="#7c5cd6" ${O}/><circle cx="60" cy="34" r="9" fill="#7c5cd6" ${O}/>` +
    face(60, 66, 0.9),

  capricorn: () =>
    `<path d="M46 42 C40 18, 22 14, 16 28 C26 22, 34 28, 38 46Z" fill="#d8c3a5" ${O}/>` +
    `<path d="M74 42 C80 18, 98 14, 104 28 C94 22, 86 28, 82 46Z" fill="#d8c3a5" ${O}/>` +
    `<ellipse cx="28" cy="60" rx="12" ry="6" transform="rotate(20 28 60)" fill="#f4efe8" ${O}/>` +
    `<ellipse cx="92" cy="60" rx="12" ry="6" transform="rotate(-20 92 60)" fill="#f4efe8" ${O}/>` +
    `<path d="M52 86 q8 24 16 0z" fill="#e8dfd2" ${O}/>` +
    `<ellipse cx="60" cy="64" rx="28" ry="29" fill="#fbf8f4" ${O}/>` +
    `<circle cx="54" cy="38" r="6" fill="#fff" ${O}/><circle cx="66" cy="38" r="6" fill="#fff" ${O}/>` +
    face(60, 66, 0.9),

  aquarius: () =>
    limb("M88 56 q18 2 14 22 q-3 12 -16 10", "#7fc4f0", 4) +
    `<path d="M44 38 q-20 12 -20 36 q0 26 36 26 q36 0 36 -26 q0 -24 -20 -36z" fill="#9ad6ff" ${O}/>` +
    `<rect x="40" y="28" width="40" height="11" rx="5.5" fill="#6fb8ec" ${O}/>` +
    `<path d="M32 86 q7 -5 14 0 t14 0 t14 0 t14 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
    drop(60, 16, 1, "#c4ebff") + drop(46, 22, 0.6, "#c4ebff") + drop(74, 22, 0.6, "#c4ebff") +
    face(60, 64, 0.9),

  pisces: () =>
    `<path d="M48 44 q10 -16 24 -2z" fill="#ff9ec7" ${O}/>` +
    `<path d="M84 66 L108 48 Q101 66 108 84Z" fill="#ff9ec7" ${O}/>` +
    `<ellipse cx="56" cy="66" rx="34" ry="25" fill="#ffc6de" ${O}/>` +
    `<path d="M70 56 q5 5 0 10 M78 60 q5 5 0 10 M70 70 q5 5 0 10" fill="none" stroke="#ff8fbc" stroke-width="2" stroke-linecap="round"/>` +
    `<circle cx="20" cy="40" r="4.5" fill="none" stroke="#7fc4f0" stroke-width="2"/><circle cx="26" cy="28" r="2.8" fill="none" stroke="#7fc4f0" stroke-width="2"/>` +
    face(46, 64, 0.85),
};

// 눈 위치 [가운데 x, y, 크기] — 안경·선글라스를 씌울 자리
const EYES = {
  aries: [[60, 66, 0.85]], taurus: [[60, 66, 0.95]], gemini: [[42, 68, 0.7], [78, 68, 0.7]],
  cancer: [[60, 39, 1.3]], leo: [[60, 62, 0.9]], virgo: [[60, 74, 0.85]], libra: [[60, 68, 0.9]],
  scorpio: [[60, 68, 0.9]], sagittarius: [[60, 66, 0.9]], capricorn: [[60, 66, 0.9]],
  aquarius: [[60, 64, 0.9]], pisces: [[46, 64, 0.85]],
};

const glasses = (cx, cy, s, dark) => {
  const lens = (x) => dark
    ? `<rect x="${x - 7 * s}" y="${cy - 5 * s}" width="${14 * s}" height="${10 * s}" rx="${4 * s}" fill="${INK}"/>` +
      `<path d="M${x - 4 * s} ${cy - 2 * s} l${3 * s} 0" stroke="#fff" stroke-width="${1.4 * s}" stroke-linecap="round" opacity=".8"/>`
    : `<circle cx="${x}" cy="${cy}" r="${7 * s}" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="${1.8 * s}"/>`;
  return lens(cx - 10 * s) + lens(cx + 10 * s) +
    `<path d="M${cx - 3 * s} ${cy - 1 * s} q${3 * s} ${-2.5 * s} ${6 * s} 0" fill="none" stroke="${INK}" stroke-width="${1.8 * s}"/>`;
};

const ribbon = (cx, cy) =>
  `<path d="M${cx} ${cy} L${cx - 11} ${cy - 7} L${cx - 11} ${cy + 7}Z" fill="#ff7fa8" ${O}/>` +
  `<path d="M${cx} ${cy} L${cx + 11} ${cy - 7} L${cx + 11} ${cy + 7}Z" fill="#ff7fa8" ${O}/>` +
  `<circle cx="${cx}" cy="${cy}" r="3.5" fill="#ff5c8d" ${O}/>`;

const sparkle = (cx, cy, r, color) =>
  `<path d="M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r}Z" fill="${color}"/>`;

// MBTI 기질 그룹별 소품: NT 안경, NF 하트, SJ 리본, SP 선글라스
function accessory(signId, mbti) {
  const group = mbti[1] === "N" ? `N${mbti[2]}` : `S${mbti[3]}`;
  if (group === "NT") return EYES[signId].map(([x, y, s]) => glasses(x, y, s, false)).join("");
  if (group === "SP") return EYES[signId].map(([x, y, s]) => glasses(x, y, s, true)).join("");
  if (group === "SJ") return ribbon(100, 16);
  return heart(101, 18, 1.2, "#ff6fa5") + sparkle(88, 10, 5, "#ffd84d") + sparkle(112, 32, 4, "#ffd84d");
}

/** 별자리 캐릭터 SVG 문자열. mbti를 주면 기질 소품과 MBTI 배지가 붙은 조합 캐릭터가 된다. */
export function characterSVG(sign, { bg = true, mbti, label } = {}) {
  const title = label ?? `${mbti ? `${mbti} ` : ""}${sign.name} 캐릭터 ${MASCOTS[sign.id].name}`;
  const height = mbti ? 134 : 120;
  return (
    `<svg viewBox="0 0 120 ${height}" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">` +
    (bg ? `<circle cx="60" cy="62" r="56" fill="${BG[sign.element]}"/>` : "") +
    DRAW[sign.id]() +
    (mbti
      ? accessory(sign.id, mbti) +
        `<rect x="34" y="112" width="52" height="20" rx="10" fill="#fff" ${O}/>` +
        `<text x="60" y="126.5" text-anchor="middle" font-size="12" font-weight="800" fill="${INK}" ` +
        `font-family="system-ui, sans-serif" letter-spacing="1">${mbti}</text>`
      : "") +
    `</svg>`
  );
}
