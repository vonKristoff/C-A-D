(function (Global) {

    // Constructor
    function Canvas () {
        this.raw = {
            canvas: {},
            vctx: {},
            plots: {},
            grids: {}
        }
        this.current = {
            name: '',
            c: function () {
                return pm.getCanvasApi.call(this)
            }.bind(this)
        }

        this.data = function (target) {
            return pm.getCanvasApi.call(this, target)   
        }
    }

    var cp = Canvas.prototype;

    cp.plot = function (name, action) {
        if(typeof action != 'function') throw new Error("action needs to be a Function");
        else this.raw.plots[name] = action;
        return this;
    }

    cp.draw = function () {
        var c = this.data(),
            ctx = c.ctx,
            config = c.config,
            plots = this.raw.plots;
        return {
            clear: function () {
                if (arguments.length == 0) ctx.clearRect(0,0,config.width,config.height);
                else ctx.clearRect.apply(ctx, arguments);
                return this
            },
            print: function (name, args) {
                if(!plots[name]) throw new Error("plot doesn't exist in this context");
                else plots[name].apply(this, args);
                return this;
            },
            setStyles: function (styles) {
                styles = styles || {};

                if ("composite" in styles) ctx.globalCompositeOperation = styles.composite;
                if ("alpha" in styles) ctx.globalAlpha = styles.alpha;
                if (styles.stroke) {
                    if ("width" in styles.stroke) ctx.lineWidth = styles.stroke.width;
                    if ("caps" in styles.stroke) ctx.lineCap = styles.stroke.caps;
                    if ("joints" in styles.stroke) ctx.lineJoin = styles.stroke.joints;
                    if ("color" in styles.stroke) ctx.strokeStyle = styles.stroke.color;
                    if ("miter" in styles.stroke) ctx.miterLimit = styles.stroke.miter;
                }
                if (styles.fill) {
                    if ("color" in styles.fill) ctx.fillStyle = styles.fill.color;
                }
                if (styles.shadow) {
                    if ("offsetX" in styles.shadow) ctx.shadowOffsetX = styles.shadow.offsetX;
                    if ("offsetY" in styles.shadow) ctx.shadowOffsetY = styles.shadow.offsetY;
                    if ("blur" in styles.shadow) ctx.shadowBlur = styles.shadow.blur;
                    if ("color" in styles.shadow) ctx.shadowColor = styles.shadow.color;
                }
                if ("text" in styles) {
                    if ("font" in styles.text) ctx.font = styles.text.font;
                    if ("align" in styles.text) ctx.textAlign = styles.text.align;
                    if ("baseline" in styles.text) ctx.textBaseline = styles.text.baseline;
                }
                return this;
            },
            startPath: function (x, y) {
                if (in_path) throw new Error("A path is still currently being defined. End it first.");

                ctx.beginPath();
                if (x != null && y != null) ctx.moveTo(x, y);
                in_path = true;

                return this;
            },
            defineSegments: function (segments) {
                var segment, 
                    type;

                if (!in_path) throw new Error("Segments need a path started first.");
                segments = segments || [];

                for (var i=0; i < segments.length; i++) {
                    segment = segments[i];
                    type = Object.keys(segment)[0];
                    if (type in segmentTypes) {
                        ctx[type].apply(ctx, segment[type]);
                    }
                }

                return this;
            },
            endPath: function (opts) {
                if (!in_path) throw new Error("No path currently active.");
                opts = opts || {};

                if (opts.close) ctx.closePath();
                if (opts.fill) ctx.fill();
                if (opts.stroke) ctx.stroke();

                in_path = false;

                return this;
            },
            rect: function (opts) {
                opts = opts || {};

                if (opts.path) defineSegments([ {rect: opts.path} ]);
                else if (opts.stroke) ctx.strokeRect.apply(ctx, opts.stroke);
                else if (opts.fill) ctx.fillRect.apply(ctx, opts.fill);

                return this;
            },
            circ: function (opts) {
                opts = opts || {};
                ctx.beginPath();
                ctx.arc(opts.x, opts.y, opts.r, 0, Math.PI*2, true);
                ctx.closePath();
                if (opts.stroke) ctx.stroke();
                else if (opts.fill) ctx.fill();

                return this;
            },
            text: function (opts) {
                opts = opts || {};

                if (opts.stroke) ctx.strokeText.apply(ctx, opts.stroke);
                else if (opts.fill) ctx.fillText.apply(ctx, opts.fill);

                return this;
            },
            transform: function (opts) {
                opts = opts || {};

                if ("translate" in opts) ctx.translate(opts.translate.x, opts.translate.y);
                if ("scale" in opts) ctx.scale(opts.scale.x, opts.scale.y);
                if ("rotate" in opts) ctx.rotate(opts.rotate);

                return this;
            },
            /**
             * predefined shapes - with relative coordinates
             * { ctx: target context, 
             *  coords: {x,y}, type: shape, style: {}, 
             *  dimensions: {w,h}, offset: {x,y}, transform: {} }
             */
            shape: function (opts) {
                var $this = opts.ctx;
                var opts = opts || {}, 
                    tx = 0, ty = 0, ox = 0, oy = 0;
                if(opts.offset) {
                    ox = opts.offset.x;
                    oy = opts.offset.y;
                }
                $this.pushState();
                if (opts.style) $this.setStyles(opts.style);
                if (opts.transform) {
                    tx = (opts.transform.center) ? -(opts.dimensions.w / 2) : 0,
                    ty = (opts.transform.center) ? -(opts.dimensions.h / 2) : 0;
                    $this.transform({
                        translate: { x: opts.coords.x, y: opts.coords.y },
                        rotate: (opts.transform.rotate) ? opts.transform.rotate : 0.1,
                        scale: (opts.transform.scale) ? opts.transform.scale : 0
                    })
                }
                shapes[opts.type].call($this, tx, ty, ox, oy, opts);
                $this.popState();

                return this
            },
            getImage: function (opts) {
                /** will fail due to canvas not being defined */
                var tmp, 
                    tmp_c;

                opts = opts || {};

                if (opts.bitmap) return ctx.getImageData(opts.bitmap.x, opts.bitmap.y, opts.bitmap.width, opts.bitmap.height);
                else if (opts.dataURL) {
                    if (("x" in opts.dataURL && "y" in opts.dataURL) || ("width" in opts.dataURL && "height" in opts.dataURL)) {
                        
                        tmp = document.createElement("canvas");
                        tmp.setAttribute("width", opts.dataURL.width || config.width);
                        tmp.setAttribute("height", opts.dataURL.height || config.height);
                        
                        tmp_c = tmp.getContext("2d");
                        tmp_c.drawImage(canvas,
                                        opts.dataURL.x, 
                                        opts.dataURL.y, 
                                        opts.dataURL.width || config.width, 
                                        opts.dataURL.height || config.height,
                                        0, 0, 
                                        opts.dataURL.width || config.width, 
                                        opts.dataURL.height || config.height
                        );
                        return tmp.toDataURL(opts.dataURL.type);
                    }
                    else return canvas.toDataURL(opts.dataURL.type);
                }
            },
            putImage: function (src, opts) {
                var args;
                opts = opts || {};

                if (opts.bitmap) ctx.putImageData(src, opts.bitmap.x || 0, opts.bitmap.y || 0);
                else if (opts.dataURL) {
                    args = [src];

                    if ("x" in opts.dataURL && "y" in opts.dataURL) args.push(opts.dataURL.x, opts.dataURL.y);
                    if ("width" in opts.dataURL && "height" in opts.dataURL) args.push(opts.dataURL.width, opts.dataURL.height);
                    if (
                      "sx" in opts.dataURL && "sy" in opts.dataURL && "sWidth" in opts.dataURL && "sHeight" in opts.dataURL &&
                      "dx" in opts.dataURL && "dy" in opts.dataURL && "dWidth" in opts.dataURL && "dHeight" in opts.dataURL
                    ) {
                      args.push(opts.dataURL.sx, opts.dataURL.sy, opts.dataURL.sWidth, opts.dataURL.sHeight, opts.dataURL.dx, opts.dataURL.dy, opts.dataURL.dWidth, opts.dataURL.dHeight);
                    }

                    ctx.drawImage.apply(ctx, args);
                }
                return this;
            },
            shiftPathTo: function (x,y) { ctx.moveTo(x, y); return this; },
            pushState: function () { ctx.save(); return this; },
            popState: function () { ctx.restore(); return this; },
            clip: function () { ctx.clip(); return this; },
            done: function () { return this }.bind(this)
        } 
    }

    cp.create = function (config) {
        config = config || {};
        config.width = ("width" in config) ? config.width : 300;
        config.height = ("height" in config) ? config.height : 150;
        config.matchDimensions = ("matchDimensions" in config) ? config.matchDimensions : true;
        config.type = (config.type == "webgl") ? "experimental-webgl" : "2d";
        config.name = (!config.name) ? 'canvas-' : config.name;

        var canvas = document.createElement("canvas"),
            context = canvas.getContext(config.type);

        canvas.setAttribute("width", config.width);
        canvas.setAttribute("height", config.height);

        if (config.matchDimensions) {
            canvas.style.width = config.width + "px";
            canvas.style.height = config.height + "px";
        }

        this.raw.canvas[config.name] = {
            element: canvas,
            config: config,
            ctx: context
        }
        
        pm.setContext.call(this, config.name)
        console.log(this);
        return this;
    }
    cp.element = function () {
        return this.raw.canvas[this.current.name].element;
    }
    cp.clear = function () {
        var c = this.current.c(),
            ctx = c.ctx,
            config = c.config;
        if (arguments.length == 0) ctx.clearRect(0,0,config.width,config.height);
        else ctx.clearRect.apply(ctx, arguments);

        return this;
    }
    cp.plot = function (name, action) {
        this.raw.plots[name] = action;
        return this;
    }
    cp.print = function (name, args) {
        if(!this.raw.plots[name]) throw new Error("plot doesn't exist in this context");
        else { 
            this.raw.plots[name].apply(this, args);
            return this;
        } 
    }
    cp.bitmap = function () {
        var $this = this;
        function switchContext (id) {
            ctx = (!id) ? pm.getContext(). : this.data().vctx[id];
            return this
        }
        return {
            create: function (name, opts, cmd) {

                var tmp = document.createElement('canvas');
                tmp.width = opts.width; tmp.height = opts.height;
                this.raw.vctx[name] = tmp.getContext("2d");
                return this
            },
            use: function (name, cmd) {
                switchContext(name);
                cmd.call($this)
                return this
            },
            done: function () {
                switchContext();
                return this
            }
        }
    }
    cp.grid = function (id) {
        var $this = this,
            grids = this.raw.grids,
            _id = (id) ? id : null
        function add (id, grid) {
            grids[id] = grid;
        }
        return {
            get: function(id) {
                var tgt = (id) ? id : _id;
                return grids[tgt];
            },
            build: function (id, width, height, size) {

                _id = id;

                var grid = {
                    size: size,
                    nRow: Math.ceil(width / size),
                    nCol: Math.ceil(height / size),
                    num: 0,
                    blocks: []
                }
                var block = {
                    index: null,
                    col: -1,
                    row: 0,
                    x: 0,
                    y: 0
                }
                grid.num = grid.nRow * grid.nCol;

                for(var i=0; i<grid.num; i++) {
                    var b = Object.create(block);
                    b.index = i;
                    b.row = i % grid.nRow;
                    if(b.row == 0) block.col++;
                    b.x = b.row * grid.size;
                    b.y = b.col * grid.size;

                    grid.blocks[i] = b;
                }

                add(id, grid);
                return this
            },
            use: function (cmd) {
                this.get().blocks.forEach(function (item, index) {
                    cmd.apply($this, [item, grids, index])
                })
                return this
            },
            done: function () { return $this }
        }
    }

    /** 
     * Private Methods
     */
    var pm = {
        setContext: function (target) {
            this.current.name = target;
        },
        getContext: function (target) {
            if(target && this.raw.canvas.hasOwnProperty(target)) return this.raw.canvas[target].ctx;
            else return this.raw.canvas[this.current.name].ctx;
        },
        getCanvasApi: function (target) {
            if(target && this.raw.canvas.hasOwnProperty(target)) return this.raw.canvas[target]
            else return this.raw.canvas[this.current.name]
        }
    }
    /**
     * shapes lib
     */
    var shapes = {
        rect: function (tx, ty, ox, oy, opts) {
            this.rect({
                fill: [tx + ox, ty + oy, opts.dimensions.w, opts.dimensions.h]
            })
        },
        circ: function (tx, ty, ox, oy, opts) {
            this.circ({
                x: tx + (opts.dimensions.w / 2) + ox,
                y: ty + (opts.dimensions.h / 2) + oy,
                r: opts.dimensions.w / 2,
                fill: opts.style
            })
        }
    }

    Global.CAD = new Canvas();

})(window);

document.body.appendChild(CAD.create().element());

console.log(CAD.draw().clear().done())

