-- ============================================================
-- V4: Seed IAM permissions and assign them to default roles
-- ============================================================

-- ------------------------------------------------------------
-- 1. Seed permissions
-- ------------------------------------------------------------

INSERT INTO permissions (id, name, description, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'USER_READ',
     'View user information',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'USER_WRITE',
     'Create and update users',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'USER_STATUS_UPDATE',
     'Activate or deactivate users',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'ROLE_READ',
     'View roles',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'ROLE_WRITE',
     'Create, update and delete roles',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'PERMISSION_READ',
     'View permissions',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'PERMISSION_WRITE',
     'Create, update and delete permissions',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'APPLICATION_READ',
     'View applications',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'APPLICATION_WRITE',
     'Create and update applications',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'ACCESS_REQUEST_READ',
     'View access requests',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'ACCESS_REQUEST_CREATE',
     'Create access requests',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'ACCESS_REQUEST_APPROVE',
     'Approve access requests',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'ACCESS_REQUEST_REJECT',
     'Reject access requests',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'ACCESS_REVOKE',
     'Revoke granted application access',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (gen_random_uuid(), 'AUDIT_READ',
     'View audit logs',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT (name) DO NOTHING;


-- ------------------------------------------------------------
-- 2. USER role permissions
-- ------------------------------------------------------------

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'USER'
  AND p.name IN (
      'APPLICATION_READ',
      'ACCESS_REQUEST_READ',
      'ACCESS_REQUEST_CREATE'
  )
ON CONFLICT DO NOTHING;


-- ------------------------------------------------------------
-- 3. APPROVER role permissions
-- ------------------------------------------------------------

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'APPROVER'
  AND p.name IN (
      'APPLICATION_READ',
      'ACCESS_REQUEST_READ',
      'ACCESS_REQUEST_APPROVE',
      'ACCESS_REQUEST_REJECT',
      'ACCESS_REVOKE'
  )
ON CONFLICT DO NOTHING;


-- ------------------------------------------------------------
-- 4. ADMIN role permissions
-- ------------------------------------------------------------

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
  AND p.name IN (
      'USER_READ',
      'USER_WRITE',
      'USER_STATUS_UPDATE',
      'ROLE_READ',
      'ROLE_WRITE',
      'PERMISSION_READ',
      'PERMISSION_WRITE',
      'APPLICATION_READ',
      'APPLICATION_WRITE',
      'ACCESS_REQUEST_READ',
      'ACCESS_REQUEST_CREATE',
      'ACCESS_REQUEST_APPROVE',
      'ACCESS_REQUEST_REJECT',
      'ACCESS_REVOKE',
      'AUDIT_READ'
  )
ON CONFLICT DO NOTHING;