'use client'
import { useEffect, useRef, useState } from 'react';
import Maze from '../components/maze'

export default function MazeCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const CANVASSIZE = 700;
    const MAZESIZE = 600;
    const PADDING = (CANVASSIZE - MAZESIZE)/2;
    const [maze, setMaze] = useState<Maze|null>(null);

    const initialize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        canvas.width = CANVASSIZE;
        canvas.height = CANVASSIZE;
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, canvas.width, canvas.height);

        setMaze(new Maze(5, 5, "square", ctx));
    };

    const generateOne = () => {
        if (maze) {
            maze.generateOne();
            maze.draw(PADDING, PADDING, MAZESIZE);
        }
    }

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (maze) {
            maze.draw(PADDING, PADDING, MAZESIZE);
        }
    }, [maze])


    return (
    <div className="flex flex-col items-center bg-gray-600 rounded-2xl">
        <div className="text-white bg-zinc-950 m-3 p-2 rounded-md w-auto text-center text-2xl h-fit font-bold">
            Maze Generator
        </div>
        <div className='flex flex-row'>
            <div>
                <button className='bg-gray-200 m-5 w-16 h-16 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors'
                 onClick={initialize}>
                    <div className='w-6 h-6 bg-gray-900 rounded-md hover:rounded-none transition-transform'></div>
                </button>
            </div>
            <canvas ref={canvasRef} className="m-3 rounded-3xl">
            </canvas>
            <div>
                <button className='bg-gray-200 m-5 w-16 h-16 pl-1 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors'
                 onClick={generateOne}>
                    <div className='w-0 h-0 border-t-[16px] border-t-transparent border-l-[27px] border-l-black border-b-[16px] border-b-transparent'></div>
                </button>
            </div>
        </div>
    </div>
    )
}