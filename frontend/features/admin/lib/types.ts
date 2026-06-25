export interface AdminField {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "enum";
    label: string;
    required?: boolean;
    readonly?: boolean;
    options?: { value: string; label: string }[];
    // Default for the create form when there's no record (e.g. visible: true).
    default?: unknown;
    // Visibility per surface (forms come later; table reads tableHidden).
    tableHidden?: boolean;
    editHidden?: boolean;
    createHidden?: boolean;
}

export interface AdminSchema {
    name: string;
    displayName: string;
    fields: AdminField[];
}

export interface AdminModel {
    name: string;
    displayName: string;
}

export interface AdminResource {
    name: string;
    displayName: string;
    apiPath: string;
    schema: AdminSchema;
}

export type AdminRecord = Record<string, unknown>;
