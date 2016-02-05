
function render () {

    CAD.plot('axis', function (cx, cy) {
        this.draw()
            .setStyles({ stroke: {width: .5, color: "rgba(0,0,0,.5)"} })
            .startPath(cx, 0.5)
            .defineSegments([{ lineTo: [cx, 500.5] }])
            .endPath({ stroke: true, fill: false })
            .startPath(0.5, cy)
            .defineSegments([{ lineTo: [500.5, cy] }])
            .endPath({ stroke: true })
        .done();
    })
    .print('axis', [250.5, 250.5])
    .draw()
        .setStyles({ stroke: {width: 15, color: "rgba(100,50,50,1)"} })
        .spline([250,50, 250,250, 380,300, 50,190])
        .setStyles({ stroke: {width: 5, color: "rgba(0,100,150,1)"} })
        .spline([500,500, 450,350, 480,400])
        .shape({
            type: 'rect',
            style: {fill: {color: '#0f9'}},
            coords: {x: 250, y: 250},
            dimensions: {w: 70, h:70},
            transform: {
                rotate: Math.random(),
                center: true
            }
        })
        .startPath(275,275)
        .defineSegments([ { arc: [275,275,100,Math.PI/2,3*Math.PI/2,true] } ])
        .endPath({ fill: true })
        .setStyles({ alpha: 0.8, stroke: { width: 3, color: "#f0f"}, fill: { color: "#009" }})
        .startPath(75,100)
        .defineSegments([ { lineTo: [200,200] },{ lineTo: [100,50] }])
        .endPath({ close: true, stroke: true, fill: true })
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
            this.getContext().drawImage(this.getVirtualCanvas('virtual-bitmap'), item.x, item.y);
        })
    .done();
}

document.body.appendChild(CAD.create({ width: 500, height: 500}).element());
render();

function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

    showPoints  = showPoints ? showPoints : false;

    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

    if (showPoints) {
        ctx.stroke();
        ctx.beginPath();
        for(var i=0;i<ptsa.length-1;i+=2) 
                ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
    }
}
