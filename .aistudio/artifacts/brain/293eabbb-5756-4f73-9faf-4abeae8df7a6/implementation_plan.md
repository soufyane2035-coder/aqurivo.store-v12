# Implementation Plan - Fixing Article Saving Issues in AQURIVO Admin

## 1. Problem Statement
When adding or editing purchase guides (articles) in the AQURIVO admin panel, the changes are not being successfully saved to the database. This can be caused by:
- Unauthorized admin access (`requireAdminApi` rejection).
- Form validation errors (missing required fields like title or slug).
- Database connection or permission issues when writing to Firestore.

## 2. Proposed Solutions
1. **Enhance Admin UI Error Handling**: Display exact error messages returned from `/api/admin/articles` (e.g. ValidationError messages or 401/403 unauthorized messages) directly in the admin form instead of a generic failure notice.
2. **Verify Admin Authentication**: Ensure the current logged-in user email is correctly recognized in `ADMIN_EMAILS`.
3. **Validate Article Payload**: Ensure all required localized titles, excerpts, and slugs are correctly populated before submitting to the API.

## 3. Step-by-Step Action Plan
- Step 1: Update the admin article management UI component to display detailed server error responses (`error` and `field`).
- Step 2: Add robust console logging or error banners in the admin panel when a save operation fails.
- Step 3: Test article creation and verify successful persistence in Firestore.
