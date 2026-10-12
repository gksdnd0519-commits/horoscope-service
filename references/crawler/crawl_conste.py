"""레퍼런스 수집: unsin.co.kr 별자리운세 12개 별자리 결과를 Firecrawl로 수집한다.

수집 결과는 references/raw/ 에 저장되며 저작권 보호를 위해 git에 올리지 않는다(.gitignore).
서비스 콘텐츠는 이 자료를 그대로 쓰지 않고, 항목 구성·분량 분석용 레퍼런스로만 사용한다.

사용법: python references/crawler/crawl_conste.py [별자리 ...]
API 키: 바탕화면 .env 의 FIRECRAWL_API_KEY
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

ENV_PATH = Path.home() / "OneDrive" / "Desktop" / ".env"
FORM_URL = "https://www.unsin.co.kr/unse/free/conste/form"
RAW_DIR = Path(__file__).resolve().parents[1] / "raw"
SIGNS = ["물병자리", "물고기자리", "양자리", "황소자리", "쌍둥이자리", "게자리",
         "사자자리", "처녀자리", "천칭자리", "전갈자리", "사수자리", "염소자리"]
SECTIONS = ["성격", "직업", "행운요소", "결혼", "건강"]


def load_api_key():
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        key, _, value = line.partition("=")
        if key.strip() == "FIRECRAWL_API_KEY":
            return value.strip().strip('"').strip("'")
    sys.exit(f"{ENV_PATH} 에 FIRECRAWL_API_KEY 가 없습니다.")


def scrape(api_key, sign):
    # 별자리 카드를 클릭해 hidden 값(what)을 채운 뒤 '결과보기' 버튼을 누른다.
    script = (
        "var el=[...document.querySelectorAll('.cont-newB')]"
        f".find(e=>e.querySelector('.title').textContent.trim()==={sign!r});"
        "el.click();document.getElementById('resultgo').click();"
    )
    body = {
        "url": FORM_URL,
        "formats": ["markdown"],
        "onlyMainContent": True,
        "actions": [
            {"type": "wait", "milliseconds": 1500},
            {"type": "executeJavascript", "script": script},
            {"type": "wait", "milliseconds": 4000},
        ],
    }
    req = urllib.request.Request(
        "https://api.firecrawl.dev/v1/scrape",
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        result = json.load(resp)
    if not result.get("success"):
        raise RuntimeError(result)
    return result["data"]["markdown"]


def parse(markdown):
    """'성격/직업/행운요소/결혼/건강' 제목 줄을 기준으로 섹션을 나눈다."""
    lines = [l.strip() for l in markdown.splitlines() if l.strip()]
    out, current = {}, None
    for line in lines:
        if line in SECTIONS:
            current = line
            out[current] = []
        elif current:
            out[current].append(line)
    period = next((l for l in lines if re.search(r"\d+월\s*\d+일\s*~", l)), "")
    return {"period": period, "sections": {k: "\n".join(v) for k, v in out.items()}}


def main():
    signs = sys.argv[1:] or SIGNS
    api_key = load_api_key()
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    for sign in signs:
        md = scrape(api_key, sign)
        parsed = parse(md)
        (RAW_DIR / f"{sign}.md").write_text(md, encoding="utf-8")
        (RAW_DIR / f"{sign}.json").write_text(
            json.dumps({"sign": sign, **parsed}, ensure_ascii=False, indent=2), encoding="utf-8")
        print(sign, "->", len(parsed["sections"]), "sections", flush=True)


if __name__ == "__main__":
    main()
