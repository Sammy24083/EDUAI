# Security Specification: SAMM AI Platform

## 1. Data Invariants
1. **Identity Integrity**: No user can impersonate another user; `authorId` on an article must match the creator's `request.auth.uid` unless the updater is an authorized Admin or Editor.
2. **Role Protection**: Standard users cannot elevate their own role to `author`, `editor`, or `admin` in `users/{userId}`. Roles can only be updated by Admins or mapped in `admins/{userId}`.
3. **Admin Privilege**: Administrative operations (managing categories, tags, advertisements, site settings, deleting others' articles/comments) are restricted to users whose email matches `amaechisamuelugo@gmail.com` or who exist in `/databases/$(database)/documents/admins/$(request.auth.uid)`.
4. **Draft and Schedule Protection**: Draft and scheduled articles can only be read by their author, editors, or admins. Public readers can only query and read articles with `status == 'published'`.
5. **Comment Integrity**: Comments can only be created by signed-in users with `userId == request.auth.uid`. Users can update or delete only their own comments. Admins can moderate, delete, or hide any comment.
6. **Like/Save Atomic Uniqueness**: A user can only like or save an article with an ID corresponding to `${articleId}_${request.auth.uid}` or with `userId == request.auth.uid`.
7. **Newsletter Privacy**: Only the subscriber or an administrator can access subscriber email records; public users cannot scrape the subscriber list.
8. **Bounded Collections and Payload Limits**: Every string and list is bounded (e.g. content max lengths, tags list <= 10 items) to prevent resource exhaustion attacks.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Privilege Escalation**: Non-admin user attempts to write `{ "role": "admin" }` to their own `/users/{userId}`.
2. **Impersonated Article Creation**: User attempts to create an article with `authorId: "victim_user_123"` instead of their own UID.
3. **Ghost Status Bypass**: User attempts to publish an article without required fields (`title`, `slug`, `content`).
4. **Denial of Wallet Injection**: User attempts to save an article with a 50MB payload in `content` exceeding 200,000 characters.
5. **Unauthenticated Comment Creation**: Anonymous or non-signed in caller attempts to inject spam comments to `/comments/{commentId}`.
6. **Comment Hijacking**: User A attempts to edit User B's comment text.
7. **Admin Document Infiltration**: Non-admin user attempts to add their UID into `/admins/{userId}`.
8. **Draft Scraping**: Unauthenticated reader attempts to read another author's draft article at `/articles/{draftId}` where `status == 'draft'`.
9. **Subscriber Harvester Attack**: Public user tries to list all emails in `/newsletterSubscribers`.
10. **Setting Poisoning**: Regular user attempts to modify global `/siteSettings/general` to redirect URLs or inject malicious scripts.
11. **Ad Campaign Sabotage**: Normal user attempts to activate or alter `/advertisements/{adId}` click counts or banner destinations.
12. **Counter Forgery**: User attempts to set `views` or `likesCount` to negative or arbitrary multi-million numbers.
