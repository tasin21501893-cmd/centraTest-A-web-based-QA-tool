import "./globals.css";

export const metadata = {
  title: "CentraTest | Centralized Autonomous QA & Playwright MCP Hub",
  description: "Enterprise QA Platform: From Test Cases & PRs to Scratch POM Generation and Automated Playwright Execution.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
