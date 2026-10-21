import assert from 'node:assert/strict';
import { seedData, boothStatus, makeCode, prettyDate, ticketTypeLabel } from './demo.js';

const db = seedData();
assert.equal(db.booths.length, 6);
assert.equal(db.tickets.length, 2);
assert.deepEqual(db.admins[0].boothIds, ['moon', 'pixel']);
assert.equal(boothStatus(db.booths[0]), 'ongoing');
assert.equal(boothStatus(db.booths[2]), 'upcoming');
assert.equal(boothStatus(db.booths[3]), 'ended');
assert.equal(ticketTypeLabel.onsite, '현장대기');
assert.equal(makeCode().length, 6);
assert.ok(prettyDate(db.booths[0].startDate));
console.log('✓ 데모 데이터, 운영 기간 판정, 코드 생성 검사 통과');
