import type { Case } from './types'

export const metroMissing: Case = {
  id: 'metro',
  title: '지하철 실종',
  difficulty: 3,
  brief:
    '2026-09-26 밤 23:47, 여대생 이서윤이 신도림역 마지막 태그를 남기고 사라졌다. 지하철 태그 로그와 CCTV, 그리고 알리바이를 위증한 진술 하나가 뒤엉킨 사건.',
  starterSql: 'SELECT * FROM crime_scene_report;',
  story: `# 지하철 실종

**2026년 9월 26일 금요일 밤**, 신도림역 개찰구를 마지막으로 여대생 **이서윤**(22)의 흔적이 끊겼다. 카페 마감 뒤 강남에서 2호선을 탄 것이 23시 30분, 신도림 하차 태그가 23시 47분. 이후 어떤 태그도, 어떤 CCTV도 그녀를 잡지 못했다.

가족이 신고한 새벽, 경찰은 서울 지하철 태그 로그와 얼굴 인식 CCTV 로그를 확보했다. 다만 관계자 진술 중 하나에는 명백한 위증이 섞여있다.

## 열람 가능한 테이블

- \`crime_scene_report\` — 여러 도시 사건 기록
- \`person\` — 인물 명부 (역할)
- \`metro_line\` — 노선 정보 (색상 · 첫차 · 막차)
- \`station\` — 역 정보 (노선 · 환승 여부)
- \`transit_log\` — 교통카드 태그 (\`IN\` / \`OUT\`)
- \`cctv_sighting\` — 얼굴 인식 (confidence)
- \`interview\` — 관계자 진술

## 최종 목표

이서윤을 미행하다 사건 당일 신도림까지 따라 들어간 **범인의 이름**을 지목하라. 단, 용의자의 진술은 사실이 아닐 수 있다. 로그와 대조해 검증할 것.
`,
  resolution: `## 카페 창가의 시선

박현우는 신도림 오피스가에서 일하던 회사원이었다. 매일 저녁 회사 근처 골목의 작은 카페에 들렀고, 그곳 마감 담당 알바생이 이서윤이었다. 처음엔 늦은 야근 뒤 커피 한 잔이었다. 두 번째 주에는 창가 자리로 옮겨 앉았다. 세 번째 주부터는 이서윤이 카운터에 서있는 시간 내내 노트북을 켜둔 채 그녀만 바라봤다.

그는 이서윤의 근무 스케줄을 외웠다. 대학 강의를 마치고 오후에 출근해 자정 전에 마감하는 리듬. 강남 캠퍼스에서 신도림 알바로 이어지는 2호선 통근 시간. 어느 순간부터 그의 교통카드 태그는 이서윤의 태그를 3~5분 간격으로 따라 붙기 시작했다.

*그는 그것을 사랑이라 불렀다.*

## 그날 밤

**23시 30분.** 이서윤은 강남에서 2호선을 탔다. 카페 마감 뒤 평소보다 늦어진 귀갓길. 박현우는 같은 열차 다른 칸에서 이미 그녀를 지켜보고 있었다 — 강남 승차 태그 23:32.

**23시 44분.** 신도림 도착. 박현우가 먼저 개찰구를 빠져나갔다. 이서윤은 3분 뒤 태그를 찍고 나왔다. 역무원 강태오는 CCTV에서 여자 뒤로 안경 낀 남자가 바짝 붙어 나가는 걸 봤다. *"며칠 전에도 비슷한 시각에 봤어요."*

**23시 48분 이후.** 신도림 골목의 CCTV 사각지대. 이서윤의 태그도, 얼굴 인식도 그 뒤로는 없다.

## 위증

박현우는 조사에서 태연히 진술했다 — *"그날 저녁엔 강남 사무실에서 야근했습니다. 22시부터 자정까지. 신도림은 발도 안 뻗었어요."* 그의 말이 성립하려면 그의 교통카드는 강남 인근에 멈춰있어야 했다. 그러나 \`transit_log\`는 그 시각 그를 강남 승차 23:32 · 신도림 하차 23:44 로 정확히 못박아 두었다.

지난 사흘간 그의 태그는 이서윤의 태그와 같은 역·같은 시간대에 열 번 넘게 겹쳐있었다. 사랑이라 부르던 그 리듬은, 로그 위에서는 미행의 패턴이었다.
`,
  seedSql: `
CREATE TABLE crime_scene_report (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT
);

CREATE TABLE metro_line (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  first_train TIME,
  last_train TIME
);

CREATE TABLE station (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  line_id INT REFERENCES metro_line(id),
  transfer BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE transit_log (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id),
  station_id INT REFERENCES station(id),
  tapped_at TIMESTAMP NOT NULL,
  direction TEXT CHECK (direction IN ('IN','OUT'))
);

CREATE TABLE cctv_sighting (
  id SERIAL PRIMARY KEY,
  station_id INT REFERENCES station(id),
  person_id INT REFERENCES person(id),
  seen_at TIMESTAMP NOT NULL,
  confidence NUMERIC(3,2)
);

CREATE TABLE interview (
  person_id INT REFERENCES person(id),
  transcript TEXT NOT NULL
);

INSERT INTO crime_scene_report (date, type, city, description) VALUES
  ('2026-09-24', 'THEFT',   '대전', '유성구 편의점 절도. 무관.'),
  ('2026-09-25', 'ASSAULT', '광주', '동구 노상 폭행. 무관.'),
  ('2026-09-26', 'MISSING', '서울', '여대생 이서윤(22) 실종. 마지막 교통카드 태그 2호선 신도림 23:47 하차. 이후 태그·CCTV 흔적 소실. 최근 사흘간 태그 로그와 CCTV, 관계자 진술 확보. 미행자를 의심 중.'),
  ('2026-09-26', 'THEFT',   '부산', '해운대 상가 야간 절도. 무관.');

INSERT INTO person (name, role) VALUES
  ('이서윤', '실종자·대학생'),
  ('박현우', '회사원'),
  ('정유나', '이서윤 대학 친구'),
  ('강태오', '신도림 역무원'),
  ('서지수', '카페 알바 동료'),
  ('김도현', '회사원'),
  ('최윤재', '통근자');

INSERT INTO metro_line (name, color, first_train, last_train) VALUES
  ('2호선',   'green', '05:30', '24:30'),
  ('1호선',   'blue',  '05:20', '24:00'),
  ('신분당선', 'red',  '05:40', '24:00');

INSERT INTO station (name, line_id, transfer) VALUES
  ('신도림',    1, TRUE),
  ('강남',      1, TRUE),
  ('신촌',      1, FALSE),
  ('홍대입구',  1, TRUE),
  ('사당',      1, TRUE),
  ('서울역',    2, TRUE),
  ('판교',      3, FALSE);

INSERT INTO transit_log (person_id, station_id, tapped_at, direction) VALUES
  (1, 1, '2026-09-24 08:15:00', 'IN'),
  (1, 2, '2026-09-24 08:37:00', 'OUT'),
  (1, 2, '2026-09-24 22:00:00', 'IN'),
  (1, 1, '2026-09-24 22:22:00', 'OUT'),
  (1, 1, '2026-09-25 08:15:00', 'IN'),
  (1, 2, '2026-09-25 08:37:00', 'OUT'),
  (1, 2, '2026-09-25 22:00:00', 'IN'),
  (1, 1, '2026-09-25 22:22:00', 'OUT'),
  (1, 1, '2026-09-26 08:15:00', 'IN'),
  (1, 2, '2026-09-26 08:37:00', 'OUT'),
  (1, 2, '2026-09-26 23:30:00', 'IN'),
  (1, 1, '2026-09-26 23:47:00', 'OUT'),

  (2, 1, '2026-09-24 08:20:00', 'IN'),
  (2, 2, '2026-09-24 08:40:00', 'OUT'),
  (2, 2, '2026-09-24 22:03:00', 'IN'),
  (2, 1, '2026-09-24 22:20:00', 'OUT'),
  (2, 1, '2026-09-25 08:18:00', 'IN'),
  (2, 2, '2026-09-25 08:38:00', 'OUT'),
  (2, 2, '2026-09-25 22:05:00', 'IN'),
  (2, 1, '2026-09-25 22:23:00', 'OUT'),
  (2, 1, '2026-09-26 08:22:00', 'IN'),
  (2, 2, '2026-09-26 08:41:00', 'OUT'),
  (2, 2, '2026-09-26 23:32:00', 'IN'),
  (2, 1, '2026-09-26 23:44:00', 'OUT'),

  (3, 2, '2026-09-25 22:10:00', 'IN'),
  (3, 4, '2026-09-25 22:30:00', 'OUT'),

  (4, 1, '2026-09-26 06:00:00', 'IN'),
  (4, 1, '2026-09-26 23:59:00', 'OUT'),

  (5, 4, '2026-09-26 22:00:00', 'IN'),
  (5, 1, '2026-09-26 22:20:00', 'OUT'),

  (6, 6, '2026-09-25 07:40:00', 'IN'),
  (6, 2, '2026-09-25 08:10:00', 'OUT'),
  (6, 2, '2026-09-25 22:15:00', 'IN'),
  (6, 6, '2026-09-25 22:45:00', 'OUT'),

  (7, 7, '2026-09-25 09:00:00', 'IN'),
  (7, 2, '2026-09-25 09:30:00', 'OUT');

INSERT INTO cctv_sighting (station_id, person_id, seen_at, confidence) VALUES
  (1, 1, '2026-09-26 23:47:00', 0.99),
  (1, 2, '2026-09-26 23:48:00', 0.87),
  (1, 2, '2026-09-25 22:23:00', 0.73),
  (1, 2, '2026-09-24 22:20:00', 0.71),
  (1, 4, '2026-09-26 06:03:00', 0.95),
  (1, 5, '2026-09-26 22:20:00', 0.82),
  (2, 6, '2026-09-25 08:12:00', 0.65),
  (4, 3, '2026-09-25 22:30:00', 0.68);

INSERT INTO interview (person_id, transcript) VALUES
  (2, '그날 저녁엔 강남 사무실에서 야근했습니다. 22시부터 자정까지 계속 있었어요. 신도림 근처엔 발도 안 뻗었습니다. 이서윤씨는... 이름만 어렴풋이 아는 정도예요.'),
  (3, '서윤이랑 그날 23시쯤 통화했어요. 카페 마감하고 지하철 탄다고. 요 며칠 자꾸 뒤가 이상하다고, 누가 따라오는 것 같다고 했는데... 대수롭지 않게 넘겼어요.'),
  (4, '23시 47분에 개찰구 CCTV로 여자 한 명이 나가는 걸 봤어요. 그 뒤로 안경 낀 남자가 바짝 붙어 나갔는데, 얼굴이 낯익었어요. 며칠 전 같은 시각에도 봤던 것 같아요.'),
  (5, '최근 몇 주간 한 손님이 서윤이 근무 시간에만 왔어요. 창가 자리만 골라서, 마감 근처까지 노트북 켜두고. 서윤이 나가면 슬쩍 따라 나가곤 했죠. 30대, 안경.');
`,
  schemas: [
    {
      table: 'crime_scene_report',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'date', type: 'DATE' },
        { name: 'type', type: 'TEXT' },
        { name: 'city', type: 'TEXT' },
        { name: 'description', type: 'TEXT' },
      ],
    },
    {
      table: 'person',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT' },
      ],
    },
    {
      table: 'metro_line',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'name', type: 'TEXT' },
        { name: 'color', type: 'TEXT' },
        { name: 'first_train', type: 'TIME' },
        { name: 'last_train', type: 'TIME' },
      ],
    },
    {
      table: 'station',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'name', type: 'TEXT' },
        { name: 'line_id', type: 'INT (FK → metro_line)' },
        { name: 'transfer', type: 'BOOLEAN' },
      ],
    },
    {
      table: 'transit_log',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'station_id', type: 'INT (FK → station)' },
        { name: 'tapped_at', type: 'TIMESTAMP' },
        { name: 'direction', type: "TEXT ('IN'|'OUT')" },
      ],
    },
    {
      table: 'cctv_sighting',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'station_id', type: 'INT (FK → station)' },
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'seen_at', type: 'TIMESTAMP' },
        { name: 'confidence', type: 'NUMERIC(3,2)' },
      ],
    },
    {
      table: 'interview',
      columns: [
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'transcript', type: 'TEXT' },
      ],
    },
  ],
  persons: [
    { id: 1, name: '이서윤', avatar: 'female3', role: '실종자', disabled: true },
    { id: 2, name: '박현우', avatar: 'male2', role: '회사원' },
    { id: 3, name: '정유나', avatar: 'female4', role: '대학 친구' },
    { id: 4, name: '강태오', avatar: 'male4', role: '역무원' },
    { id: 5, name: '서지수', avatar: 'female5', role: '카페 알바' },
    { id: 6, name: '김도현', avatar: 'male3', role: '회사원' },
    { id: 7, name: '최윤재', avatar: 'male5', role: '통근자' },
  ],
  hints: [
    '`crime_scene_report` 에서 이번 실종 하나만 특정하라. 설명 안에 마지막 태그 시각과 역이 명시돼있다.',
    '`transit_log` 를 `person` · `station` 과 JOIN 해 이서윤의 최근 사흘 동선을 뽑고, **같은 역·같은 시간대**에 이서윤과 반복해서 겹치는 인물을 `GROUP BY` + `HAVING COUNT(*) >= 5` 로 압축하라. 이서윤 태그와 5분 이내로 붙는 태그를 세면 후보가 한 명으로 좁혀진다.',
    '후보의 `interview` 진술은 알리바이를 주장한다. **그 진술은 거짓이다.** 진술 속 시각·장소를 `transit_log` 로 다시 대조하라. 사건 당일 23시대에 신도림에 있었던 자가 범인이다. `cctv_sighting` 으로 confidence 까지 확인하면 확정된다.',
  ],
  solution: {
    question: '범인의 이름은?',
    fields: [
      {
        id: 'name',
        label: '범인',
        placeholder: '이름을 적을 것',
        answer: '박현우',
      },
    ],
  },
}
