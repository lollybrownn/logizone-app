-- =============================================================================
-- Data Seeder
-- Order: users → gudang_induk → zones → barang → history_barang
-- Passwords below are bcrypt hashes of "password123"
-- =============================================================================
-- -----------------------------------------------------------------------------
-- SEED: users
-- -----------------------------------------------------------------------------
INSERT INTO
    users (username, password, role, status)
VALUES
    (
        'admin_owner',
        '$2a$10$zZgyHwOq4D1MWaovVJGPZuTOwbE96Q1jqjqp4t4x8C.N9sEpHVLrO',
        'Owner',
        'Active'
    ),
    (
        'budi_ops',
        '$2a$10$zZgyHwOq4D1MWaovVJGPZuTOwbE96Q1jqjqp4t4x8C.N9sEpHVLrO',
        'Staff Operasional',
        'Active'
    ),
    (
        'sari_ops',
        '$2a$10$zZgyHwOq4D1MWaovVJGPZuTOwbE96Q1jqjqp4t4x8C.N9sEpHVLrO',
        'Staff Operasional',
        'Active'
    ),
    (
        'deni_gudang',
        '$2a$10$zZgyHwOq4D1MWaovVJGPZuTOwbE96Q1jqjqp4t4x8C.N9sEpHVLrO',
        'Staff Gudang',
        'Active'
    ),
    (
        'rina_gudang',
        '$2a$10$zZgyHwOq4D1MWaovVJGPZuTOwbE96Q1jqjqp4t4x8C.N9sEpHVLrO',
        'Staff Gudang',
        'Active'
    ),
    (
        'tono_gudang',
        '$2a$10$zZgyHwOq4D1MWaovVJGPZuTOwbE96Q1jqjqp4t4x8C.N9sEpHVLrO',
        'Staff Gudang',
        'Inactive'
    );

-- -----------------------------------------------------------------------------
-- SEED: gudang_induk  (Master Warehouse)
-- -----------------------------------------------------------------------------
INSERT INTO
    gudang_induk (kode, nama, alamat, kontak)
VALUES
    (
        'GI-JKT-01',
        'Gudang Induk Jakarta Pusat',
        'Jl. Mangga Dua Raya No. 12, Jakarta Pusat',
        '021-6234567'
    ),
    (
        'GI-BDG-01',
        'Gudang Induk Bandung',
        'Jl. Soekarno Hatta No. 88, Bandung',
        '022-5201234'
    ),
    (
        'GI-SBY-01',
        'Gudang Induk Surabaya',
        'Jl. Raya Waru No. 45, Sidoarjo, Surabaya',
        '031-8987654'
    );

-- -----------------------------------------------------------------------------
-- SEED: zones
-- -----------------------------------------------------------------------------
INSERT INTO
    zones (
        kode_zona,
        nama_zona,
        kapasitas,
        kapasitas_terisi,
        deskripsi
    )
VALUES
    (
        'ZN-A1',
        'Zona A - Rak 1',
        50,
        12,
        'Zona penyimpanan barang elektronik kecil'
    ),
    (
        'ZN-A2',
        'Zona A - Rak 2',
        50,
        30,
        'Zona penyimpanan barang elektronik besar'
    ),
    (
        'ZN-B1',
        'Zona B - Rak 1',
        80,
        0,
        'Zona penyimpanan pakaian dan tekstil'
    ),
    (
        'ZN-B2',
        'Zona B - Rak 2',
        80,
        45,
        'Zona penyimpanan peralatan rumah tangga'
    ),
    (
        'ZN-C1',
        'Zona C - Rak 1',
        100,
        5,
        'Zona penyimpanan makanan dan minuman kering'
    ),
    (
        'ZN-C2',
        'Zona C - Rak 2',
        100,
        0,
        'Zona penyimpanan bahan bangunan ringan'
    );

-- -----------------------------------------------------------------------------
-- SEED: barang  (Items)
-- -----------------------------------------------------------------------------
INSERT INTO
    barang (
        no_resi,
        label_barang,
        jumlah_koli,
        tgl_masuk,
        tgl_ambil,
        estimasi_tgl_keluar,
        kota_asal_barang,
        kota_tujuan_keluar,
        biaya,
        status,
        nama_penerima,
        no_telp_penerima,
        nama_pengirim,
        no_telp_pengirim,
        id_gudang_induk,
        id_zona
    )
VALUES
    -- Stored items (in zone)
    (
        'RSI-20240601-001',
        'Laptop ASUS Vivobook 14 inch',
        2,
        NOW () - INTERVAL '10 days',
        NULL,
        NOW () + INTERVAL '5 days',
        'Jakarta',
        'Bandung',
        150000,
        'Stored',
        'Ahmad Fauzi',
        '081234567890',
        'PT Teknindo',
        '021-5551234',
        1,
        1
    ),
    (
        'RSI-20240602-002',
        'Paket Baju Batik Premium',
        5,
        NOW () - INTERVAL '8 days',
        NULL,
        NOW () + INTERVAL '7 days',
        'Bandung',
        'Surabaya',
        75000,
        'Stored',
        'Dewi Rahayu',
        '082345678901',
        'CV Batik Nusantara',
        '022-5559876',
        2,
        3
    ),
    (
        'RSI-20240603-003',
        'Peralatan Dapur Set Lengkap',
        3,
        NOW () - INTERVAL '6 days',
        NULL,
        NOW () + INTERVAL '2 days',
        'Surabaya',
        'Jakarta',
        200000,
        'Stored',
        'Budi Santoso',
        '083456789012',
        'Toko Alat Dapur',
        '031-5552468',
        3,
        4
    ),
    -- Aging item (close to estimasi_tgl_keluar)
    (
        'RSI-20240604-004',
        'Smartphone Samsung Galaxy A55',
        1,
        NOW () - INTERVAL '15 days',
        NULL,
        NOW () + INTERVAL '2 days',
        'Jakarta',
        'Yogyakarta',
        120000,
        'Stored',
        'Citra Lestari',
        '084567890123',
        'Distributor HP Jaya',
        '021-5553692',
        1,
        2
    ),
    -- Overdue item
    (
        'RSI-20240505-005',
        'Karpet Permadani Turki 3x4m',
        1,
        NOW () - INTERVAL '30 days',
        NULL,
        NOW () - INTERVAL '5 days',
        'Jakarta',
        'Medan',
        350000,
        'Stored',
        'Hendra Wijaya',
        '085678901234',
        'Importir Karpet',
        '021-5554812',
        1,
        4
    ),
    -- Pending / unplaced items
    (
        'RSI-20240610-006',
        'Monitor Gaming 27 inch 144Hz',
        2,
        NOW () - INTERVAL '1 day',
        NULL,
        NOW () + INTERVAL '14 days',
        'Surabaya',
        'Makassar',
        180000,
        'Pending',
        'Fandi Ahmad',
        '086789012345',
        'Toko Monitor Pro',
        '031-5556028',
        1,
        NULL
    ),
    (
        'RSI-20240610-007',
        'Beras Premium 25kg x 10 Karung',
        10,
        NOW () - INTERVAL '2 days',
        NULL,
        NOW () + INTERVAL '10 days',
        'Bandung',
        'Cirebon',
        90000,
        'Registered',
        'Guntur Prakoso',
        '087890123456',
        'UD Beras Berkah',
        '022-5557244',
        2,
        NULL
    ),
    -- Completed / picked up items
    (
        'RSI-20240520-008',
        'TV LED 55 inch Smart TV',
        1,
        NOW () - INTERVAL '25 days',
        NOW () - INTERVAL '10 days',
        NOW () - INTERVAL '10 days',
        'Jakarta',
        'Bekasi',
        250000,
        'Picked Up',
        'Indah Permata',
        '088901234567',
        'Distributor Elektronik',
        '021-5558460',
        1,
        1
    ),
    (
        'RSI-20240515-009',
        'Mesin Cuci Front Load 8kg',
        1,
        NOW () - INTERVAL '28 days',
        NOW () - INTERVAL '12 days',
        NOW () - INTERVAL '12 days',
        'Bandung',
        'Tasikmalaya',
        175000,
        'Completed',
        'Joko Susilo',
        '089012345678',
        'Toko Elektronik Maju',
        '022-5559676',
        2,
        NULL
    ),
    (
        'RSI-20240510-010',
        'Kulkas 2 Pintu 400L',
        1,
        NOW () - INTERVAL '35 days',
        NOW () - INTERVAL '20 days',
        NOW () - INTERVAL '20 days',
        'Surabaya',
        'Malang',
        200000,
        'Completed',
        'Kartini Dewi',
        '081122334455',
        'CV Serba Ada',
        '031-5550892',
        3,
        NULL
    );

-- -----------------------------------------------------------------------------
-- SEED: history_barang  (Outbound History)
-- -----------------------------------------------------------------------------
INSERT INTO
    history_barang (
        tipe_keluar,
        berat_barang,
        biaya_ekstra,
        biaya_tambahan,
        total_biaya,
        tgl_keluar,
        id_barang,
        id_user_validator
    )
VALUES
    -- History for Picked Up item (id_barang = 8)
    (
        'Ambil di Gudang',
        5.5,
        20000,
        0,
        270000,
        NOW () - INTERVAL '10 days',
        (
            SELECT
                id_barang
            FROM
                barang
            WHERE
                no_resi = 'RSI-20240520-008'
        ),
        4
    ),
    -- History for Completed item (id_barang = 9)
    (
        'Diantar',
        75.0,
        50000,
        15000,
        240000,
        NOW () - INTERVAL '12 days',
        (
            SELECT
                id_barang
            FROM
                barang
            WHERE
                no_resi = 'RSI-20240515-009'
        ),
        5
    ),
    -- History for Completed item (id_barang = 10)
    (
        'Diantar',
        95.0,
        75000,
        25000,
        300000,
        NOW () - INTERVAL '20 days',
        (
            SELECT
                id_barang
            FROM
                barang
            WHERE
                no_resi = 'RSI-20240510-010'
        ),
        4
    ),
    -- Extra historical records for income reporting
    (
        'Ambil di Gudang',
        3.2,
        10000,
        0,
        130000,
        NOW () - INTERVAL '40 days',
        (
            SELECT
                id_barang
            FROM
                barang
            WHERE
                no_resi = 'RSI-20240510-010'
        ),
        5
    ),
    (
        'Diantar',
        12.0,
        30000,
        10000,
        85000,
        NOW () - INTERVAL '45 days',
        (
            SELECT
                id_barang
            FROM
                barang
            WHERE
                no_resi = 'RSI-20240515-009'
        ),
        2
    );

-- =============================================================================
-- END OF SEEDER
-- =============================================================================