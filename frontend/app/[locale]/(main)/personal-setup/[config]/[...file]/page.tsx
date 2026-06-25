import { ConfigFilePage } from "@/features/setup/components/file-view/config-file-page";

interface Props {
    params: Promise<{ config: string; file: string[] }>;
}

export default async function ConfigFileRoute({ params }: Props) {
    const { config, file } = await params;

    return <ConfigFilePage slug={config} file={file} />;
}
