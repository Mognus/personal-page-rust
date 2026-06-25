import type { AdminModel, AdminResource } from "@/features/admin/lib/types";

// Declarative admin resources. Add a model here and it appears in the nav +
// gets a generic table at /admin/models/<name>.
export const adminResources: AdminResource[] = [
    {
        name: "users",
        displayName: "Users",
        apiPath: "/users",
        schema: {
            name: "users",
            displayName: "Users",
            fields: [
                {
                    name: "id",
                    type: "string",
                    label: "ID",
                    readonly: true,
                    tableHidden: true,
                    createHidden: true,
                    editHidden: true,
                },
                {
                    name: "email",
                    type: "string",
                    label: "Email",
                    required: true,
                },
                {
                    name: "display_name",
                    type: "string",
                    label: "Name",
                    required: true,
                },
                {
                    name: "role",
                    type: "enum",
                    label: "Role",
                    required: true,
                    options: [
                        { value: "user", label: "User" },
                        { value: "friend", label: "Friend" },
                        { value: "admin", label: "Admin" },
                    ],
                },
                {
                    name: "password",
                    type: "string",
                    label: "Password",
                    required: true,
                    tableHidden: true,
                    editHidden: true,
                },
                {
                    name: "created_at",
                    type: "date",
                    label: "Created",
                    readonly: true,
                    createHidden: true,
                    editHidden: true,
                },
                {
                    name: "updated_at",
                    type: "date",
                    label: "Updated",
                    readonly: true,
                    tableHidden: true,
                    createHidden: true,
                    editHidden: true,
                },
            ],
        },
    },
    {
        name: "projects",
        displayName: "Projects",
        apiPath: "/projects",
        schema: {
            name: "projects",
            displayName: "Projects",
            fields: [
                {
                    name: "id",
                    type: "string",
                    label: "ID",
                    readonly: true,
                    tableHidden: true,
                    createHidden: true,
                    editHidden: true,
                },
                {
                    name: "label",
                    type: "string",
                    label: "Label",
                    required: true,
                },
                {
                    name: "slug",
                    type: "string",
                    label: "Slug",
                    required: true,
                },
                {
                    name: "full_name",
                    type: "string",
                    label: "Repository",
                    required: true,
                },
                {
                    name: "position",
                    type: "number",
                    label: "Position",
                    default: 0,
                },
                {
                    name: "visible",
                    type: "boolean",
                    label: "Visible",
                    default: true,
                },
                {
                    name: "created_at",
                    type: "date",
                    label: "Created",
                    readonly: true,
                    tableHidden: true,
                    createHidden: true,
                    editHidden: true,
                },
                {
                    name: "updated_at",
                    type: "date",
                    label: "Updated",
                    readonly: true,
                    tableHidden: true,
                    createHidden: true,
                    editHidden: true,
                },
            ],
        },
    },
];

export const adminNavModels: AdminModel[] = adminResources.map(
    ({ name, displayName }) => ({ name, displayName }),
);

export function getAdminResource(name: string): AdminResource | undefined {
    return adminResources.find((resource) => resource.name === name);
}
