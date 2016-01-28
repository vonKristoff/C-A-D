#C-A-D

### Canvas Aided Development

A HTML5 Canvas wrapper library to enable quick starts and chainability to developing Canvas experiments.

---
	
### Usage

The lib will self invoke, and you can create multiple canvas contexts with it.  
#### `var ctx = cad( options );`

	// create instance
	var ctx = cad({
	  width: 500,
	  height: 500
	});
	// add to DOM
	document.body.appendChild(ctx.element());
	
For 'options' see `cad.js` - nothing really to sing and dance about.

The idea is that the methods are helper functions for the HTML5 Canvas API, but which are wrapped in a way so that the can be chained together; Functional Style.

	// example usage
	ctx
	.clear()
	.setStyles({
	    alpha: 0.8,
	    stroke: {
	        width: 3,
	        color: "#fc6"   
	    },
	    fill: {
	        color: "#009"
	    }
	})
	.startPath(100,150)
	.defineSegments([
	    { lineTo: [200,200] },
	    { lineTo: [100,50] }
	])
	.endPath({
	    close: true,
	    stroke: true,
	    fill: true
	})

---

### Methods

* `__raw__`: {DOM} - canvas
* `__raw__ctx__`: {object} - context
* `element`: returns {DOM} - canvas
* `clear`: (x, y, w, h) <- clears the canvas
* `setStyles`: 
* `startPath`: 
* `defineSegments`: 
* `endPath`: 
* `rect`: 
* `text`: 
* `transform`: 
* `shiftPathTo`: 
* `pushState`: 
* `popState`: 
* `getImage`: 
* `putImage`: 
* `clip`: 
* `info`: {_object_} - returns the instance config

---

**Build**: `npm run build` -> `/dist`