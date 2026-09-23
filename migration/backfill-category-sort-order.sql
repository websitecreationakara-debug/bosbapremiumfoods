WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY COALESCE(parent_id, '')
    ORDER BY created_at
  ) - 1 AS rn
  FROM categories
)
UPDATE categories
SET sort_order = (SELECT rn FROM ranked WHERE ranked.id = categories.id);
