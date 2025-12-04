import { GoogleGenAI, Type } from "@google/genai";
import { AnalyzedData, RecommendedTopic, HollywoodTechnique } from "../types";
import { ANALYSIS_MODEL, WRITER_MODEL } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the user's script/input and suggests new topics using Hollywood storytelling techniques.
 */
export const analyzeAndRecommend = async (inputText: string): Promise<AnalyzedData> => {
  const prompt = `
# Role
당신은 헐리우드에서 가장 몸값이 비싼 '시나리오 각색가'이자 100만 유튜버의 메인 작가입니다. 
당신의 특기는 지루하고 평범한 텍스트를 읽고, 그것을 "시청자가 절대 이탈할 수 없는 몰입감 높은 대본"으로 재구성하는 것입니다.

# Input Data
사용자 원문:
"""
${inputText}
"""

# Task
다음 순서대로 분석하세요:

## STEP 1. 원문 정밀 분석 (Diagnosis)
1. **핵심 감정(Core Emotion):** 원문에서 느껴지는 주된 감정을 파악하세요.
   - 분노/복수/억울함 → 사이다 참교육형
   - 감동/성장/희망 → 휴먼 다큐멘터리형
   - 공포/미스터리/긴장 → 스릴러형
   - 황당/유머/혼란 → 시트콤형

2. **소재의 잠재력:** 이 소재가 유튜브 시청자에게 먹힐 핵심 포인트를 간단히 설명하세요.

## STEP 2. 헐리우드 기법 매칭 (Matching)
분석된 감정에 따라 가장 적합한 스토리텔링 기법을 **단 하나** 선정하세요:

### A. 픽티안 커브 (Fichtean Curve) - 썰 채널/사이다
- **적용 대상:** 분노/복수/억울함 감정
- **목표:** 고구마를 먹이다가 마지막에 강력한 사이다를 터뜨림
- **구조:** 발단(빌런 만행) → 위기1(참으려 함) → 위기2(선 넘음) → 절정(참교육) → 결말(몰락)
- **톤앤매너:** '존 윅' 스타일의 복수극

### B. 인 미디어스 레스 (In Media Res) - 미스터리/야담/공포
- **적용 대상:** 공포/미스터리/긴장 감정
- **목표:** 결말이나 절정을 먼저 보여주어 호기심 자극
- **구조:** 훅(충격 장면) → 회상(3일 전) → 전개(징후) → 진실(소름) → 여운(열린 결말)
- **톤앤매너:** '넷플릭스 스릴러 예고편' 스타일

### C. 영웅의 여정 (Hero's Journey) - 국뽕/성공담/정보
- **적용 대상:** 감동/성장/희망 감정
- **목표:** 웅장함을 주고 감동을 이끌어냄
- **구조:** 결핍(과거) → 계기(변화) → 시련(처절함) → 성취(압도) → 변화(위상)
- **톤앤매너:** '휴먼 다큐멘터리' 스타일

### D. 행오버 스타일 (Mystery Comedy) - 엽기/유머/브이로그
- **적용 대상:** 황당/유머/혼란 감정
- **목표:** 황당한 상황을 강조하여 웃음 유발
- **구조:** 혼란(현재 황당) → 되감기(사소한 실수) → 스노우볼(대혼란) → 반전(황당 이유)
- **톤앤매너:** '시트콤' 스타일

**기법 선택 이유를 1-2문장으로 설명하세요.**

## STEP 3. 주제 리브랜딩 (Re-branding)
원문을 기반으로 **3개의 완전히 새롭고 바이럴에 적합한 주제**를 제안하세요.
각 주제는 서로 다른 기법을 적용하여 다양성을 확보하세요.

각 주제마다:
1. **클릭을 부르는 제목** (자극적이되 진실을 담은, 인터넷 커뮤니티 특유의 구어체)
2. **리브랜딩된 주제 설명** (기존 주제를 어떻게 재해석했는지)
3. **적용된 헐리우드 기법** (4가지 중 1개)
4. **썸네일/제목 추천 3가지** (각기 다른 어조로: 자극형, 호기심형, 공감형)
5. **선택 이유** (왜 이 주제가 바이럴 될 수 있는지)

# Output Format
JSON으로 응답하되, 다음 구조를 정확히 따르세요:

{
  "tone": "원문의 전체적인 톤 (예: 진지한, 유머러스한, 열정적인)",
  "targetAudience": "타겟 시청자 (예: 20대 직장인, MZ세대, 자기계발 관심층)",
  "diagnosis": {
    "coreEmotion": "핵심 감정 키워드",
    "potentialHook": "소재의 잠재력 설명",
    "selectedTechnique": "선택된 기법 (FICTIAN_CURVE, HEROS_JOURNEY, IN_MEDIAS_RES, HANGOVER 중 1개)",
    "techniqueReason": "기법 선택 이유"
  },
  "topics": [
    {
      "title": "클릭을 부르는 주제 제목",
      "rebrandedTheme": "리브랜딩된 주제 설명",
      "technique": "이 주제에 적용할 기법 (FICTIAN_CURVE, HEROS_JOURNEY, IN_MEDIAS_RES, HANGOVER)",
      "thumbnailSuggestions": ["자극형 제목", "호기심형 제목", "공감형 제목"],
      "reason": "이 주제가 바이럴 될 이유"
    }
    // ... 총 3개 (각기 다른 기법 적용 권장)
  ]
}
`;

  const response = await ai.models.generateContent({
    model: ANALYSIS_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          diagnosis: {
            type: Type.OBJECT,
            properties: {
              coreEmotion: { type: Type.STRING },
              potentialHook: { type: Type.STRING },
              selectedTechnique: { 
                type: Type.STRING,
                enum: ["FICTIAN_CURVE", "HEROS_JOURNEY", "IN_MEDIAS_RES", "HANGOVER"]
              },
              techniqueReason: { type: Type.STRING }
            },
            required: ["coreEmotion", "potentialHook", "selectedTechnique", "techniqueReason"]
          },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                rebrandedTheme: { type: Type.STRING },
                technique: { 
                  type: Type.STRING,
                  enum: ["FICTIAN_CURVE", "HEROS_JOURNEY", "IN_MEDIAS_RES", "HANGOVER"]
                },
                thumbnailSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                reason: { type: Type.STRING }
              },
              required: ["title", "rebrandedTheme", "technique", "thumbnailSuggestions", "reason"]
            }
          }
        },
        required: ["tone", "targetAudience", "diagnosis", "topics"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to analyze content.");
  }

  return JSON.parse(response.text) as AnalyzedData;
};

/**
 * Generates a full YouTube script based on a selected topic and Hollywood technique.
 */
export const generateScript = async (topic: RecommendedTopic, tone: string, audience: string): Promise<string> => {
  // 기법별 구조 정의 (마스터 시스템 프롬프트 기반)
  const techniqueStructures = {
    FICTIAN_CURVE: `
# 적용 기법: 픽티안 커브 (Fichtean Curve) - 갈등 고조 모델
이 사연을 **'존 윅' 스타일의 복수극** 구조로 각색하세요.

## 구조 가이드
1. **[Trigger - 발단]**: 도저히 참을 수 없는 빌런의 만행으로 시작 (설명 최소화, 바로 본론)
   - 빌런의 행동을 아주 얄밉게 묘사
   - 시청자가 "이건 아니지..."라고 느끼게 만들기

2. **[Crisis 1 - 위기]**: 주인공이 참거나 좋게 해결하려 했으나 무시당함
   - 주인공의 인내와 노력 강조
   - 빌런의 오만함 부각

3. **[Crisis 2 - 심화]**: 빌런이 선을 넘음 (가장 화가 나는 포인트 강조)
   - 감정선 최고조
   - 시청자의 공감과 분노 극대화
   - *(BGM: 긴장감 고조)*

4. **[Climax - 사이다]**: 주인공의 철저한 준비와 논리적/물리적 참교육 시전
   - 냉철하고 잔인한(?) 반격
   - 통쾌한 사이다 장면
   - 구체적 디테일로 몰입감 제공
   - *(BGM: 강렬하고 시원한 음악)*

5. **[Resolution - 결말]**: 빌런의 몰락 확인 및 주인공의 평온한 현재
   - 교훈과 메시지
   - CTA (좋아요, 구독, 댓글)

**연출 가이드:**
- 빌런의 대사는 아주 얄밉게, 주인공의 반격은 냉철하고 잔인하게 묘사
- 불필요한 서론 삭제, 바로 본론으로
- 문체: 인터넷 커뮤니티 특유의 구어체 (음슴체 또는 해요체)
`,
    HEROS_JOURNEY: `
# 적용 기법: 현대적 영웅의 여정 (Hero's Journey) - 성장 모델
이 사연을 **'한 편의 휴먼 다큐멘터리'** 스타일로 각색하세요.

## 구조 가이드
1. **[Ordinary World - 결핍]**: 주인공(또는 한국)이 무시당하거나 부족했던 과거 시절
   - 결핍과 부족함 강조
   - 시청자의 동질감 형성

2. **[Call to Adventure - 계기]**: 변화를 결심하게 된 결정적인 사건이나 만남
   - "이대로는 안 돼" 각성의 순간
   - 목표 설정과 다짐

3. **[Ordeal - 시련]**: 목표를 향해 가면서 겪은 처절한 실패와 비웃음
   - 구체적인 어려움과 장애물
   - 포기하고 싶었던 순간들
   - 감정 이입 극대화
   - *(BGM: 애절하고 처절한 음악)*

4. **[Reward - 성취]**: 시련 끝에 얻어낸 압도적인 성과 (구체적 수치 제시)
   - 드라마틱한 성공 장면
   - 변화된 모습, 성장한 주인공
   - *(BGM: 고양되고 감동적인 음악)*

5. **[Change - 변화]**: 성공 후 달라진 위상과 주변의 반응 (국뽕/자부심 고취)
   - "우리"라는 단어로 동질감 형성
   - 희망과 감동의 메시지
   - CTA

**연출 가이드:**
- 웅장한 톤앤매너 유지 (배경음악이 고조되는 듯한 느낌)
- '우리'라는 단어를 사용하여 시청자와 동질감 형성
- 문체: 진중하면서도 친근한 해요체
`,
    IN_MEDIAS_RES: `
# 적용 기법: 인 미디어스 레스 (In Media Res) - 결말 선행 공개 모델
이 사연을 **'넷플릭스 스릴러 예고편'** 스타일로 각색하세요.

## 구조 가이드
1. **[The Hook - 미끼]**: 사연에서 가장 충격적이거나 기이한 장면을 대본 맨 앞에 배치
   - 설명 금지, 상황 묘사만
   - "어떻게 이런 일이...?" 호기심 자극
   - 강렬한 비주얼 or 충격적 대사
   - *(효과음: 충격적인 사운드)*

2. **[Flashback - 회상]**: "사건은 정확히 3일 전 시작되었습니다"라며 과거로 전환
   - 평범했던 시작점
   - 시간 역행 연출
   - *(BGM: 미스터리한 음악)*

3. **[Build-up - 전개]**: 평범했던 일상에 이상한 징후들이 나타나는 과정
   - 점층적 공포/긴장감 조성
   - 작은 실마리들 제시
   - 시청자가 추리하게 만들기

4. **[Reveal - 진실]**: 맨 처음 보여줬던 장면이 왜 일어났는지에 대한 소름 돋는 진실 공개
   - 모든 퍼즐 조각 맞춤
   - 충격적 진실
   - 처음 장면과 연결
   - *(BGM: 드라마틱한 음악)*

5. **[Open Ending - 여운]**: 아직 끝나지 않은 듯한 찝찝한 한마디로 마무리
   - 열린 결말
   - "믿을 수 있나요?" 여운 남기기
   - CTA

**연출 가이드:**
- 직접적 묘사보다는 분위기와 정황 증거 위주로 서술
- 청자의 상상력을 자극
- 문체: 신비롭고 긴장감 있는 해요체/음슴체
`,
    HANGOVER: `
# 적용 기법: 미스터리 코미디 (Mystery Comedy) - 반전 웃음 모델
이 사연을 **'시트콤'** 스타일로 각색하세요.

## 구조 가이드
1. **[Confusion - 혼란]**: "대체 내가 왜 이러고 있는지 모르겠다"는 황당한 현재 상황 제시
   - 말도 안 되는 상황
   - 코믹하고 황당한 연출
   - *(BGM: 코믹한 음악)*

2. **[Rewind - 되감기]**: 사건 발생 전, 아주 사소하고 멍청한 실수 하나를 조명
   - "분명 평범하게 시작했는데..."
   - 작은 선택들의 나비효과

3. **[Escalation - 스노우볼]**: 작은 실수가 걷잡을 수 없이 커져가는 과정
   - 대혼란의 연쇄 반응
   - 하나가 해결되면 둘이 생김
   - 코믹한 상황 극대화
   - *(효과음: 황당한 사운드)*

4. **[Twist - 반전]**: 알고 보니 아무것도 아니었거나, 더 황당한 이유가 밝혀짐
   - 예상 못한 반전
   - 웃픈 결말
   - 모든 일이 우연히(?) 맞아떨어짐

5. **[교훈(?) - 웃픈 마무리]**: "이것이 교훈이라면..." 유머러스한 정리
   - CTA

**연출 가이드:**
- 주인공의 내면 독백(속마음)을 괄호로 넣어 웃음 포인트 살리기
- 황당함 강조
- 문체: 가벼운 음슴체/반말체
`
  };

  const selectedStructure = techniqueStructures[topic.technique] || techniqueStructures.HEROS_JOURNEY;

  const prompt = `
# Role
당신은 헐리우드에서 가장 몸값이 비싼 '시나리오 각색가'이자 100만 유튜버의 메인 작가입니다.
당신의 특기는 지루하고 평범한 텍스트를 읽고, 그것을 "시청자가 절대 이탈할 수 없는 몰입감 높은 대본"으로 재구성하는 것입니다.

# Task
다음 주제를 지정된 [스토리텔링 기법]에 맞춰 유튜브 대본으로 각색하십시오.

## 콘텐츠 정보
- **주제:** ${topic.title}
- **리브랜딩된 테마:** ${topic.rebrandedTheme}
- **적용 기법:** ${topic.technique}
- **톤:** ${tone}
- **타겟 시청자:** ${audience}

${selectedStructure}

# Output Format (반드시 이 구조를 지킬 것)

## 📋 콘텐츠 설계 진단서
* **적용된 헐리우드 기법:** ${topic.technique}
* **주제:** ${topic.title}

## 🎬 대본

### [썸네일/제목 추천]
${topic.thumbnailSuggestions.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### [오프닝 훅 (0:00-0:10)]
*시청자의 시선을 뺏는 강렬한 첫 마디를 작성하세요. 대본의 맨 앞으로 배치됩니다.*

### [본문 대본]
*위에 제시된 구조 가이드의 각 단계를 따라 상세히 작성하세요.*
*각 파트의 구분을 명확히 표시하고 ([발단], [전개] 등), 타이밍을 명시하세요 (예: 0:30-1:00).*

# 작성 지침 (Constraints)
1. **문체:** 인터넷 커뮤니티 특유의 구어체 (음슴체 또는 해요체) 사용하여 친근감 제공
2. **편집:** 불필요한 서론은 과감히 삭제하고 바로 본론으로 진입
3. **과장:** 원문의 팩트는 유지하되, 감정 묘사는 극적으로 과장 (MSG 첨가)
4. **연출:** (괄호)를 사용하여 BGM 분위기나 효과음 타이밍을 지시
5. **몰입:** 구체적인 예시와 디테일로 몰입감 극대화
6. **분량:** 5-7분 분량의 대본 작성
7. **언어:** 모든 내용을 한국어로 작성

**중요:** 구조만 제시하지 말고, 각 섹션의 실제 내용을 구체적이고 상세하게 작성해야 합니다!
`;

  const response = await ai.models.generateContent({
    model: WRITER_MODEL,
    contents: prompt,
    config: {
        // High thinking budget for better structure and creativity
        thinkingConfig: { thinkingBudget: 2048 } 
    }
  });

  return response.text || "스크립트를 생성할 수 없습니다. 다시 시도해주세요.";
};
