import { Home } from "./pages/Home.tsx";
import { ThemeSwitcher } from "./components/ThemeSwitcher.tsx";

export function App() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 9999,
        }}
      >
        <ThemeSwitcher />
      </div>
      <Home />
    </>
  );
}
