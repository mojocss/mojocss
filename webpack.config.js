import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.resolve(__dirname, "package.json");
const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
const { version } = JSON.parse(packageJsonContent);

const comment = `Mojo CSS ${version} (https://mojocss.com) | Copyright © 2024 Mojo CSS Authors (https://github.com/orgs/mojocss/people) | Licensed under MIT (https://github.com/mojocss/mojocss/blob/main/LICENSE)`

export default {
  mode: "production",
  entry: "./cdn.js",
  output: {
    filename: `mojo.min.js`,
    path: path.resolve(__dirname, "dist"),
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /\/\n/,
        parallel: true,
        terserOptions: {
          compress: {
            drop_debugger: true,
          },
          output: {
            comments: false,
          },
          mangle: true,
        },
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: (fileData) => {
            return `${fileData.filename}.LICENSE.txt${fileData.query}`;
          },
          banner: () => {
            return comment;
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: " " + comment.replace(/\|/g, "\n"),
      raw: false
    })
],
};


