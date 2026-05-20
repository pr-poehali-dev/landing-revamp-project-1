
-- Таблица участников розыгрыша
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_raw VARCHAR(50) NOT NULL,
    phone_normalized VARCHAR(20) NOT NULL,
    ticket_number INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(100),
    CONSTRAINT participants_phone_normalized_unique UNIQUE (phone_normalized),
    CONSTRAINT participants_ticket_number_unique UNIQUE (ticket_number)
);

-- Таблица розыгрышей
CREATE TABLE draws (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    prize_name VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'finished',
    participants_count INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100)
);

-- Таблица победителей
CREATE TABLE winners (
    id SERIAL PRIMARY KEY,
    draw_id INTEGER NOT NULL REFERENCES draws(id),
    participant_id INTEGER NOT NULL REFERENCES participants(id),
    ticket_number INTEGER NOT NULL,
    full_name_snapshot VARCHAR(100) NOT NULL,
    phone_snapshot VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_participants_phone_normalized ON participants(phone_normalized);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_winners_draw_id ON winners(draw_id);
