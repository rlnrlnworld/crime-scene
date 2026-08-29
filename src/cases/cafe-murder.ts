import type { Case } from './types'

export const cafeMurder: Case = {
  id: 'cafe-noir',
  title: '카페 Noir 살인사건',
  difficulty: 1,
  brief:
    '2026-08-25 밤, 서울 심야 카페 Noir에서 바리스타 한지호가 살해됐다. 사건 기록을 시작으로 데이터베이스를 뒤져 진짜 범인을 찾아라.',
  starterSql: 'SELECT * FROM crime_scene_report;',
  story: `# 카페 Noir 살인사건

**2026년 8월 25일 화요일 밤**, 서울 도심의 심야 카페 **Noir**에서 바리스타 **한지호**(28)가 카운터 뒤에서 쓰러진 채 발견됐다.

경찰이 도착했을 때 카페 문은 열려있었지만 손님도 직원도 없었다. 다행히 남은 것은 데이터베이스뿐이다.

## 열람 가능한 테이블

- \`crime_scene_report\` — 경찰이 정리한 사건 기록
- \`person\` — 시내 주민 명부
- \`interview\` — 목격자들의 진술
- \`members\` — 카페 Noir 회원 등급
- \`orders\` — 카페 주문 로그

## 최종 목표

여러 사건 중 이번 살인 사건을 찾고, 사건 기록의 설명에서 목격자를 특정한 뒤, 그들의 진술을 조합해 **범인의 이름**을 밝혀라.

단서는 여러 테이블에 흩어져 있다. 하나를 조회하면 다음 조회 방향이 보일 것이다.
`,
  resolution: `## 잊혀지지 않는 밤

박도윤은 카페 Noir 의 오랜 GOLD 회원이었다. 2년 전부터 야근이 끝나면 마지막 손님으로 남아, 마감을 앞둔 카운터에서 바리스타 **한지호** 와 이야기를 나눴다. 사업 이야기, 가족 이야기, 결혼 생활의 균열까지. 카페의 어두운 조명과 바리스타의 무심한 리스닝이 자백을 편하게 만들었다.

박도윤은 한지호를 믿었다. *한지호는 그저 좋은 청자였다* — 라고 생각했다.

문제는 한지호가 다른 곳에서도 좋은 이야기꾼이었다는 것이다. 그는 손님이 흘리고 간 이야기를 다른 술자리에서, 다른 바에서, 지나가듯 흘렸다. 악의는 없었다. 다만 이야기는 발이 달려있었다.

박도윤의 아내는 어느 날 남편의 외도를 이미 알고 있었다. 박도윤의 사업 파트너는 그의 개인 사정을 이미 알고 있었다. 소문의 시작을 거슬러 올라가자 매번 같은 이름이 나왔다 — **한지호**.

박도윤은 몇 달간 Noir 에 발을 끊었다. 분노는 조용히 자랐다. 그리고 8월 25일 밤, 그는 마지막으로 한 번 더 갔다.

## 그날 밤

밤 10시 42분, 마감을 앞둔 카운터에는 한지호 혼자였다. 마지막 손님 오지민이 자리를 뜨는 참이었다. 박도윤은 태연히 아메리카노를 주문했다. 한지호가 그를 알아보고 반긴다 — *"GOLD 회원님, 오랜만이시네요."*

오지민은 그 인사를 등 뒤로 듣고 22시 40분에 카페를 나섰다.

이후 카운터에서 무슨 대화가 오갔는지는 알 수 없다. 다만 카페 위 15층 아파트 창가의 정하은은 밤 11시경 검은 세단이 급히 출발하는 걸 목격했다. 뛰어나온 남자가 흘린 GOLD 회원 카드에는 이니셜 **P.D** 가 새겨져 있었다.

박도윤은 서두르다 자신의 이름을 흘리고 도주했다. 마지막 순간까지도, 그는 자신이 얼마나 말이 많은 사람이었는지 몰랐던 셈이다.
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
  address_floor INT,
  phone TEXT
);

CREATE TABLE interview (
  person_id INT REFERENCES person(id),
  transcript TEXT NOT NULL
);

CREATE TABLE members (
  person_id INT REFERENCES person(id),
  tier TEXT CHECK (tier IN ('BASIC','SILVER','GOLD','STAFF')),
  joined_at DATE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id),
  item TEXT NOT NULL,
  price INT NOT NULL,
  ordered_at TIMESTAMP NOT NULL
);

INSERT INTO crime_scene_report (date, type, city, description) VALUES
  ('2026-08-24', 'THEFT',  '서울', '강남 편의점 심야 절도. 무관.'),
  ('2026-08-22', 'MURDER', '인천', '주택가 살인 미수. 용의자 검거.'),
  ('2026-08-25', 'ARSON',  '부산', '창고 방화. 무관.'),
  ('2026-08-25', 'MURDER', '서울', '심야 카페 Noir에서 바리스타 한지호(28) 살해. 목격자 두 명 확보. 첫 번째 목격자는 카페 바로 위 아파트 최상층 거주자. 두 번째 목격자는 카페 회원이며 이름 마지막 글자가 ''민''.');

INSERT INTO person (name, address_floor, phone) VALUES
  ('김민서', 4,  '010-1111-2222'),
  ('박도윤', 12, '010-2222-3333'),
  ('이서준', 8,  '010-3333-4444'),
  ('정하은', 15, '010-4444-5555'),
  ('최윤호', 2,  '010-5555-6666'),
  ('한지호', 3,  '010-9999-0000'),
  ('오지민', 5,  '010-6666-7777'),
  ('한소민', 9,  '010-7777-8888');

INSERT INTO interview (person_id, transcript) VALUES
  (4, '밤 11시쯤 아파트 창문으로 카페 앞을 봤어요. 남자 한 명이 급하게 뛰어나와 검은 세단을 타고 사라졌어요. 뛰다가 뭘 떨어뜨렸는데 내려가서 주워보니 카페 GOLD 회원 카드였고, 이름 이니셜이 P.D였어요.'),
  (7, '내가 그날 마지막 손님이었어요. 22시 40분쯤 나가려는데, 한 남자가 카운터에서 아메리카노를 주문하고 있었어요. 바리스타가 "GOLD 회원님 오랜만이시네요"라고 인사하더라고요. 30대 초반, 이니셜 P.D. 얼굴은 확실히 봤어요.');

INSERT INTO members (person_id, tier, joined_at) VALUES
  (1, 'SILVER', '2025-01-04'),
  (2, 'GOLD',   '2025-03-11'),
  (3, 'SILVER', '2025-05-20'),
  (4, 'SILVER', '2025-07-01'),
  (5, 'BASIC',  '2026-02-14'),
  (6, 'STAFF',  '2024-11-10'),
  (7, 'SILVER', '2026-01-05'),
  (8, 'GOLD',   '2025-11-20');

INSERT INTO orders (person_id, item, price, ordered_at) VALUES
  (1, 'Latte',      5500, '2026-08-25 20:15:00'),
  (2, 'Americano',  4500, '2026-08-25 22:42:00'),
  (3, 'Cappuccino', 5500, '2026-08-25 19:05:00'),
  (4, 'Americano',  4500, '2026-08-25 22:57:00'),
  (5, 'Mocha',      6000, '2026-08-25 18:25:00'),
  (7, 'Espresso',   4500, '2026-08-25 22:38:00'),
  (8, 'Latte',      5500, '2026-08-25 15:20:00');
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
        { name: 'address_floor', type: 'INT' },
        { name: 'phone', type: 'TEXT' },
      ],
    },
    {
      table: 'interview',
      columns: [
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'transcript', type: 'TEXT' },
      ],
    },
    {
      table: 'members',
      columns: [
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'tier', type: "TEXT ('BASIC'|'SILVER'|'GOLD'|'STAFF')" },
        { name: 'joined_at', type: 'DATE' },
      ],
    },
    {
      table: 'orders',
      columns: [
        { name: 'id', type: 'INT (PK)' },
        { name: 'person_id', type: 'INT (FK → person)' },
        { name: 'item', type: 'TEXT' },
        { name: 'price', type: 'INT' },
        { name: 'ordered_at', type: 'TIMESTAMP' },
      ],
    },
  ],
  persons: [
    { id: 1, name: '김민서', avatar: 'female1' },
    { id: 2, name: '박도윤', avatar: 'male1' },
    { id: 3, name: '이서준', avatar: 'male2' },
    { id: 4, name: '정하은', avatar: 'female2' },
    { id: 5, name: '최윤호', avatar: 'male3' },
    { id: 6, name: '한지호', avatar: 'male4', role: '피해자', disabled: true },
    { id: 7, name: '오지민', avatar: 'female3' },
    { id: 8, name: '한소민', avatar: 'female4' },
  ],
  hints: [
    '먼저 `crime_scene_report`에서 이번 사건 하나만 골라내라. type, city, date를 조건으로 걸어봐.',
    '사건 기록 설명은 목격자 두 명의 특징을 알려준다. 하나는 사는 위치, 하나는 이름 패턴이다. 각각 `person`에서 후보를 좁힌 다음 `interview`로 진술을 읽어라.',
    '진술은 용의자를 회원 등급 · 주문한 메뉴 · 시간대라는 여러 속성으로 짚어준다. 이 조건을 모두 만족하는 사람은 하나뿐이다.',
  ],
  solution: {
    question: '범인의 이름은?',
    fields: [
      {
        id: 'name',
        label: '범인',
        placeholder: '이름을 적을 것',
        answer: '박도윤',
      },
    ],
  },
}
