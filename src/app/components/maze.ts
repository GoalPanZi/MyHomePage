import next from "next";

export default class Maze{
    rows: number;
    cols: number;
    total_cell_count: number;
    grid: MazeCell[];
    ctx: CanvasRenderingContext2D | null = null;
    start: number;
    current: MazeCell;
    path: number[];
    visited: number[];

    constructor(rows: number, cols: number, type = "square", ctx: CanvasRenderingContext2D | null) {
        this.rows = rows;
        this.cols = cols;
        this.total_cell_count = rows*cols;
        this.grid = [];
        switch (type) {
            case "square":
                for (let i = 0 ; i < this.total_cell_count; i++){
                    this.grid.push(new MazeCellSquare(i));
                }
                for (let j = 0; j < rows-1; j++) {
                    for (let i = 0; i < cols-1; i++) {
                        let index = i + j*cols;
                        this.grid[index].connect(1, this.grid[index+1],3);
                        this.grid[index].connect(2, this.grid[index+cols],0);
                    }
                }
            default:
                // do nothing
        }
        this.ctx = ctx;
        this.start = 0;
        this.current = this.grid[this.start];
        this.path = [this.start];
        this.visited = [this.start];
    }

    generateOne() {
        if (this.visited.length == this.total_cell_count) {
            return;
        }
        let movable = this.current.getMovable(this.visited);
        while (movable.length == 0) {
            this.current = this.grid[this.path.pop()!];
            movable = this.current.getMovable(this.visited);
        }
        let wallIndex = movable[Math.floor(Math.random()*movable.length)];
        this.current.openWall(wallIndex);
        this.current = this.current.connected[wallIndex]!;
        this.path.push(this.current.index);
    }

    draw(left : number, top : number, mazeSize: number) {
        if (this.ctx == null) {
            return;
        }
        let cellSize = mazeSize / this.rows;
        for (let j =0 ; j< this.rows; j++) {
            for (let i =0; i < this.cols; i++) {
                this.grid[i + j*this.cols].draw(this.ctx, cellSize, left + i*cellSize, top + j*cellSize);
            }
        }

        //Drawing current position
        let sx = left + cellSize * (this.current.index%this.cols + 0.5);
        let sy = top + cellSize * (Math.floor(this.current.index/this.cols) + 0.5);
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.ellipse(sx, sy, cellSize * 0.25, cellSize * 0.25, 0, 0, 2*Math.PI);
        this.ctx.fill();


        // Drawing outer Box
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.lineJoin = "round";
        this.ctx.strokeRect(left, top, mazeSize, mazeSize);
    }
}

class MazeCell{
    points: [number, number][]; // Vertex of each cell clockwise, Top Left corner = [0,0], Waill i of Mazecell = [points[i], points[i+1]]
    connected: (MazeCell | null)[]; // Other Mazecell connected at i-th edge, -1 by default
    blocked: boolean[]; // index of other Mazecell blocked by wall at i-th edge, true by default
    index : number;

    constructor(points: [number, number][], index: number) {
        this.points = points
        this.connected = []
        this.blocked = []
        for (let i = 0; i < points.length ; i++) {
            this.connected.push(null)
            this.blocked.push(true)
        }
        this.index = index
    }

    connect(wall: number, otherCell: MazeCell, wallOther: number) {
        this.connected[wall] = otherCell;
        otherCell.connected[wallOther] = this;
    }

    draw(ctx: CanvasRenderingContext2D, cellSize : number, left: number, top : number) {
        ctx.strokeStyle = "black";
        ctx.lineJoin="round";
        ctx.lineWidth = 2;
        for (let i = 0; i < this.points.length; i++) {
            let cx = this.points[i][0] * cellSize;
            let cy = this.points[i][1] * cellSize;
            let nx = this.points[(i+1)%this.points.length][0] * cellSize;
            let ny = this.points[(i+1)%this.points.length][1] * cellSize;
            if (this.blocked[i]) {
                ctx.beginPath();
                ctx.moveTo(left + cx, top+ cy);
                ctx.lineTo(left + nx, top + ny);
                ctx.stroke();
            }
        }
    }

    getMovable(visited: number[]) {
        let blockedWall = [];
        for (let i = 0; i < this.connected.length; i++) {
            if (this.blocked[i] && this.connected[i]!=null && !visited.includes(this.connected[i]!.index)) {
                blockedWall.push(i);
            }
        }
        return blockedWall;
    }

    openWall(index: number) {
        this.blocked[index] = true;
    }
}

class MazeCellSquare extends MazeCell{
    constructor(index: number) {
        let points: [number,number][]
        points = []
        points.push([0,0])
        points.push([1,0])
        points.push([1,1])
        points.push([0,1])
        super(points, index)
    }
}