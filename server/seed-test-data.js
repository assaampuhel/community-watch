#!/bin/bash

# Database seed script for testing
# Run: mongosh < seed-test-data.js

use envision;

// Clear existing data
db.users.deleteMany({});
db.reports.deleteMany({});
db.reviews.deleteMany({});

// Insert test users
db.users.insertMany([
  {
    handle: "testuser",
    rating: 0,
    role: "user",
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    handle: "adminuser",
    rating: 0,
    role: "admin",
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    handle: "moduser",
    rating: 0,
    role: "moderator",
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert test report
db.reports.insertOne({
  reportId: "MANUAL_TEST_RPT_001",
  reporterHandle: "testuser",
  suspectHandle: "cheater1",
  contestId: "CONTEST_001",
  problemId: "PROBLEM_001",
  reason: "Code Similarity",
  description: "Test report for manual testing",
  evidenceImage: null,
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert test review
db.reports.findOne({ reportId: "MANUAL_TEST_RPT_001" });
const reportRef = db.reports.findOne({ reportId: "MANUAL_TEST_RPT_001" });

db.reviews.insertOne({
  reviewId: "MANUAL_TEST_REV_001",
  reportId: "MANUAL_TEST_RPT_001",
  reviewerHandle: "moduser",
  decision: "approve",
  comment: "Initial review",
  createdAt: new Date(),
  updatedAt: new Date()
});

print("✓ Database seeded successfully!");
print("Users: testuser, adminuser, moduser");
print("Report: MANUAL_TEST_RPT_001");
print("Review: MANUAL_TEST_REV_001");
print("\nNow you can run the API tests!");
