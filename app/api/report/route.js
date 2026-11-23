import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const candidatePaths = [
      path.resolve(process.cwd(), "monocart-results/Test-Report.html"),
      path.resolve(process.cwd(), "../monocart-results/Test-Report.html"),
      path.resolve("C:/Users/SayedAhmedTasin/Desktop/immunizationFunctional/therap-test-automation/playwright/monocart-results/Test-Report.html"),
    ];

    const reportPath = candidatePaths.find((p) => fs.existsSync(p));

    if (!reportPath) {
      return new NextResponse(
        "<html><body style='background:#0f172a;color:#f8fafc;font-family:sans-serif;padding:40px;text-align:center;'><h2>Monocart Report Not Found</h2><p>Please run the test suite first to generate monocart-results/Test-Report.html</p></body></html>",
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    const htmlContent = fs.readFileSync(reportPath, "utf8");

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    return new NextResponse(`Error serving report: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
