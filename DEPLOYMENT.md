# 🚀 스트림스 메트로 배포 가이드

## ✅ 프로젝트 상태

모든 개발이 완료되었습니다! 프로덕션 빌드가 성공적으로 테스트되었습니다.

**빌드 결과:**
- ✅ TypeScript 컴파일 성공
- ✅ 프로덕션 빌드 생성 (dist/)
- ✅ 총 번들 크기: ~237 KB (gzipped: ~72 KB)
- ✅ Git 저장소 초기화 및 커밋 완료

## 📦 로컬 테스트

배포 전에 로컬에서 프로덕션 빌드를 테스트해보세요:

```bash
# 프로덕션 빌드 생성
npm run build

# 프로덕션 빌드 미리보기
npm run preview
```

브라우저에서 `http://localhost:4173`을 열어 확인하세요.

## 🌐 Vercel 배포 방법

### Option 1: GitHub + Vercel (추천)

가장 쉽고 자동화된 방법입니다.

#### 1단계: GitHub에 푸시

```bash
# GitHub에서 새 저장소를 만든 후:
git remote add origin https://github.com/YOUR_USERNAME/streams-metro.git
git push -u origin main
```

#### 2단계: Vercel에 배포

1. [vercel.com](https://vercel.com)에 접속하여 GitHub 계정으로 로그인
2. **"New Project"** 클릭
3. **"Import Git Repository"** 에서 `streams-metro` 저장소 선택
4. 프로젝트 설정 (자동 감지됨):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **"Deploy"** 클릭

배포가 완료되면 Vercel이 고유 URL을 제공합니다 (예: `streams-metro.vercel.app`)

### Option 2: Vercel CLI로 배포

터미널에서 직접 배포하는 방법입니다.

#### 1단계: Vercel CLI 설치

```bash
npm install -g vercel
```

#### 2단계: 로그인

```bash
vercel login
```

#### 3단계: 배포

```bash
# 프로젝트 디렉토리에서:
vercel

# 프로덕션 배포 (처음 배포 시):
vercel --prod
```

프롬프트에 따라 설정을 완료하면 자동으로 배포됩니다.

## 🔄 자동 배포 설정

GitHub + Vercel 방식을 사용하면 **자동 배포**가 활성화됩니다:

- `main` 브랜치에 푸시할 때마다 자동으로 프로덕션 배포
- Pull Request 생성 시 자동으로 프리뷰 배포
- 배포 상태를 GitHub에서 확인 가능

## 🎮 배포 후 확인사항

배포가 완료되면 다음을 테스트하세요:

- [ ] 게임 시작 화면이 정상적으로 로드되는가?
- [ ] 플레이어 수, 노선 수, 환승역 수를 선택할 수 있는가?
- [ ] 게임을 시작하면 보드와 카드가 표시되는가?
- [ ] 역을 클릭하여 카드를 배치할 수 있는가?
- [ ] 환승역이 자동으로 동기화되는가?
- [ ] 점수가 올바르게 계산되는가?
- [ ] "모두 배치 완료" 버튼이 작동하는가?
- [ ] 라운드 종료 후 점수판이 표시되는가?
- [ ] 다음 라운드를 시작할 수 있는가?
- [ ] 모바일에서도 정상적으로 작동하는가?
- [ ] 다크모드가 작동하는가?

## 📱 도메인 설정 (선택사항)

Vercel에서 커스텀 도메인을 연결할 수 있습니다:

1. Vercel 프로젝트 대시보드에서 **"Settings"** > **"Domains"**
2. 원하는 도메인 입력 (예: `metro.yourdomain.com`)
3. DNS 설정 안내에 따라 도메인 공급업체에서 설정
4. 자동으로 SSL 인증서가 발급됩니다

## 🐛 문제 해결

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# TypeScript 오류 확인
npm run build 2>&1 | grep error
```

### 배포 후 404 오류

`vercel.json`에 rewrites 설정이 포함되어 있는지 확인하세요:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 환경 변수가 필요한 경우

Vercel 대시보드에서 **Settings** > **Environment Variables**에서 추가하세요.

## 📊 성능 모니터링

Vercel은 자동으로 다음을 제공합니다:

- 실시간 배포 로그
- 성능 분석 (Core Web Vitals)
- 에러 추적
- 사용자 분석 (Vercel Analytics 활성화 시)

## 🎉 완료!

이제 여러분의 스트림스 메트로 게임이 전 세계에 공개되었습니다! 🚇✨

URL을 친구들과 공유하고 함께 플레이해보세요!

---

**개발 문의**: 이 프로젝트는 Claude Sonnet 4.5가 구현했습니다.
**라이선스**: MIT
**기반 게임**: Metro X 보드게임 (팬메이드 디지털 구현)
