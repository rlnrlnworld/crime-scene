import type { Case } from './types'

export const atelierTheft: Case = {
  id: 'atelier',
  title: '아뜰리에 도난',
  difficulty: 2,
  brief:
    '2026-09-14 밤, 성북동 아뜰리에에서 원로 화가 한겸의 유작이 사라졌다. 개막을 코앞에 두고 사라진 그림, 범인은 초대장 안에 있다.',
  starterSql: 'SELECT * FROM crime_scene_report;',
  story: `# 아뜰리에 도난

**2026년 9월 14일 월요일 밤**, 성북동 산기슭에 자리한 원로 화가 **한겸**(72)의 아뜰리에. 다음 날 개막을 앞둔 유작 프리뷰의 밤, 안쪽 수장고에 걸려있던 미공개 유화 **\`<밤의 정원>\`** 이 액자만 남기고 사라졌다.

문은 지문 인증. 창은 봉인. 정문 지문 로그와 초대 명단, 프리뷰 사진, 청소부 진술이 남아있다.

## 열람 가능한 테이블

- \`crime_scene_report\` — 여러 도시 사건 기록
- \`person\` — 인물 명부 (역할 · 이름)
- \`artwork\` — 아뜰리에 소장 작품
- \`attendee\` — 프리뷰 초대장 명단
- \`access_log\` — 지문 인증 정문 출입 기록
- \`interview\` — 관계자 진술

## 최종 목표

작품이 사라진 정확한 **범행 시각 창** 과 **범인의 이름** 을 지목하라.
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
  role TEXT NOT NULL
);

CREATE TABLE artwork (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  estimated_value BIGINT NOT NULL
);

CREATE TABLE attendee (
  person_id INT REFERENCES person(id),
  event_date DATE NOT NULL
);

CREATE TABLE access_log (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id),
  entered_at TIMESTAMP NOT NULL,
  exited_at TIMESTAMP
);

CREATE TABLE interview (
  person_id INT REFERENCES person(id),
  transcript TEXT NOT NULL
);

INSERT INTO crime_scene_report (date, type, city, description) VALUES
  ('2026-09-12', 'THEFT',  '부산', '해운대 상가 절도. 무관.'),
  ('2026-09-13', 'ARSON',  '대구', '주차장 방화. 무관.'),
  ('2026-09-14', 'THEFT',  '서울', '성북동 아뜰리에에서 원로 화가 한겸의 미공개 유화 <밤의 정원> 도난. 오너가 22:00 정기 순찰에서 작품 위치 확인. 22:35 재확인 시 액자만 남고 사라짐. 정문 지문 로그와 프리뷰 초대 명단 확보.'),
  ('2026-09-14', 'THEFT',  '인천', '구월동 편의점 절도. 무관.');

INSERT INTO person (name, role) VALUES
  ('한겸',   '화가·오너'),
  ('유서린', '큐레이터'),
  ('정민호', '제자 화가'),
  ('조하영', '청소부'),
  ('배진우', '후원자'),
  ('오세연', '사진 기록사'),
  ('김도훈', '견학자');

INSERT INTO artwork (title, location, estimated_value) VALUES
  ('밤의 정원',   '수장고',   500000000),
  ('겨울 소묘',   '메인 갤러리', 80000000),
  ('항아리 정물', '메인 갤러리', 50000000),
  ('강가의 노인', '수장고',   120000000);

INSERT INTO attendee (person_id, event_date) VALUES
  (2, '2026-09-14'),
  (3, '2026-09-14'),
  (5, '2026-09-14'),
  (6, '2026-09-14');

INSERT INTO access_log (person_id, entered_at, exited_at) VALUES
  (1, '2026-09-14 09:00:00', '2026-09-14 23:10:00'),
  (4, '2026-09-14 07:00:00', '2026-09-14 09:30:00'),
  (3, '2026-09-14 09:15:00', '2026-09-14 09:45:00'),
  (2, '2026-09-14 18:00:00', '2026-09-14 20:30:00'),
  (3, '2026-09-14 18:15:00', '2026-09-14 20:00:00'),
  (5, '2026-09-14 18:20:00', '2026-09-14 20:15:00'),
  (6, '2026-09-14 18:30:00', '2026-09-14 20:45:00'),
  (7, '2026-09-14 19:00:00', '2026-09-14 22:15:00'),
  (3, '2026-09-14 22:00:00', '2026-09-14 22:35:00');

INSERT INTO interview (person_id, transcript) VALUES
  (4, '아침 청소를 하는데 09시쯤 수장고에서 누가 <밤의 정원> 액자 옆에 서서 뭘 재고 있었어요. 뒷모습만 봐서 누군지는 몰라요. 그 시간에 저 말고 정문으로 들어온 사람은 딱 한 명 뿐이었어요.'),
  (6, '프리뷰 촬영이 끝나고 사진을 넘기다가 발견했는데, 20시 15분경 뒷 복도에서 견학자 김도훈이 수장고 문 손잡이를 만지고 있었어요. 프리뷰 동선은 메인 갤러리까지가 끝인데.'),
  (5, '한겸 선생은 22시 정확히 수장고 순찰을 도셨어요. 그때 저는 정문 밖에서 담배 피우고 있었고, 22시 정각에 정문으로 들어가는 사람을 봤어요. 초대장 받은 사람 중에서요.');
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
      table: 'artwork',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'title', type: 'TEXT' },
        { name: 'location', type: 'TEXT' },
        { name: 'estimated_value', type: 'BIGINT' },
      ],
    },
    {
      table: 'attendee',
      columns: [
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'event_date', type: 'DATE' },
      ],
    },
    {
      table: 'access_log',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'entered_at', type: 'TIMESTAMP' },
        { name: 'exited_at', type: 'TIMESTAMP' },
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
  hints: [
    '`crime_scene_report` 설명에 범행 시각 창이 명시돼있다. 오너가 작품을 마지막으로 확인한 시각과 사라진 것을 발견한 시각 사이가 정답 후보 창.',
    '`access_log` 를 `person` 과 JOIN 해서 범행 시각 창에 아뜰리에 안에 있었던 인물을 추려라. `entered_at <= 창 시작 AND (exited_at >= 창 시작 OR exited_at IS NULL)` 같은 필터.',
    '후보 중 오너(한겸)를 제외하면 두 명 정도가 남는다. `interview` 를 다시 읽어라. 청소부의 아침 진술이 그 중 한 명을 특정한다 — 아침 09시대에 정문으로 들어온 유일한 외부인이 누구인지 `access_log` 로 확인하면 아침에도 그림 액자를 재던 인물이 밤에 재진입한 자와 동일하다.',
  ],
  solution: {
    question: '범인과 재진입 시각을 지목하라',
    fields: [
      {
        id: 'time',
        label: '범인의 재진입 시각',
        placeholder: 'HH:MM',
        answer: '22:00',
      },
      {
        id: 'name',
        label: '범인',
        placeholder: '이름을 적을 것',
        answer: '정민호',
      },
    ],
  },
}
