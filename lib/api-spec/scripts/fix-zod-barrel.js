const fs = require("fs");
const path = require("path");

const barrel = path.resolve(__dirname, "../../api-zod/src/index.ts");
const content = `export * from "./generated/api";\n`;
fs.writeFileSync(barrel, content, "utf8");
console.log("Fixed api-zod barrel index.ts");
