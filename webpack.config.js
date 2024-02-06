import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.resolve(__dirname, "package.json");
const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
const { version } = JSON.parse(packageJsonContent);

export default {
  mode: "production",
  entry: "./cdn.js",
  output: {
    filename: `mojo.min.js`,
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    mangleWasmImports: true,
    concatenateModules: false,
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("AddCommentsPlugin", () => {
          const outputPath = path.resolve(__dirname, "dist", "mojo.min.js");

          setTimeout(() => {
            const comment = `/*  Mojo CSS ${version} (https://mojocss.com)  | Copyright © 2024 Mojo CSS Authors (https://github.com/orgs/mojocss/people) | Licensed under MIT (https://github.com/mojocss/mojocss/blob/main/LICENSE) */`;

            const fileContent = fs.readFileSync(outputPath, "utf-8");
            const contentWithComment = comment + "\n" + fileContent;
            fs.writeFileSync(outputPath, contentWithComment, "utf8");

            console.log("Comment added to the beginning of the file.");
          }, 100);
        });
      },
    },
  ],
};
