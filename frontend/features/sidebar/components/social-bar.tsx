import { cn } from "@/lib/utils";

export interface SocialItem {
    label: string;
    url: string;
    icon: React.ReactNode;
}

interface SocialBarProps {
    socials: SocialItem[];
    className?: string;
    isOpen?: boolean;
}

export function SocialBar({ socials, className, isOpen = true }: SocialBarProps) {
    return (
        <aside className={cn(className, isOpen ? "max-w-16 px-4" : "max-w-0 px-0")}>
            {socials.map((s) => (
                <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                >
                    {s.icon}
                </a>
            ))}
        </aside>
    );
}
