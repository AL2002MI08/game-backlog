import { useMantineColorScheme } from "@mantine/core";

export function useColorMode() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const currentMode = (colorScheme || "dark") as "light" | "dark";

  const toggleColorMode = () => {
    setColorScheme(currentMode === "dark" ? "light" : "dark");
  };

  return {
    colorMode: currentMode,
    setColorMode: setColorScheme,
    toggleColorMode,
  };
}
