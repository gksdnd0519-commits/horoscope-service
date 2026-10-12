// 12별자리 데이터와 생년월일 → 별자리 판별 로직.
// 프로필 문구는 모두 자체 작성한 콘텐츠다.

export const ELEMENTS = {
  fire: { name: "불", desc: "열정과 추진력" },
  earth: { name: "흙", desc: "현실 감각과 꾸준함" },
  air: { name: "공기", desc: "생각과 소통" },
  water: { name: "물", desc: "감성과 공감" },
};

// start: 해당 별자리가 시작되는 [월, 일]. 황도 순서(양자리부터)로 나열한다.
export const SIGNS = [
  {
    id: "aries", name: "양자리", symbol: "♈", start: [3, 21], element: "fire", ruler: "화성",
    keywords: ["도전", "솔직함", "리더십"],
    profile: {
      personality: "생각이 떠오르면 바로 움직이는 개척자입니다. 누구보다 먼저 시작하는 용기가 강점이지만, 마무리 단계에서 흥미가 식기 쉬우니 끝까지 함께 갈 동료를 곁에 두면 좋습니다.",
      love: "마음에 들면 숨기지 않고 먼저 다가갑니다. 밀고 당기기보다 솔직한 표현을 좋아하고, 함께 새로운 것을 해보는 연애에서 가장 빛납니다.",
      career: "속도와 결단이 필요한 일에 강합니다. 영업, 창업, 스포츠, 프로젝트 리더처럼 목표가 분명하고 성과가 바로 보이는 분야가 잘 맞습니다.",
      health: "에너지를 한꺼번에 쏟는 편이라 두통과 과로를 조심하세요. 짧고 강도 높은 운동으로 열기를 풀어주면 컨디션이 안정됩니다.",
    },
    lucky: { color: "레드", number: 9, day: "화요일", stone: "루비" },
  },
  {
    id: "taurus", name: "황소자리", symbol: "♉", start: [4, 20], element: "earth", ruler: "금성",
    keywords: ["안정", "감각", "인내"],
    profile: {
      personality: "한 번 정한 일은 묵묵히 해내는 든든한 사람입니다. 맛있는 음식, 좋은 음악처럼 오감을 채우는 것에서 행복을 찾고, 변화 앞에서는 신중하게 속도를 조절합니다.",
      love: "천천히 마음을 열지만 한 번 열면 오래 갑니다. 화려한 이벤트보다 꾸준한 관심과 함께하는 편안한 일상을 사랑의 증거로 여깁니다.",
      career: "결과물이 손에 잡히는 일이 잘 맞습니다. 금융, 요리, 디자인, 부동산처럼 감각과 꾸준함이 쌓여 가치가 되는 분야에서 성과를 냅니다.",
      health: "목과 어깨가 쉽게 뭉칩니다. 맛있는 것을 즐기는 만큼 식사량 조절과 가벼운 산책을 습관으로 만들어 주세요.",
    },
    lucky: { color: "그린", number: 6, day: "금요일", stone: "에메랄드" },
  },
  {
    id: "gemini", name: "쌍둥이자리", symbol: "♊", start: [5, 21], element: "air", ruler: "수성",
    keywords: ["호기심", "재치", "소통"],
    profile: {
      personality: "궁금한 것이 많고 머리 회전이 빠른 이야기꾼입니다. 여러 일을 동시에 다루는 데 능하지만 관심이 흩어지기 쉬우니, 우선순위를 적어두는 습관이 큰 힘이 됩니다.",
      love: "대화가 잘 통하는 사람에게 끌립니다. 지루함을 싫어해 함께 웃고 떠들 수 있는 친구 같은 연애를 원합니다.",
      career: "말과 글, 정보를 다루는 일에 재능이 있습니다. 마케팅, 기자, 강사, 콘텐츠 기획처럼 매일 새로운 자극이 있는 분야가 어울립니다.",
      health: "생각이 많아 잠이 얕아질 수 있습니다. 잠들기 전 화면을 멀리하고 호흡을 고르는 시간을 가지세요.",
    },
    lucky: { color: "옐로", number: 5, day: "수요일", stone: "아게이트" },
  },
  {
    id: "cancer", name: "게자리", symbol: "♋", start: [6, 22], element: "water", ruler: "달",
    keywords: ["보살핌", "공감", "기억력"],
    profile: {
      personality: "가까운 사람을 끝까지 챙기는 따뜻한 보호자입니다. 감정의 결을 섬세하게 읽어내지만 상처도 오래 기억하는 편이라, 마음을 털어놓을 안전한 공간이 필요합니다.",
      love: "신뢰가 쌓여야 마음을 엽니다. 가족처럼 서로를 챙기는 관계를 꿈꾸며, 작은 기념일과 추억을 소중히 여깁니다.",
      career: "사람을 돌보고 공동체를 만드는 일에 강합니다. 교육, 상담, 의료, 요식업, 인사 관리처럼 정성이 결과로 이어지는 분야가 잘 맞습니다.",
      health: "스트레스가 소화기로 오기 쉽습니다. 규칙적인 식사와 따뜻한 음식으로 속을 편하게 해주세요.",
    },
    lucky: { color: "실버", number: 2, day: "월요일", stone: "진주" },
  },
  {
    id: "leo", name: "사자자리", symbol: "♌", start: [7, 23], element: "fire", ruler: "태양",
    keywords: ["자신감", "관대함", "표현력"],
    profile: {
      personality: "어디서든 분위기를 밝히는 타고난 주인공입니다. 사람들을 이끌고 칭찬하는 데 인색하지 않지만, 인정받지 못한다고 느끼면 쉽게 상처받으니 스스로를 먼저 인정해 주세요.",
      love: "사랑할 때 아낌없이 표현하고 크게 베풉니다. 상대에게 자랑스러운 존재가 되고 싶어 하며, 진심 어린 칭찬에 가장 약합니다.",
      career: "무대와 책임이 있는 자리에서 실력이 드러납니다. 공연, 방송, 경영, 브랜드 기획처럼 자신의 색을 보여줄 수 있는 일이 잘 맞습니다.",
      health: "심장과 허리를 아껴 주세요. 무리한 일정 뒤에는 반드시 충분한 휴식을 넣는 것이 좋습니다.",
    },
    lucky: { color: "골드", number: 1, day: "일요일", stone: "페리도트" },
  },
  {
    id: "virgo", name: "처녀자리", symbol: "♍", start: [8, 23], element: "earth", ruler: "수성",
    keywords: ["분석", "성실", "배려"],
    profile: {
      personality: "디테일을 놓치지 않는 꼼꼼한 해결사입니다. 남이 못 본 문제를 먼저 발견하고 묵묵히 고쳐 놓지만, 스스로에게 너무 엄격해지지 않도록 '이만하면 충분하다'는 기준도 필요합니다.",
      love: "말보다 행동으로 마음을 보여줍니다. 상대의 작은 습관까지 기억해 챙기며, 서로의 성장을 돕는 관계를 원합니다.",
      career: "정확함이 생명인 일에서 빛납니다. 데이터 분석, 회계, 편집, 연구, 품질 관리처럼 체계와 완성도가 중요한 분야가 어울립니다.",
      health: "걱정이 많아지면 장이 예민해집니다. 일과 휴식의 경계를 정하고 가벼운 요가나 스트레칭을 곁들이세요.",
    },
    lucky: { color: "네이비", number: 5, day: "수요일", stone: "사파이어" },
  },
  {
    id: "libra", name: "천칭자리", symbol: "♎", start: [9, 24], element: "air", ruler: "금성",
    keywords: ["균형", "조화", "미적 감각"],
    profile: {
      personality: "모두가 편안한 방향을 찾는 타고난 중재자입니다. 아름다운 것과 공정함을 중요하게 여기지만, 모두를 만족시키려다 결정이 늦어질 수 있으니 내 마음의 우선순위를 먼저 정해보세요.",
      love: "함께하는 시간의 분위기를 중시합니다. 서로 존중하고 대화로 균형을 맞추는 성숙한 관계에서 가장 행복합니다.",
      career: "사람과 사람, 아이디어와 아이디어를 잇는 일에 강합니다. 디자인, 외교, 법률, 홍보, 패션 분야에서 감각을 발휘합니다.",
      health: "허리와 신장 쪽을 챙기세요. 물을 충분히 마시고 생활 리듬이 무너지지 않도록 하는 것이 중요합니다.",
    },
    lucky: { color: "핑크", number: 6, day: "금요일", stone: "오팔" },
  },
  {
    id: "scorpio", name: "전갈자리", symbol: "♏", start: [10, 23], element: "water", ruler: "명왕성",
    keywords: ["집중", "통찰", "진정성"],
    profile: {
      personality: "겉은 조용하지만 속은 누구보다 뜨거운 사람입니다. 본질을 꿰뚫는 통찰력과 한 가지에 몰입하는 힘이 강점이며, 믿는 사람에게만 진짜 모습을 보여줍니다.",
      love: "가볍게 사랑하지 않습니다. 깊은 신뢰와 솔직함을 원하고, 한 번 마음을 주면 끝까지 지키는 진한 사랑을 합니다.",
      career: "깊이 파고드는 일에서 성과를 냅니다. 연구, 수사, 심리, 투자, 의학처럼 숨은 원인을 찾아내는 분야가 잘 맞습니다.",
      health: "감정을 안에 쌓아두면 몸이 먼저 지칩니다. 땀을 흘리는 운동이나 일기로 마음을 자주 비워 주세요.",
    },
    lucky: { color: "버건디", number: 8, day: "화요일", stone: "토파즈" },
  },
  {
    id: "sagittarius", name: "사수자리", symbol: "♐", start: [11, 23], element: "fire", ruler: "목성",
    keywords: ["자유", "낙관", "탐험"],
    profile: {
      personality: "더 넓은 세상을 향해 화살을 쏘는 모험가입니다. 낙천적이고 솔직해 주변에 활력을 주지만, 약속과 디테일을 가볍게 넘기지 않도록 주의하면 신뢰가 더 단단해집니다.",
      love: "함께 떠나고 배우며 성장하는 연애를 원합니다. 구속보다 서로의 자유를 존중하는 관계에서 오래 갑니다.",
      career: "새로운 경험과 배움이 있는 일이 잘 맞습니다. 여행, 교육, 출판, 해외 영업, 스타트업처럼 시야를 넓히는 분야에서 성장합니다.",
      health: "활동량이 많아 허벅지와 고관절에 무리가 가기 쉽습니다. 운동 전후 스트레칭을 잊지 마세요.",
    },
    lucky: { color: "퍼플", number: 3, day: "목요일", stone: "터키석" },
  },
  {
    id: "capricorn", name: "염소자리", symbol: "♑", start: [12, 25], element: "earth", ruler: "토성",
    keywords: ["책임감", "목표", "끈기"],
    profile: {
      personality: "높은 산을 한 걸음씩 오르는 전략가입니다. 장기적인 목표를 세우고 꾸준히 실행하는 힘이 뛰어나지만, 쉬는 것도 실력이라는 것을 기억하면 더 멀리 갈 수 있습니다.",
      love: "진지하고 책임감 있는 사랑을 합니다. 표현은 서툴러도 미래를 함께 설계하며 믿음직한 버팀목이 되어 줍니다.",
      career: "조직과 시스템 안에서 성과를 쌓는 데 강합니다. 경영, 공직, 건축, 재무, 컨설팅처럼 시간이 지날수록 가치가 커지는 일이 어울립니다.",
      health: "무릎과 관절, 피부 건조를 조심하세요. 과로가 습관이 되지 않도록 휴식 일정을 미리 정해 두세요.",
    },
    lucky: { color: "브라운", number: 8, day: "토요일", stone: "가넷" },
  },
  {
    id: "aquarius", name: "물병자리", symbol: "♒", start: [1, 20], element: "air", ruler: "천왕성",
    keywords: ["독창성", "자유", "이상"],
    profile: {
      personality: "남들과 다른 시선으로 세상을 보는 혁신가입니다. 틀에 얽매이지 않는 아이디어와 공정함에 대한 신념이 강점이며, 혼자만의 시간도 꼭 필요한 사람입니다.",
      love: "친구 같은 연인을 원합니다. 서로의 개성과 공간을 존중하고, 같은 가치를 바라보는 관계에서 깊어집니다.",
      career: "기술과 아이디어로 세상을 바꾸는 일이 잘 맞습니다. IT, 과학, 사회 혁신, 기획, 커뮤니티 운영 분야에서 두각을 나타냅니다.",
      health: "혈액 순환과 발목을 챙기세요. 오래 앉아 있었다면 자주 일어나 몸을 움직이는 것이 좋습니다.",
    },
    lucky: { color: "스카이블루", number: 4, day: "토요일", stone: "자수정" },
  },
  {
    id: "pisces", name: "물고기자리", symbol: "♓", start: [2, 19], element: "water", ruler: "해왕성",
    keywords: ["상상력", "공감", "예술성"],
    profile: {
      personality: "풍부한 상상력과 깊은 공감 능력을 가진 몽상가입니다. 다른 사람의 감정을 자기 일처럼 느끼는 만큼, 나를 지키는 경계선을 정해 두면 훨씬 편안해집니다.",
      love: "영화 같은 낭만을 꿈꾸며 헌신적으로 사랑합니다. 감정을 말하지 않아도 알아주는 다정한 상대에게 마음이 갑니다.",
      career: "감성과 직관을 살리는 일이 잘 맞습니다. 음악, 미술, 영상, 상담, 사회복지처럼 사람의 마음에 닿는 분야에서 빛납니다.",
      health: "발과 면역력을 챙기세요. 충분한 수면과 따뜻한 물로 하는 족욕이 컨디션 회복에 도움이 됩니다.",
    },
    lucky: { color: "아쿠아", number: 7, day: "목요일", stone: "아쿠아마린" },
  },
];

const BY_ID = Object.fromEntries(SIGNS.map((s) => [s.id, s]));

export function getSign(id) {
  return BY_ID[id];
}

/** 별자리 기간을 "3월 21일 ~ 4월 19일" 형식으로 돌려준다. */
export function signPeriod(sign) {
  const next = SIGNS[(SIGNS.indexOf(sign) + 1) % SIGNS.length];
  const end = new Date(2001, next.start[0] - 1, next.start[1] - 1); // 평년 기준 전날
  return `${sign.start[0]}월 ${sign.start[1]}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
}

/** 월(1~12), 일로 별자리를 찾는다. 범위를 벗어나면 null. */
export function signFromDate(month, day) {
  if (!Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12) return null;
  const maxDay = new Date(2000, month, 0).getDate(); // 윤년 기준이라 2/29 허용
  if (day < 1 || day > maxDay) return null;
  const key = month * 100 + day;
  // 시작일이 key 이하인 별자리 중 가장 늦게 시작하는 것. 없으면 연말의 염소자리.
  let found = null;
  for (const s of SIGNS) {
    const start = s.start[0] * 100 + s.start[1];
    if (start <= key && (!found || start > found.start[0] * 100 + found.start[1])) found = s;
  }
  return found ?? BY_ID.capricorn;
}
