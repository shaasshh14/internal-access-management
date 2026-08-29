import AppRouter from "./app/routes/AppRouter";
import { CommandPaletteProvider } from "./shared/components/CommandPalette/CommandPaletteContext";

export default function App() {
  return (
    <CommandPaletteProvider>
      <AppRouter />
    </CommandPaletteProvider>
  );
}
