CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    label TEXT NOT NULL,
    -- Sort order; the enso angle is derived from position + count in the
    -- frontend, so the layout stays evenly spaced as projects are added.
    position INT NOT NULL DEFAULT 0,
    -- Lets a project be drafted/hidden without deleting it.
    visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
