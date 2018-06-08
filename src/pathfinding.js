
import { MinHeap } from '../node_modules/heap-tree/heaptree.js';

export class GridPath {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.len = width * height;
        this.startI = null;
        this.goalI = null;
        this.workingNodes = [];
    }

    find(startI, goalI, evaluator) {
        this.startI = startI;
        this.goalI = goalI;

        const closedSet = {};

        const cameFrom = {};

        const gScore = {};
        gScore[startI] = 0;

        const fScore = {};
        const openSet = new MinHeap(index => fScore[index] || Infinity);
        fScore[startI] = this.heuristicCostEstimateSquared(startI, goalI);
        openSet.push(startI);

        return whileLoopFunc.bind(this);

        function whileLoopFunc() {
            this.workingNodes = [];
            if (openSet.items.length <= 0) return null;
            const currentI = openSet.pop();

            if (currentI === goalI) {
                // done
                return this.reconstructPath(cameFrom, currentI);
            }

            closedSet[currentI] = true;
            const neighboursI = this.neighboursI(currentI);

            for (let i = 0; i < neighboursI.length; i++) {
                const neighbourI = neighboursI[i];

                if (neighbourI < 0 || neighbourI > this.len || closedSet[neighbourI] || !evaluator[neighbourI])
                    continue;

                const tentativeGscore = gScore[currentI] + 1;

                if (!fScore[neighbourI]) {
                    cameFrom[neighbourI] = currentI;
                    gScore[neighbourI] = tentativeGscore;
                    fScore[neighbourI] = tentativeGscore + this.heuristicCostEstimateSquared(neighbourI, goalI);
                    this.workingNodes.push(neighbourI);
                    openSet.push(neighbourI);
                }
                else {
                    if (tentativeGscore < gScore[neighbourI]) {
                        cameFrom[neighbourI] = currentI;
                        gScore[neighbourI] = tentativeGscore;
                        fScore[neighbourI] = tentativeGscore + this.heuristicCostEstimateSquared(neighbourI, goalI);
                        // update openset
                        openSet.delete(neighbourI);
                        openSet.push(neighbourI);
                        this.workingNodes.push(neighbourI);
                    }
                }
            }
        };

    }

    reconstructPath(cameFrom, currentI) {
        let counter = 0;
        const path = [];
        path.push(currentI);
        while (currentI !== this.startI) {
            path.push(currentI);
            currentI = cameFrom[currentI];
            if (counter++ > 999999) return null;
        }
        path.push(this.startI);
        let nodesI = new Array(path.length);
        for (let i = 0; i < path.length; i++) {
            nodesI[i] = path[path.length - 1 - i];
        }
        return nodesI;
    }

    neighboursI(nodeI) {
        // if (this.diagonal)
        //     return [
        //         nodeI - this.width,
        //         nodeI - this.width + 1,
        //         nodeI + 1,
        //         nodeI + this.width + 1,
        //         nodeI + this.width,
        //         nodeI + this.width - 1,
        //         nodeI - 1,
        //         nodeI - this.width -1,
        //     ];
        // else {
        return [
            nodeI - this.width,
            nodeI + 1,
            nodeI + this.width,
            nodeI - 1,
        ]
        // }
    }

    heuristicCostEstimateSquared(node1I, node2I) {
        return Math.pow(node2I % this.width - node1I % this.width, 2)
            + Math.pow(Math.floor(node2I / this.width) - Math.floor(node1I / this.width), 2);
    }
}
