CREATE TABLE configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    -- lucide icon name (e.g. "Monitor"); resolved client-side via an icon map.
    icon TEXT NOT NULL,
    -- Folder path inside the configured dotfiles repo (e.g. ".config/hypr").
    path TEXT NOT NULL,
    position INT NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
