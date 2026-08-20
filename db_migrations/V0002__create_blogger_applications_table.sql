CREATE TABLE blogger_applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    social_network VARCHAR(50) NOT NULL,
    social_link TEXT NOT NULL,
    followers_count VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(64)
);