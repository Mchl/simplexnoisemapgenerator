# simplexnoisemapgenerator

This is an excersise in procedurally generating heightmaps. [Leaflet](http://leafletjs.com/) is used to display the results on a webpage.

At this moment it is using two instances of simplex noise at different frequencies to generate heightmap. Biomes are calculated using elevation above sea level and rainfall value generated from another instance of simplex noise

## Installation

Should be straightforward:

1. Have `node.js` installed - 6.x is recommended but 5.x with `--harmony` flag should work as well
1. Clone from github
1. Install node-canvas dependencies - see [instructions here](https://github.com/Automattic/node-canvas) 
  - Windows users: don't be afraid! It does work!
  - Debian (and maybe Ubuntu) users: use `libjpeg62-turbo-dev` instead of `libjpeg8-dev`
1. Run `npm install`
1. Run `node index.js`
1. Go to [http://localhost:3000](http://localhost:3000)

You might want to use [PM2](http://pm2.keymetrics.io/) to run several instances in parallel to quicker generate the tiles. Running `pm2 start index.js -i 0` will start a number of instances equal to the number of available CPU cores at your machine.

## Static example
### 0.0.4 ![Example of generated map from 0.0.4](http://i.imgur.com/tzhL4Sr.png)
### 0.0.3 ![Example of generated map from 0.0.3](http://i.imgur.com/i14NWkT.png)

## Working example

I have set it up on http://spigot.michaljarosz.net - the server is not very powerful though, so expect slow rendering times.

## Version history

* 0.0.4 - Added biome generation based on Polygonal Map Generation for Game from Red Blob Games article (see below)
* 0.0.3 - First released implementation. Heightmap only

## Reading material

* [Christian Maher: Working with Simplex Noise](https://cmaher.github.io/posts/working-with-simplex-noise/)
* [Polygonal Map Generation for Game from Red Blob Games](http://www-cs-students.stanford.edu/~amitp/game-programming/polygon-map-generation/)

## License

MIT
