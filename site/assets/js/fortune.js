// 오늘의 운세·궁합 생성 로직.
// 서버 없이 "날짜 + 별자리"를 시드로 한 결정적 난수를 써서,
// 같은 날 같은 별자리는 누구에게나 같은 운세가, 다음 날에는 새 운세가 나온다.

import { SIGNS, ELEMENTS, getSign } from "./zodiac.js";

/** 한국 시간(KST) 기준 오늘 날짜를 YYYY-MM-DD 로 돌려준다. */
export function todayKST(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(now);
}

// 문자열 → 32bit 해시 (FNV-1a)
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// 시드 기반 난수 생성기 (mulberry32)
function rng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];

// 점수대별 문구: low(1~2점) / mid(3점) / high(4~5점)
const MESSAGES = {
  overall: {
    label: "총운",
    low: [
      "속도를 늦추면 놓쳤던 것이 보이는 날입니다. 큰 결정은 하루 미뤄도 괜찮아요.",
      "작은 일이 엉키기 쉬우니 일정을 여유 있게 잡으세요. 저녁에는 흐름이 풀립니다.",
      "마음먹은 대로 되지 않아도 조급해하지 마세요. 오늘은 준비하는 날입니다.",
    ],
    mid: [
      "무난하게 흘러가는 하루입니다. 평소 하던 일을 차분히 이어가면 충분합니다.",
      "특별한 사건은 없지만 소소한 즐거움이 있는 날. 좋아하는 것을 하나 챙겨보세요.",
      "균형이 중요한 날입니다. 일과 휴식을 반반씩 나누면 컨디션이 유지됩니다.",
    ],
    high: [
      "기운이 맑게 차오르는 날입니다. 미뤄 둔 일을 시작하면 순조롭게 풀립니다.",
      "타이밍이 잘 맞는 하루. 떠오른 아이디어를 바로 실행해 보세요.",
      "주변의 도움이 자연스럽게 모이는 날입니다. 먼저 손을 내밀면 더 크게 돌아옵니다.",
    ],
  },
  love: {
    label: "애정운",
    low: [
      "말 한마디가 오해를 부를 수 있어요. 감정이 올라오면 한 템포 쉬고 말하세요.",
      "혼자만의 시간이 필요한 날입니다. 서운함은 내일 차분히 이야기하세요.",
      "상대의 반응에 너무 의미를 두지 마세요. 오늘은 나를 먼저 돌보는 날입니다.",
    ],
    mid: [
      "평온한 관계가 이어집니다. 짧은 안부 메시지 하나가 분위기를 따뜻하게 합니다.",
      "익숙함 속에 작은 변화를 주면 좋아요. 평소와 다른 장소에서 만나 보세요.",
      "솔로라면 지인 모임에서 편안한 대화가 오갈 수 있어요.",
    ],
    high: [
      "매력이 빛나는 날입니다. 마음에 둔 사람이 있다면 먼저 연락해 보세요.",
      "진심이 잘 전해지는 날. 고마운 마음을 표현하면 관계가 한층 가까워집니다.",
      "설레는 만남의 기운이 있습니다. 새로운 자리에 적극적으로 나가 보세요.",
    ],
  },
  money: {
    label: "금전운",
    low: [
      "충동구매를 조심하세요. 장바구니에 넣고 하루 뒤에 다시 보는 것이 좋습니다.",
      "예상치 못한 지출이 생길 수 있어요. 오늘은 지갑을 단단히 닫아두세요.",
      "돈 거래나 보증은 피하는 것이 좋은 날입니다.",
    ],
    mid: [
      "수입과 지출이 균형을 이루는 날. 가계부를 정리하기에 좋습니다.",
      "작은 절약이 쌓이는 날입니다. 구독 서비스를 한 번 점검해 보세요.",
      "큰 변화는 없지만 꾸준한 저축이 든든한 힘이 됩니다.",
    ],
    high: [
      "작은 행운이 따르는 날입니다. 잊고 있던 포인트나 환급을 확인해 보세요.",
      "재정 계획을 세우면 좋은 결과로 이어집니다. 장기적인 투자 공부를 시작해 보세요.",
      "노력한 만큼 보상이 돌아오는 날. 협상이나 가격 비교에서 이득을 봅니다.",
    ],
  },
  work: {
    label: "일·학업운",
    low: [
      "실수가 생기기 쉬우니 제출 전에 한 번 더 확인하세요.",
      "집중력이 흩어지는 날입니다. 25분 집중 + 5분 휴식으로 리듬을 만들어 보세요.",
      "의견 충돌이 있을 수 있어요. 결론보다 상대의 이유를 먼저 들어보세요.",
    ],
    mid: [
      "해야 할 일을 목록으로 정리하면 하루가 훨씬 가벼워집니다.",
      "꾸준함이 빛을 보는 날. 오늘 한 만큼 내일이 편해집니다.",
      "새로운 일보다 진행 중인 일을 마무리하는 데 집중하세요.",
    ],
    high: [
      "실력이 인정받는 날입니다. 발표나 면접이 있다면 자신 있게 임하세요.",
      "막혀 있던 문제의 실마리가 보입니다. 새로운 방식으로 접근해 보세요.",
      "협업 운이 좋습니다. 팀원과 아이디어를 나누면 좋은 결과가 나옵니다.",
    ],
  },
};

const LUCKY_ITEMS = ["손수건", "이어폰", "텀블러", "향수", "책갈피", "반지", "운동화", "우산",
  "다이어리", "초콜릿", "꽃 한 송이", "모자", "선글라스", "열쇠고리", "핸드크림", "볼펜"];
const LUCKY_COLORS = ["코랄", "민트", "라벤더", "아이보리", "네이비", "올리브", "버터옐로",
  "스카이블루", "와인", "베이지", "블랙", "화이트"];

function tier(score) {
  return score <= 2 ? "low" : score === 3 ? "mid" : "high";
}

/** signId 별자리의 dateStr(YYYY-MM-DD) 운세. */
export function dailyFortune(signId, dateStr = todayKST()) {
  const rand = rng(hash(`${signId}|${dateStr}`));
  const categories = Object.entries(MESSAGES).map(([key, m]) => {
    // 1~5점, 양 끝 점수는 덜 나오도록 두 번 굴려 평균
    const score = Math.max(1, Math.min(5, Math.round((rand() * 5 + rand() * 5) / 2 + 0.5)));
    return { key, label: m.label, score, text: pick(rand, m[tier(score)]) };
  });
  return {
    sign: getSign(signId),
    date: dateStr,
    categories,
    lucky: {
      color: pick(rand, LUCKY_COLORS),
      number: 1 + Math.floor(rand() * 45),
      item: pick(rand, LUCKY_ITEMS),
    },
  };
}

// 황도상 거리(0~6)별 관계. 같은 원소는 거리 4(트라인), 잘 맞는 원소는 거리 2(섹스타일).
const ASPECTS = {
  0: { score: 80, title: "닮은꼴 커플", text: "같은 별자리라 말하지 않아도 통합니다. 다만 단점도 닮아 있으니 서로의 빈틈을 채워 줄 역할을 나눠 보세요." },
  1: { score: 62, title: "새로운 자극", text: "이웃한 별자리는 서로 전혀 다른 방식으로 세상을 봅니다. 차이를 배움으로 받아들이면 성장하는 관계가 됩니다." },
  2: { score: 85, title: "편안한 친구 같은 사이", text: "서로의 원소가 자연스럽게 어울려 대화가 즐겁습니다. 함께하는 활동이 많을수록 관계가 깊어집니다." },
  3: { score: 55, title: "불꽃 튀는 긴장감", text: "생각의 방향이 엇갈리기 쉬워 부딪힐 때가 있습니다. 하지만 갈등을 잘 넘기면 누구보다 단단한 팀이 됩니다." },
  4: { score: 93, title: "천생연분", text: "같은 원소를 공유해 가치관과 리듬이 잘 맞습니다. 서로를 있는 그대로 응원하는 최고의 궁합입니다." },
  5: { score: 68, title: "조율이 필요한 사이", text: "관심사가 잘 겹치지 않아 처음에는 어색할 수 있습니다. 상대의 세계에 호기심을 가지면 의외의 매력을 발견합니다." },
  6: { score: 76, title: "끌리는 반대편", text: "황도 정반대에 있는 별자리로, 내게 없는 것을 가진 상대에게 강하게 끌립니다. 균형을 맞추면 완벽한 보완 관계입니다." },
};

/** 두 별자리 궁합 */
export function compatibility(idA, idB) {
  const a = getSign(idA);
  const b = getSign(idB);
  const diff = Math.abs(SIGNS.indexOf(a) - SIGNS.indexOf(b));
  const distance = Math.min(diff, 12 - diff);
  return {
    a, b, distance, ...ASPECTS[distance],
    elements: `${ELEMENTS[a.element].name} × ${ELEMENTS[b.element].name}`,
  };
}
