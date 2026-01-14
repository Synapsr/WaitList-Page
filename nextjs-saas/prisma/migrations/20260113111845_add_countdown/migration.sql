-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Waitlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "headline" TEXT NOT NULL,
    "subheadline" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "logoUrl" TEXT,
    "collectName" BOOLEAN NOT NULL DEFAULT true,
    "collectCompany" BOOLEAN NOT NULL DEFAULT false,
    "customFields" TEXT,
    "countdownEnabled" BOOLEAN NOT NULL DEFAULT false,
    "countdownDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Waitlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Waitlist" ("backgroundColor", "collectCompany", "collectName", "createdAt", "customFields", "description", "headline", "id", "logoUrl", "primaryColor", "slug", "subheadline", "title", "updatedAt", "userId") SELECT "backgroundColor", "collectCompany", "collectName", "createdAt", "customFields", "description", "headline", "id", "logoUrl", "primaryColor", "slug", "subheadline", "title", "updatedAt", "userId" FROM "Waitlist";
DROP TABLE "Waitlist";
ALTER TABLE "new_Waitlist" RENAME TO "Waitlist";
CREATE UNIQUE INDEX "Waitlist_slug_key" ON "Waitlist"("slug");
CREATE INDEX "Waitlist_userId_idx" ON "Waitlist"("userId");
CREATE INDEX "Waitlist_slug_idx" ON "Waitlist"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
