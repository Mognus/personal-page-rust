"use client";

import type { ReactNode } from "react";
import { useParams } from "next/navigation";

import { CornerFrame } from "@/components/corner-frame";
import { Text } from "@/components/typography/text";
import type { ProjectOrbit } from "@/features/projects/lib/projects";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const orbit = {
    centerX: 50,
    centerY: 50,
    radius: 45,
};

interface ProjectEnsoProps {
    children?: ReactNode;
    projects: ProjectOrbit[];
}

export function ProjectEnso({ children, projects }: ProjectEnsoProps) {
    const params = useParams<{ project?: string }>();
    const activeProjectSlug = params.project;

    return (
        <div className="flex h-full items-center justify-center">
            <div
                className={cn(
                    "spin relative aspect-square w-[min(100%,calc(100vh-8rem))] max-h-full max-w-full",
                    activeProjectSlug && "spin-paused",
                )}
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-foreground [mask:url('/enso-clean.png')_center/contain_no-repeat]"
                />
                {projects.map((project) => {
                    const active = project.slug === activeProjectSlug;

                    return (
                        <ProjectOrbitItem
                            active={active}
                            spinPaused={Boolean(activeProjectSlug)}
                            key={project.href}
                            project={project}
                        >
                            {children}
                        </ProjectOrbitItem>
                    );
                })}
            </div>
        </div>
    );
}

function ProjectOrbitItem({
    active,
    spinPaused,
    project,
    children,
}: {
    active: boolean;
    children?: ReactNode;
    project: ProjectOrbit;
    spinPaused: boolean;
}) {
    const angleInRadians = (project.angle * Math.PI) / 180;
    const x = active
        ? orbit.centerX
        : orbit.centerX + Math.cos(angleInRadians) * orbit.radius;
    const y = active
        ? orbit.centerY
        : orbit.centerY + Math.sin(angleInRadians) * orbit.radius;

    return (
        <div
            className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-300 ease-out",
                active ? "z-20" : "z-10",
            )}
            style={{
                left: `${x}%`,
                top: `${y}%`,
            }}
        >
            <div className={cn("counter-spin", spinPaused && "spin-paused")}>
                {active ? (
                    <CornerFrame className="grid gap-4 bg-background p-4 transition-[width,height] duration-300 ease-out">
                        {children}
                    </CornerFrame>
                ) : (
                    <Link
                        className="block aspect-[3/1] w-[clamp(7rem,18vw,14rem)]"
                        href={project.href}
                    >
                        <CornerFrame className="flex h-full w-full items-center justify-center bg-background/65 p-4 text-center backdrop-blur-md transition-colors hover:bg-background/80">
                            <Text as="span" variant="eyebrow" className="font-mono">
                                {project.label}
                            </Text>
                        </CornerFrame>
                    </Link>
                )}
            </div>
        </div>
    );
}
