배포 가이드 (한국어)

1) 로컬 개발
- server/.env 파일을 복사하여 실제 키를 넣습니다 (예: OPENROUTER_API_KEY=YOUR_KEY). 이 파일은 절대 원격에 푸시하지 마세요.
- 루트에서 다음 명령을 실행합니다:
  - `npm install`
  - `npm run dev` (또는 `npm run server`를 별도 터미널에서 실행)

2) Netlify에 배포
- Netlify 대시보드에서 Site settings → Build & deploy → Environment에 아래 환경변수를 추가하세요:
  - OPENROUTER_API_KEY = (실제 키)
  - MODEL = (모델 이름)
  - VITE_SITE_NAME = AI_SCHEDULER
  - VITE_DEV_PROXY_TARGET = http://localhost:5000 (선택)
- 추가한 뒤 Deploys에서 'Clear cache and deploy site'를 클릭하세요.

3) 키 교체 권장
- 민감키가 노출되었을 가능성이 있는 경우(과거에 .env를 커밋한 적이 있다면) 해당 서비스에서 키를 폐기하고 새 키를 발급받아 Netlify 환경변수에 업데이트하세요.

4) 기타
- 민감값이 레포에 남아있을 가능성을 줄이려면 `.gitignore`에 `server/.env`와 `.env`가 포함되어 있어야 합니다. (이미 포함되어 있음)
- Netlify CLI를 사용하면 `netlify dev --env OPENROUTER_API_KEY="your_key"` 같은 방식으로 로컬환경에서 실행할 수 있습니다.
