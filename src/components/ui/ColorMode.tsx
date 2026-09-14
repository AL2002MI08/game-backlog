import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    />
  );
}

export function useColorMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentMode = (resolvedTheme || theme || "dark") as "light" | "dark";

  const toggleColorMode = () => {
    const nextMode = currentMode === "dark" ? "light" : "dark";
    setTheme(nextMode);
  };

  return {
    colorMode: currentMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}
