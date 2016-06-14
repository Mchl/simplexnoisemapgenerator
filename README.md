# simplexnoisemapgenerator

This is an excersise in procedurally generating heightmaps. [Leaflet](http://leafletjs.com/) is used to display the results on a webpage.

At this moment it is using two instances of simplex noise at different frequencies. I plan for adding some more feauters like biomes, rivers, maybe some man-made features.

## Installation

Should be straightforward:

1. Clone from github
2. Install node-canvas dependencies - see [instructions here](https://github.com/Automattic/node-canvas) 
  - Windows users: don't be afraid! It does work!
  - Debian (and maybe Ubuntu) users: use `libjpeg62-turbo-dev` instead of `libjpeg8-dev`
3. Run `npm install`
4. Run `node index.js`
5. Go to [http://localhost:3000](http://localhost:3000)

You might want to use [PM2](http://pm2.keymetrics.io/) to run several instances in parallel to quicker generate the tiles. Running `pm2 start index.js -i 0` will start a number of instances equal to the number of available CPU cores at your machine.

## Static example

![Example of generated map](http://i.imgur.com/i14NWkT.png)

## Working example

I have set it up on http://spigot.michaljarosz.net - the server is not very powerful though, so expect slow rendering times.

## License

MIT
