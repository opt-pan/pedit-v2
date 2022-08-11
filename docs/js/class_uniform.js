class Puzzle_truncated_square extends Puzzle {
    constructor(nx, ny, size) {
        //盤面情報
        super('truncated_square');
        this.nx = nx;
        this.ny = ny;
        this.nx0 = this.nx + 2;
        this.ny0 = this.ny * 2 + 2;
        this.margin = -1; //for arrow of number pointing outside of the grid

        this.width0 = this.nx + 6;
        this.height0 = this.ny;
        this.width_c = this.width0;
        this.height_c = this.height0;
        this.width = this.width_c;
        this.height = this.height_c;
        this.canvasx = this.width_c * this.size;
        this.canvasy = this.height_c * this.size;
        this.space = [];
        this.size = size;
        this.onoff_symbolmode_list = {
            "cross": 4,
            "arrow_cross": 4,
            "arrow_fourtip": 4,
            "degital": 7,
            "degital_f": 7,
            "arrow_eight": 8,
            "arrow_fouredge_B": 8,
            "arrow_fouredge_G": 8,
            "arrow_fouredge_E": 8,
            "dice": 9,
            "polyomino": 9
        };
        this.reset();
        this.erase_buttons();
    }

    erase_buttons() {
        for (var i of this.group1) {
            document.getElementById(i).style.display = "none";
        }
        for (var i of this.group2) {
            document.getElementById(i).style.display = "none";
        }
        for (var i of this.group3) {
            document.getElementById(i).style.display = "none";
        }
        for (var i of this.group4) {
            document.getElementById(i).style.display = "none";
        }
        for (var i of this.group5) {
            document.getElementById(i).style.display = "none";
        }
    }

    create_point() {
        var k = 0,
            k0;
        var nx = this.nx0;
        var ny = this.ny0;
        var r;
        var adjacent, surround, type, use, neighbor;
        var point = [];
        adjacent = [];
        surround = [];
        neighbor = [];
        //center
        for (var j = 0; j < ny; j++) {
            for (var i = 0; i < nx; i++) {
                k0 = k;
                type = 0;
                if (i === 0 || i === nx - 1 || j === 0 || j === ny - 1) { use = -1; } else { use = 1; }
                point[k] = new Point(((i * 2 + (j % 2)) + 0.5) * this.size, (j + 0.5) * this.size, type, adjacent, surround, use, neighbor, [], 0);
                k++;
                point[k] = new Point(((i * 2 + (j % 2)) + 1.5) * this.size, (j + 0.5) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;

                type = 1;
                r = 0.5 * Math.sqrt(2) / Math.cos(2 * Math.PI / 360 * 22.5);
                for (var m = 0; m < 8; m++) {
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 45 + 22.5)), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 45 + 22.5)), type, adjacent, surround, use, neighbor);
                    point[k0].surround = point[k0].surround.concat([k]); //pushやspliceだと全てのpointが更新されてしまう
                    k++;
                }
                r = Math.sqrt(2) - 1;
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 45)), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 45)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].surround = point[k0 + 1].surround.concat([k]);
                    k++;
                }

                type = 2;
                r = 0.5 * Math.sqrt(2);
                for (var m = 0; m < 8; m++) {
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 8 * m), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 8 * m), type, adjacent, surround, use, neighbor);
                    point[k0].neighbor = point[k0].neighbor.concat([k]); //pushやspliceだとpointが全て更新されてしまう
                    if (m === 0) {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 5].neighbor = point[k - 5].neighbor.concat([k]);
                    } else {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 13].neighbor = point[k - 13].neighbor.concat([k]);
                    }
                    k++;
                }
                r = 1 - 0.5 * Math.sqrt(2);
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 4 * m), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 4 * m), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].neighbor = point[k0 + 1].neighbor.concat([k]);
                    if (m === 0) {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 9].neighbor = point[k - 9].neighbor.concat([k]);
                    } else {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 13].neighbor = point[k - 13].neighbor.concat([k]);
                    }
                    k++;
                }
            }
        }
        // 重複判定
        for (var i = 0; i < point.length; i++) {
            if (!point[i]) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j]) { continue; };
                if ((point[i].x - point[j].x) ** 2 + (point[i].y - point[j].y) ** 2 < 0.01) {
                    //surround,neighbor置換
                    for (var k = 0; k < point.length; k++) {
                        if (!point[k]) { continue; };
                        for (var n = 0; n < point[k].surround.length; n++) {
                            if (point[k].surround[n] === j) {
                                point[k].surround.splice(n, 1, i);
                            }
                        }
                        for (var n = 0; n < point[k].neighbor.length; n++) {
                            if (point[k].neighbor[n] === j) {
                                if (point[k].neighbor.indexOf(i) === -1) {
                                    point[k].neighbor.splice(n, 1, i); //無ければ置き換え
                                } else {
                                    point[k].neighbor.splice(n, 1); //あったら削除
                                }
                            }
                        }
                    }
                    for (var n = 0; n < point[j].neighbor.length; n++) { //削除された点のneighborを移し替え
                        if (point[i].neighbor.indexOf(point[j].neighbor[n]) === -1) {
                            point[i].neighbor = point[i].neighbor.concat([point[j].neighbor[n]]);
                        }
                    }
                    if (point[i].use === -1 && point[j].use === 1) { point[i].use = 1; };
                    delete point[j];
                    //置換ここまで
                }
            }
        }
        // adjacent作成
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 0) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 1) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 1) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        this.point = point;
    }

    reset_frame() {
        this.create_point();
        this.space = [];

        this.centerlist = [];
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].use === 1 && this.point[i].type === 0) {
                this.centerlist.push(i);
            }
        }
        this.search_center();
        this.width_c = this.width;
        this.height_c = this.height;
        this.center_n0 = this.center_n;
        this.canvasxy_update();
        this.canvas_size_setting();
        this.point_move((this.canvasx * 0.5 - this.point[this.center_n].x + 0.5), (this.canvasy * 0.5 - this.point[this.center_n].y + 0.5), this.theta);

        this.make_frameline();
        this.cursol = this.centerlist[0];
        this.cursolS = 4 * (this.nx0) * (this.ny0) + 4 + 4 * (this.nx0);
    }

    search_center() {
        var xmax = 0,
            xmin = 1e5;
        var ymax = 0,
            ymin = 1e5;
        for (var i of this.centerlist) {
            if (this.point[i].x > xmax) { xmax = this.point[i].x; }
            if (this.point[i].x < xmin) { xmin = this.point[i].x; }
            if (this.point[i].y > ymax) { ymax = this.point[i].y; }
            if (this.point[i].y < ymin) { ymin = this.point[i].y; }
        }
        var x = (xmax + xmin) / 2;
        var y = (ymax + ymin) / 2;
        this.width = (xmax - xmin) / this.size + 2.5;
        this.height = (ymax - ymin) / this.size + 2.5;

        var min0, min = 10e6;
        var num = 0;
        for (var i in this.point) {
            min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
            if (min0 < min) {
                min = min0;
                num = i;
            }
        }
        this.center_n = parseInt(num);
    }

    type_set() {
        var type
        switch (this.mode[this.mode.qa].edit_mode) {
            case "surface":
            case "board":
                type = [0];
                break;
            case "symbol":
            case "move":
                if (document.getElementById('edge_button').textContent === "OFF") {
                    type = [0];
                } else {
                    type = [0, 1, 2];
                }
                break;
            case "number":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3") {
                    type = [4];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "9") {
                    type = [5];
                } else {
                    if (document.getElementById('edge_button').textContent === "OFF") {
                        type = [0];
                    } else {
                        type = [0, 1, 2];
                    }
                }
                break;
            case "line":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "5") {
                    type = [0, 2];
                } else {
                    type = [0];
                }
                break;
            case "lineE":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else {
                    type = [1];
                }
                break;
            case "wall":
                if (this.drawing) {
                    type = [this.point[this.last].type];
                } else {
                    type = [2];
                }
                break;
            case "cage":
                type = [4];
                break;
            case "special":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "polygon") {
                    type = [1];
                } else {
                    type = [0, 1];
                }
                break;
            case "combi":
                switch (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0]) {
                    case "tents":
                    case "linex":
                        type = [0, 2];
                        break;
                    case "edgexoi":
                        type = [0, 1, 2];
                        break;
                    case "blpo":
                    case "blwh":
                    case "battleship":
                    case "star":
                    case "magnets":
                    case "lineox":
                    case "yajilin":
                    case "hashi":
                    case "arrowS":
                    case "shaka":
                    case "numfl":
                    case "alfl":
                        type = [0];
                        break;
                    case "edgesub":
                        type = [0, 1];
                        break;
                }
                break;
        }
        return type;
    }

    recalculate_num(x, y, num) {
        var min0, min = 10e6;
        var num0 = 0;
        var r0 = 0.5 * Math.sqrt(2) / Math.cos(2 * Math.PI / 360 * 22.5);
        var r1 = Math.sqrt(2) - 1;
        if (this.point[num].type != 0) { return num; }

        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].type === 0 && this.point[i].use === 1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type2 === 0 && min0 > (r0 * this.size) ** 2) { continue; } //円形の内側に入っていなければ更新しない
                    if (this.point[i].type2 === 1 && min0 > (r1 * this.size) ** 2) { continue; }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    coord_p_edgex(x, y) {
        var min0, min = 10e6;
        var num = 0;
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.type.indexOf(this.point[i].type) != -1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type === 2 || this.point[i].type === 3) {
                        if (min0 > (0.3 * this.size) ** 2) {
                            continue;
                        }
                    }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    rotate_left() {
        this.theta = (this.theta - 45 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, -45);
        this.redraw();
    }

    rotate_right() {
        this.theta = (this.theta + 45 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, +45);
        this.redraw();
    }

    cursolcheck() {
        if (this.mode[this.mode.qa].edit_mode === "number" && this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3") {
            if (this.cursolS > 8 * (this.nx0) * (this.ny0)) {
                this.cursolS -= 4 * (this.nx0) * (this.ny0);
            }
        } else if (this.mode[this.mode.qa].edit_mode === "number" && this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "9") {
            if (this.cursolS < 8 * (this.nx0) * (this.ny0)) {
                this.cursolS += 4 * (this.nx0) * (this.ny0);
            }
        }
    }

    key_arrow(key_code) {}

    direction_arrow8(x, y, x0, y0) {
        var angle = Math.atan2(y - y0, x - x0) * 360 / 2 / Math.PI + 180;
        if (this.reflect[0] === -1) { angle = (180 - angle + 360) % 360; }
        if (this.reflect[1] === -1) { angle = (360 - angle + 360) % 360; }
        angle = (angle - this.theta + 360) % 360;
        angle -= 180;
        var a;
        if (angle < -157.5 || angle > 157.5) {
            a = 1;
        } else if (angle > -157.5 && angle < -112.5) {
            a = 4;
        } else if (angle > -112.5 && angle < -67.5) {
            a = 0;
        } else if (angle > -67.5 && angle < -22.5) {
            a = 5;
        } else if (angle > -22.5 && angle < 22.5) {
            a = 2;
        } else if (angle > 22.5 && angle < 67.5) {
            a = 7;
        } else if (angle > 67.5 && angle < 112.5) {
            a = 3;
        } else if (angle > 112.5 && angle < 157.5) {
            a = 6;
        }
        return a;
    }

    ////////////////draw/////////////////////

    draw() {
        this.draw_surface("pu_q");
        this.draw_surface("pu_a");
        //    this.draw_squareframe("pu_q");
        //  this.draw_squareframe("pu_a");
        //    this.draw_thermo("pu_q");
        //    this.draw_thermo("pu_a");
        //    this.draw_arrowsp("pu_q");
        //  this.draw_arrowsp("pu_a");
        this.draw_symbol("pu_q", 1);
        this.draw_symbol("pu_a", 1);
        //  this.draw_wall("pu_q");
        //  this.draw_wall("pu_a");
        this.draw_frame();
        this.draw_polygonsp("pu_q");
        this.draw_polygonsp("pu_a");
        this.draw_freeline("pu_q");
        this.draw_freeline("pu_a");
        this.draw_line("pu_q");
        this.draw_line("pu_a");
        //this.draw_direction("pu_q");
        //this.draw_direction("pu_a");
        this.draw_lattice();
        this.draw_frameBold();
        this.draw_symbol("pu_q", 2);
        this.draw_symbol("pu_a", 2);
        //this.draw_cage("pu_q");
        //this.draw_cage("pu_a");
        this.draw_number("pu_q");
        this.draw_number("pu_a");
        this.draw_cursol();
        this.draw_freecircle();

        //this.draw_point();
    }

    draw_point() {
        set_font_style(this.ctx, (0.2 * this.size).toString(), 1);
        for (var i in this.point) {
            if (this.point[i].type === 0) {
                this.ctx.fillStyle = "#000";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 1) {
                this.ctx.fillStyle = "blue";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 2) {
                this.ctx.fillStyle = "red";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 3) {
                this.ctx.fillStyle = "orange";
                //this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 4) {
                this.ctx.fillStyle = "green";
                //this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 5) {
                this.ctx.fillStyle = "green";
                //this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            }
            this.ctx.beginPath();
            //this.ctx.arc(this.point[i].x,this.point[i].y,2.5,0,2*Math.PI,true);
            this.ctx.fill();
        }
    }

    draw_lattice() {
        if (this.mode.grid[1] === "1") {
            this.ctx.fillStyle = "#000";
            var verticelist = [];
            for (var i = 0; i < this.centerlist.length; i++) {
                for (var j = 0; j < this.point[this.centerlist[i]].surround.length; j++) {
                    verticelist.push(this.point[this.centerlist[i]].surround[j]);
                }
            }
            verticelist = Array.from(new Set(verticelist));
            for (var i = 0; i < verticelist.length; i++) {
                this.ctx.beginPath();
                this.ctx.arc(this.point[verticelist[i]].x, this.point[verticelist[i]].y, 2.1, 0, 2 * Math.PI, true);
                this.ctx.fill();
            }
        }
    }

    draw_surface(pu, num = "") {
        if (num) {
            var keys = [],
                key0 = num + "";
            if (this[pu].surface[key0]) {
                keys.push(key0);
            }
            for (var i = 0; i < this.point[num].adjacent.length; i++) {
                key0 = this.point[num].adjacent[i] + "";
                if (keys.indexOf(key0) === -1 && this[pu].surface[key0]) {
                    keys.push(key0);
                }
            }
        } else {
            var keys = Object.keys(this[pu].surface);
        }
        for (var k = 0; k < keys.length; k++) {
            var i = keys[k];
            set_surface_style(this.ctx, this[pu].surface[i]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.point[this.point[i].surround[0]].x, this.point[this.point[i].surround[0]].y);
            for (var j = 1; j < this.point[i].surround.length; j++) {
                this.ctx.lineTo(this.point[this.point[i].surround[j]].x, this.point[this.point[i].surround[j]].y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    draw_polygon(ctx, x, y, r, n, th) {
        ctx.LineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - r * Math.cos(th * (Math.PI / 180)) * this.size, y - r * Math.sin(th * (Math.PI / 180)) * this.size);
        for (var i = 0; i < n - 1; i++) {
            th += 360 / n;
            ctx.lineTo(x - r * Math.cos(th * (Math.PI / 180)) * this.size, y - r * Math.sin(th * (Math.PI / 180)) * this.size);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    draw_direction(pu) {
        for (var i = 0; i < this[pu].direction.length; i++) {
            if (this[pu].direction[i][0]) {
                this.ctx.setLineDash([]);
                this.ctx.lineCap = "square";
                this.ctx.strokeStyle = "#999";
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(this.point[this[pu].direction[i][0]].x, this.point[this[pu].direction[i][0]].y);
                for (var j = 1; j < this[pu].direction[i].length - 1; j++) {
                    this.ctx.lineTo(this.point[this[pu].direction[i][j]].x, this.point[this[pu].direction[i][j]].y);
                }
                this.ctx.stroke();

                j = this[pu].direction[i].length - 1;
                this.ctx.lineJoin = "bevel";
                this.ctx.beginPath();
                this.ctx.arrow(this.point[this[pu].direction[i][j - 1]].x, this.point[this[pu].direction[i][j - 1]].y,
                    this.point[this[pu].direction[i][j]].x, this.point[this[pu].direction[i][j]].y, [-0.00001, 0, -0.25 * this.size, 0.25 * this.size]);
                this.ctx.stroke();
                this.ctx.lineJoin = "miter";
            }
        }
    }

    draw_line(pu) {
        for (var i in this[pu].line) {
            if (this[pu].line[i] === 98) {
                var r = 0.2;
                var x = this.point[i].x;
                var y = this.point[i].y;
                set_line_style(this.ctx, 98);
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(45 * (Math.PI / 180)) * this.size, y + r * Math.sin(45 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(225 * (Math.PI / 180)) * this.size, y + r * Math.sin(225 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(135 * (Math.PI / 180)) * this.size, y + r * Math.sin(135 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(315 * (Math.PI / 180)) * this.size, y + r * Math.sin(315 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
            } else {
                set_line_style(this.ctx, this[pu].line[i]);
                var i1 = i.split(",")[0];
                var i2 = i.split(",")[1];
                this.ctx.beginPath();
                if (this[pu].line[i] === 40) {
                    var r = 0.8;
                    var x1 = r * this.point[i1].x + (1 - r) * this.point[i2].x;
                    var y1 = r * this.point[i1].y + (1 - r) * this.point[i2].y;
                    var x2 = (1 - r) * this.point[i1].x + r * this.point[i2].x;
                    var y2 = (1 - r) * this.point[i1].y + r * this.point[i2].y;
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                } else if (this[pu].line[i] === 30) {
                    var r = 0.15 * this.size;
                    var dx = this.point[i1].x - this.point[i2].x;
                    var dy = this.point[i1].y - this.point[i2].y;
                    var d = Math.sqrt(dx ** 2 + dy ** 2);
                    this.ctx.moveTo(this.point[i1].x - r / d * dy, this.point[i1].y + r / d * dx);
                    this.ctx.lineTo(this.point[i2].x - r / d * dy, this.point[i2].y + r / d * dx);
                    this.ctx.stroke();
                    this.ctx.moveTo(this.point[i1].x + r / d * dy, this.point[i1].y - r / d * dx);
                    this.ctx.lineTo(this.point[i2].x + r / d * dy, this.point[i2].y - r / d * dx);
                } else {
                    if (this.point[i1].type === 2 || this.point[i1].type === 3) { //for centerline
                        this.ctx.moveTo(this.point[i2].x, this.point[i2].y);
                        this.ctx.lineTo((this.point[i1].x + this.point[i2].x) * 0.5, (this.point[i1].y + this.point[i2].y) * 0.5);
                        this.ctx.stroke();
                        this.ctx.lineCap = "butt";
                    } else if (this.point[i2].type === 2 || this.point[i2].type === 3) {
                        this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
                        this.ctx.lineTo((this.point[i1].x + this.point[i2].x) * 0.5, (this.point[i1].y + this.point[i2].y) * 0.5);
                        this.ctx.stroke();
                        this.ctx.lineCap = "butt";
                    }
                    this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
                    this.ctx.lineTo(this.point[i2].x, this.point[i2].y);
                }
                this.ctx.stroke();
            }
        }
        for (var i in this[pu].lineE) {
            if (this[pu].lineE[i] === 98) {
                var r = 0.2;
                var x = this.point[i].x;
                var y = this.point[i].y;
                set_line_style(this.ctx, 98);
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(45 * (Math.PI / 180)) * this.size, y + r * Math.sin(45 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(225 * (Math.PI / 180)) * this.size, y + r * Math.sin(225 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(135 * (Math.PI / 180)) * this.size, y + r * Math.sin(135 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(315 * (Math.PI / 180)) * this.size, y + r * Math.sin(315 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
            } else {
                set_line_style(this.ctx, this[pu].lineE[i]);
                var i1 = i.split(",")[0];
                var i2 = i.split(",")[1];
                this.ctx.beginPath();
                if (this[pu].lineE[i] === 30) {
                    var r = 0.15 * this.size;
                    var dx = this.point[i1].x - this.point[i2].x;
                    var dy = this.point[i1].y - this.point[i2].y;
                    var d = Math.sqrt(dx ** 2 + dy ** 2);
                    this.ctx.moveTo(this.point[i1].x - r / d * dy, this.point[i1].y + r / d * dx);
                    this.ctx.lineTo(this.point[i2].x - r / d * dy, this.point[i2].y + r / d * dx);
                    this.ctx.stroke();
                    this.ctx.moveTo(this.point[i1].x + r / d * dy, this.point[i1].y - r / d * dx);
                    this.ctx.lineTo(this.point[i2].x + r / d * dy, this.point[i2].y - r / d * dx);
                } else {
                    this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
                    this.ctx.lineTo(this.point[i2].x, this.point[i2].y);
                }
                this.ctx.stroke();
            }
        }
    }

    draw_freeline(pu) {
        /*freeline*/
        for (var i in this[pu].freeline) {
            set_line_style(this.ctx, this[pu].freeline[i]);
            var i1 = i.split(",")[0];
            var i2 = i.split(",")[1];
            this.ctx.beginPath();
            if (this[pu].freeline[i] === 30) {
                var r = 0.15 * this.size;
                var dx = this.point[i1].x - this.point[i2].x;
                var dy = this.point[i1].y - this.point[i2].y;
                var d = Math.sqrt(dx ** 2 + dy ** 2);
                this.ctx.moveTo(this.point[i1].x - r / d * dy, this.point[i1].y + r / d * dx);
                this.ctx.lineTo(this.point[i2].x - r / d * dy, this.point[i2].y + r / d * dx);
                this.ctx.stroke();
                this.ctx.moveTo(this.point[i1].x + r / d * dy, this.point[i1].y - r / d * dx);
                this.ctx.lineTo(this.point[i2].x + r / d * dy, this.point[i2].y - r / d * dx);
            } else {
                this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
                this.ctx.lineTo(this.point[i2].x, this.point[i2].y);
            }
            this.ctx.stroke();
        }
    }

    draw_wall(pu) {
        for (var i in this[pu].wall) {
            set_line_style(this.ctx, this[pu].wall[i]);
            this.ctx.lineCap = "butt";
            var i1 = i.split(",")[0];
            var i2 = i.split(",")[1];
            this.ctx.beginPath();
            this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
            this.ctx.lineTo(this.point[i2].x, this.point[i2].y);
            this.ctx.stroke();
        }
    }

    draw_symbol(pu, layer) {
        /*symbol_layer*/
        var p_x, p_y;
        for (var i in this[pu].symbol) {
            if (i.slice(-1) === "E") { //辺モードでの重ね書き
                p_x = this.point[i.slice(0, -1)].x;
                p_y = this.point[i.slice(0, -1)].y;
            } else {
                p_x = this.point[i].x;
                p_y = this.point[i].y;
            }
            if (this[pu].symbol[i][2] === layer) {
                this.draw_symbol_select(this.ctx, p_x, p_y, this[pu].symbol[i][0], this[pu].symbol[i][1]);
            }
        }
    }

    draw_number(pu) {
        /*number*/
        var p_x, p_y;
        for (var i in this[pu].number) {
            if (i.slice(-1) === "E") { //辺モードでの重ね書き
                p_x = this.point[i.slice(0, -1)].x;
                p_y = this.point[i.slice(0, -1)].y;
            } else {
                p_x = this.point[i].x;
                p_y = this.point[i].y;
            }
            switch (this[pu].number[i][2]) {
                case "1": //normal
                    this.draw_numbercircle(pu, i, p_x, p_y, 0.42);
                    set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.text(this[pu].number[i][0], p_x, p_y + 0.06 * this.size, this.size * 0.8);
                    break;
                case "2": //arrow
                    var arrowlength = 0.7;
                    this.draw_numbercircle(pu, i, p_x, p_y, 0.42);
                    set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                    var direction = {
                        "_0": 90,
                        "_1": 180,
                        "_2": 0,
                        "_3": 270,
                        "_4": 135,
                        "_5": 45,
                        "_6": 225,
                        "_7": 315,
                    }
                    var direction = (direction[this[pu].number[i][0].slice(-2)] - this.theta + 360) % 360;
                    if (this.reflect[0] === -1) { direction = (180 - direction + 360) % 360; }
                    if (this.reflect[1] === -1) { direction = (360 - direction + 360) % 360; }
                    switch (direction) {

                        case 180:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x + 0.0 * this.size, p_y + 0.15 * this.size, this.size * 0.8);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x + (arrowlength * 0.5 + 0.0) * this.size, p_y + (arrowlength * 0.0 - 0.3) * this.size,
                                p_x + (-arrowlength * 0.5 + 0.0) * this.size, p_y + (-arrowlength * 0.0 - 0.3) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 0:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x + 0.0 * this.size, p_y + 0.15 * this.size, this.size * 0.8);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x - (arrowlength * 0.5 + 0.0) * this.size, p_y + (arrowlength * 0.0 - 0.3) * this.size,
                                p_x - (-arrowlength * 0.5 + 0.0) * this.size, p_y + (-arrowlength * 0.0 - 0.3) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 90:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x - 0.1 * this.size, p_y + 0.05 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x + (arrowlength * 0.0 + 0.3) * this.size, p_y + (arrowlength * 0.5 - 0.0) * this.size,
                                p_x + (-arrowlength * 0.0 + 0.3) * this.size, p_y + (-arrowlength * 0.5 - 0.0) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 270:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x - 0.1 * this.size, p_y + 0.05 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x + (arrowlength * 0.0 + 0.3) * this.size, p_y + (-arrowlength * 0.5 - 0.0) * this.size,
                                p_x + (-arrowlength * 0.0 + 0.3) * this.size, p_y + (arrowlength * 0.5 - 0.0) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 45:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x + 0.05 * this.size, p_y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x + (-arrowlength * 0.35 - 0.2) * this.size, p_y + (arrowlength * 0.35 - 0.2) * this.size,
                                p_x + (arrowlength * 0.35 - 0.2) * this.size, p_y + (-arrowlength * 0.35 - 0.2) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 225:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x + 0.05 * this.size, p_y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x + (arrowlength * 0.35 - 0.2) * this.size, p_y + (-arrowlength * 0.35 - 0.2) * this.size,
                                p_x + (-arrowlength * 0.35 - 0.2) * this.size, p_y + (arrowlength * 0.35 - 0.2) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 135:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x - 0.05 * this.size, p_y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x + (arrowlength * 0.35 + 0.2) * this.size, p_y + (arrowlength * 0.35 - 0.2) * this.size,
                                p_x + (-arrowlength * 0.35 + 0.2) * this.size, p_y + (-arrowlength * 0.35 - 0.2) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 315:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), p_x - 0.05 * this.size, p_y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(p_x + (-arrowlength * 0.35 + 0.2) * this.size, p_y + (-arrowlength * 0.35 - 0.2) * this.size,
                                p_x + (arrowlength * 0.35 + 0.2) * this.size, p_y + (arrowlength * 0.35 - 0.2) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        default:
                            set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);;
                            this.ctx.text(this[pu].number[i][0], p_x, p_y + 0.06 * this.size, this.size * 0.8);
                            break;
                    }
                    break;
                case "4": //tapa
                    this.draw_numbercircle(pu, i, p_x, p_y, 0.44);
                    if (this[pu].number[i][0].length === 1) {
                        set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0], p_x, p_y + 0.06 * this.size, this.size * 0.8);
                    } else if (this[pu].number[i][0].length === 2) {
                        set_font_style(this.ctx, 0.48 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0].slice(0, 1), p_x - 0.16 * this.size, p_y - 0.15 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(1, 2), p_x + 0.18 * this.size, p_y + 0.19 * this.size, this.size * 0.8);
                    } else if (this[pu].number[i][0].length === 3) {
                        set_font_style(this.ctx, 0.45 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0].slice(0, 1), p_x - 0.22 * this.size, p_y - 0.14 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(1, 2), p_x + 0.24 * this.size, p_y - 0.05 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(2, 3), p_x - 0.0 * this.size, p_y + 0.3 * this.size, this.size * 0.8);
                    } else if (this[pu].number[i][0].length === 4) {
                        set_font_style(this.ctx, 0.4 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0].slice(0, 1), p_x - 0.0 * this.size, p_y - 0.22 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(1, 2), p_x - 0.26 * this.size, p_y + 0.04 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(2, 3), p_x + 0.26 * this.size, p_y + 0.04 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(3, 4), p_x - 0.0 * this.size, p_y + 0.3 * this.size, this.size * 0.8);
                    }
                    break;
                case "5": //small
                    this.draw_numbercircle(pu, i, p_x, p_y, 0.17);
                    set_font_style(this.ctx, 0.25 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.text(this[pu].number[i][0], p_x, p_y + 0.02 * this.size, this.size * 0.8);
                    break;
                case "6": //medium
                    this.draw_numbercircle(pu, i, p_x, p_y, 0.25);
                    set_font_style(this.ctx, 0.4 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.text(this[pu].number[i][0], p_x, p_y + 0.03 * this.size, this.size * 0.8);
                    break;
                case "7": //sudoku
                    this.draw_numbercircle(pu, i, p_x, p_y, 0.42);
                    var sum = 0,
                        pos = 0;
                    for (var j = 0; j < 9; j++) {
                        if (this[pu].number[i][0][j] === 1) {
                            sum += 1;
                            pos = j;
                        }
                    }
                    if (sum === 1) {
                        set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text((pos + 1).toString(), p_x, p_y + 0.06 * this.size, this.size * 0.8);
                    } else {
                        set_font_style(this.ctx, 0.3 * this.size.toString(10), this[pu].number[i][1]);
                        for (var j = 0; j < 9; j++) {
                            if (this[pu].number[i][0][j] === 1) {
                                this.ctx.text((j + 1).toString(), p_x + ((j % 3 - 1) * 0.28) * this.size, p_y + (((j / 3 | 0) - 1) * 0.28 + 0.02) * this.size);
                            }
                        }
                    }
                    break;
                case "8": //long
                    if (this[pu].number[i][1] === 5) {
                        set_font_style(this.ctx, 0.5 * this.size.toString(10), this[pu].number[i][1]);
                        set_circle_style(this.ctx, 7);
                        this.ctx.fillRect(p_x - 0.2 * this.size, p_y - 0.25 * this.size, this.ctx.measureText(this[pu].number[i][0]).width, 0.5 * this.size);
                    }
                    set_font_style(this.ctx, 0.5 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.textAlign = "left";
                    this.ctx.text(this[pu].number[i][0], p_x - 0.2 * this.size, p_y);
                    break;
            }
        }

        for (var i in this[pu].numberS) {
            if (this[pu].numberS[i][1] === 5) {
                set_circle_style(this.ctx, 7);
                this.draw_polygon(this.ctx, this.point[i].x, this.point[i].y, 0.27, 4, 45);
            } else if (this[pu].numberS[i][1] === 6) {
                set_circle_style(this.ctx, 1);
                this.draw_circle(this.ctx, this.point[i].x, this.point[i].y, 0.18);
            } else if (this[pu].numberS[i][1] === 7) {
                set_circle_style(this.ctx, 2);
                this.draw_circle(this.ctx, this.point[i].x, this.point[i].y, 0.18);
            }
            if (true) { //(this[pu].numberS[i][0].length <= 2 ){
                set_font_style(this.ctx, 0.32 * this.size.toString(10), this[pu].numberS[i][1]);
                this.ctx.textAlign = "center";
                this.ctx.text(this[pu].numberS[i][0], this.point[i].x, this.point[i].y + 0.03 * this.size, this.size * 0.48);
                //}else{
                //  set_font_style(this.ctx,0.28*this.size.toString(10),this[pu].numberS[i][1]);
                //  this.ctx.textAlign = "left";
                //  this.ctx.text(this[pu].numberS[i][0],this.point[i].x-0.15*this.size,this.point[i].y+0.03*this.size,this.size*0.8);
            }
        }
    }

    draw_numbercircle(pu, i, p_x, p_y, size) {
        if (this[pu].number[i][1] === 5) {
            set_circle_style(this.ctx, 7);
            this.draw_circle(this.ctx, p_x, p_y, size);
        } else if (this[pu].number[i][1] === 6) {
            set_circle_style(this.ctx, 1);
            this.draw_circle(this.ctx, p_x, p_y, size);
        } else if (this[pu].number[i][1] === 7) {
            set_circle_style(this.ctx, 2);
            this.draw_circle(this.ctx, p_x, p_y, size);
        }
    }

    draw_symbol_select(ctx, x, y, num, sym) {
        switch (sym) {
            /* figure */
            case "circle_L":
                if (num === 0) {
                    set_circle_style(ctx, 1);
                    this.draw_circle(ctx, x, y, 0.43);
                    this.draw_circle(ctx, x, y, 0.32);
                } else {
                    set_circle_style(ctx, num);
                    this.draw_circle(ctx, x, y, 0.43);
                }
                break;
            case "circle_M":
                if (num === 0) {
                    set_circle_style(ctx, 1);
                    this.draw_circle(ctx, x, y, 0.35);
                    this.draw_circle(ctx, x, y, 0.25);
                } else {
                    set_circle_style(ctx, num);
                    this.draw_circle(ctx, x, y, 0.35);
                }
                break;
            case "circle_S":
                if (num === 0) {
                    set_circle_style(ctx, 1);
                    this.draw_circle(ctx, x, y, 0.22);
                    this.draw_circle(ctx, x, y, 0.14);
                } else {
                    set_circle_style(ctx, num);
                    this.draw_circle(ctx, x, y, 0.22);
                }
                break;
            case "circle_SS":
                if (num === 0) {
                    set_circle_style(ctx, 1);
                    this.draw_circle(ctx, x, y, 0.13);
                    this.draw_circle(ctx, x, y, 0.07);
                } else {
                    set_circle_style(ctx, num);
                    this.draw_circle(ctx, x, y, 0.13);
                }
                break;
            case "square_LL":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.5 * Math.sqrt(2), 4, 45);
                break;
            case "square_L":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.4 * Math.sqrt(2), 4, 45);
                break;
            case "square_M":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.35 * Math.sqrt(2), 4, 45);
                break;
            case "square_S":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.22 * Math.sqrt(2), 4, 45);
                break;
            case "square_SS":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.13 * Math.sqrt(2), 4, 45);
                break;
            case "triup_L":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y + 0.5 * 0.25 * this.size, 0.5, 3, 90);
                break;
            case "triup_M":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y + 0.4 * 0.25 * this.size, 0.4, 3, 90);
                break;
            case "triup_SS":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y + 0.16 * 0.25 * this.size, 0.16, 3, 90);
                break;
            case "tridown_L":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y - 0.5 * 0.25 * this.size, 0.5, 3, -90);
                break;
            case "tridown_M":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y - 0.4 * 0.25 * this.size, 0.4, 3, -90);
                break;
            case "tridown_SS":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y - 0.16 * 0.25 * this.size, 0.16, 3, -90);
                break;
            case "diamond_L":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.43, 4, 0);
                break;
            case "diamond_M":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.35, 4, 0);
                break;
            case "diamond_SS":
                set_circle_style(ctx, num);
                this.draw_polygon(ctx, x, y, 0.13, 4, 0);
                break;
            case "ox_B":
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.fillStyle = "rgba(255,255,255,0)";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = 2;
                this.draw_ox(ctx, num, x, y);
                break;
            case "ox_E":
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.fillStyle = "rgba(255,255,255,0)";
                ctx.strokeStyle = "rgba(32,128,32,1)";
                ctx.lineWidth = 2;
                this.draw_ox(ctx, num, x, y);
                break;
            case "ox_G":
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.fillStyle = "rgba(255,255,255,0)";
                ctx.strokeStyle = "rgba(153,153,153,1)";
                ctx.lineWidth = 2;
                this.draw_ox(ctx, num, x, y);
                break;
            case "tri":
                this.draw_tri(ctx, num, x, y);
                break;
            case "cross":
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = 3;
                this.draw_cross(ctx, num, x, y);
                break;
            case "line":
                this.draw_linesym(ctx, num, x, y);
                break;

                //number
            case "inequality":
                set_circle_style(ctx, 10);
                this.draw_inequality(ctx, num, x, y);
                break;
            case "math":
                set_font_style(ctx, 0.8 * pu.size.toString(10), 1);
                this.draw_math(ctx, num, x, y + 0.05 * pu.size);
                break;
            case "math_G":
                set_font_style(ctx, 0.8 * pu.size.toString(10), 2);
                this.draw_math(ctx, num, x, y + 0.05 * pu.size);
                break;
            case "degital":
                this.draw_degital(ctx, num, x, y);
                break;
            case "degital_f":
                this.draw_degital_f(ctx, num, x, y);
                break;
            case "dice":
                set_circle_style(ctx, 2);
                this.draw_dice(ctx, num, x, y);
                break;
            case "pills":
                set_circle_style(ctx, 3);
                this.draw_pills(ctx, num, x, y);
                break;

                /* arrow */
            case "arrow_B_B":
                set_circle_style(ctx, 2);
                this.draw_arrowB(ctx, num, x, y);
                break;
            case "arrow_B_G":
                set_circle_style(ctx, 3);
                this.draw_arrowB(ctx, num, x, y);
                break;
            case "arrow_B_W":
                set_circle_style(ctx, 1);
                this.draw_arrowB(ctx, num, x, y);
                break;
            case "arrow_N_B":
                set_circle_style(ctx, 2);
                this.draw_arrowN(ctx, num, x, y);
                break;
            case "arrow_N_G":
                set_circle_style(ctx, 3);
                this.draw_arrowN(ctx, num, x, y);
                break;
            case "arrow_N_W":
                set_circle_style(ctx, 1);
                this.draw_arrowN(ctx, num, x, y);
                break;
            case "arrow_S":
                set_circle_style(ctx, 2);
                this.draw_arrowS(ctx, num, x, y);
                break;
            case "arrow_GP":
                set_circle_style(ctx, 2);
                this.draw_arrowGP(ctx, num, x, y);
                break;
            case "arrow_GP_C":
                set_circle_style(ctx, 2);
                this.draw_arrowGP_C(ctx, num, x, y);
                break;
            case "arrow_Short":
                set_circle_style(ctx, 2);
                this.draw_arrowShort(ctx, num, x, y);
                break;
            case "arrow_tri_B":
                set_circle_style(ctx, 2);
                this.draw_arrowtri(ctx, num, x, y);
                break;
            case "arrow_tri_G":
                set_circle_style(ctx, 3);
                this.draw_arrowtri(ctx, num, x, y);
                break;
            case "arrow_tri_W":
                set_circle_style(ctx, 1);
                this.draw_arrowtri(ctx, num, x, y);
                break;
            case "arrow_cross":
                set_circle_style(ctx, 2);
                this.draw_arrowcross(ctx, num, x, y);
                break;
            case "arrow_eight":
                set_circle_style(ctx, 2);
                this.draw_arroweight(ctx, num, x, y);
                break;
            case "arrow_fourtip":
                set_circle_style(ctx, 2);
                this.draw_arrowfourtip(ctx, num, x, y);
                break;
            case "arrow_fouredge_B":
                set_circle_style(ctx, 2);
                ctx.strokeStyle = "rgba(0,0,0,0)";
                this.draw_arrowfouredge(ctx, num, x, y);
                break;
            case "arrow_fouredge_G":
                set_circle_style(ctx, 2);
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.fillStyle = "#999";
                this.draw_arrowfouredge(ctx, num, x, y);
                break;
            case "arrow_fouredge_E":
                set_circle_style(ctx, 2);
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.fillStyle = "#24a024";
                this.draw_arrowfouredge(ctx, num, x, y);
                break;

                /* special */
            case "kakuro":
                this.draw_kakuro(ctx, num, x, y);
                break;
            case "compass":
                this.draw_compass(ctx, num, x, y);
                break;
            case "star":
                this.draw_star(ctx, num, x, y);
                break;
            case "tents":
                this.draw_tents(ctx, num, x, y);
                break;
            case "battleship_B":
                set_circle_style(ctx, 2);
                this.draw_battleship(ctx, num, x, y);
                break;
            case "battleship_G":
                set_circle_style(ctx, 3);
                ctx.fillStyle = "#999";
                this.draw_battleship(ctx, num, x, y);
                break;
            case "battleship_W":
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = 2;
                this.draw_battleship(ctx, num, x, y);
                break;
            case "angleloop":
                this.draw_angleloop(ctx, num, x, y);
                break;
            case "firefly":
                this.draw_firefly(ctx, num, x, y);
                break;
            case "sun_moon":
                this.draw_sun_moon(ctx, num, x, y);
                break;
            case "sudokuetc":
                this.draw_sudokuetc(ctx, num, x, y);
                break;
            case "polyomino":
                this.draw_polyomino(ctx, num, x, y);
                break;
            case "pencils":
                this.draw_pencils(ctx, num, x, y);
                break;
        }
    }

    draw_circle(ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r * pu.size, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
    }

    draw_x(ctx, x, y, r) {
        ctx.beginPath();
        ctx.moveTo(x + r * Math.cos(45 * (Math.PI / 180)) * this.size, y + r * Math.sin(45 * (Math.PI / 180)) * this.size);
        ctx.lineTo(x + r * Math.cos(225 * (Math.PI / 180)) * this.size, y + r * Math.sin(225 * (Math.PI / 180)) * this.size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + r * Math.cos(135 * (Math.PI / 180)) * this.size, y + r * Math.sin(135 * (Math.PI / 180)) * this.size);
        ctx.lineTo(x + r * Math.cos(315 * (Math.PI / 180)) * this.size, y + r * Math.sin(315 * (Math.PI / 180)) * this.size);
        ctx.stroke();
    }

    draw_ast(ctx, x, y, r) {
        var th;
        th = 45 + this.theta % 180;
        ctx.beginPath();
        ctx.moveTo(x + r * Math.cos(th * (Math.PI / 180)) * this.size, y + r * Math.sin(th * (Math.PI / 180)) * this.size);
        ctx.lineTo(x + r * Math.cos((th + 180) * (Math.PI / 180)) * this.size, y + r * Math.sin((th + 180) * (Math.PI / 180)) * this.size);
        ctx.stroke();
        th = 135 + this.theta % 180;
        ctx.beginPath();
        ctx.moveTo(x + r * Math.cos(th * (Math.PI / 180)) * this.size, y + r * Math.sin(th * (Math.PI / 180)) * this.size);
        ctx.lineTo(x + r * Math.cos((th + 180) * (Math.PI / 180)) * this.size, y + r * Math.sin((th + 180) * (Math.PI / 180)) * this.size);
        ctx.stroke();
    }

    draw_slash(ctx, x, y, r) {
        var th;
        th = 45 + this.theta % 180;
        ctx.beginPath();
        ctx.moveTo(x + r * Math.cos(th * (Math.PI / 180)) * this.size, y + r * Math.sin(th * (Math.PI / 180)) * this.size);
        ctx.lineTo(x + r * Math.cos((th + 180) * (Math.PI / 180)) * this.size, y + r * Math.sin((th + 180) * (Math.PI / 180)) * this.size);
        ctx.stroke();
    }

    draw_ox(ctx, num, x, y) {
        var r = 0.3;
        switch (num) {
            case 1:
                this.draw_circle(ctx, x, y, r);
                break;
            case 2:
                this.draw_polygon(ctx, x, y + 0.05 * this.size, 0.3, 3, 90);
                break;
            case 3:
                this.draw_polygon(ctx, x, y, 0.35, 4, 45);
                break;
            case 4:
                this.draw_x(ctx, x, y, r);
                break;
            case 5:
                r = 0.5;
                ctx.beginPath();
                ctx.moveTo(x + r * Math.cos(45 * (Math.PI / 180)) * pu.size, y + r * Math.sin(45 * (Math.PI / 180)) * pu.size);
                ctx.lineTo(x + r * Math.cos(225 * (Math.PI / 180)) * pu.size, y + r * Math.sin(225 * (Math.PI / 180)) * pu.size);
                ctx.stroke();
                break;
            case 6:
                r = 0.5;
                ctx.beginPath();
                ctx.moveTo(x + r * Math.cos(135 * (Math.PI / 180)) * pu.size, y + r * Math.sin(135 * (Math.PI / 180)) * pu.size);
                ctx.lineTo(x + r * Math.cos(315 * (Math.PI / 180)) * pu.size, y + r * Math.sin(315 * (Math.PI / 180)) * pu.size);
                ctx.stroke();
                break;
            case 7:
                this.draw_x(ctx, x, y, 0.5);
                break;
            case 8:
                r = 0.05;
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.fillStyle = ctx.strokeStyle;
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 2;
                this.draw_circle(ctx, x, y, r);
                break;
            case 9:
                r = 0.3;
                this.draw_circle(ctx, x, y, r);
                this.draw_x(ctx, x, y, 0.45);
                break;
        }
    }

    draw_cross(ctx, num, x, y) {
        for (var i = 0; i < 4; i++) {
            if (num[i] === 1) {
                var th = this.rotate_theta(i * 90 - 180);
                ctx.beginPath();
                ctx.moveTo(x + ctx.lineWidth * 0.3 * Math.cos(th), y + ctx.lineWidth * 0.3 * Math.sin(th));
                ctx.lineTo(x - 0.5 * pu.size * Math.cos(th), y - 0.5 * pu.size * Math.sin(th));
                ctx.stroke();
            }
        }
    }

    draw_linesym(ctx, num, x, y) {
        var r = 0.32;
        ctx.setLineDash([]);
        ctx.lineCap = "round";
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 3;
        switch (num) {
            case 1:
                ctx.beginPath();
                ctx.moveTo(x - r * pu.size, y - 0 * pu.size);
                ctx.lineTo(x + r * pu.size, y + 0 * pu.size);
                ctx.closePath();
                ctx.stroke();
                break;
            case 2:
                ctx.beginPath();
                ctx.moveTo(x - 0 * pu.size, y - r * pu.size);
                ctx.lineTo(x + 0 * pu.size, y + r * pu.size);
                ctx.closePath();
                ctx.stroke();
                break;
            case 3:
                r = r / Math.sqrt(2);
                ctx.beginPath();
                ctx.moveTo(x - r * pu.size, y - r * pu.size);
                ctx.lineTo(x + r * pu.size, y + r * pu.size);
                ctx.closePath();
                ctx.stroke();
                break;
            case 4:
                r = r / Math.sqrt(2);
                ctx.beginPath();
                ctx.moveTo(x + r * pu.size, y - r * pu.size);
                ctx.lineTo(x - r * pu.size, y + r * pu.size);
                ctx.closePath();
                ctx.stroke();
                break;
            case 5:
                ctx.beginPath();
                ctx.moveTo(x - r * pu.size, y - 0 * pu.size);
                ctx.lineTo(x + r * pu.size, y + 0 * pu.size);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x - 0 * pu.size, y - r * pu.size);
                ctx.lineTo(x + 0 * pu.size, y + r * pu.size);
                ctx.closePath();
                ctx.stroke();
                break;
            case 6:
                r = r / Math.sqrt(2);
                ctx.beginPath();
                ctx.moveTo(x - r * pu.size, y - r * pu.size);
                ctx.lineTo(x + r * pu.size, y + r * pu.size);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + r * pu.size, y - r * pu.size);
                ctx.lineTo(x - r * pu.size, y + r * pu.size);
                ctx.closePath();
                ctx.stroke();
                break;
        }
    }

    draw_inequality(ctx, num, x, y) {
        var th;
        var len = 0.14;
        switch (num) {
            case 1:
            case 2:
            case 3:
            case 4:
                ctx.beginPath();
                th = this.rotate_theta((num - 1) * 90 + 45);
                ctx.moveTo(x + len * Math.sqrt(2) * pu.size * Math.cos(th), y + len * Math.sqrt(2) * pu.size * Math.sin(th));
                th = this.rotate_theta((num - 1) * 90 + 180);
                ctx.lineTo(x + len * pu.size * Math.cos(th), y + len * pu.size * Math.sin(th));
                th = this.rotate_theta((num - 1) * 90 + 315);
                ctx.lineTo(x + len * Math.sqrt(2) * pu.size * Math.cos(th), y + len * Math.sqrt(2) * pu.size * Math.sin(th));
                ctx.fill();
                ctx.stroke();
                break;
                //for square
            case 5:
            case 6:
            case 7:
            case 8:
                len = 0.12;
                set_circle_style(ctx, 10);
                ctx.beginPath();
                th = this.rotate_theta((num - 1) * 90 + 80);
                ctx.moveTo(x + len * Math.sqrt(2) * pu.size * Math.cos(th), y + len * Math.sqrt(2) * pu.size * Math.sin(th));
                th = this.rotate_theta((num - 1) * 90 + 180);
                ctx.lineTo(x + len * pu.size * Math.cos(th), y + len * pu.size * Math.sin(th));
                th = this.rotate_theta((num - 1) * 90 + 280);
                ctx.lineTo(x + len * Math.sqrt(2) * pu.size * Math.cos(th), y + len * Math.sqrt(2) * pu.size * Math.sin(th));
                ctx.stroke();
                break;
        }
    }

    draw_math(ctx, num, x, y) {
        switch (num) {
            case 1:
                ctx.font = 0.8 * pu.size + "px sans-serif";
                ctx.text("\u{221E}", x, y);
                break;
            case 2:
                ctx.font = 0.7 * pu.size + "px Helvetica,Arial";
                ctx.text("＋", x, y);
                break;
            case 3:
                ctx.font = 0.7 * pu.size + "px Helvetica,Arial";
                ctx.text("－", x, y);
                break;
            case 4:
                ctx.text("×", x, y);
                break;
            case 5:
                ctx.font = 0.7 * pu.size + "px Helvetica,Arial";
                ctx.text("＊", x, y);
                break;
            case 6:
                ctx.text("÷", x, y);
                break;
            case 7:
                ctx.font = 0.7 * pu.size + "px Helvetica,Arial";
                ctx.text("＝", x, y);
                break;
            case 8:
                ctx.text("≠", x, y);
                break;
            case 9:
                ctx.text("≦", x, y);
                break;
            case 0:
                ctx.text("≧", x, y);
                break;
        }
    }

    draw_degital(ctx, num, x, y) {
        set_circle_style(ctx, 2);
        var w1, w2, w3, w4, z1, z2;
        z1 = 0.17;
        z2 = 0.015;
        w3 = 0.05;
        w4 = 0.05;
        for (var i = 0; i < 7; i++) {
            if (num[0] === 1) {
                w1 = z1;
                w2 = -2 * (z1 + z2);
                ctx.beginPath();
                ctx.arrow(x - w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + w2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
                ctx.fill();
            }
            if (num[1] === 1) {
                w1 = -(z1 + z2);
                w2 = -2 * z1;
                ctx.beginPath();
                ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y - 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
                ctx.fill();
            }
            if (num[2] === 1) {
                w1 = z1 + z2;
                w2 = -2 * z1;
                ctx.beginPath();
                ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y - 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
                ctx.fill();
            }
            if (num[3] === 1) {
                w1 = z1;
                w2 = 0;
                ctx.beginPath();
                ctx.arrow(x - w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + w2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
                ctx.fill();
            }
            if (num[4] === 1) {
                w1 = -(z1 + z2);
                w2 = 2 * z1;
                ctx.beginPath();
                ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
                ctx.fill();
            }
            if (num[5] === 1) {
                w1 = z1 + z2;
                w2 = 2 * z1;
                ctx.beginPath();
                ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
                ctx.fill();
            }
            if (num[6] === 1) {
                w1 = z1;
                w2 = 2 * (z1 + z2);
                ctx.beginPath();
                ctx.arrow(x - w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + w2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
                ctx.fill();
            }
        }
    }

    draw_degital_f(ctx, num, x, y) {
        set_circle_style(ctx, 3);
        var w1, w2, w3, w4, z1, z2;
        z1 = 0.17;
        z2 = 0.015;
        w3 = 0.05;
        w4 = 0.05;
        //frame
        w1 = z1;
        w2 = -2 * (z1 + z2);
        ctx.beginPath();
        ctx.arrow(x - w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + w2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
        ctx.stroke();
        ctx.fill();
        w1 = -(z1 + z2);
        w2 = -2 * z1;
        ctx.beginPath();
        ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y - 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
        ctx.stroke();
        ctx.fill();
        w1 = z1 + z2;
        w2 = -2 * z1;
        ctx.beginPath();
        ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y - 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
        ctx.stroke();
        ctx.fill();
        w1 = z1;
        w2 = 0;
        ctx.beginPath();
        ctx.arrow(x - w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + w2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
        ctx.stroke();
        ctx.fill();
        w1 = -(z1 + z2);
        w2 = 2 * z1;
        ctx.beginPath();
        ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
        ctx.stroke();
        ctx.fill();
        w1 = z1 + z2;
        w2 = 2 * z1;
        ctx.beginPath();
        ctx.arrow(x + w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + 2 * z2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
        ctx.stroke();
        ctx.fill();
        w1 = z1;
        w2 = 2 * (z1 + z2);
        ctx.beginPath();
        ctx.arrow(x - w1 * pu.size, y + w2 * pu.size, x + w1 * pu.size, y + w2 * pu.size, [w3 * pu.size, w4 * pu.size, -w3 * pu.size, w4 * pu.size]);
        ctx.stroke();
        ctx.fill();

        //contents
        this.draw_degital(ctx, num, x, y);
    }

    draw_dice(ctx, num, x, y) {
        for (var i = 0; i < 9; i++) {
            if (num[i] === 1) {
                this.draw_circle(ctx, x + (i % 3 - 1) * 0.25 * pu.size, y + ((i / 3 | 0) - 1) * 0.25 * pu.size, 0.09);
            }
        }
    }

    draw_pills(ctx, num, x, y) {
        var r = 0.15;
        ctx.fillStyle = "#999"
        switch (num) {
            case 1:
                this.draw_circle(ctx, x, y, r);
                break;
            case 2:
                this.draw_circle(ctx, x - 0.22 * pu.size, y - 0.22 * pu.size, r);
                this.draw_circle(ctx, x + 0.22 * pu.size, y + 0.22 * pu.size, r);
                break;
            case 3:
                this.draw_circle(ctx, x - 0 * pu.size, y - 0.23 * pu.size, r);
                this.draw_circle(ctx, x + 0.23 * pu.size, y + 0.2 * pu.size, r);
                this.draw_circle(ctx, x - 0.23 * pu.size, y + 0.2 * pu.size, r);
                break;
            case 4:
                this.draw_circle(ctx, x - 0.22 * pu.size, y - 0.22 * pu.size, r);
                this.draw_circle(ctx, x + 0.22 * pu.size, y + 0.22 * pu.size, r);
                this.draw_circle(ctx, x - 0.22 * pu.size, y + 0.22 * pu.size, r);
                this.draw_circle(ctx, x + 0.22 * pu.size, y - 0.22 * pu.size, r);
                break;
            case 5:
                this.draw_circle(ctx, x, y, r);
                this.draw_circle(ctx, x - 0.24 * pu.size, y - 0.24 * pu.size, r);
                this.draw_circle(ctx, x + 0.24 * pu.size, y + 0.24 * pu.size, r);
                this.draw_circle(ctx, x - 0.24 * pu.size, y + 0.24 * pu.size, r);
                this.draw_circle(ctx, x + 0.24 * pu.size, y - 0.24 * pu.size, r);
                break;
        }
    }


    draw_arrowB(ctx, num, x, y) {
        var len1 = 0.38; //nemoto
        var len2 = 0.4; //tip
        var w1 = 0.2;
        var w2 = 0.4;
        var ri = -0.4;
        this.draw_arrow(ctx, num, x, y, len1, len2, w1, w2, ri);
    }

    draw_arrowN(ctx, num, x, y) {
        var len1 = 0.38; //nemoto
        var len2 = 0.4; //tip
        var w1 = 0.03;
        var w2 = 0.13;
        var ri = -0.25;
        this.draw_arrow(ctx, num, x, y, len1, len2, w1, w2, ri);
    }

    draw_arrowS(ctx, num, x, y) {
        var len1 = 0.3; //nemoto
        var len2 = 0.32; //tip
        var w1 = 0.02;
        var w2 = 0.12;
        var ri = -0.2;
        this.draw_arrow(ctx, num, x, y, len1, len2, w1, w2, ri);
    }

    draw_arrowGP(ctx, num, x, y) {
        var len1 = 0.35; //nemoto
        var len2 = 0.35; //tip
        var w1 = 0.12;
        var w2 = 0.23;
        var w3 = 0.34;
        var r1 = -0.33;
        var r2 = -0.44;
        var r3 = -0.32;
        var th;
        if (num > 0 && num <= 8) {
            th = this.rotate_theta((num - 1) * 45 - 180);
            ctx.beginPath();
            ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, r1 * pu.size, w1 * pu.size, r2 * pu.size, w2 * pu.size, r3 * pu.size, w3 * pu.size]);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw_arrowShort(ctx, num, x, y) {
        var len1 = 0.3; //nemoto
        var len2 = 0.3; //tip
        var w1 = 0.15;
        var w2 = 0.31;
        var ri = -0.33;
        this.draw_arrow(ctx, num, x, y, len1, len2, w1, w2, ri);
    }

    draw_arrowtri(ctx, num, x, y) {
        var len1 = 0.25; //nemoto
        var len2 = 0.4; //tip
        var w1 = 0;
        var w2 = 0.35;
        var ri = 0;
        this.draw_arrow(ctx, num, x, y, len1, len2, w1, w2, ri);
    }

    draw_arrow(ctx, num, x, y, len1, len2, w1, w2, ri) {
        var th;
        if (num > 0 && num <= 8) {
            th = this.rotate_theta((num - 1) * 45 - 180);
            ctx.beginPath();
            ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw_arrowcross(ctx, num, x, y) {
        var w1 = 0.025;
        var w2 = 0.12;
        var len1 = 0.5 * w1; //nemoto
        var len2 = 0.45; //tip
        var ri = -0.18;
        var th;
        for (var i = 0; i < 4; i++) {
            if (num[i] === 1) {
                th = this.rotate_theta(i * 90 - 180);
                ctx.beginPath();
                ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
                ctx.fill();
            }
        }
    }

    draw_arroweight(ctx, num, x, y) {
        var len1 = -0.2; //nemoto
        var len2 = 0.45; //tip
        var w1 = 0.025;
        var w2 = 0.10;
        var ri = -0.15;
        for (var i = 0; i < 8; i++) {
            if (num[i] === 1) {
                this.draw_arrow8(ctx, i + 1, x, y, len1, len2, w1, w2, ri);
            }
        }
    }

    draw_arrow8(ctx, num, x, y, len1, len2, w1, w2, ri) {
        var th;
        if (num === 2 || num === 4 || num === 6 || num === 8) {
            len1 *= 1.3;
            len2 *= 1.2;
        }
        if (num > 0 && num <= 8) {
            th = this.rotate_theta((num - 1) * 45 - 180);
            ctx.beginPath();
            ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw_arrowfourtip(ctx, num, x, y) {
        var len1 = 0.5; //nemoto
        var len2 = -0.25; //tip
        var w1 = 0.0;
        var w2 = 0.2;
        var ri = 0.0;
        for (var i = 0; i < 4; i++) {
            if (num[i] === 1) {
                this.draw_arrow4(ctx, i + 1, x, y, len1, len2, w1, w2, ri);
            }
        }
    }

    draw_arrow4(ctx, num, x, y, len1, len2, w1, w2, ri) {
        var th;
        if (num > 0 && num <= 4) {
            th = this.rotate_theta((num - 1) * 90);
            ctx.beginPath();
            ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw_arrowfouredge(ctx, num, x, y) {
        var len1 = 0.5; //nemoto
        var len2 = 0.5;
        var t1 = 0.00;
        var t2 = 0.50;
        var w1 = 0.02;
        var w2 = 0.07;
        var ri = 0.42;
        var th1, th2;
        for (var i = 0; i < 4; i++) {
            if (num[i] === 1) {
                th1 = this.rotate_theta(225 + 90 * i);
                th2 = this.rotate_theta(90 * i);
                ctx.beginPath();
                ctx.arrow(x + len1 * pu.size * Math.cos(th1 + Math.PI * t1) + 0.1 * pu.size * Math.cos(th2), y + len1 * pu.size * Math.sin(th1 + Math.PI * t1) + 0.1 * pu.size * Math.sin(th2), x + len2 * pu.size * Math.cos(th1 + Math.PI * t2) - 0.05 * pu.size * Math.cos(th2), y + len2 * pu.size * Math.sin(th1 + Math.PI * t2) - 0.05 * pu.size * Math.sin(th2), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
                ctx.fill();
                ctx.stroke();
            }
        }
        for (var i = 4; i < 8; i++) {
            if (num[i] === 1) {
                th1 = this.rotate_theta(225 + 90 * i);
                th2 = this.rotate_theta(90 * i);
                ctx.beginPath();
                ctx.arrow(x + len2 * pu.size * Math.cos(th1 + Math.PI * t2) - 0.1 * pu.size * Math.cos(th2), y + len2 * pu.size * Math.sin(th1 + Math.PI * t2) - 0.1 * pu.size * Math.sin(th2), x + len1 * pu.size * Math.cos(th1 + Math.PI * t1) + 0.05 * pu.size * Math.cos(th2), y + len1 * pu.size * Math.sin(th1 + Math.PI * t1) + 0.05 * pu.size * Math.sin(th2), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
                ctx.fill();
                ctx.stroke();
            }
        }
    }

    draw_tents(ctx, num, x, y) {
        switch (num) {
            case 1:
                var r1;
                var r2;
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = 1;
                ctx.fillStyle = "#fff";
                r1 = 0.1;
                r2 = 0.4;
                ctx.beginPath();
                ctx.moveTo(x - r1 * pu.size, y);
                ctx.lineTo(x + r1 * pu.size, y);
                ctx.lineTo(x + r1 * pu.size, y + r2 * pu.size);
                ctx.lineTo(x - r1 * pu.size, y + r2 * pu.size);
                ctx.lineTo(x - r1 * pu.size, y);
                ctx.fill();
                ctx.stroke();

                r1 = 0.2;
                r2 = 0.4;
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.fillStyle = "#999";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x - r1 * Math.cos(90 * (Math.PI / 180)) * pu.size, y - (r1 * Math.sin(90 * (Math.PI / 180)) + 0) * pu.size);
                ctx.lineTo(x - r2 * Math.cos(210 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(210 * (Math.PI / 180)) + 0) * pu.size);
                ctx.lineTo(x - r2 * Math.cos(330 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(330 * (Math.PI / 180)) + 0) * pu.size);
                //ctx.arc(x,y-0.1*pu.size,0.3*pu.size,0,2*Math.PI,false);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x - r1 * Math.cos(90 * (Math.PI / 180)) * pu.size, y - (r1 * Math.sin(90 * (Math.PI / 180)) + 0.2) * pu.size);
                ctx.lineTo(x - r2 * Math.cos(210 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(210 * (Math.PI / 180)) + 0.2) * pu.size);
                ctx.lineTo(x - r2 * Math.cos(330 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(330 * (Math.PI / 180)) + 0.2) * pu.size);
                ctx.fill();
                break;
            case 2:
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#ccc";
                ctx.lineWidth = 1;
                r1 = 0.3;
                r2 = 0.4;
                ctx.beginPath();
                ctx.moveTo(x - r1 * Math.cos(90 * (Math.PI / 180)) * pu.size, y - (r1 * Math.sin(90 * (Math.PI / 180)) - 0.1) * pu.size);
                ctx.lineTo(x - r2 * Math.cos(210 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(210 * (Math.PI / 180)) - 0.1) * pu.size);
                ctx.lineTo(x - r2 * Math.cos(330 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(330 * (Math.PI / 180)) - 0.1) * pu.size);
                ctx.lineTo(x - r1 * Math.cos(90 * (Math.PI / 180)) * pu.size, y - (r1 * Math.sin(90 * (Math.PI / 180)) - 0.1) * pu.size);
                ctx.lineTo(x - r2 * Math.cos(210 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(210 * (Math.PI / 180)) - 0.1) * pu.size);
                ctx.fill();
                ctx.stroke();
                break;
            case 3: //anglers
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - 0.35 * pu.size, y);
                ctx.quadraticCurveTo(x - 0. * pu.size, y + 0.37 * pu.size, x + 0.3 * pu.size, y - 0.2 * pu.size);
                ctx.stroke();
                ctx.moveTo(x - 0.35 * pu.size, y);
                ctx.quadraticCurveTo(x - 0. * pu.size, y - 0.37 * pu.size, x + 0.3 * pu.size, y + 0.2 * pu.size);
                ctx.stroke();
                break;
            case 4:
                set_font_style(ctx, 0.8 * pu.size.toString(10), 1);
                ctx.text("～", x, y - 0.11 * pu.size);
                ctx.text("～", x, y + 0.09 * pu.size);
                ctx.text("～", x, y + 0.29 * pu.size);
                break;
        }
    }

    draw_star(ctx, num, x, y) {
        var r1 = 0.38;
        var r2 = 0.382 * r1;
        switch (num) {
            case 1:
                ctx.fillStyle = "#fff";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y + 0.03 * pu.size, r1, r2, 5);
                break;
            case 2:
                ctx.fillStyle = "#000"; //"#009826";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y + 0.03 * pu.size, r1, r2, 5);
                break;
            case 3:
                ctx.fillStyle = "#999";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y + 0.03 * pu.size, r1, r2, 5);
                break;
            case 4:
                ctx.fillStyle = "#fff";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y, r1, r2 * 0.9, 4);
                break;
            case 5:
                ctx.fillStyle = "#000"; //"#009826";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y, r1, r2 * 0.9, 4);
                break;
            case 6:
                ctx.fillStyle = "#999";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y, r1, r2 * 0.9, 4);
                break;
            case 7:
                ctx.fillStyle = "#fff";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y, r2 * 0.9, r1, 4);
                break;
            case 8:
                ctx.fillStyle = "#000"; //"#009826";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y, r2 * 0.9, r1, 4);
                break;
            case 9:
                ctx.fillStyle = "#999";
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 1;
                this.draw_star0(ctx, x, y, r2 * 0.9, r1, 4);
                break;
            case 0:
                var r = 0.4;
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                this.draw_x(ctx, x, y, r)
                break;
        }
    }

    draw_star0(ctx, x, y, r1, r2, n) {
        var th1 = 90;
        var th2 = th1 + 180 / n;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - r1 * Math.cos(th1 * (Math.PI / 180)) * pu.size, y - (r1 * Math.sin(th1 * (Math.PI / 180)) - 0) * pu.size);
        ctx.lineTo(x - r2 * Math.cos(th2 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(th2 * (Math.PI / 180)) - 0) * pu.size);
        for (var i = 0; i < n; i++) {
            th1 += 360 / n;
            th2 += 360 / n;
            ctx.lineTo(x - r1 * Math.cos(th1 * (Math.PI / 180)) * pu.size, y - (r1 * Math.sin(th1 * (Math.PI / 180)) - 0) * pu.size);
            ctx.lineTo(x - r2 * Math.cos(th2 * (Math.PI / 180)) * pu.size, y - (r2 * Math.sin(th2 * (Math.PI / 180)) - 0) * pu.size);
        }
        ctx.fill();
        ctx.stroke();
    }

    draw_angleloop(ctx, num, x, y) {
        var r;
        switch (num) {
            case 1:
                r = 0.24;
                set_circle_style(ctx, 2);
                this.draw_polygon(ctx, x, y, r, 3, 90);
                break;
            case 2:
                r = 0.24;
                set_circle_style(ctx, 5);
                ctx.fillStyle = "#999";
                this.draw_polygon(ctx, x, y, r, 4, 45);
                break;
            case 3:
                r = 0.215;
                set_circle_style(ctx, 1);
                ctx.lineWidth = 1;
                this.draw_polygon(ctx, x, y, r, 5, 90);
                break;
            case 4:
                r = 0.25;
                set_circle_style(ctx, 1);
                ctx.lineWidth = 2;
                this.draw_x(ctx, x, y, r);
                break;
        }
    }

    draw_firefly(ctx, num, x, y) {
        var r1 = 0.36,
            r2 = 0.09;
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        switch (num) {
            case 1:
            case 2:
            case 3:
            case 4:
                var th = this.rotate_theta((num - 1) * 90 - 180);
                set_circle_style(ctx, 1);
                this.draw_circle(ctx, x, y, r1);
                ctx.fillStyle = "#000";
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.lineWidth = 2;
                this.draw_circle(ctx, x - r1 * pu.size * Math.cos(th), y - r1 * pu.size * Math.sin(th), r2);
                break;
            case 5:
                set_circle_style(ctx, 1);
                this.draw_circle(ctx, x, y, r1);
                break;
        }
    }

    draw_sun_moon(ctx, num, x, y) {
        var r1 = 0.36,
            r2 = 0.34;
        switch (num) {
            case 1:
                set_circle_style(ctx, 1);
                this.draw_circle(ctx, x, y, r1);
                break;
            case 2:
                set_circle_style(ctx, 2);
                ctx.beginPath();
                ctx.arc(x, y, r1 * pu.size, -0.34 * Math.PI, 0.73 * Math.PI, false);
                ctx.arc(x - 0.12 * pu.size, y - 0.08 * pu.size, r2 * pu.size, 0.67 * Math.PI, -0.28 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                break;
        }
    }

    draw_sudokuetc(ctx, num, x, y) {
        switch (num) {
            case 1:
                var r = 0.14;
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.fillStyle = "#ccc";
                this.draw_polygon(ctx, x - r * pu.size, y + r * pu.size, r * Math.sqrt(2), 4, 45);
                this.draw_polygon(ctx, x + r * pu.size, y - r * pu.size, r * Math.sqrt(2), 4, 45);
                ctx.fillStyle = "#666";
                this.draw_polygon(ctx, x - r * pu.size, y - r * pu.size, r * Math.sqrt(2), 4, 45);
                this.draw_polygon(ctx, x + r * pu.size, y + r * pu.size, r * Math.sqrt(2), 4, 45);
                break;
            case 2:
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.strokeStyle = "#ccc";
                ctx.lineWidth = 4;
                this.draw_circle(ctx, x, y, 0.71);
                break;
            case 3:
                var r = 0.99;
                set_circle_style(ctx, 3);
                ctx.beginPath();
                ctx.moveTo(x, y + r * pu.size);
                ctx.lineTo(x + r * pu.size, y);
                ctx.lineTo(x, y - r * pu.size);
                ctx.lineTo(x - r * pu.size, y);
                ctx.closePath();
                ctx.fill();
                break;
            case 4:
                var r = 0.2 * pu.size;
                var w = 1.8 * pu.size;
                var h = 0.8 * pu.size;
                x = x - 0.40 * pu.size;
                y = y - 0.40 * pu.size;
                ctx.lineCap = "butt";
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.strokeStyle = "#000";
                ctx.beginPath()
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.arcTo(x + w, y, x + w, y + r, r);
                ctx.lineTo(x + w, y + h - r);
                ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
                ctx.lineTo(x + r, y + h);
                ctx.arcTo(x, y + h, x, y + h - r, r);
                ctx.lineTo(x, y + r);
                ctx.arcTo(x, y, x + r, y, r);
                ctx.closePath();
                ctx.stroke();
                break;
            case 5:
                var r = 0.2 * pu.size;
                var w = 0.8 * pu.size;
                var h = 1.8 * pu.size;
                x = x - 0.40 * pu.size;
                y = y - 0.40 * pu.size;
                ctx.lineCap = "butt";
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.strokeStyle = "#000";
                ctx.beginPath()
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.arcTo(x + w, y, x + w, y + r, r);
                ctx.lineTo(x + w, y + h - r);
                ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
                ctx.lineTo(x + r, y + h);
                ctx.arcTo(x, y + h, x, y + h - r, r);
                ctx.lineTo(x, y + r);
                ctx.arcTo(x, y, x + r, y, r);
                ctx.closePath();
                ctx.stroke();
                break;
        }
    }

    draw_polyomino(ctx, num, x, y) {
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(200,200,200,1)";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1.2;
        ctx.lineCap = "butt";
        var r = 0.25;
        for (var i = 0; i < 9; i++) {
            if (num[i] === 1) {
                this.draw_polygon(ctx, x + (i % 3 - 1) * r * pu.size, y + ((i / 3 | 0) - 1) * r * pu.size, r * 0.5 * Math.sqrt(2), 4, 45);
            }
        }
    }

    rotate_theta(th) {
        th = (th + this.theta);
        if (this.reflect[0] === -1) { th = (180 - th + 360) % 360; }
        if (this.reflect[1] === -1) { th = (360 - th + 360) % 360; }
        th = th / 180 * Math.PI;
        return th;
    }
}

class Puzzle_tetrakis_square extends Puzzle_truncated_square {
    constructor(nx, ny, size) {
        //盤面情報
        super("tetrakis_square");
        this.gridtype = 'tetrakis_square';
        this.nx = nx;
        this.ny = ny;
        this.nx0 = this.nx + 2;
        this.ny0 = this.ny * 2 + 2;
        this.margin = -1; //for arrow of number pointing outside of the grid

        this.width0 = this.nx + 6;
        this.height0 = this.ny;
        this.width_c = this.width0;
        this.height_c = this.height0;
        this.width = this.width_c;
        this.height = this.height_c;
        this.canvasx = this.width_c * this.size;
        this.canvasy = this.height_c * this.size;
        this.space = [];
        this.size = size;
        this.onoff_symbolmode_list = {
            "cross": 4,
            "arrow_cross": 4,
            "arrow_fourtip": 4,
            "degital": 7,
            "degital_f": 7,
            "arrow_eight": 8,
            "arrow_fouredge_B": 8,
            "arrow_fouredge_G": 8,
            "arrow_fouredge_E": 8,
            "dice": 9,
            "polyomino": 9
        };
        this.reset();
        this.erase_buttons();
    }

    create_point() {
        var k = 0,
            k0;
        var nx = this.nx0;
        var ny = this.ny0;
        var r;
        var adjacent, surround, type, use, neighbor;
        var point = [];
        adjacent = [];
        surround = [];
        neighbor = [];
        //center
        for (var i = 0; i < nx; i++) {
            for (var j = 0; j < ny; j++) {
                k0 = k;
                type = 1;
                if (i === 0 || i === nx - 1 || j === 0 || j === ny - 1) { use = -1; } else { use = 1; }
                point[k] = new Point(((i * 2 + (j % 2)) + 0.5) * this.size, (j + 0.5) * this.size, type, adjacent, surround, use, neighbor, [], 0);
                k++;
                point[k] = new Point(((i * 2 + (j % 2)) + 1.5) * this.size, (j + 0.5) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;

                type = 0;
                r = 0.5 * Math.sqrt(2) / Math.cos(2 * Math.PI / 360 * 22.5);
                for (var m = 0; m < 8; m++) {
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 45 + 22.5)), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 45 + 22.5)), type, adjacent, surround, use, neighbor);
                    point[k0].surround = point[k0].surround.concat([k]); //pushやspliceだと全てのpointが更新されてしまう
                    point[k].surround = point[k].surround.concat([k0]);
                    k++;
                }
                r = Math.sqrt(2) - 1;
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 45)), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 45)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].surround = point[k0 + 1].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 1]);
                    k++;
                }

                //type = 2-4;
                r = 0.5 * Math.sqrt(2);
                for (var m = 0; m < 8; m++) {
                    if (m % 2 === 0) { type = 2; } else { type = 3; }
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 8 * m), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 8 * m), type, adjacent, surround, use, neighbor);
                    point[k0].neighbor = point[k0].neighbor.concat([k]); //pushやspliceだとpointが全て更新されてしまう
                    if (m === 0) {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 5].neighbor = point[k - 5].neighbor.concat([k]);
                    } else {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 13].neighbor = point[k - 13].neighbor.concat([k]);
                    }
                    k++;
                }
                type = 2;
                r = 1 - 0.5 * Math.sqrt(2);
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 4 * m), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 4 * m), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].neighbor = point[k0 + 1].neighbor.concat([k]);
                    if (m === 0) {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 9].neighbor = point[k - 9].neighbor.concat([k]);
                    } else {
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                        point[k - 13].neighbor = point[k - 13].neighbor.concat([k]);
                    }
                    k++;
                }
                type = 4;
                r = 0.5;
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 4 * m), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 4 * m), type, adjacent, surround, use, neighbor);
                    k++;
                }
            }
        }
        // 重複判定
        for (var i = 0; i < point.length; i++) {
            if (!point[i]) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j]) { continue; };
                if ((point[i].x - point[j].x) ** 2 + (point[i].y - point[j].y) ** 2 < 0.01) {
                    //surround,neighbor置換
                    for (var k = 0; k < point.length; k++) {
                        if (!point[k]) { continue; };
                        for (var n = 0; n < point[k].surround.length; n++) {
                            if (point[k].surround[n] === j) {
                                point[k].surround.splice(n, 1, i);
                            }
                        }
                        for (var n = 0; n < point[k].neighbor.length; n++) {
                            if (point[k].neighbor[n] === j) {
                                if (point[k].neighbor.indexOf(i) === -1) {
                                    point[k].neighbor.splice(n, 1, i); //無ければ置き換え
                                } else {
                                    point[k].neighbor.splice(n, 1); //あったら削除
                                }
                            }
                        }
                    }
                    for (var n = 0; n < point[j].surround.length; n++) { //削除された点のsurroundを移し替え
                        if (point[i].surround.indexOf(point[j].surround[n]) === -1) {
                            point[i].surround = point[i].surround.concat([point[j].surround[n]]);
                        }
                    }
                    for (var n = 0; n < point[j].neighbor.length; n++) { //削除された点のneighborを移し替え
                        if (point[i].neighbor.indexOf(point[j].neighbor[n]) === -1) {
                            point[i].neighbor = point[i].neighbor.concat([point[j].neighbor[n]]);
                        }
                    }
                    delete point[j];
                    //置換ここまで
                }
            }
        }
        // adjacent作成
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 0) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 1) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 1) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        //use更新
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0 || point[i].use === -1) { continue; };
            for (var k = 0; k < point[i].neighbor.length; k++) {
                point[point[i].neighbor[k]].use = 1;
            }
            for (var k = 0; k < point[i].surround.length; k++) {
                point[point[i].surround[k]].use = 1;
            }
        }
        this.point = point;
    }

    reset_frame() {
        this.create_point();
        this.space = [];

        this.centerlist = [];
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].use === 1 && this.point[i].type === 0) {
                this.centerlist.push(i);
            }
        }
        this.search_center();
        this.width_c = this.width;
        this.height_c = this.height;
        this.center_n0 = this.center_n;
        this.canvasxy_update();
        this.canvas_size_setting();
        this.point_move((this.canvasx * 0.5 - this.point[this.center_n].x + 0.5), (this.canvasy * 0.5 - this.point[this.center_n].y + 0.5), this.theta);

        this.make_frameline();
        this.cursol = this.centerlist[0];
        this.cursolS = 4 * (this.nx0) * (this.ny0) + 4 + 4 * (this.nx0);
    }

    search_center() {
        var xmax = 0,
            xmin = 1e5;
        var ymax = 0,
            ymin = 1e5;
        for (var i of this.centerlist) {
            if (this.point[i].x > xmax) { xmax = this.point[i].x; }
            if (this.point[i].x < xmin) { xmin = this.point[i].x; }
            if (this.point[i].y > ymax) { ymax = this.point[i].y; }
            if (this.point[i].y < ymin) { ymin = this.point[i].y; }
        }
        var x = (xmax + xmin) / 2;
        var y = (ymax + ymin) / 2;
        this.width = (xmax - xmin) / this.size + 2.5;
        this.height = (ymax - ymin) / this.size + 2.5;

        var min0, min = 10e6;
        var num = 0;
        for (var i in this.point) {
            min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
            if (min0 < min) {
                min = min0;
                num = i;
            }
        }
        this.center_n = parseInt(num);
    }

    type_set() {
        var type
        switch (this.mode[this.mode.qa].edit_mode) {
            case "surface":
            case "board":
                type = [0];
                break;
            case "symbol":
            case "move":
                if (document.getElementById('edge_button').textContent === "OFF") {
                    type = [0];
                } else {
                    type = [0, 1, 3, 4];
                }
                break;
            case "number":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3") {
                    type = [5];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "9") {
                    type = [6];
                } else {
                    if (document.getElementById('edge_button').textContent === "OFF") {
                        type = [0];
                    } else {
                        type = [0, 1, 3, 4];
                    }
                }
                break;
            case "line":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [3, 4];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "5") {
                    type = [0, 2, 3];
                } else {
                    type = [0];
                }
                break;
            case "lineE":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [3, 4];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else {
                    type = [1];
                }
                break;
            case "special":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "polygon") {
                    type = [1];
                } else {
                    type = [0, 1];
                }
                break;
            case "combi":
                switch (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0]) {
                    case "tents":
                    case "linex":
                        type = [0, 3, 4];
                        break;
                    case "edgexoi":
                        type = [0, 1, 3, 4];
                        break;
                    case "blpo":
                    case "blwh":
                    case "battleship":
                    case "star":
                    case "magnets":
                    case "lineox":
                    case "yajilin":
                    case "hashi":
                    case "arrowS":
                    case "shaka":
                    case "numfl":
                    case "alfl":
                        type = [0];
                        break;
                    case "edgesub":
                        type = [0, 1];
                        break;
                }
                break;
        }
        return type;
    }

    recalculate_num(x, y, num) {
        var min0, min = 10e6;
        var num0 = 0;
        var r0 = 0.5 * Math.sqrt(2) / Math.cos(2 * Math.PI / 360 * 22.5);
        var r1 = Math.sqrt(2) - 1;
        if (this.point[num].type != 1) { return num; }

        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].type === 1 && this.point[i].use === 1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type2 === 0 && min0 > (r0 * this.size) ** 2) { continue; } //円形の内側に入っていなければ更新しない
                    if (this.point[i].type2 === 1 && min0 > (r1 * this.size) ** 2) { continue; }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    coord_p_edgex(x, y) {
        var min0, min = 10e6;
        var num = 0;
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.type.indexOf(this.point[i].type) != -1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type === 2 || this.point[i].type === 3) {
                        if (min0 > (0.3 * this.size) ** 2) {
                            continue;
                        }
                    }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    rotate_left() {
        this.theta = (this.theta - 45 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, -45);
        this.redraw();
    }

    rotate_right() {
        this.theta = (this.theta + 45 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, +45);
        this.redraw();
    }


    ////////////////draw/////////////////////

    draw() {
        this.draw_surface("pu_q");
        this.draw_surface("pu_a");
        //    this.draw_squareframe("pu_q");
        //  this.draw_squareframe("pu_a");
        //    this.draw_thermo("pu_q");
        //    this.draw_thermo("pu_a");
        //    this.draw_arrowsp("pu_q");
        //  this.draw_arrowsp("pu_a");
        this.draw_symbol("pu_q", 1);
        this.draw_symbol("pu_a", 1);
        //  this.draw_wall("pu_q");
        //  this.draw_wall("pu_a");
        this.draw_frame();
        this.draw_polygonsp("pu_q");
        this.draw_polygonsp("pu_a");
        this.draw_freeline("pu_q");
        this.draw_freeline("pu_a");
        this.draw_line("pu_q");
        this.draw_line("pu_a");
        //this.draw_direction("pu_q");
        //this.draw_direction("pu_a");
        this.draw_lattice();
        this.draw_frameBold();
        this.draw_symbol("pu_q", 2);
        this.draw_symbol("pu_a", 2);
        //this.draw_cage("pu_q");
        //this.draw_cage("pu_a");
        this.draw_number("pu_q");
        this.draw_number("pu_a");
        this.draw_cursol();
        this.draw_freecircle();

        //this.draw_point();
    }
    draw_point() {
        set_font_style(this.ctx, (0.2 * this.size).toString(), 1);
        for (var i in this.point) {
            if (this.point[i].type === 0) {
                this.ctx.fillStyle = "#000";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 1) {
                this.ctx.fillStyle = "blue";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 2) {
                this.ctx.fillStyle = "red";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 3) {
                this.ctx.fillStyle = "orange";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 4) {
                this.ctx.fillStyle = "green";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 5) {
                this.ctx.fillStyle = "green";
                //this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            }
            this.ctx.beginPath();
            //this.ctx.arc(this.point[i].x,this.point[i].y,2.5,0,2*Math.PI,true);
            this.ctx.fill();
        }
    }

    rotate_theta(th) {
        th = (th + this.theta);
        if (this.reflect[0] === -1) { th = (180 - th + 360) % 360; }
        if (this.reflect[1] === -1) { th = (360 - th + 360) % 360; }
        th = th / 180 * Math.PI;
        return th;
    }
}

class Puzzle_snub_square extends Puzzle_truncated_square {
    constructor(nx, ny, size) {
        //盤面情報
        super("snub_square");
        this.gridtype = 'snub_square';
        this.nx = nx;
        this.ny = ny;
        this.nx0 = this.nx + 2;
        this.ny0 = this.ny + 2;
        this.margin = -1; //for arrow of number pointing outside of the grid

        this.width0 = this.nx + 6;
        this.height0 = this.ny + 6;
        this.width_c = this.width0;
        this.height_c = this.height0;
        this.width = this.width_c;
        this.height = this.height_c;
        this.canvasx = this.width_c * this.size;
        this.canvasy = this.height_c * this.size;
        this.space = [];
        this.size = size;
        this.onoff_symbolmode_list = {
            "cross": 4,
            "arrow_cross": 4,
            "arrow_fourtip": 4,
            "degital": 7,
            "degital_f": 7,
            "arrow_eight": 8,
            "arrow_fouredge_B": 8,
            "arrow_fouredge_G": 8,
            "arrow_fouredge_E": 8,
            "dice": 9,
            "polyomino": 9
        };
        this.reset();
        this.erase_buttons();
    }

    create_point() {
        var k = 0,
            k0;
        var nx = this.nx0;
        var ny = this.ny0;
        var r;
        var adjacent, surround, type, use, neighbor;
        var point = [];
        adjacent = [];
        surround = [];
        neighbor = [];
        //center
        for (var j = 0; j < ny; j++) {
            for (var i = 0; i < nx; i++) {
                var offsetx = i * (1 + 0.5 * Math.sqrt(3)) + j * 0.5 + 0.5;
                var offsety = j * (1 + 0.5 * Math.sqrt(3)) - i * 0.5 + 0.5

                k0 = k;
                type = 0;
                if (i === 0 || i === nx - 1 || j === 0 || j === ny - 1) { use = -1; } else { use = 1; }
                point[k] = new Point(offsetx * this.size, (offsety) * this.size, type, adjacent, surround, use, neighbor, [], 0);
                k++;
                point[k] = new Point((offsetx + 0.5 + Math.sqrt(3) / 6) * this.size, (offsety) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx) * this.size, (offsety + 0.5 + Math.sqrt(3) / 6) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx + 0.5) * this.size, (offsety + 0.5 + Math.sqrt(3) / 3) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx + 0.75 + Math.sqrt(3) / 4) * this.size, (offsety + 0.25 + Math.sqrt(3) / 4) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx + 0.5 + Math.sqrt(3) / 3) * this.size, (offsety - 0.5) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;

                type = 1;
                r = 0.5 * Math.sqrt(2);
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 45)), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 45)), type, adjacent, surround, use, neighbor);
                    point[k0].surround = point[k0].surround.concat([k]); //pushやspliceだと全てのpointが更新されてしまう
                    point[k].surround = point[k].surround.concat([k0]);
                    k++;
                }
                r = Math.sqrt(3) / 3;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 0)), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 0)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].surround = point[k0 + 1].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 1]);
                    k++;
                    point[k] = new Point(point[k0 + 2].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 90)), point[k0 + 2].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 90)), type, adjacent, surround, use, neighbor);
                    point[k0 + 2].surround = point[k0 + 2].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 2]);
                    k++;
                    point[k] = new Point(point[k0 + 3].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 30)), point[k0 + 3].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 30)), type, adjacent, surround, use, neighbor);
                    point[k0 + 3].surround = point[k0 + 3].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 3]);
                    k++;
                }
                r = 0.5 * Math.sqrt(2);
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 4].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 15)), point[k0 + 4].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 15)), type, adjacent, surround, use, neighbor);
                    point[k0 + 4].surround = point[k0 + 4].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 4]);
                    k++;
                }
                r = Math.sqrt(3) / 3;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 5].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 60)), point[k0 + 5].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 5].surround = point[k0 + 5].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 5]);
                    k++;
                }

                type = 2;
                r = 0.5;
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 0)), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 0)), type, adjacent, surround, use, neighbor);
                    point[k0].neighbor = point[k0].neighbor.concat([k]);
                    if (m === 0) {
                        point[k - 17].neighbor = point[k - 17].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    } else {
                        point[k - 11].neighbor = point[k - 11].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    }
                    k++;
                }
                r = Math.sqrt(3) / 6;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 60)), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].neighbor = point[k0 + 1].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                    point[k] = new Point(point[k0 + 2].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 30)), point[k0 + 2].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 30)), type, adjacent, surround, use, neighbor);
                    point[k0 + 2].neighbor = point[k0 + 2].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                    point[k] = new Point(point[k0 + 3].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 90)), point[k0 + 3].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 90)), type, adjacent, surround, use, neighbor);
                    point[k0 + 3].neighbor = point[k0 + 3].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                }
                r = 0.5;
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 4].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 60)), point[k0 + 4].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 4].neighbor = point[k0 + 4].neighbor.concat([k]);
                    if (m === 3) {
                        point[k - 17].neighbor = point[k - 17].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    } else {
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    }
                    k++;
                }
                r = Math.sqrt(3) / 6;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 5].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 0)), point[k0 + 5].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 0)), type, adjacent, surround, use, neighbor);
                    point[k0 + 5].neighbor = point[k0 + 5].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                }
            }
        }
        // 重複判定
        for (var i = 0; i < point.length; i++) {
            if (!point[i]) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j]) { continue; };
                if ((point[i].x - point[j].x) ** 2 + (point[i].y - point[j].y) ** 2 < 0.01) {
                    //surround,neighbor置換
                    for (var k = 0; k < point.length; k++) {
                        if (!point[k]) { continue; };
                        for (var n = 0; n < point[k].surround.length; n++) {
                            if (point[k].surround[n] === j) {
                                point[k].surround.splice(n, 1, i);
                            }
                        }
                        for (var n = 0; n < point[k].neighbor.length; n++) {
                            if (point[k].neighbor[n] === j) {
                                if (point[k].neighbor.indexOf(i) === -1) {
                                    point[k].neighbor.splice(n, 1, i); //無ければ置き換え
                                } else {
                                    point[k].neighbor.splice(n, 1); //あったら削除
                                }
                            }
                        }
                    }
                    for (var n = 0; n < point[j].surround.length; n++) { //削除された点のsurroundを移し替え
                        if (point[i].surround.indexOf(point[j].surround[n]) === -1) {
                            point[i].surround = point[i].surround.concat([point[j].surround[n]]);
                        }
                    }
                    for (var n = 0; n < point[j].neighbor.length; n++) { //削除された点のneighborを移し替え
                        if (point[i].neighbor.indexOf(point[j].neighbor[n]) === -1) {
                            point[i].neighbor = point[i].neighbor.concat([point[j].neighbor[n]]);
                        }
                    }
                    delete point[j];
                    //置換ここまで
                }
            }
        }
        // adjacent作成
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 0) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 1) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 1) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        //use更新
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0 || point[i].use === -1) { continue; };
            for (var k = 0; k < point[i].neighbor.length; k++) {
                point[point[i].neighbor[k]].use = 1;
            }
            for (var k = 0; k < point[i].surround.length; k++) {
                point[point[i].surround[k]].use = 1;
            }
        }
        this.point = point;
    }

    reset_frame() {
        this.create_point();
        this.space = [];

        this.centerlist = [];
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].use === 1 && this.point[i].type === 0) {
                this.centerlist.push(i);
            }
        }
        this.search_center();
        this.width_c = this.width;
        this.height_c = this.height;
        this.center_n0 = this.center_n;
        this.canvasxy_update();
        this.canvas_size_setting();
        this.point_move((this.canvasx * 0.5 - this.point[this.center_n].x + 0.5), (this.canvasy * 0.5 - this.point[this.center_n].y + 0.5), this.theta);

        this.make_frameline();
        this.cursol = this.centerlist[0];
        this.cursolS = 4 * (this.nx0) * (this.ny0) + 4 + 4 * (this.nx0);
    }

    search_center() {
        var xmax = 0,
            xmin = 1e5;
        var ymax = 0,
            ymin = 1e5;
        for (var i of this.centerlist) {
            if (this.point[i].x > xmax) { xmax = this.point[i].x; }
            if (this.point[i].x < xmin) { xmin = this.point[i].x; }
            if (this.point[i].y > ymax) { ymax = this.point[i].y; }
            if (this.point[i].y < ymin) { ymin = this.point[i].y; }
        }
        var x = (xmax + xmin) / 2;
        var y = (ymax + ymin) / 2;
        this.width = (xmax - xmin) / this.size + 2.5;
        this.height = (ymax - ymin) / this.size + 2.5;

        var min0, min = 10e6;
        var num = 0;
        for (var i in this.point) {
            min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
            if (min0 < min) {
                min = min0;
                num = i;
            }
        }
        this.center_n = parseInt(num);
    }

    type_set() {
        var type
        switch (this.mode[this.mode.qa].edit_mode) {
            case "surface":
            case "board":
                type = [0];
                break;
            case "symbol":
            case "move":
                if (document.getElementById('edge_button').textContent === "OFF") {
                    type = [0];
                } else {
                    type = [0, 1, 2];
                }
                break;
            case "number":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3") {
                    type = [5];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "9") {
                    type = [6];
                } else {
                    if (document.getElementById('edge_button').textContent === "OFF") {
                        type = [0];
                    } else {
                        type = [0, 1, 2];
                    }
                }
                break;
            case "line":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "5") {
                    type = [0, 2];
                } else {
                    type = [0];
                }
                break;
            case "lineE":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else {
                    type = [1];
                }
                break;
            case "special":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "polygon") {
                    type = [1];
                } else {
                    type = [0, 1];
                }
                break;
            case "combi":
                switch (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0]) {
                    case "tents":
                    case "linex":
                        type = [0, 2];
                        break;
                    case "edgexoi":
                        type = [0, 1, 2];
                        break;
                    case "blpo":
                    case "blwh":
                    case "battleship":
                    case "star":
                    case "magnets":
                    case "lineox":
                    case "yajilin":
                    case "hashi":
                    case "arrowS":
                    case "shaka":
                    case "numfl":
                    case "alfl":
                        type = [0];
                        break;
                    case "edgesub":
                        type = [0, 1];
                        break;
                }
                break;
        }
        return type;
    }

    recalculate_num(x, y, num) {
        var min0, min = 10e6;
        var num0 = 0;
        var r0 = 0.5 * Math.sqrt(2) / Math.cos(2 * Math.PI / 360 * 22.5);
        var r1 = Math.sqrt(2) - 1;
        if (this.point[num].type != 1) { return num; }

        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].type === 1 && this.point[i].use === 1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type2 === 0 && min0 > (r0 * this.size) ** 2) { continue; } //円形の内側に入っていなければ更新しない
                    if (this.point[i].type2 === 1 && min0 > (r1 * this.size) ** 2) { continue; }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    coord_p_edgex(x, y) {
        var min0, min = 10e6;
        var num = 0;
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.type.indexOf(this.point[i].type) != -1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type === 2 || this.point[i].type === 3) {
                        if (min0 > (0.3 * this.size) ** 2) {
                            continue;
                        }
                    }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    rotate_left() {
        this.theta = (this.theta - 30 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, -30);
        this.redraw();
    }

    rotate_right() {
        this.theta = (this.theta + 30 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, +30);
        this.redraw();
    }


    ////////////////draw/////////////////////

    draw() {
        this.draw_surface("pu_q");
        this.draw_surface("pu_a");
        //    this.draw_squareframe("pu_q");
        //  this.draw_squareframe("pu_a");
        //    this.draw_thermo("pu_q");
        //    this.draw_thermo("pu_a");
        //    this.draw_arrowsp("pu_q");
        //  this.draw_arrowsp("pu_a");
        this.draw_symbol("pu_q", 1);
        this.draw_symbol("pu_a", 1);
        //  this.draw_wall("pu_q");
        //  this.draw_wall("pu_a");
        this.draw_frame();
        this.draw_polygonsp("pu_q");
        this.draw_polygonsp("pu_a");
        this.draw_freeline("pu_q");
        this.draw_freeline("pu_a");
        this.draw_line("pu_q");
        this.draw_line("pu_a");
        //this.draw_direction("pu_q");
        //this.draw_direction("pu_a");
        this.draw_lattice();
        this.draw_frameBold();
        this.draw_symbol("pu_q", 2);
        this.draw_symbol("pu_a", 2);
        //this.draw_cage("pu_q");
        //this.draw_cage("pu_a");
        this.draw_number("pu_q");
        this.draw_number("pu_a");
        this.draw_cursol();
        this.draw_freecircle();

        //this.draw_point();
    }
    draw_point() {
        set_font_style(this.ctx, (0.2 * this.size).toString(), 1);
        for (var i in this.point) {
            if (this.point[i].type === 0) {
                this.ctx.fillStyle = "#000";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 1) {
                this.ctx.fillStyle = "blue";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 2) {
                this.ctx.fillStyle = "red";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 3) {
                this.ctx.fillStyle = "orange";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 4) {
                this.ctx.fillStyle = "green";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 5) {
                this.ctx.fillStyle = "green";
                //this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            }
            this.ctx.beginPath();
            //this.ctx.arc(this.point[i].x,this.point[i].y,2.5,0,2*Math.PI,true);
            this.ctx.fill();
        }
    }

    rotate_theta(th) {
        th = (th + this.theta);
        if (this.reflect[0] === -1) { th = (180 - th + 360) % 360; }
        if (this.reflect[1] === -1) { th = (360 - th + 360) % 360; }
        th = th / 180 * Math.PI;
        return th;
    }
}

class Puzzle_cairo_pentagonal extends Puzzle_truncated_square {
    constructor(nx, ny, size) {
        //盤面情報
        super("cairo_pentagonal");
        this.gridtype = "cairo_pentagonal";
        this.nx = nx;
        this.ny = ny;
        this.nx0 = this.nx + 2;
        this.ny0 = this.ny + 2;
        this.margin = -1; //for arrow of number pointing outside of the grid

        this.width0 = this.nx + 6;
        this.height0 = this.ny + 6;
        this.width_c = this.width0;
        this.height_c = this.height0;
        this.width = this.width_c;
        this.height = this.height_c;
        this.canvasx = this.width_c * this.size;
        this.canvasy = this.height_c * this.size;
        this.space = [];
        this.size = size;
        this.onoff_symbolmode_list = {
            "cross": 4,
            "arrow_cross": 4,
            "arrow_fourtip": 4,
            "degital": 7,
            "degital_f": 7,
            "arrow_eight": 8,
            "arrow_fouredge_B": 8,
            "arrow_fouredge_G": 8,
            "arrow_fouredge_E": 8,
            "dice": 9,
            "polyomino": 9
        };
        this.reset();
        this.erase_buttons();
    }

    create_point() {
        var k = 0,
            k0;
        var nx = this.nx0;
        var ny = this.ny0;

        var r;
        var adjacent, surround, type, use, neighbor;
        var point = [];
        adjacent = [];
        surround = [];
        neighbor = [];
        //center
        for (var j = 0; j < ny; j++) {
            for (var i = 0; i < nx; i++) {
                var offsetx = i * (1 + 0.5 * Math.sqrt(3)) + j * 0.5 + 0.5;
                var offsety = j * (1 + 0.5 * Math.sqrt(3)) - i * 0.5 + 0.5

                k0 = k;
                type = 1;
                if (i === 0 || i === nx - 1 || j === 0 || j === ny - 1) { use = -1; } else { use = 1; }
                point[k] = new Point(offsetx * this.size, (offsety) * this.size, type, adjacent, surround, use, neighbor, [], 0);
                k++;
                point[k] = new Point((offsetx + 0.5 + Math.sqrt(3) / 6) * this.size, (offsety) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx) * this.size, (offsety + 0.5 + Math.sqrt(3) / 6) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx + 0.5) * this.size, (offsety + 0.5 + Math.sqrt(3) / 3) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx + 0.75 + Math.sqrt(3) / 4) * this.size, (offsety + 0.25 + Math.sqrt(3) / 4) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                point[k] = new Point((offsetx + 0.5 + Math.sqrt(3) / 3) * this.size, (offsety - 0.5) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;

                type = 0;
                r = 0.5 * Math.sqrt(2);
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 45)), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 45)), type, adjacent, surround, use, neighbor);
                    point[k0].surround = point[k0].surround.concat([k]); //pushやspliceだと全てのpointが更新されてしまう
                    point[k].surround = point[k].surround.concat([k0]);
                    k++;
                }
                r = Math.sqrt(3) / 3;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 0)), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 0)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].surround = point[k0 + 1].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 1]);
                    k++;
                    point[k] = new Point(point[k0 + 2].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 90)), point[k0 + 2].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 90)), type, adjacent, surround, use, neighbor);
                    point[k0 + 2].surround = point[k0 + 2].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 2]);
                    k++;
                    point[k] = new Point(point[k0 + 3].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 30)), point[k0 + 3].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 30)), type, adjacent, surround, use, neighbor);
                    point[k0 + 3].surround = point[k0 + 3].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 3]);
                    k++;
                }
                r = 0.5 * Math.sqrt(2);
                for (var m = 0; m < 4; m++) {
                    if (m === 0) { var type2 = 1; } else { var type2 = 0; }
                    point[k] = new Point(point[k0 + 4].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 15)), point[k0 + 4].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 15)), type, adjacent, surround, use, neighbor, [], type2);
                    point[k0 + 4].surround = point[k0 + 4].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 4]);
                    k++;
                }
                r = Math.sqrt(3) / 3;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 5].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 60)), point[k0 + 5].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 5].surround = point[k0 + 5].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 5]);
                    k++;
                }

                type = 2;
                r = 0.5;
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 0)), point[k0].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 0)), type, adjacent, surround, use, neighbor);
                    point[k0].neighbor = point[k0].neighbor.concat([k]);
                    if (m === 0) {
                        point[k - 17].neighbor = point[k - 17].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    } else {
                        point[k - 11].neighbor = point[k - 11].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    }
                    k++;
                }
                r = Math.sqrt(3) / 6;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 1].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 60)), point[k0 + 1].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].neighbor = point[k0 + 1].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                    point[k] = new Point(point[k0 + 2].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 30)), point[k0 + 2].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 30)), type, adjacent, surround, use, neighbor);
                    point[k0 + 2].neighbor = point[k0 + 2].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                    point[k] = new Point(point[k0 + 3].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 90)), point[k0 + 3].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 90)), type, adjacent, surround, use, neighbor);
                    point[k0 + 3].neighbor = point[k0 + 3].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                }
                r = 0.5;
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 4].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 90 + 60)), point[k0 + 4].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 90 + 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 4].neighbor = point[k0 + 4].neighbor.concat([k]);
                    if (m === 3) {
                        point[k - 17].neighbor = point[k - 17].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    } else {
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                    }
                    k++;
                }
                r = Math.sqrt(3) / 6;
                for (var m = 0; m < 3; m++) {
                    point[k] = new Point(point[k0 + 5].x + r * this.size * Math.cos(2 * Math.PI / 360 * (m * 120 + 0)), point[k0 + 5].y + r * this.size * Math.sin(2 * Math.PI / 360 * (m * 120 + 0)), type, adjacent, surround, use, neighbor);
                    point[k0 + 5].neighbor = point[k0 + 5].neighbor.concat([k]);
                    if (m === 2) {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 22].neighbor = point[k - 22].neighbor.concat([k]);
                    } else {
                        point[k - 20].neighbor = point[k - 20].neighbor.concat([k]);
                        point[k - 19].neighbor = point[k - 19].neighbor.concat([k]);
                    }
                    k++;
                }
            }
        }
        // 重複判定
        for (var i = 0; i < point.length; i++) {
            if (!point[i]) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j]) { continue; };
                if ((point[i].x - point[j].x) ** 2 + (point[i].y - point[j].y) ** 2 < 0.01) {
                    //surround,neighbor置換
                    for (var k = 0; k < point.length; k++) {
                        if (!point[k]) { continue; };
                        for (var n = 0; n < point[k].surround.length; n++) {
                            if (point[k].surround[n] === j) {
                                point[k].surround.splice(n, 1, i);
                            }
                        }
                        for (var n = 0; n < point[k].neighbor.length; n++) {
                            if (point[k].neighbor[n] === j) {
                                if (point[k].neighbor.indexOf(i) === -1) {
                                    point[k].neighbor.splice(n, 1, i); //無ければ置き換え
                                } else {
                                    point[k].neighbor.splice(n, 1); //あったら削除
                                }
                            }
                        }
                    }
                    for (var n = 0; n < point[j].surround.length; n++) { //削除された点のsurroundを移し替え
                        if (point[i].surround.indexOf(point[j].surround[n]) === -1) {
                            point[i].surround = point[i].surround.concat([point[j].surround[n]]);
                        }
                    }
                    for (var n = 0; n < point[j].neighbor.length; n++) { //削除された点のneighborを移し替え
                        if (point[i].neighbor.indexOf(point[j].neighbor[n]) === -1) {
                            point[i].neighbor = point[i].neighbor.concat([point[j].neighbor[n]]);
                        }
                    }
                    delete point[j];
                    //置換ここまで
                }
            }
        }
        // adjacent作成
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 0) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 1) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 1) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        //use更新
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0 || point[i].use === -1) { continue; };
            for (var k = 0; k < point[i].neighbor.length; k++) {
                point[point[i].neighbor[k]].use = 1;
            }
            for (var k = 0; k < point[i].surround.length; k++) {
                point[point[i].surround[k]].use = 1;
            }
        }
        //surround並び替え
        var s0;
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0 || point[i].use === -1) { continue; };
            if (point[i].type2 === 0) {
                s0 = point[i].surround[2];
                point[i].surround[2] = point[i].surround[4];
                point[i].surround[4] = s0;
            } else {
                s0 = point[i].surround[3];
                point[i].surround[3] = point[i].surround[4];
                point[i].surround[4] = s0;
                point[i].type2 = 0;
            }
        }
        this.point = point;
    }

    reset_frame() {
        this.create_point();
        this.space = [];

        this.centerlist = [];
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].use === 1 && this.point[i].type === 0) {
                this.centerlist.push(i);
            }
        }
        this.search_center();
        this.width_c = this.width;
        this.height_c = this.height;
        this.center_n0 = this.center_n;
        this.canvasxy_update();
        this.canvas_size_setting();
        this.point_move((this.canvasx * 0.5 - this.point[this.center_n].x + 0.5), (this.canvasy * 0.5 - this.point[this.center_n].y + 0.5), this.theta);

        this.make_frameline();
        this.cursol = this.centerlist[0];
        this.cursolS = 4 * (this.nx0) * (this.ny0) + 4 + 4 * (this.nx0);
    }

    search_center() {
        var xmax = 0,
            xmin = 1e5;
        var ymax = 0,
            ymin = 1e5;
        for (var i of this.centerlist) {
            if (this.point[i].x > xmax) { xmax = this.point[i].x; }
            if (this.point[i].x < xmin) { xmin = this.point[i].x; }
            if (this.point[i].y > ymax) { ymax = this.point[i].y; }
            if (this.point[i].y < ymin) { ymin = this.point[i].y; }
        }
        var x = (xmax + xmin) / 2;
        var y = (ymax + ymin) / 2;
        this.width = (xmax - xmin) / this.size + 2.5;
        this.height = (ymax - ymin) / this.size + 2.5;

        var min0, min = 10e6;
        var num = 0;
        for (var i in this.point) {
            min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
            if (min0 < min) {
                min = min0;
                num = i;
            }
        }
        this.center_n = parseInt(num);
    }

    type_set() {
        var type
        switch (this.mode[this.mode.qa].edit_mode) {
            case "surface":
            case "board":
                type = [0];
                break;
            case "symbol":
            case "move":
                if (document.getElementById('edge_button').textContent === "OFF") {
                    type = [0];
                } else {
                    type = [0, 1, 2];
                }
                break;
            case "number":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3") {
                    type = [5];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "9") {
                    type = [6];
                } else {
                    if (document.getElementById('edge_button').textContent === "OFF") {
                        type = [0];
                    } else {
                        type = [0, 1, 2];
                    }
                }
                break;
            case "line":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "5") {
                    type = [0, 2];
                } else {
                    type = [0];
                }
                break;
            case "lineE":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else {
                    type = [1];
                }
                break;
            case "special":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "polygon") {
                    type = [1];
                } else {
                    type = [0, 1];
                }
                break;
            case "combi":
                switch (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0]) {
                    case "tents":
                    case "linex":
                        type = [0, 2];
                        break;
                    case "edgexoi":
                        type = [0, 1, 2];
                        break;
                    case "blpo":
                    case "blwh":
                    case "battleship":
                    case "star":
                    case "magnets":
                    case "lineox":
                    case "yajilin":
                    case "hashi":
                    case "arrowS":
                    case "shaka":
                    case "numfl":
                    case "alfl":
                        type = [0];
                        break;
                    case "edgesub":
                        type = [0, 1];
                        break;
                }
                break;
        }
        return type;
    }

    recalculate_num(x, y, num) {
        var min0, min = 10e6;
        var num0 = 0;
        var r0 = 0.5 * Math.sqrt(2) / Math.cos(2 * Math.PI / 360 * 22.5);
        var r1 = Math.sqrt(2) - 1;
        if (this.point[num].type != 1) { return num; }

        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].type === 1 && this.point[i].use === 1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type2 === 0 && min0 > (r0 * this.size) ** 2) { continue; } //円形の内側に入っていなければ更新しない
                    if (this.point[i].type2 === 1 && min0 > (r1 * this.size) ** 2) { continue; }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    coord_p_edgex(x, y) {
        var min0, min = 10e6;
        var num = 0;
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.type.indexOf(this.point[i].type) != -1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type === 2 || this.point[i].type === 3) {
                        if (min0 > (0.3 * this.size) ** 2) {
                            continue;
                        }
                    }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    rotate_left() {
        this.theta = (this.theta - 30 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, -30);
        this.redraw();
    }

    rotate_right() {
        this.theta = (this.theta + 30 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, +30);
        this.redraw();
    }


    ////////////////draw/////////////////////

    draw() {
        this.draw_surface("pu_q");
        this.draw_surface("pu_a");
        //    this.draw_squareframe("pu_q");
        //  this.draw_squareframe("pu_a");
        //    this.draw_thermo("pu_q");
        //    this.draw_thermo("pu_a");
        //    this.draw_arrowsp("pu_q");
        //  this.draw_arrowsp("pu_a");
        this.draw_symbol("pu_q", 1);
        this.draw_symbol("pu_a", 1);
        //  this.draw_wall("pu_q");
        //  this.draw_wall("pu_a");
        this.draw_frame();
        this.draw_polygonsp("pu_q");
        this.draw_polygonsp("pu_a");
        this.draw_freeline("pu_q");
        this.draw_freeline("pu_a");
        this.draw_line("pu_q");
        this.draw_line("pu_a");
        //this.draw_direction("pu_q");
        //this.draw_direction("pu_a");
        this.draw_lattice();
        this.draw_frameBold();
        this.draw_symbol("pu_q", 2);
        this.draw_symbol("pu_a", 2);
        //this.draw_cage("pu_q");
        //this.draw_cage("pu_a");
        this.draw_number("pu_q");
        this.draw_number("pu_a");
        this.draw_cursol();
        this.draw_freecircle();

        //this.draw_point();
    }
    draw_point() {
        set_font_style(this.ctx, (0.2 * this.size).toString(), 1);
        for (var i in this.point) {
            if (this.point[i].type === 0) {
                this.ctx.fillStyle = "#000";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 1) {
                this.ctx.fillStyle = "blue";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 2) {
                this.ctx.fillStyle = "red";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 3) {
                this.ctx.fillStyle = "orange";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 4) {
                this.ctx.fillStyle = "green";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 5) {
                this.ctx.fillStyle = "green";
                //this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            }
            this.ctx.beginPath();
            //this.ctx.arc(this.point[i].x,this.point[i].y,2.5,0,2*Math.PI,true);
            this.ctx.fill();
        }
    }

    rotate_theta(th) {
        th = (th + this.theta);
        if (this.reflect[0] === -1) { th = (180 - th + 360) % 360; }
        if (this.reflect[1] === -1) { th = (360 - th + 360) % 360; }
        th = th / 180 * Math.PI;
        return th;
    }
}

class Puzzle_iso extends Puzzle_truncated_square {
    constructor(nx, ny, size) {
        //盤面情報
        super("iso");
        this.gridtype = 'iso';
        this.nx = nx;
        this.ny = ny;
        this.nx0 = this.nx;
        this.ny0 = this.ny;
        this.margin = -1; //for arrow of number pointing outside of the grid

        this.width0 = this.nx + 6;
        this.height0 = this.ny + 6;
        this.width_c = this.width0;
        this.height_c = this.height0;
        this.width = this.width_c;
        this.height = this.height_c;
        this.canvasx = this.width_c * this.size;
        this.canvasy = this.height_c * this.size;
        this.space = [];
        this.size = size;
        this.onoff_symbolmode_list = {
            "cross": 6,
            "arrow_cross": 6,
            "arrow_fourtip": 4,
            "degital": 7,
            "degital_f": 7,
            "arrow_eight": 8,
            "arrow_fouredge_B": 8,
            "arrow_fouredge_G": 8,
            "arrow_fouredge_E": 8,
            "dice": 9,
            "polyomino": 9
        };
        this.reset();
        this.erase_buttons();
        document.getElementById("sub_lineE2_lb").style.display = "inline-block";
    }

    create_point() {
        var k = 0,
            k0;
        var nx = this.nx0;
        var r1, r2, angle;
        var adjacent, surround, type, use, neighbor;
        var point = [];
        adjacent = [];
        surround = [];
        neighbor = [];
        use = 1;
        var offsetx, offsety;
        //center
        for (var j = 0; j < nx; j++) {
            for (var i = 0; i < nx; i++) {

                k0 = k;
                type = 0;
                offsetx = i * 0.5 * Math.sqrt(3) - j * 0.5 * Math.sqrt(3);
                offsety = -i * 0.5 - j * 0.5;
                point[k] = new Point((offsetx) * this.size, (offsety - 0.5) * this.size, type, adjacent, surround, use, neighbor, [], 1);
                k++;
                offsetx = -j * 0.5 * Math.sqrt(3);
                offsety = i - j * 0.5;
                point[k] = new Point((offsetx - Math.sqrt(3) / 4) * this.size, (offsety + 0.25) * this.size, type, adjacent, surround, use, neighbor, [], 2);
                k++;
                offsetx = j * 0.5 * Math.sqrt(3);
                offsety = i - j * 0.5;
                point[k] = new Point((offsetx + Math.sqrt(3) / 4) * this.size, (offsety + 0.25) * this.size, type, adjacent, surround, use, neighbor, [], 3);
                k++;

                type = 1;
                r1 = 0.5 * Math.sqrt(3);
                r2 = 0.5;
                for (var m = 0; m < 2; m++) {
                    point[k] = new Point(point[k0].x + r1 * this.size * Math.cos(2 * Math.PI / 360 * (m * 180 + 0)), point[k0].y + r1 * this.size * Math.sin(2 * Math.PI / 360 * (m * 180 + 0)), type, adjacent, surround, use, neighbor);
                    point[k0].surround = point[k0].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0]);
                    if (m === 0) {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k + 2]);
                    } else {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k - 2]);
                    }
                    k++;
                    point[k] = new Point(point[k0].x + r2 * this.size * Math.cos(2 * Math.PI / 360 * (m * 180 + 90)), point[k0].y + r2 * this.size * Math.sin(2 * Math.PI / 360 * (m * 180 + 90)), type, adjacent, surround, use, neighbor);
                    point[k0].surround = point[k0].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0]);
                    if (m === 0) {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k + 2]);
                    } else {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k - 2]);
                    }
                    k++;
                }
                for (var m = 0; m < 2; m++) {
                    point[k] = new Point(point[k0 + 1].x + r1 * this.size * Math.cos(2 * Math.PI / 360 * (m * 180 + 60)), point[k0 + 1].y + r1 * this.size * Math.sin(2 * Math.PI / 360 * (m * 180 + 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].surround = point[k0 + 1].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 1]);
                    if (m === 0) {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k + 2]);
                    } else {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k - 2]);
                    }
                    k++;
                    point[k] = new Point(point[k0 + 1].x + r2 * this.size * Math.cos(2 * Math.PI / 360 * (m * 180 + 150)), point[k0 + 1].y + r2 * this.size * Math.sin(2 * Math.PI / 360 * (m * 180 + 150)), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].surround = point[k0 + 1].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 1]);
                    if (m === 0) {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k + 2]);
                    } else {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k - 2]);
                    }
                    k++;
                }
                for (var m = 0; m < 2; m++) {
                    point[k] = new Point(point[k0 + 2].x + r1 * this.size * Math.cos(2 * Math.PI / 360 * (m * 180 - 60)), point[k0 + 2].y + r1 * this.size * Math.sin(2 * Math.PI / 360 * (m * 180 - 60)), type, adjacent, surround, use, neighbor);
                    point[k0 + 2].surround = point[k0 + 2].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 2]);
                    if (m === 0) {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k + 2]);
                    } else {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k - 2]);
                    }
                    k++;
                    point[k] = new Point(point[k0 + 2].x + r2 * this.size * Math.cos(2 * Math.PI / 360 * (m * 180 + 30)), point[k0 + 2].y + r2 * this.size * Math.sin(2 * Math.PI / 360 * (m * 180 + 30)), type, adjacent, surround, use, neighbor);
                    point[k0 + 2].surround = point[k0 + 2].surround.concat([k]);
                    point[k].surround = point[k].surround.concat([k0 + 2]);
                    if (m === 0) {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k + 2]);
                    } else {
                        point[k].adjacent_dia = point[k].adjacent_dia.concat([k - 2]);
                    }
                    k++;
                }

                type = 2;
                r1 = 0.5;
                angle = [30, 150, 210, 330];
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0].x + r1 * this.size * Math.cos(2 * Math.PI / 360 * angle[m]), point[k0].y + r1 * this.size * Math.sin(2 * Math.PI / 360 * angle[m]), type, adjacent, surround, use, neighbor);
                    point[k0].neighbor = point[k0].neighbor.concat([k]);
                    if (m === 3) {
                        point[k - 15].neighbor = point[k - 15].neighbor.concat([k]);
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                    } else {
                        point[k - 11].neighbor = point[k - 11].neighbor.concat([k]);
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                    }
                    k++;
                }
                angle = [30, 90, 210, 270];
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 1].x + r1 * this.size * Math.cos(2 * Math.PI / 360 * angle[m]), point[k0 + 1].y + r1 * this.size * Math.sin(2 * Math.PI / 360 * angle[m]), type, adjacent, surround, use, neighbor);
                    point[k0 + 1].neighbor = point[k0 + 1].neighbor.concat([k]);
                    if (m === 0) {
                        point[k - 9].neighbor = point[k - 9].neighbor.concat([k]);
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                    } else {
                        point[k - 13].neighbor = point[k - 13].neighbor.concat([k]);
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                    }
                    k++;
                }
                angle = [-30, 90, 150, 270];
                for (var m = 0; m < 4; m++) {
                    point[k] = new Point(point[k0 + 2].x + r1 * this.size * Math.cos(2 * Math.PI / 360 * angle[m]), point[k0 + 2].y + r1 * this.size * Math.sin(2 * Math.PI / 360 * angle[m]), type, adjacent, surround, use, neighbor);
                    point[k0 + 2].neighbor = point[k0 + 2].neighbor.concat([k]);
                    if (m === 3) {
                        point[k - 15].neighbor = point[k - 15].neighbor.concat([k]);
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                    } else {
                        point[k - 11].neighbor = point[k - 11].neighbor.concat([k]);
                        point[k - 12].neighbor = point[k - 12].neighbor.concat([k]);
                    }
                    k++;
                }

            }
        }

        // 重複判定
        for (var i = 0; i < point.length; i++) {
            if (!point[i]) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j]) { continue; };
                if ((point[i].x - point[j].x) ** 2 + (point[i].y - point[j].y) ** 2 < 0.01) {
                    //surround,neighbor置換
                    for (var k = 0; k < point.length; k++) {
                        if (!point[k]) { continue; };
                        for (var n = 0; n < point[k].surround.length; n++) {
                            if (point[k].surround[n] === j) {
                                point[k].surround.splice(n, 1, i);
                            }
                        }
                        for (var n = 0; n < point[k].neighbor.length; n++) {
                            if (point[k].neighbor[n] === j) {
                                if (point[k].neighbor.indexOf(i) === -1) {
                                    point[k].neighbor.splice(n, 1, i); //無ければ置き換え
                                } else {
                                    point[k].neighbor.splice(n, 1); //あったら削除
                                }
                            }
                        }
                        for (var n = 0; n < point[k].adjacent_dia.length; n++) {
                            if (point[k].adjacent_dia[n] === j) {
                                point[k].adjacent_dia.splice(n, 1, i);
                            }
                        }
                    }
                    for (var n = 0; n < point[j].surround.length; n++) { //削除された点のsurroundを移し替え
                        if (point[i].surround.indexOf(point[j].surround[n]) === -1) {
                            point[i].surround = point[i].surround.concat([point[j].surround[n]]);
                        }
                    }
                    for (var n = 0; n < point[j].neighbor.length; n++) { //削除された点のneighborを移し替え
                        if (point[i].neighbor.indexOf(point[j].neighbor[n]) === -1) {
                            point[i].neighbor = point[i].neighbor.concat([point[j].neighbor[n]]);
                        }
                    }
                    for (var n = 0; n < point[j].adjacent_dia.length; n++) { //削除された点のadjacent_diaを移し替え
                        if (point[i].adjacent_dia.indexOf(point[j].adjacent_dia[n]) === -1) {
                            point[i].adjacent_dia = point[i].adjacent_dia.concat([point[j].adjacent_dia[n]]);
                        }
                    }
                    delete point[j];
                    //置換ここまで
                }
            }
        }
        // adjacent作成
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 0) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 0) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        for (var i = 0; i < point.length; i++) {
            if (!point[i] || point[i].type != 1) { continue; };
            for (var j = i + 1; j < point.length; j++) {
                if (!point[j] || point[j].type != 1) { continue; };
                for (var k = 0; k < point[i].neighbor.length; k++) {
                    if (point[j].neighbor.indexOf(point[i].neighbor[k]) != -1) {
                        point[i].adjacent = point[i].adjacent.concat([j]);
                        point[j].adjacent = point[j].adjacent.concat([i]);
                    }
                }
            }
        }
        this.point = point;
    }

    reset_frame() {
        this.create_point();
        this.space = [];

        this.centerlist = [];
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].use === 1 && this.point[i].type === 0) {
                this.centerlist.push(i);
            }
        }
        this.search_center();
        this.width_c = this.width;
        this.height_c = this.height;
        this.center_n0 = this.center_n;
        this.canvasxy_update();
        this.canvas_size_setting();
        this.point_move((this.canvasx * 0.5 - this.point[this.center_n].x + 0.5), (this.canvasy * 0.5 - this.point[this.center_n].y + 0.5), this.theta);

        this.make_frameline();
        this.cursol = this.centerlist[0];
        this.cursolS = 4 * (this.nx0) * (this.ny0) + 4 + 4 * (this.nx0);
    }

    search_center() {
        var xmax = 0,
            xmin = 1e5;
        var ymax = 0,
            ymin = 1e5;
        for (var i of this.centerlist) {
            if (this.point[i].x > xmax) { xmax = this.point[i].x; }
            if (this.point[i].x < xmin) { xmin = this.point[i].x; }
            if (this.point[i].y > ymax) { ymax = this.point[i].y; }
            if (this.point[i].y < ymin) { ymin = this.point[i].y; }
        }
        var x = (xmax + xmin) / 2;
        var y = (ymax + ymin) / 2;
        this.width = (xmax - xmin) / this.size + 2.5;
        this.height = (ymax - ymin) / this.size + 2.5;

        var min0, min = 10e6;
        var num = 0;
        for (var i in this.point) {
            min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
            if (min0 < min) {
                min = min0;
                num = i;
            }
        }
        this.center_n = parseInt(num);
    }

    type_set() {
        var type
        switch (this.mode[this.mode.qa].edit_mode) {
            case "surface":
            case "board":
                type = [0];
                break;
            case "symbol":
            case "move":
                if (document.getElementById('edge_button').textContent === "OFF") {
                    type = [0];
                } else {
                    type = [0, 1, 2];
                }
                break;
            case "number":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3") {
                    type = [5];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "9") {
                    type = [6];
                } else {
                    if (document.getElementById('edge_button').textContent === "OFF") {
                        type = [0];
                    } else {
                        type = [0, 1, 2];
                    }
                }
                break;
            case "line":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "5") {
                    type = [0, 2];
                } else {
                    type = [0];
                }
                break;
            case "lineE":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4") {
                    type = [2];
                } else if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "2") {
                    type = [0, 1];
                } else {
                    type = [1];
                }
                break;
            case "special":
                if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "polygon") {
                    type = [1];
                } else {
                    type = [0, 1];
                }
                break;
            case "combi":
                switch (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0]) {
                    case "tents":
                    case "linex":
                        type = [0, 2];
                        break;
                    case "edgexoi":
                        type = [0, 1, 2];
                        break;
                    case "blpo":
                    case "blwh":
                    case "battleship":
                    case "star":
                    case "magnets":
                    case "lineox":
                    case "yajilin":
                    case "hashi":
                    case "arrowS":
                    case "shaka":
                    case "numfl":
                    case "alfl":
                        type = [0];
                        break;
                    case "edgesub":
                        type = [0, 1];
                        break;
                }
                break;
        }
        return type;
    }

    recalculate_num(x, y, num) {
        var min0, min = 10e6;
        var num0 = 0;
        var r0 = 0.5 * Math.sqrt(2) / Math.cos(2 * Math.PI / 360 * 22.5);
        var r1 = Math.sqrt(2) - 1;
        if (this.point[num].type != 1) { return num; }

        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.point[i].type === 1 && this.point[i].use === 1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type2 === 0 && min0 > (r0 * this.size) ** 2) { continue; } //円形の内側に入っていなければ更新しない
                    if (this.point[i].type2 === 1 && min0 > (r1 * this.size) ** 2) { continue; }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    coord_p_edgex(x, y) {
        var min0, min = 10e6;
        var num = 0;
        for (var i = 0; i < this.point.length; i++) {
            if (this.point[i] && this.type.indexOf(this.point[i].type) != -1) {
                min0 = (x - this.point[i].x) ** 2 + (y - this.point[i].y) ** 2;
                if (min0 < min) {
                    if (this.point[i].type === 2 || this.point[i].type === 3) {
                        if (min0 > (0.3 * this.size) ** 2) {
                            continue;
                        }
                    }
                    min = min0;
                    num = i;
                }
            }
        }
        return parseInt(num);
    }

    rotate_left() {
        this.theta = (this.theta - 30 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, -30);
        this.redraw();
    }

    rotate_right() {
        this.theta = (this.theta + 30 * this.reflect[0] * this.reflect[1] + 360) % 360;
        this.point_move(0, 0, +30);
        this.redraw();
    }

    direction_arrow8(x, y, x0, y0) {
        var angle = Math.atan2(y - y0, x - x0) * 360 / 2 / Math.PI + 180;
        if (this.reflect[0] === -1) { angle = (180 - angle + 360) % 360; }
        if (this.reflect[1] === -1) { angle = (360 - angle + 360) % 360; }
        angle = (angle - this.theta + 360) % 360;
        angle -= 180;
        var a;
        if (angle < -120) {
            a = 0;
        } else if (angle > -120 && angle < -60) {
            a = 1;
        } else if (angle > -60 && angle < 0) {
            a = 2;
        } else if (angle > 0 && angle < 60) {
            a = 3;
        } else if (angle > 60 && angle < 120) {
            a = 4;
        } else if (angle > 120) {
            a = 5;
        }
        return a;
    }


    ////////////////draw/////////////////////

    draw() {
        this.draw_surface("pu_q");
        this.draw_surface("pu_a");
        //    this.draw_squareframe("pu_q");
        //  this.draw_squareframe("pu_a");
        //    this.draw_thermo("pu_q");
        //    this.draw_thermo("pu_a");
        //    this.draw_arrowsp("pu_q");
        //  this.draw_arrowsp("pu_a");
        this.draw_symbol("pu_q", 1);
        this.draw_symbol("pu_a", 1);
        //  this.draw_wall("pu_q");
        //  this.draw_wall("pu_a");
        this.draw_frame();
        this.draw_polygonsp("pu_q");
        this.draw_polygonsp("pu_a");
        this.draw_freeline("pu_q");
        this.draw_freeline("pu_a");
        this.draw_line("pu_q");
        this.draw_line("pu_a");
        //this.draw_direction("pu_q");
        //this.draw_direction("pu_a");
        this.draw_lattice();
        this.draw_frameBold();
        this.draw_symbol("pu_q", 2);
        this.draw_symbol("pu_a", 2);
        //this.draw_cage("pu_q");
        //this.draw_cage("pu_a");
        this.draw_number("pu_q");
        this.draw_number("pu_a");
        this.draw_cursol();
        this.draw_freecircle();

        //this.draw_point();
    }
    draw_point() {
        set_font_style(this.ctx, (0.2 * this.size).toString(), 1);
        for (var i in this.point) {
            if (this.point[i].type === 0) {
                this.ctx.fillStyle = "#000";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 1) {
                this.ctx.fillStyle = "blue";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
            } else if (this.point[i].type === 2) {
                this.ctx.fillStyle = "red";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 3) {
                this.ctx.fillStyle = "orange";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 4) {
                this.ctx.fillStyle = "green";
                if (this.point[i].use === 1) {
                    this.ctx.text(i, this.point[i].x, this.point[i].y, 0.8 * this.size);
                }
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            } else if (this.point[i].type === 5) {
                this.ctx.fillStyle = "green";
                //this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
                this.ctx.fillStyle = "rgba(0,0,0,0)";
            }
            this.ctx.beginPath();
            //this.ctx.arc(this.point[i].x,this.point[i].y,2.5,0,2*Math.PI,true);
            this.ctx.fill();
        }
    }

    draw_line(pu) {
        for (var i in this[pu].line) {
            if (this[pu].line[i] === 98) {
                var r = 0.2;
                var x = this.point[i].x;
                var y = this.point[i].y;
                set_line_style(this.ctx, 98);
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(45 * (Math.PI / 180)) * this.size, y + r * Math.sin(45 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(225 * (Math.PI / 180)) * this.size, y + r * Math.sin(225 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(135 * (Math.PI / 180)) * this.size, y + r * Math.sin(135 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(315 * (Math.PI / 180)) * this.size, y + r * Math.sin(315 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
            } else {
                set_line_style(this.ctx, this[pu].line[i]);
                var i1 = i.split(",")[0];
                var i2 = i.split(",")[1];
                var i3;
                //search neighbor
                for (var j = 0; j < 4; j++) {
                    if (this.point[i2].neighbor.indexOf(this.point[i1].neighbor[j]) != -1) {
                        i3 = this.point[i1].neighbor[j];
                    }
                }
                this.ctx.beginPath();
                if (this[pu].line[i] === 40) {
                    var r = 0.6;
                    var x1 = r * this.point[i1].x + (1 - r) * this.point[i3].x;
                    var y1 = r * this.point[i1].y + (1 - r) * this.point[i3].y;
                    var x2 = (1 - r) * this.point[i3].x + r * this.point[i2].x;
                    var y2 = (1 - r) * this.point[i3].y + r * this.point[i2].y;
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(this.point[i3].x, this.point[i3].y);
                    this.ctx.lineTo(x2, y2);
                } else if (this[pu].line[i] === 30) {
                    var r = 0.15 * this.size;
                    var dx = this.point[i1].x - this.point[i2].x;
                    var dy = this.point[i1].y - this.point[i2].y;
                    var d = Math.sqrt(dx ** 2 + dy ** 2);
                    this.ctx.moveTo(this.point[i1].x - r / d * dy, this.point[i1].y + r / d * dx);
                    this.ctx.lineTo(this.point[i2].x - r / d * dy, this.point[i2].y + r / d * dx);
                    this.ctx.stroke();
                    this.ctx.moveTo(this.point[i1].x + r / d * dy, this.point[i1].y - r / d * dx);
                    this.ctx.lineTo(this.point[i2].x + r / d * dy, this.point[i2].y - r / d * dx);
                } else {
                    if (this.point[i1].type === 2 || this.point[i1].type === 3) { //for centerline
                        this.ctx.moveTo(this.point[i2].x, this.point[i2].y);
                        this.ctx.lineTo((this.point[i1].x + this.point[i2].x) * 0.5, (this.point[i1].y + this.point[i2].y) * 0.5);
                        this.ctx.stroke();
                        this.ctx.lineCap = "butt";
                    } else if (this.point[i2].type === 2 || this.point[i2].type === 3) {
                        this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
                        this.ctx.lineTo((this.point[i1].x + this.point[i2].x) * 0.5, (this.point[i1].y + this.point[i2].y) * 0.5);
                        this.ctx.stroke();
                        this.ctx.lineCap = "butt";
                    }
                    this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
                    this.ctx.lineTo(this.point[i3].x, this.point[i3].y);
                    this.ctx.lineTo(this.point[i2].x, this.point[i2].y);
                }
                this.ctx.stroke();
            }
        }
        for (var i in this[pu].lineE) {
            if (this[pu].lineE[i] === 98) {
                var r = 0.2;
                var x = this.point[i].x;
                var y = this.point[i].y;
                set_line_style(this.ctx, 98);
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(45 * (Math.PI / 180)) * this.size, y + r * Math.sin(45 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(225 * (Math.PI / 180)) * this.size, y + r * Math.sin(225 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * Math.cos(135 * (Math.PI / 180)) * this.size, y + r * Math.sin(135 * (Math.PI / 180)) * this.size);
                this.ctx.lineTo(x + r * Math.cos(315 * (Math.PI / 180)) * this.size, y + r * Math.sin(315 * (Math.PI / 180)) * this.size);
                this.ctx.stroke();
            } else {
                set_line_style(this.ctx, this[pu].lineE[i]);
                var i1 = i.split(",")[0];
                var i2 = i.split(",")[1];
                this.ctx.beginPath();
                if (this[pu].lineE[i] === 30) {
                    var r = 0.15 * this.size;
                    var dx = this.point[i1].x - this.point[i2].x;
                    var dy = this.point[i1].y - this.point[i2].y;
                    var d = Math.sqrt(dx ** 2 + dy ** 2);
                    this.ctx.moveTo(this.point[i1].x - r / d * dy, this.point[i1].y + r / d * dx);
                    this.ctx.lineTo(this.point[i2].x - r / d * dy, this.point[i2].y + r / d * dx);
                    this.ctx.stroke();
                    this.ctx.moveTo(this.point[i1].x + r / d * dy, this.point[i1].y - r / d * dx);
                    this.ctx.lineTo(this.point[i2].x + r / d * dy, this.point[i2].y - r / d * dx);
                } else {
                    this.ctx.moveTo(this.point[i1].x, this.point[i1].y);
                    this.ctx.lineTo(this.point[i2].x, this.point[i2].y);
                }
                this.ctx.stroke();
            }
        }
    }

    draw_number(pu) {
        /*number*/
        for (var i in this[pu].number) {
            switch (this[pu].number[i][2]) {
                case "1": //normal
                    this.draw_numbercircle(pu, i, 0.42);
                    set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.text(this[pu].number[i][0], this.point[i].x, this.point[i].y + 0.06 * this.size, this.size * 0.8);
                    break;
                case "2": //arrow
                    var arrowlength = 0.7;
                    this.draw_numbercircle(pu, i, 0.42);
                    set_font_style(this.ctx, 0.65 * this.size.toString(10), this[pu].number[i][1]);
                    var direction = {
                        "_0": 150,
                        "_1": 90,
                        "_2": 30,
                        "_3": 330,
                        "_4": 270,
                        "_5": 210
                    }
                    direction = (direction[this[pu].number[i][0].slice(-2)] - this.theta + 360) % 360;
                    if (this.reflect[0] === -1) { direction = (180 - direction + 360) % 360; }
                    if (this.reflect[1] === -1) { direction = (360 - direction + 360) % 360; }
                    switch (direction) {
                        case 120:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x - 0.1 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x + (arrowlength * 0.25 + 0.15) * this.size, this.point[i].y + (arrowlength * 0.25 * Math.sqrt(3) - 0.15) * this.size,
                                this.point[i].x + (-arrowlength * 0.25 + 0.15) * this.size, this.point[i].y + (-arrowlength * 0.25 * Math.sqrt(3) - 0.15) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 300:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x - 0.1 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x + (-arrowlength * 0.25 + 0.2) * this.size, this.point[i].y + (-arrowlength * 0.25 * Math.sqrt(3) - 0.1) * this.size,
                                this.point[i].x + (arrowlength * 0.25 + 0.2) * this.size, this.point[i].y + (arrowlength * 0.25 * Math.sqrt(3) - 0.1) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 60:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x + 0.1 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x - (arrowlength * 0.25 + 0.15) * this.size, this.point[i].y + (arrowlength * 0.25 * Math.sqrt(3) - 0.15) * this.size,
                                this.point[i].x - (-arrowlength * 0.25 + 0.15) * this.size, this.point[i].y + (-arrowlength * 0.25 * Math.sqrt(3) - 0.15) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 240:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x + 0.1 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x - (-arrowlength * 0.25 + 0.2) * this.size, this.point[i].y + (-arrowlength * 0.25 * Math.sqrt(3) - 0.1) * this.size,
                                this.point[i].x - (arrowlength * 0.25 + 0.2) * this.size, this.point[i].y + (arrowlength * 0.25 * Math.sqrt(3) - 0.1) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 180:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x + 0.0 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x + (arrowlength * 0.5 + 0.0) * this.size, this.point[i].y + (arrowlength * 0.0 - 0.3) * this.size,
                                this.point[i].x + (-arrowlength * 0.5 + 0.0) * this.size, this.point[i].y + (-arrowlength * 0.0 - 0.3) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 0:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x + 0.0 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x - (arrowlength * 0.5 + 0.0) * this.size, this.point[i].y + (arrowlength * 0.0 - 0.3) * this.size,
                                this.point[i].x - (-arrowlength * 0.5 + 0.0) * this.size, this.point[i].y + (-arrowlength * 0.0 - 0.3) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 150:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x - 0.0 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x + (arrowlength * 0.25 * Math.sqrt(3) + 0.1) * this.size, this.point[i].y + (arrowlength * 0.25 - 0.2) * this.size,
                                this.point[i].x + (-arrowlength * 0.25 * Math.sqrt(3) + 0.1) * this.size, this.point[i].y + (-arrowlength * 0.25 - 0.2) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 330:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x - 0.0 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x + (-arrowlength * 0.25 * Math.sqrt(3) + 0.15) * this.size, this.point[i].y + (-arrowlength * 0.25 - 0.15) * this.size,
                                this.point[i].x + (arrowlength * 0.25 * Math.sqrt(3) + 0.15) * this.size, this.point[i].y + (arrowlength * 0.25 - 0.15) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 30:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x + 0.0 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x - (arrowlength * 0.25 * Math.sqrt(3) + 0.1) * this.size, this.point[i].y + (arrowlength * 0.25 - 0.2) * this.size,
                                this.point[i].x - (-arrowlength * 0.25 * Math.sqrt(3) + 0.1) * this.size, this.point[i].y + (-arrowlength * 0.25 - 0.2) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 210:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x + 0.0 * this.size, this.point[i].y + 0.15 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x - (-arrowlength * 0.25 * Math.sqrt(3) + 0.15) * this.size, this.point[i].y + (-arrowlength * 0.25 - 0.15) * this.size,
                                this.point[i].x - (arrowlength * 0.25 * Math.sqrt(3) + 0.15) * this.size, this.point[i].y + (arrowlength * 0.25 - 0.15) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 90:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x - 0.1 * this.size, this.point[i].y + 0.05 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x + (arrowlength * 0.0 + 0.25) * this.size, this.point[i].y + (arrowlength * 0.5 - 0.0) * this.size,
                                this.point[i].x + (-arrowlength * 0.0 + 0.25) * this.size, this.point[i].y + (-arrowlength * 0.5 - 0.0) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        case 270:
                            this.ctx.text(this[pu].number[i][0].slice(0, -2), this.point[i].x - 0.1 * this.size, this.point[i].y + 0.05 * this.size, this.size * 0.7);
                            this.ctx.beginPath();
                            this.ctx.arrow(this.point[i].x + (arrowlength * 0.0 + 0.25) * this.size, this.point[i].y + (-arrowlength * 0.5 - 0.0) * this.size,
                                this.point[i].x + (-arrowlength * 0.0 + 0.25) * this.size, this.point[i].y + (arrowlength * 0.5 - 0.0) * this.size, [0, 1, -0.25 * this.size, 1, -0.25 * this.size, 3]);
                            this.ctx.stroke();
                            this.ctx.fill();
                            break;
                        default:
                            set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                            this.ctx.text(this[pu].number[i][0], this.point[i].x, this.point[i].y + 0.06 * this.size, this.size * 0.8);
                            break;
                    }
                    break;
                case "4": //tapa
                    this.draw_numbercircle(pu, i, 0.44);
                    if (this[pu].number[i][0].length === 1) {
                        set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0], this.point[i].x, this.point[i].y + 0.06 * this.size, this.size * 0.8);
                    } else if (this[pu].number[i][0].length === 2) {
                        set_font_style(this.ctx, 0.48 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0].slice(0, 1), this.point[i].x - 0.16 * this.size, this.point[i].y - 0.15 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(1, 2), this.point[i].x + 0.18 * this.size, this.point[i].y + 0.19 * this.size, this.size * 0.8);
                    } else if (this[pu].number[i][0].length === 3) {
                        set_font_style(this.ctx, 0.45 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0].slice(0, 1), this.point[i].x - 0.22 * this.size, this.point[i].y - 0.14 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(1, 2), this.point[i].x + 0.24 * this.size, this.point[i].y - 0.05 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(2, 3), this.point[i].x - 0.0 * this.size, this.point[i].y + 0.3 * this.size, this.size * 0.8);
                    } else if (this[pu].number[i][0].length === 4) {
                        set_font_style(this.ctx, 0.4 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text(this[pu].number[i][0].slice(0, 1), this.point[i].x - 0.0 * this.size, this.point[i].y - 0.22 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(1, 2), this.point[i].x - 0.26 * this.size, this.point[i].y + 0.04 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(2, 3), this.point[i].x + 0.26 * this.size, this.point[i].y + 0.04 * this.size, this.size * 0.8);
                        this.ctx.text(this[pu].number[i][0].slice(3, 4), this.point[i].x - 0.0 * this.size, this.point[i].y + 0.3 * this.size, this.size * 0.8);
                    }
                    break;
                case "5": //small
                    this.draw_numbercircle(pu, i, 0.17);
                    set_font_style(this.ctx, 0.25 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.text(this[pu].number[i][0], this.point[i].x, this.point[i].y + 0.02 * this.size, this.size * 0.8);
                    break;
                case "6": //medium
                    this.draw_numbercircle(pu, i, 0.25);
                    set_font_style(this.ctx, 0.4 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.text(this[pu].number[i][0], this.point[i].x, this.point[i].y + 0.03 * this.size, this.size * 0.8);
                    break;
                case "7": //sudoku
                    this.draw_numbercircle(pu, i, 0.42);
                    var sum = 0,
                        pos = 0;
                    for (var j = 0; j < 9; j++) {
                        if (this[pu].number[i][0][j] === 1) {
                            sum += 1;
                            pos = j;
                        }
                    }
                    if (sum === 1) {
                        set_font_style(this.ctx, 0.7 * this.size.toString(10), this[pu].number[i][1]);
                        this.ctx.text((pos + 1).toString(), this.point[i].x, this.point[i].y + 0.06 * this.size, this.size * 0.8);
                    } else {
                        set_font_style(this.ctx, 0.3 * this.size.toString(10), this[pu].number[i][1]);
                        for (var j = 0; j < 9; j++) {
                            if (this[pu].number[i][0][j] === 1) {
                                this.ctx.text((j + 1).toString(), this.point[i].x + ((j % 3 - 1) * 0.25) * this.size, this.point[i].y + (((j / 3 | 0) - 1) * 0.25 + 0.01) * this.size);
                            }
                        }
                    }
                    break;
                case "8": //long
                    if (this[pu].number[i][1] === 5) {
                        set_font_style(this.ctx, 0.5 * this.size.toString(10), this[pu].number[i][1]);
                        set_circle_style(this.ctx, 7);
                        this.ctx.fillRect(this.point[i].x - 0.2 * this.size, this.point[i].y - 0.25 * this.size, this.ctx.measureText(this[pu].number[i][0]).width, 0.5 * this.size);
                    }
                    set_font_style(this.ctx, 0.5 * this.size.toString(10), this[pu].number[i][1]);
                    this.ctx.textAlign = "left";
                    this.ctx.text(this[pu].number[i][0], this.point[i].x - 0.2 * this.size, this.point[i].y);
                    break;
            }
        }

        for (var i in this[pu].numberS) {
            if (this[pu].numberS[i][1] === 5) {
                set_circle_style(this.ctx, 7);
                this.draw_circle(this.ctx, this.point[i].x, this.point[i].y, 0.15);
            } else if (this[pu].numberS[i][1] === 6) {
                set_circle_style(this.ctx, 1);
                this.draw_circle(this.ctx, this.point[i].x, this.point[i].y, 0.15);
            } else if (this[pu].numberS[i][1] === 7) {
                set_circle_style(this.ctx, 2);
                this.draw_circle(this.ctx, this.point[i].x, this.point[i].y, 0.15);
            }
            if (true) {
                set_font_style(this.ctx, 0.26 * this.size.toString(10), this[pu].numberS[i][1]);
                this.ctx.textAlign = "center";
                this.ctx.text(this[pu].numberS[i][0], this.point[i].x, this.point[i].y + 0.03 * this.size, 0.3 * this.size);
            }
        }
    }

    draw_cross(ctx, num, x, y) {
        for (var i = 0; i < 6; i++) {
            if (num[i] === 1) {
                var th = this.rotate_theta(i * 60 - 150);
                ctx.beginPath();
                ctx.moveTo(x + ctx.lineWidth * 0.3 * Math.cos(th), y + ctx.lineWidth * 0.3 * Math.sin(th));
                ctx.lineTo(x - 0.5 * pu.size * Math.cos(th), y - 0.5 * pu.size * Math.sin(th));
                ctx.stroke();
            }
        }
    }

    draw_inequality(ctx, num, x, y) {
        var th;
        var len = 0.14;
        switch (num) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                ctx.beginPath();
                th = this.rotate_theta((num - 1) * 60 + 75);
                ctx.moveTo(x + len * Math.sqrt(2) * pu.size * Math.cos(th), y + len * Math.sqrt(2) * pu.size * Math.sin(th));
                th = this.rotate_theta((num - 1) * 60 + 210);
                ctx.lineTo(x + len * pu.size * Math.cos(th), y + len * pu.size * Math.sin(th));
                th = this.rotate_theta((num - 1) * 60 + 345);
                ctx.lineTo(x + len * Math.sqrt(2) * pu.size * Math.cos(th), y + len * Math.sqrt(2) * pu.size * Math.sin(th));
                ctx.fill();
                ctx.stroke();
                break;
        }
    }

    draw_arrowGP(ctx, num, x, y) {
        var len1 = 0.35; //nemoto
        var len2 = 0.35; //tip
        var w1 = 0.12;
        var w2 = 0.23;
        var w3 = 0.34;
        var r1 = -0.33;
        var r2 = -0.44;
        var r3 = -0.32;
        var th;
        if (num > 0 && num <= 6) {
            th = this.rotate_theta((num - 1) * 60 - 150);
            ctx.beginPath();
            ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, r1 * pu.size, w1 * pu.size, r2 * pu.size, w2 * pu.size, r3 * pu.size, w3 * pu.size]);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw_arrowGP_C(ctx, num, x, y) {
        if (num > 0 && num <= 6) {
            var th = this.rotate_theta((num - 1) * 60 - 150);
            this.draw_circle(ctx, x, y, 0.35);
            this.draw_arrowGP(ctx, num, x + 0.5 * pu.size * Math.cos(th), y + 0.5 * pu.size * Math.sin(th));
        }
    }

    draw_arrow(ctx, num, x, y, len1, len2, w1, w2, ri) {
        var th;
        if (num > 0 && num <= 6) {
            th = this.rotate_theta((num - 1) * 60 - 150);
            ctx.beginPath();
            ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw_arrowcross(ctx, num, x, y) {
        var w1 = 0.025;
        var w2 = 0.12;
        var len1 = 0.5 * w1; //nemoto
        var len2 = 0.45; //tip
        var ri = -0.18;
        var th;
        for (var i = 0; i < 6; i++) {
            if (num[i] === 1) {
                th = this.rotate_theta(i * 60 - 150);
                ctx.beginPath();
                ctx.arrow(x - len1 * pu.size * Math.cos(th), y - len1 * pu.size * Math.sin(th), x + len2 * pu.size * Math.cos(th), y + len2 * pu.size * Math.sin(th), [0, w1 * pu.size, ri * pu.size, w1 * pu.size, ri * pu.size, w2 * pu.size]);
                ctx.fill();
            }
        }
    }

    draw_arroweight(ctx, num, x, y) {
        var len1 = -0.2; //nemoto
        var len2 = 0.45; //tip
        var w1 = 0.025;
        var w2 = 0.10;
        var ri = -0.15;
        for (var i = 0; i < 6; i++) {
            if (num[i] === 1) {
                this.draw_arrow(ctx, i + 1, x, y, len1, len2, w1, w2, ri);
            }
        }
    }

    rotate_theta(th) {
        th = (th + this.theta);
        if (this.reflect[0] === -1) { th = (180 - th + 360) % 360; }
        if (this.reflect[1] === -1) { th = (360 - th + 360) % 360; }
        th = th / 180 * Math.PI;
        return th;
    }
}