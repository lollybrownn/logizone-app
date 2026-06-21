-- One-time repair script: recalculates kapasitas_terisi for every zone
-- based on the actual jumlah_koli of items currently Stored in it.
-- Run this once if you see "violates check constraint chk_kapasitas_terisi"
-- errors, or if zone capacity numbers look wrong compared to the real data.
--
-- Usage: psql -d your_db -f src/database/reconcile_capacity.sql

UPDATE zones z
SET kapasitas_terisi = COALESCE(sub.total, 0)
FROM (
    SELECT id_zona, SUM(jumlah_koli) AS total
    FROM barang
    WHERE status = 'Stored'
    GROUP BY id_zona
) sub
WHERE z.id = sub.id_zona;

-- Zones with no Stored items at all (sub-query above won't touch them)
UPDATE zones
SET kapasitas_terisi = 0
WHERE id NOT IN (
    SELECT DISTINCT id_zona FROM barang WHERE status = 'Stored' AND id_zona IS NOT NULL
);

SELECT id, kode_zona, kapasitas, kapasitas_terisi FROM zones ORDER BY id;
