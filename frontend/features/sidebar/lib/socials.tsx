import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

import type { SocialItem } from "@/features/sidebar/components/social-bar";

export const SOCIALS: SocialItem[] = [
    {
        label: "GitHub",
        url: "https://github.com/Mognus",
        icon: <FaGithub className="h-5 w-5" />,
    },
    {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/magnus-eschrich-2189b8234/",
        icon: <FaLinkedin className="h-5 w-5" />,
    },
    {
        label: "Mail",
        url: "mailto:magnuseschrich@gmail.com",
        icon: <Mail className="h-5 w-5" />,
    },
];
