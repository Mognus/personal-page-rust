export interface SetupGridTracks {
    gap: string;
    gridTemplateColumns: string;
    gridTemplateRows: string;
}

// Responsive column count for the config grid.
const COLUMN_BREAKPOINTS = { threeColumns: 720, fourColumns: 1080 } as const;

export function getColumnCount(width: number) {
    if (width < COLUMN_BREAKPOINTS.threeColumns) return 2;
    if (width < COLUMN_BREAKPOINTS.fourColumns) return 3;

    return 4;
}

export function getRowCount(itemCount: number, columnCount: number) {
    return Math.max(1, Math.ceil(itemCount / columnCount));
}

// Default: an even grid of config buttons.
export function getDefaultTracks(
    columnCount: number,
    rowCount: number,
): SetupGridTracks {
    return {
        gap: "2rem",
        gridTemplateColumns: repeat(columnCount, "minmax(0, 1fr)"),
        gridTemplateRows: repeat(rowCount, "minmax(0, 1fr)"),
    };
}

// Expanded: the active cell's column and row grow to 1fr, every other track
// collapses to 0fr — the grid morphs the selected button into a full panel.
export function getExpandedTracks(
    activeIndex: number,
    columnCount: number,
    rowCount: number,
): SetupGridTracks {
    const activeColumn = activeIndex % columnCount;
    const activeRow = Math.floor(activeIndex / columnCount);

    return {
        gap: "0rem",
        gridTemplateColumns: track(columnCount, activeColumn),
        gridTemplateRows: track(rowCount, activeRow),
    };
}

// One track set where only `activeTrack` is 1fr; the rest collapse to 0fr.
function track(count: number, activeTrack: number) {
    return Array.from({ length: count }, (_, index) =>
        index === activeTrack ? "minmax(0, 1fr)" : "minmax(0, 0fr)",
    ).join(" ");
}

function repeat(count: number, value: string) {
    return Array.from({ length: count }, () => value).join(" ");
}
