interface UserDisplayProps {
    name: string;
    email: string;
}

// Presentational only: name + email, truncated.
export function UserDisplay({ name, email }: UserDisplayProps) {
    return (
        <div className="flex w-full min-w-0 flex-col gap-0.5">
            <span className="truncate text-xs font-bold tracking-[0.2em] text-foreground uppercase">
                {name}
            </span>
            <span className="truncate text-[10px] tracking-wide text-muted-foreground">
                {email}
            </span>
        </div>
    );
}
