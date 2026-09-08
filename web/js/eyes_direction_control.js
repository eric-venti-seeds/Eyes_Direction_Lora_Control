import { app } from "/scripts/app.js";

const MIN_CANVAS_PX = 120;
const MAX_CANVAS_PX = 600;
const DEFAULT_CANVAS_PX = 200;
const SIDE_MARGIN = 40;
const TOP_MARGIN = 16;
const BUTTON_H = 24;
const BUTTON_GAP = 6;

app.registerExtension({
    name: "EyesDirectionControl.Widget",
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "EyesDirectionControl") return;

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;

            const node = this;
            const xWidget = node.widgets.find((w) => w.name === "x");
            const yWidget = node.widgets.find((w) => w.name === "y");
            if (!xWidget || !yWidget) return r;

            let canvasPx = DEFAULT_CANVAS_PX;

            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.flexDirection = "column";
            wrap.style.alignItems = "center";
            wrap.style.justifyContent = "center";
            wrap.style.width = "100%";
            wrap.style.boxSizing = "border-box";
            wrap.style.padding = "4px 0";
            wrap.style.overflow = "hidden";

            const canvas = document.createElement("canvas");
            canvas.style.cursor = "crosshair";
            canvas.style.background = "#fff";
            wrap.appendChild(canvas);

            const centerBtn = document.createElement("button");
            centerBtn.textContent = "Center";
            centerBtn.style.marginTop = BUTTON_GAP + "px";
            centerBtn.style.height = BUTTON_H + "px";
            centerBtn.style.width = "100%";
            centerBtn.style.maxWidth = "260px";
            centerBtn.style.cursor = "pointer";
            centerBtn.style.borderRadius = "4px";
            centerBtn.style.border = "1px solid #555";
            centerBtn.style.background = "#3a3a3a";
            centerBtn.style.color = "#ddd";
            wrap.appendChild(centerBtn);

            const ctx = canvas.getContext("2d");

            function draw() {
                const size = canvasPx;
                const ratio = size / 1024;
                const dotR = Math.max(3, 85 * ratio);
                const border = Math.max(2, Math.round(6 * ratio));
                const frameSize = size * (580 / 1024);
                const frameMargin = size * ((1024 - 580) / 2 / 1024);

                ctx.clearRect(0, 0, size, size);
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, size, size);
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = border;
                ctx.strokeRect(
                    frameMargin + border / 2,
                    frameMargin + border / 2,
                    frameSize - border,
                    frameSize - border
                );

                const px = xWidget.value * size;
                const py = yWidget.value * size;
                ctx.beginPath();
                ctx.arc(px, py, dotR, 0, Math.PI * 2);
                ctx.fillStyle = "#ff0000";
                ctx.fill();
            }

            function resizeCanvas() {
                const avail = Math.round(node.size[0] - SIDE_MARGIN);
                canvasPx = Math.min(MAX_CANVAS_PX, Math.max(MIN_CANVAS_PX, avail));
                canvas.width = canvasPx;
                canvas.height = canvasPx;
                canvas.style.width = canvasPx + "px";
                canvas.style.height = canvasPx + "px";
                const totalH = canvasPx + TOP_MARGIN + BUTTON_GAP + BUTTON_H;
                wrap.style.height = totalH + "px";
                if (domWidget) domWidget.computeSize = () => [0, totalH];
                draw();
            }

            function setValues(nx, ny) {
                nx = Math.min(1, Math.max(0, nx));
                ny = Math.min(1, Math.max(0, ny));
                xWidget.value = nx;
                yWidget.value = ny;
                if (xWidget.callback) xWidget.callback(nx, canvas, node);
                if (yWidget.callback) yWidget.callback(ny, canvas, node);
                draw();
                node.setDirtyCanvas(true, true);
            }

            centerBtn.addEventListener("click", (e) => {
                setValues(0.5, 0.5);
                e.stopPropagation();
            });
            centerBtn.addEventListener("pointerdown", (e) => e.stopPropagation());

            let dragging = false;
            function pointFromEvent(e) {
                const rect = canvas.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width;
                const ny = (e.clientY - rect.top) / rect.height;
                return [nx, ny];
            }

            canvas.addEventListener("pointerdown", (e) => {
                dragging = true;
                setValues(...pointFromEvent(e));
                canvas.setPointerCapture(e.pointerId);
                e.stopPropagation();
            });
            canvas.addEventListener("pointermove", (e) => {
                if (!dragging) return;
                setValues(...pointFromEvent(e));
                e.stopPropagation();
            });
            canvas.addEventListener("pointerup", (e) => {
                dragging = false;
                canvas.releasePointerCapture(e.pointerId);
                e.stopPropagation();
            });

            const origXCallback = xWidget.callback;
            xWidget.callback = function (v, ...rest) {
                if (origXCallback) origXCallback.call(this, v, ...rest);
                draw();
            };
            const origYCallback = yWidget.callback;
            yWidget.callback = function (v, ...rest) {
                if (origYCallback) origYCallback.call(this, v, ...rest);
                draw();
            };

            const domWidget = node.addDOMWidget("point_picker_ui", "custom", wrap, {
                serialize: false,
                hideOnZoom: false,
            });

            node._pointPickerResize = resizeCanvas;

            const minWidth = DEFAULT_CANVAS_PX + SIDE_MARGIN;
            node.setSize([Math.max(node.size[0], minWidth), node.size[1]]);
            resizeCanvas();

            return r;
        };

        const onResize = nodeType.prototype.onResize;
        nodeType.prototype.onResize = function (size) {
            const r = onResize ? onResize.apply(this, arguments) : undefined;
            if (this._pointPickerResize) this._pointPickerResize();
            return r;
        };
    },
});
