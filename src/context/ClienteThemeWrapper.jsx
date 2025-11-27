import { ThemeProvider } from "../../context/ThemeContext";

export default function ClienteThemeWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
