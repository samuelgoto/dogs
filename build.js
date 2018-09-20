const fs = require("fs");

async function main() {
 // console.log("hi");
 let dirs = fs.readdirSync("images/");
 // console.log(dirs);
 let dataset = {
  "@context": "https://code.sgo.to/datasets",
  "@type": "Dataset",
  "entries": []
 };
 for (let dir of dirs) {
  // console.log(dir);
  let entry = {
   "@type": "Entry",
   "@id": `${dir}`,
   "name": `${dir}`,
   "examples": []
  };
  for (let file of fs.readdirSync(`images/${dir}/`)) {
   // console.log(file);
   entry.examples.push(`images/${dir}/${file}`);
  }
  dataset.entries.push(entry);
 }
 console.log(JSON.stringify(dataset, undefined, 2));
}

main();