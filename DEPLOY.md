배포 가이드 (한국어)

 - `server/.env` 파일을 복사하여 실제 키를 넣습니다. 예시는 문서에 노출하지 말고, 실제 값은 로컬에서만 보관하세요. 이 파일은 절대 원격에 푸시하지 마세요.
- 루트에서 다음 명령을 실행합니다:
  - `npm install`
  - `npm run dev` (또는 `npm run server`를 별도 터미널에서 실행)

  - VITE_DEV_PROXY_TARGET = (예: http://localhost:<port> 또는 http://localhost)  (선택)
- 추가한 뒤 Deploys에서 'Clear cache and deploy site'를 클릭하세요.

- 민감키가 노출되었을 가능성이 있는 경우(과거에 .env를 커밋한 적이 있다면) 해당 서비스에서 키를 폐기하고 새 키를 발급받아 Netlify 환경변수에 업데이트하세요.

- Netlify CLI를 사용하면 `netlify dev --env OPENROUTER_API_KEY="your_key"` 같은 방식으로 로컬환경에서 실행할 수 있습니다.
  - OPENROUTER_API_KEY = (실제 키 — 이 값은 절대 레포에 커밋하지 마세요)
  - MODEL = (모델 이름)
  - VITE_SITE_NAME = (공개용 사이트 이름, 노출 가능)
3) 키 교체 권장
