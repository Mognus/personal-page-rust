import CubeScene from "./components/cube-scene";

export default function Home() {
  // Canvas fills this flex-1 main; the body is a flex column (see layout.tsx).
  return (
    <main className="flex-1">
      <CubeScene />
    </main>
  );
}
