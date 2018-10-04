# dogs

This is a port of the [stanford dataset of dog breeds](http://vision.stanford.edu/aditya86/StanfordDogs/) packaged in the [dataset](https://github.com/samuelgoto/datasets) JSON-LD format.

# browsing

To visualize the data, run:

```bash
python -m SimpleHTTPServer 8080
```

And point your browser at http://localhost:8080.

# parsing

To use the data programatically, start with the ```index.jsonld``` file:

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('index.jsonld')))"
```
