export default class Maze{
    rows: number;
    cols: number;
    total_cell_count: number;
    grid: MazeCell[];

    constructor(rows: number, cols: number, type = "square") {
        this.rows = rows;
        this.cols = cols;
        this.total_cell_count = rows*cols;
        this.grid = [];
        switch (type) {
            case "square":
                for (let i = 0 ; i < this.total_cell_count; i++){
                    this.grid.push(new MazeCellSquare(i));
                }
            default:
                // do nothing
        }
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