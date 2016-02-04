document.body.appendChild(CAD.create({ width: 500, height: 500}).element());

CAD.plot('axis', function (cx, cy) {
    this.draw()
        .setStyles({
            stroke: {
                width: .5, color: "rgba(0,0,0,.5)"
            }
        })
        .startPath(cx, 0.5)
        .defineSegments([
            { lineTo: [cx, 500.5] }
        ])
        .endPath({
            stroke: true, fill: false
        })
        .startPath(0.5, cy)
        .defineSegments([
            { lineTo: [500.5, cy] }
        ])
        .endPath({
            stroke: true
        })
    .done();
})
.print('axis', [250.5, 250.5])
.draw()
    .pushState()
    .setStyles({fill: {color: 'red'}})
    .transform({translate: {x:250, y:250}, rotate:.3})
    .rect({
        fill: [-25,-25,50,50]
    })
    .popState()
    .shape({
        type: 'circ',
        style: {fill: {color: '#0f9'}},
        coords: {x: 250, y: 250},
        dimensions: {w: 20, h:20},
        transform: {
            center: true
        }
    })
.done()
.bitmap().create('virtual-bitmap', { width:10, height: 10 })
.use('virtual-bitmap', function () {
    this.draw()
        .setStyles({
            fill: { color: "red" }
        }).rect({
            fill: [0, 0, 5, 5]
        }).setStyles({
            fill: { color: "purple" }
        }).rect({
            fill: [5, 5, 5, 5]
        })
    .done()
}).done()
.grid().build('standard',500,500,20)
    .use(function (item, collection, index) {
        var self = this;
        console.log();
        this.getContext().drawImage(this.getVirtualCanvas('virtual-bitmap'), item.x, item.y);
    })
.done();

