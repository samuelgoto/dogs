const fs = require("fs");
const parse = require("xml2js").parseString;

async function main() {
 // console.log("hi");
 let dirs = fs.readdirSync("images/");
 // console.log(dirs);
 let dataset = {
  "@context": "https://code.sgo.to/datasets",
  "@type": "Dataset",
  "name": "The stanford dog breed dataset",
  "classes": []
 };
 for (let dir of dirs) {
  // console.log(dir);
  let entry = {
   "@context": "https://code.sgo.to/datasets",
   "@type": "Class",
   "@id": `${dir}`,
   "name": `${dir}`,
   "images": []
   // "images": `images/${dir}/index.jsonld`
  };

  // let feed = {
  // "@context": "https://feeds.json-ld.io/2005/Atom",
  // "@type": "Feed",
  // "name": `Images of ${dir}`,
  // "entries": []
  //};

  for (let file of fs.readdirSync(`images/${dir}/`)) {
   if (file == "index.jsonld") {
    continue;
   }

   // console.log(file);
   let image = {
    "@type": "Image",
    "url": `images/${dir}/${file}`
   };

   entry.images.push(image);

   // feed.entries.push(image);
   
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

   // console.log(JSON.stringify(entry, undefined, 2));
   
   // break;
  }
  fs.writeFileSync(`images/${dir}/index.jsonld`, JSON.stringify(entry, undefined, 2));

  dataset.classes.push(`images/${dir}/index.jsonld`);

  // dataset.classes.push(entry);
  // break;
 }
 fs.writeFileSync("index.jsonld", JSON.stringify(dataset, undefined, 2));
 // console.log(JSON.stringify(dataset, undefined, 2));
}

main();
