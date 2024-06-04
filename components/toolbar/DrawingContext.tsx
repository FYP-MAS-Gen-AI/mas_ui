import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface DrawingCanvasProps {
    imageUrl: string | null;
    brushSize: number;
    tool: string;
}

const DrawingCanvas = forwardRef(({ imageUrl, brushSize, tool }: DrawingCanvasProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawingRef = useRef<boolean>(false);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);

    const initializeCanvas = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (canvas && img) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctxRef.current = ctx;
                ctx.lineWidth = brushSize;
                ctx.lineCap = 'round';
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setToolAndBrush(ctx);
            }
        }
    };

    const setToolAndBrush = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = tool === 'brush' ? 'white' : 'rgba(0,0,0,1)'; // Use white for brush, transparent for eraser
        ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
    };

    useEffect(() => {
        initializeCanvas();
    }, [imageUrl]);

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.lineWidth = brushSize;
        }
    }, [brushSize]);

    useEffect(() => {
        if (ctxRef.current) {
            setToolAndBrush(ctxRef.current);
        }
    }, [tool]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (tool === 'none') return;
        const { offsetX, offsetY } = e.nativeEvent;
        if (ctxRef.current) {
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(offsetX, offsetY);
            isDrawingRef.current = true;
        }
    };

    const finishDrawing = () => {
        if (isDrawingRef.current && ctxRef.current) {
            ctxRef.current.closePath();
            isDrawingRef.current = false;
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current || !ctxRef.current) return;
        const { offsetX, offsetY } = e.nativeEvent;
        ctxRef.current.lineTo(offsetX, offsetY);
        ctxRef.current.stroke();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setMousePosition({ x: offsetX, y: offsetY });
    };

    useImperativeHandle(ref, () => ({
        getCanvasDataUrl: () => {
            if (canvasRef.current) {
                return canvasRef.current.toDataURL('image/png');
            }
            return '';
        }
    }));

    return (
        <div className="relative">
            {imageUrl && <img ref={imgRef} src={imageUrl} alt="Selected" className="w-full" crossOrigin="anonymous" onLoad={initializeCanvas} />}
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ background: 'transparent' }}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={(e) => { draw(e); handleMouseMove(e); }}
            />
            {mousePosition && tool !== 'none' && (
                <div
                    style={{
                        position: 'absolute',
                        top: mousePosition.y - brushSize / 2,
                        left: mousePosition.x - brushSize / 2,
                        width: brushSize,
                        height: brushSize,
                        borderRadius: '50%',
                        border: '1px solid black',
                        pointerEvents: 'none'
                    }}
                />
            )}
        </div>
    );
});

export default DrawingCanvas;
