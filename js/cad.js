(function(){

    function cad (config) {;

        var api, 
            canvas, 
            ctx,
            in_path = false;
        
        var segmentTypes = {
            lineTo: 1,
            arc: 1,
            rect: 1,
            quadraticCurveTo: 1,
            bezierCurveTo: 1
        };

        // process the options
        config = config || {};
        config.width = ("width" in config) ? config.width : 300;
        config.height = ("height" in config) ? config.height : 150;
        config.matchDimensions = ("matchDimensions" in config) ? config.matchDimensions : true;
        config.type = (config.type == "webgl") ? "experimental-webgl" : "2d";

        canvas = document.createElement("canvas");
        canvas.setAttribute("width", config.width);
        canvas.setAttribute("height", config.height);

        if (config.matchDimensions) {
            canvas.style.width = config.width + "px";
            canvas.style.height = config.height + "px";
        }

        ctx = canvas.getContext(config.type);

        function element() {
            return canvas;
        }

        function clear() {
            if (arguments.length == 0) ctx.clearRect(0,0,config.width,config.height);
            else ctx.clearRect.apply(ctx, arguments);

            return api;
        }

        function setStyles(styles) {
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

            return api;
        }

        function startPath(x, y) {
            if (in_path) throw new Error("A path is still currently being defined. End it first.");

            ctx.beginPath();
            if (x != null && y != null) ctx.moveTo(x, y);
            in_path = true;

            return api;
        }

        function defineSegments(segments) {
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

            return api;
        }

        function endPath(opts) {
            if (!in_path) throw new Error("No path currently active.");
            opts = opts || {};

            if (opts.close) ctx.closePath();
            if (opts.fill) ctx.fill();
            if (opts.stroke) ctx.stroke();

            in_path = false;

            return api;
        }

        function rect(opts) {
            opts = opts || {};

            if (opts.path) defineSegments([ {rect: opts.path} ]);
            else if (opts.stroke) ctx.strokeRect.apply(ctx, opts.stroke);
            else if (opts.fill) ctx.fillRect.apply(ctx, opts.fill);

            return api;
        }

        function text(opts) {
            opts = opts || {};

            if (opts.stroke) ctx.strokeText.apply(ctx, opts.stroke);
            else if (opts.fill) ctx.fillText.apply(ctx, opts.fill);

            return api;
        }

        function transform(opts) {
            opts = opts || {};

            if ("translate" in opts) ctx.translate(opts.translate.x, opts.translate.y);
            if ("scale" in opts) ctx.scale(opts.scale.x, opts.scale.y);
            if ("rotate" in opts) ctx.rotate(opts.rotate);

            return api;
        }

        function shiftPathTo(x,y) { ctx.moveTo(x, y); return api; }
        function pushState() { ctx.save(); return api; }
        function popState() { ctx.restore(); return api; }
        function clip() { ctx.clip(); return api; }

        function getImage(opts) {
            var tmp, 
                tmp_c;

            opts = opts || {};

            if (opts.bitmap) return ctx.getImageData(opts.bitmap.x,opts.bitmap.y,opts.bitmap.width,opts.bitmap.height);
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
        }

        function putImage(src, opts) {
            var args;
            opts = opts || {};

            if (opts.bitmap) ctx.putImageData(src,opts.bitmap.x || 0, opts.bitmap.y || 0);
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
            return api;
        }

        api = {
            __raw__: canvas,
            __raw__ctx__: ctx,
            element: element,
            clear: clear,
            setStyles: setStyles,
            startPath: startPath,
            defineSegments: defineSegments,
            endPath: endPath,
            rect: rect,
            text: text,
            transform: transform,
            shiftPathTo: shiftPathTo,
            pushState: pushState,
            popState: popState,
            getImage: getImage,
            putImage: putImage,
            clip: clip,
            info: config
        };

        return api;
    };
    window.cad = cad;
})();