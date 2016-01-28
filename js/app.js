var ctx = cad({
  width: 500,
  height: 500
});

document.body.appendChild(ctx.element());

ctx.clear()
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
.startPath(75,100)
.defineSegments([
    { lineTo: [200,200] },
    { lineTo: [100,50] }
])
.endPath({
    close: true,
    stroke: true,
    fill: true
})
.pushState()
.setStyles({
    stroke: {
        color: "black"
    },
    fill: {
        color: "red"
    }
})
.rect({
    fill: [40,40,25,25]
})
.rect({
    stroke: [400,400,50,50]
})
.popState()
.startPath(275,275)
.defineSegments([
    { arc: [275,275,100,Math.PI/2,3*Math.PI/2,true] }
])
.endPath({
    fill: true
});