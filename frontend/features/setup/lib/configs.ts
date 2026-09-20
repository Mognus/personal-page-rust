// Curation pointers into the dotfiles repo: which folder to show and how to
// label it. The file contents themselves are fetched from GitHub at request
// time, so nothing here needs to be stored or edited at runtime.
//
// Array order is the display order, and an entry is shown precisely because it
// is listed — that replaces the `position` and `visible` columns this used to
// carry. `icon` is a lucide name resolved by ICON_MAP in config-button.tsx;
// an unknown name falls back to Package rather than breaking the grid.
export interface Config {
    slug: string;
    label: string;
    icon: string;
    path: string;
}

export const configs: Config[] = [
    { slug: "hyprland", label: "Hyprland", icon: "Monitor", path: ".config/hypr" },
    {
        slug: "alacritty",
        label: "Alacritty",
        icon: "SquareTerminal",
        path: ".config/alacritty",
    },
    { slug: "neovim", label: "Neovim", icon: "Code2", path: ".config/nvim" },
    { slug: "zed", label: "Zed", icon: "PanelTop", path: ".config/zed" },
    { slug: "tmux", label: "Tmux", icon: "PanelsTopLeft", path: ".config/tmux" },
    { slug: "shell", label: "Shell", icon: "Terminal", path: ".config/fish" },
    {
        slug: "quickshell",
        label: "Quickshell",
        icon: "Layers",
        path: ".config/quickshell",
    },
    { slug: "tools", label: "Tools", icon: "Package", path: ".config/tools" },
];
