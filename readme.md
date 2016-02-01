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
	
#### Groups

You can **plot** a load of methods together in a save like state, and then **print** them as neccessary passing any _arguments_ as required.

	// define a group
	ctx.plot('box-frame', function (x, y) {
		this.clear()
			.rect({
    			fill: [40, 40, x, y]
			})
	});
	
	// play out that group with input
	ctx.print('box-frame', [10, 20]);

---

### Methods

* `__raw__`: {DOM} - canvas
* `__raw__ctx__`: {_object_} - context
* `getCanvas`: (type) {_object_} - if not 'raw', return a defined virtual canvas context
* `element`: returns {DOM} - canvas
* `clear`: (x, y, w, h) <- clears the canvas
* `switchContext`: (target) - switch contexts between main visible and virtual
* `setStyles`: {_fill, stroke_}
* `startPath`: 
* `defineSegments`: 
* `endPath`: 
* `bitmap`: create / use / done - create virtual canvas to draw from
* `grid`: build / use / done - generate grid coordinates
* `rect`: {_fill_: [w, h, x, y]}
* `text`: 
* `transform`: {_method_: [args])
* `shiftPathTo`: 
* `plot`: (name, fn) - define a set of instructions
* `print`: (name, array) - plays out the rule
* `pushState`: save current context
* `popState`: reset coordinates
* `getImage`: 
* `putImage`: 
* `clip`: 
* `info`: {_object_} - returns the instance config



---

**Build**: `npm run build` -> `/dist`