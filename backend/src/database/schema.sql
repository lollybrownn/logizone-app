-- =============================================================================
-- PostgreSQL Database Schema
-- Generated from: UserModel, ZoneModel, MasterWarehouseModel, ItemModel, HistoryItemModel
-- =============================================================================
-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('Owner', 'Staff Operasional', 'Staff Gudang');

CREATE TYPE item_status AS ENUM (
    'Pending',
    'Registered',
    'Stored',
    'Picked Up',
    'Completed'
);

CREATE TYPE exit_type AS ENUM ('Pickup', 'Delivery', 'Return');

-- -----------------------------------------------------------------------------
-- TABLE: users
-- -----------------------------------------------------------------------------
CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

-- -----------------------------------------------------------------------------
-- TABLE: gudang_induk  (Master Warehouse)
-- -----------------------------------------------------------------------------
CREATE TABLE
    gudang_induk (
        id SERIAL PRIMARY KEY,
        kode VARCHAR(50) NOT NULL UNIQUE,
        nama VARCHAR(150) NOT NULL UNIQUE,
        alamat TEXT,
        kontak VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

-- -----------------------------------------------------------------------------
-- TABLE: zones
-- -----------------------------------------------------------------------------
CREATE TABLE
    zones (
        id SERIAL PRIMARY KEY,
        kode_zona VARCHAR(50) NOT NULL,
        nama_zona VARCHAR(150) NOT NULL,
        kapasitas INTEGER NOT NULL DEFAULT 0,
        kapasitas_terisi INTEGER NOT NULL DEFAULT 0,
        deskripsi TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW (),
        CONSTRAINT uq_zones_kode_nama UNIQUE (kode_zona, nama_zona),
        CONSTRAINT chk_kapasitas_terisi CHECK (kapasitas_terisi >= 0),
        CONSTRAINT chk_kapasitas CHECK (kapasitas >= 0)
    );

-- -----------------------------------------------------------------------------
-- TABLE: barang  (Items)
-- -----------------------------------------------------------------------------
CREATE TABLE
    barang (
        id_barang SERIAL PRIMARY KEY,
        no_resi VARCHAR(100) NOT NULL UNIQUE,
        label_barang VARCHAR(255) NOT NULL,
        jumlah_koli INTEGER NOT NULL DEFAULT 1,
        tgl_masuk TIMESTAMP NOT NULL DEFAULT NOW (),
        tgl_ambil TIMESTAMP,
        estimasi_tgl_keluar TIMESTAMP,
        kota_asal_barang VARCHAR(100),
        kota_tujuan_keluar VARCHAR(100),
        biaya NUMERIC(15, 2) NOT NULL DEFAULT 0,
        status item_status NOT NULL DEFAULT 'Pending',
        nama_penerima VARCHAR(150),
        no_telp_penerima VARCHAR(30),
        nama_pengirim VARCHAR(150),
        no_telp_pengirim VARCHAR(30),
        id_gudang_induk INTEGER REFERENCES gudang_induk (id) ON DELETE SET NULL,
        id_zona INTEGER REFERENCES zones (id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

CREATE INDEX idx_barang_status ON barang (status);

CREATE INDEX idx_barang_id_zona ON barang (id_zona);

CREATE INDEX idx_barang_id_gudang ON barang (id_gudang_induk);

CREATE INDEX idx_barang_tgl_masuk ON barang (tgl_masuk DESC);

CREATE INDEX idx_barang_estimasi_keluar ON barang (estimasi_tgl_keluar);

-- -----------------------------------------------------------------------------
-- TABLE: history_barang  (Item History / Outbound)
-- -----------------------------------------------------------------------------
CREATE TABLE
    history_barang (
        id SERIAL PRIMARY KEY,
        tipe_keluar exit_type NOT NULL,
        berat_barang NUMERIC(10, 2) NOT NULL DEFAULT 0,
        biaya_ekstra NUMERIC(15, 2) NOT NULL DEFAULT 0,
        biaya_tambahan NUMERIC(15, 2) NOT NULL DEFAULT 0,
        total_biaya NUMERIC(15, 2) NOT NULL DEFAULT 0,
        tgl_keluar TIMESTAMP NOT NULL DEFAULT NOW (),
        id_barang INTEGER NOT NULL REFERENCES barang (id_barang) ON DELETE CASCADE,
        id_user_validator INTEGER REFERENCES users (id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

CREATE INDEX idx_history_tgl_keluar ON history_barang (tgl_keluar DESC);

CREATE INDEX idx_history_id_barang ON history_barang (id_barang);

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================