# ✨ 별빛 운세

생년월일만 넣으면 내 별자리와 오늘의 운세, 궁합까지 한 번에 보는 무료 별자리 운세 웹 서비스.

- **오늘의 운세**: 총운·애정·금전·일/학업 별점과 메시지, 행운의 색·숫자·아이템 (한국 시간 기준으로 매일 바뀜)
- **별자리 프로필**: 성격·연애·직업·건강·행운요소
- **궁합**: 두 별자리의 원소와 황도 위치로 본 궁합 점수
- **공유**: 결과 URL(`?sign=leo&tab=match&with=aries`) 복사

## 문서

- [서비스 계획서](docs/PLAN.md)
- [레퍼런스 분석](docs/REFERENCE.md)

## 로컬 실행

```bash
npm start      # site/ 폴더를 http://localhost:3000 으로 서비스
npm test       # 별자리 판별·운세·궁합 로직 테스트
```

빌드 과정이 없는 정적 사이트라 `site/index.html`을 아무 정적 서버로 열어도 됩니다. ES Modules를 쓰기 때문에 파일을 더블클릭해서 여는 `file://` 방식으로는 동작하지 않습니다.

## 배포 (GitHub CLI)

`main` 브랜치에 push 하면 GitHub Actions가 테스트를 돌린 뒤 `site/` 폴더를 GitHub Pages로 배포합니다.

```bash
gh repo create horoscope-service --public --source . --push
gh api -X POST repos/{owner}/horoscope-service/pages -f build_type=workflow
gh workflow run deploy.yml     # 수동 재배포
gh run watch                   # 배포 진행 확인
```

## 레퍼런스 수집

```bash
python references/crawler/crawl_conste.py          # 12별자리 전체
python references/crawler/crawl_conste.py 양자리   # 일부만
```

Firecrawl API 키는 바탕화면 `.env`의 `FIRECRAWL_API_KEY`에서 읽습니다. 수집 원문(`references/raw/`)은 저작권 보호를 위해 git에 올리지 않습니다.
