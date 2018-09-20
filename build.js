const fs = require("fs");
const parse = require("xml2js").parseString;

async function main() {
 // console.log("hi");
 let dirs = fs.readdirSync("images/");
 // console.log(dirs);
 let dataset = {
  "@context": "https://code.sgo.to/datasets",
  "@type": "Dataset",
  "url": "https://code.sgo.to/dogs/index.jsonld",
  "description": "The stanford dog breed dataset packaged into a JSON-LD",
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
   let image = {
    "@type": "Image",
    "url": `images/${dir}/${file}`
   };
   entry.examples.push(image);
   
   // entry.examples.push(`images/${dir}/${file}`);

   let annotations = fs.readFileSync(`annotations/${dir}/${file.substring(0, file.length - 4)}`, "utf8");
   // console.log(annotations);
   let data = await new Promise(function(resolve, reject) {
     parse(annotations, function(err, result) {
       // console.log(JSON.stringify(result));
       resolve(result);
      });
   });
   // console.log(data.annotation.object);
   if (data.annotation.size) {
    image.size = {
     width: data.annotation.size[0].width[0],
     height: data.annotation.size[0].height[0],
     depth: data.annotation.size[0].depth[0]
    };
   }
   if (data.annotation.object) {
    image.boxes = [];
    for (let box of data.annotation.object[0].bndbox) {
     // console.log(box);
     image.boxes.push({
       "@type": "Box",
       "left": box.xmin[0],
       "right": box.xmax[0],
       "top": box.ymin[0],
       "bottom": box.xmax[0]
      });
    }
   }
   
   // break;
  }
  dataset.entries.push(entry);
  // break;
 }
 console.log(JSON.stringify(dataset, undefined, 2));
}

main();
