// MBTI 16유형 데이터와 "별자리 × MBTI" 조합 캐릭터 생성 로직.

import { SIGNS, ELEMENTS, getSign } from "./zodiac.js";
import { MASCOTS } from "./characters.js";

export const GROUPS = {
  NT: { name: "분석가", item: "동그란 안경" },
  NF: { name: "외교관", item: "반짝 하트" },
  SJ: { name: "관리자", item: "리본" },
  SP: { name: "탐험가", item: "선글라스" },
};

// adj: 조합 이름에 붙는 수식어, best: 흔히 말하는 찰떡 MBTI
export const MBTI = {
  INTJ: { adj: "전략 짜는", desc: "머릿속에 이미 10년 계획이 있는 전략가", best: "ENFP" },
  INTP: { adj: "궁금한 게 많은", desc: "질문 하나로 밤새 탐구하는 논리술사", best: "ENTJ" },
  ENTJ: { adj: "앞장서는", desc: "목표가 생기면 판을 짜고 모두를 이끄는 지휘관", best: "INTP" },
  ENTP: { adj: "아이디어 뿜뿜", desc: "기발한 말솜씨로 토론을 즐기는 발명가", best: "INFJ" },
  INFJ: { adj: "속 깊은", desc: "조용하지만 사람 마음을 꿰뚫는 통찰가", best: "ENTP" },
  INFP: { adj: "몽글몽글", desc: "자기만의 세계와 따뜻한 가치를 지키는 이상주의자", best: "ENFJ" },
  ENFJ: { adj: "다정한 리더", desc: "모두의 성장을 응원하는 따뜻한 리더", best: "INFP" },
  ENFP: { adj: "햇살 같은", desc: "어디서든 신나는 일을 찾아내는 에너자이저", best: "INTJ" },
  ISTJ: { adj: "계획대로 착착", desc: "약속과 원칙을 지키는 믿음직한 관리자", best: "ESFP" },
  ISFJ: { adj: "챙겨주는", desc: "조용히 주변을 돌보는 다정한 수호자", best: "ESTP" },
  ESTJ: { adj: "똑 부러지는", desc: "일을 체계적으로 끝내는 실행가", best: "ISTP" },
  ESFJ: { adj: "인싸 매니저", desc: "모두를 챙기고 분위기를 살피는 사교가", best: "ISFP" },
  ISTP: { adj: "쿨한 만능", desc: "말보다 손이 빠른 해결사", best: "ESTJ" },
  ISFP: { adj: "감성 충만", desc: "지금 이 순간의 아름다움을 즐기는 예술가", best: "ESFJ" },
  ESTP: { adj: "행동파", desc: "생각보다 몸이 먼저 나가는 모험가", best: "ISFJ" },
  ESFP: { adj: "분위기 메이커", desc: "어디서든 무대를 만드는 엔터테이너", best: "ISTJ" },
};

export const MBTI_TYPES = Object.keys(MBTI);

export function isMbti(code) {
  return typeof code === "string" && code.toUpperCase() in MBTI;
}

export function mbtiGroup(code) {
  return code[1] === "N" ? `N${code[2]}` : `S${code[3]}`;
}

// 원소 × 외향/내향 성향 문장
const BLEND = {
  fire: {
    E: "에너지가 두 배! 어디서든 주목받고 분위기를 끌어올리는 타입이에요.",
    I: "겉은 차분해 보여도 속은 활활, 한 번 꽂히면 누구보다 뜨겁게 몰입해요.",
  },
  earth: {
    E: "추진력에 현실 감각까지 갖춰서 말한 건 꼭 해내는 든든한 행동파예요.",
    I: "조용히, 하지만 확실하게 결과를 쌓아 올리는 묵직한 실력파예요.",
  },
  air: {
    E: "말과 아이디어로 사람을 모으는 소통왕! 대화 속에서 영감을 얻어요.",
    I: "머릿속이 아이디어 창고예요. 생각을 글이나 작품으로 풀어낼 때 빛나요.",
  },
  water: {
    E: "공감력 만렙이라 친구들의 마음을 먼저 알아채고 챙겨줘요.",
    I: "감수성이 깊어 작은 것에도 크게 감동하는 섬세한 타입이에요.",
  },
};

/** 별자리 × MBTI 조합 결과 */
export function blend(signId, code) {
  const sign = getSign(signId);
  const type = code.toUpperCase();
  const m = MBTI[type];
  const mascot = MASCOTS[sign.id];
  const group = GROUPS[mbtiGroup(type)];
  // 찰떡 짝꿍: 찰떡 MBTI + 같은 원소의 다음 별자리(트라인)
  const partnerSign = SIGNS[(SIGNS.indexOf(sign) + 4) % 12];
  return {
    sign,
    mbti: type,
    group,
    mascot,
    title: `${m.adj} ${mascot.animal}`,
    intro: `${m.desc}의 성향에 ${sign.name}의 ${sign.keywords[0]} 기질이 섞인 ${mascot.name}${josaIeyo(mascot.name)}.`,
    blend: BLEND[sign.element][type[0]],
    strengths: [...new Set([...sign.keywords, MBTI_STRENGTH[mbtiGroup(type)]])],
    element: ELEMENTS[sign.element].name,
    partner: { sign: partnerSign, mbti: m.best, title: `${MBTI[m.best].adj} ${MASCOTS[partnerSign.id].animal}` },
  };
}

// 받침 유무에 따라 '이에요' / '예요'
function josaIeyo(word) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 ? "이에요" : "예요";
}

const MBTI_STRENGTH = { NT: "논리력", NF: "공감력", SJ: "책임감", SP: "순발력" };
