var ctx = cad({
  width: 500,
  height: 500
});

document.body.appendChild(ctx.element());

ctx
    .pushState()
    .setStyles({fill: {color: "red"}})
    .transform({translate: {x:250, y:250}, rotate:.3})
    .rect({
        fill: [-25,-25,50,50]
    })
    .popState()
    .rect({
        fill: [100,100,50,50]
    }).drawType({
        ctx: ctx,
        type: 'circ',
        style: {color: 'red'},
        coords: {x: 250, y: 250},
        dimensions: {w: 20, h:20},
        transform: {
            center: true
        }
    })

// ctx.bitmap().create('shape', { width:10, height: 10 }).use('shape', function () {
//     this.setStyles({
//         fill: { color: "red" }
//     }).rect({
//         fill: [0, 0, 5, 5]
//     }).setStyles({
//         fill: { color: "purple" }
//     }).rect({
//         fill: [5, 5, 5, 5]
//     })
// }).done().grid().build('standard',500,500,20).use(function (item, collection, index) {

//     this.getCanvas('raw').drawImage(this.getCanvas('shape').canvas, item.x, item.y);
    
// }).done();

// ctx.plot('simon', function (a, w, c) {
//     this.clear();
//     console.log(arguments,a);
// })

// ctx
// .setStyles({
//     alpha: 0.8,
//     stroke: {
//         width: 3,
//         color: "#fc6"   
//     },
//     fill: {
//         color: "#009"
//     }
// })
// .startPath(75,100)
// .defineSegments([
//     { lineTo: [200,200] },
//     { lineTo: [100,50] }
// ])
// .endPath({
//     close: true,
//     stroke: true,
//     fill: true
// })
// .pushState()
// .setStyles({
//     stroke: {
//         color: "black"
//     },
//     fill: {
//         color: "red"
//     }
// })
// .transform({rotate:Math.PI / 2.3, translate: {x:200, y:200}})
// .rect({
//     fill: [40,40,25,25]
// })
// .rect({
//     stroke: [40,40,50,50]
// })
// .popState()
// .startPath(275,275)
// .defineSegments([
//     { arc: [275,275,100,Math.PI/2,3*Math.PI/2,true] }
// ])
// .endPath({
//     fill: true
// })
// .pushState()
// .setStyles({fill: {color: "red"}})
// .transform({translate: {x:250, y:250}, rotate:.3})
// .rect({
//     fill: [-25,-25,50,50]
// })
// .setStyles({alpha: 1,fill: {color: "white"}})
// .transform({rotate:.3})
// .rect({
//     fill: [-25,-25,50,50]
// })
// .popState()



// ctx.print('simon', ['test', 2, 3]);

