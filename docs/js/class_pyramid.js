class Puzzle_pyramid extends Puzzle{
  constructor(nx,ny,size){
    //盤面情報
    super('pyramid');
    this.nx = nx;
    this.ny = ny;
    this.corner = 6;
    this.nx0 = this.nx+4;
    this.ny0 = this.ny+4;
    this.margin = -1; //for arrow of number pointing outside of the grid

    this.top_n = parseInt(this.nx0*2.5);

    this.width0 = this.nx+1;
    this.height0 = this.ny+1;
    this.width_c = this.width0;
    this.height_c = this.height0;
    this.width = this.width_c;
    this.height = this.height_c;
    this.canvasx = this.width_c*this.size;
    this.canvasy = this.height_c*this.size;
    this.space = [
      parseInt(document.getElementById("nb_space1").value,10)
    ];
    this.size = size;
    this.onoff_symbolmode_list = {
      "cross":6,
      "arrow_cross":6,
      "degital":7,
      "degital_f":7,
      "arrow_eight":6,
      "dice":9,
      "polyomino":9
    };
    this.reset();
    this.erase_buttons();
  }

  erase_buttons(){
    for (var i of this.group1){
      document.getElementById(i).style.display = "none";
    }
    for (var i of this.group2){
      document.getElementById(i).style.display = "inline-block";
    }
    for (var i of this.group3){
      document.getElementById(i).style.display = "none";
    }
  }

  create_point(){
    var k = 0;
    var nx = this.nx0;
    var ny = this.ny0;
    var adjacent,surround,type,use;
    var point = [];
    //center
    type = 0;
    for (var j=0; j<ny; j++){
      for (var i=0; i<nx; i++){
        if(i===0||i===nx-1||j===0||j===ny-1){use=-1;}else{use=1;}
        adjacent = [k-nx-1+j%2,k-nx+j%2,k-1,k+1,k+nx-1+j%2,k+nx+j%2];
        surround = [k+nx*ny-1,k+2*nx*ny-nx-1+j%2,k+nx*ny,k+2*nx*ny,k+nx*ny+nx-1+j%2,k+2*nx*ny-1];
        point[k] = new Point((i+0.5+(j%2)*0.5)*this.size,(j+0.5)*this.size,type,adjacent,surround,use);
        k++;
      }
    }
    //vertex
    type = 1;
    for (var j=0; j<ny; j++){
      for (var i=0; i<nx; i++){
        if(i===0||i===nx-1||j===0||j===ny-1){use=-1;}else{use=1;}
        adjacent = [k+nx*ny-nx-1+j%2,k+nx*ny-nx+j%2,k+nx*ny];
        surround = [k+nx*ny-2*nx];//for wall
        point[k] = new Point(point[i+j*nx].x+0.5*this.size,point[i+j*nx].y-0.5*this.size,type,adjacent,surround,use);
        k++;
      }
    }
    for (var j=0; j<ny; j++){
      for (var i=0; i<nx; i++){
        if(i===0||i===nx-1||j===0||j===ny-1){use=-1;}else{use=1;}
        adjacent = [k-nx*ny,k-nx*ny+nx-1+j%2,k-nx*ny+nx+j%2];
        surround = [k-nx*ny+2*nx];//for wall
        point[k] = new Point(point[i+j*nx].x+0.5*this.size,point[i+j*nx].y+0.5*this.size,type,adjacent,surround,use);
        k++;
      }
    }

    //centervertex
    type = 2;
    for (var j=0; j<ny; j++){
      for (var i=0; i<nx; i++){
        if(i===0||i===nx-1||j===0||j===ny-1){use=-1;}else{use=1;}
        adjacent = [];
        surround = [k-1,k+1]; //for wall
        point[k] = new Point(point[i+j*nx].x+0.5*this.size,point[i+j*nx].y,type,adjacent,surround,use);
        k++;
      }
    }

    type = 3;
    for (var j=0; j<ny; j++){
      for (var i=0; i<nx; i++){
        if(i===0||i===nx-1||j===0||j===ny-1){use=-1;}else{use=1;}
        adjacent = [];
        surround = [];
        point[k] = new Point(point[i+j*nx].x-0.25*this.size,point[i+j*nx].y+0.5*this.size,type,adjacent,surround,use);
        k++;
        adjacent = [];
        surround = [];
        point[k] = new Point(point[i+j*nx].x+0.25*this.size,point[i+j*nx].y+0.5*this.size,type,adjacent,surround,use);
        k++;
      }
    }

    //  1/4
    var r = 0.25;
    type = 4;
    for (var j=0; j<ny; j++){
      for (var i=0; i<nx; i++){
        if(i===0||i===nx-1||j===0||j===ny-1){use=-1;}else{use=1;}
        surround = [];
        adjacent = [];
        point[k] = new Point(point[i+j*nx].x-r*this.size,point[i+j*nx].y-r*this.size,type,adjacent,surround,use);
        k++;
        point[k] = new Point(point[i+j*nx].x+r*this.size,point[i+j*nx].y-r*this.size,type,adjacent,surround,use);
        k++;
        point[k] = new Point(point[i+j*nx].x-r*this.size,point[i+j*nx].y+r*this.size,type,adjacent,surround,use);
        k++;
        point[k] = new Point(point[i+j*nx].x+r*this.size,point[i+j*nx].y+r*this.size,type,adjacent,surround,use);
        k++;
      }
    }
    /*
    //  compass
    var r = 0.3;
    type = 5;
    for (var j=0; j<ny; j++){
      for (var i=0; i<nx; i++){
        if(i===0||i===nx-1||j===0||j===ny-1){use=-1;}else{use=1;}
        adjacent = [];
        surround = [];
        point[k] = new Point(point[i+j*nx].x-0*this.size,point[i+j*nx].y-r*this.size,type,adjacent,surround,use);
        k++;
        point[k] = new Point(point[i+j*nx].x+r*this.size,point[i+j*nx].y-0*this.size,type,adjacent,surround,use);
        k++;
        point[k] = new Point(point[i+j*nx].x-r*this.size,point[i+j*nx].y+0*this.size,type,adjacent,surround,use);
        k++;
        point[k] = new Point(point[i+j*nx].x+0*this.size,point[i+j*nx].y+r*this.size,type,adjacent,surround,use);
        k++;
      }
    }
    */

    this.point = point;
  }

  listappend(centerlist){
    var n = centerlist.length;
    for (var j=0;j<n;j++){
      if(centerlist.indexOf(this.point[centerlist[j]].adjacent[4]) === -1){
        centerlist.push(this.point[centerlist[j]].adjacent[4]);
      }
      if(centerlist.indexOf(this.point[centerlist[j]].adjacent[5]) === -1){
        centerlist.push(this.point[centerlist[j]].adjacent[5]);
      }
    }
    return centerlist;
  }

  reset_frame(){
    this.create_point();
    this.space = [
      parseInt(document.getElementById("nb_space1").value,10),
      parseInt(document.getElementById("nb_space2").value,10),
      parseInt(document.getElementById("nb_space3").value,10),
      parseInt(document.getElementById("nb_space4").value,10)
    ];

    this.centerlist = [this.top_n+this.nx0*2*this.space[0]];
    for (var j=0;j<this.nx-1-2*this.space[0];j++){
      this.centerlist = this.listappend(this.centerlist);
    }

    this.search_center();
    this.center_n0 = this.center_n;
    this.canvasxy_update();
    this.canvas_size_setting();
    this.point_move((this.canvasx*0.5-this.point[this.center_n].x+0.5),(this.canvasy*0.5-this.point[this.center_n].y+0.5),this.theta);
    this.make_frameline();
    this.cursol = this.centerlist[0];
    this.cursolS =  6*(this.nx0)*(this.ny0)+10*(this.nx0)-4;
  }

  type_set(){
    var type;
    switch(this.mode[this.mode.qa].edit_mode){
      case "surface":
      case "board":
        type = [0];
        break;
      case "symbol":
      case "move":
        if(document.getElementById('edge_button').textContent === "OFF"){
          type = [0];
        }else{
          type = [0,1,2,3];
        }
        break;
      case "number":
        if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3"){
          type = [4];
        }else{
          if(document.getElementById('edge_button').textContent === "OFF"){
            type = [0];
          }else{
            type = [0,1,2,3];
          }
        }
        break;
      case "line":
        if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4"){
          type = [2,3];
        }else{
          type = [0];
        }
        break;
      case "lineE":
        if (this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "4"){
          type = [2,3];
        }else{
          type = [1];
        }
        break;
      case "wall":
        if(this.drawing_line != -1){
          type = [this.point[this.last].type];
        }else{
          type = [1,2];
        }
        break;
      case "special":
        type = [0];
        break;
    }
    return type;
  }

  rotate_left(){
    this.theta = (this.theta-90*this.reflect[0]*this.reflect[1]+360)%360;
    this.point_move(0,0,-90);
    this.redraw();
  }

  rotate_right(){
    this.theta = (this.theta+90*this.reflect[0]*this.reflect[1]+360)%360;
    this.point_move(0,0,+90);
    this.redraw();
  }

  cursolcheck(){
    if(this.mode[this.mode.qa].edit_mode === "number" && this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3"){
      if(this.cursolS>8*(this.nx0)*(this.ny0)){
        this.cursolS -= 4*(this.nx0)*(this.ny0);
      }
    }else if(this.mode[this.mode.qa].edit_mode === "number" && this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "9"){
      if(this.cursolS<8*(this.nx0)*(this.ny0)){
        this.cursolS += 4*(this.nx0)*(this.ny0);
      }
    }
  }

  key_arrow(key_code){
    var a,b,c;
    if(this.theta === 0){b = [0,1,2,3];}
    else if(this.theta===90){b = [3,0,1,2];}
    else if(this.theta===180){b = [2,3,0,1];}
    else if(this.theta===270){b = [1,2,3,0];}
    if (this.reflect[0]===-1){
      c = b[0];
      b[0] = b[2];
      b[2] = c;
    }
    if (this.reflect[1]===-1){
      c = b[1];
      b[1] = b[3];
      b[3] = c;
    }
    switch(key_code){
      case "ArrowLeft":
        c = b[0];
        break;
      case "ArrowUp":
        c = b[1];
        break;
      case "ArrowRight":
        c = b[2];
        break;
      case "ArrowDown":
        c = b[3];
        break;
      }
    if (this.mode[this.mode.qa].edit_mode === "number" || this.mode[this.mode.qa].edit_mode === "symbol"){
      if (this.mode[this.mode.qa].edit_mode === "number" && this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][0] === "3"){
        switch(c){
          case 0:
            a = this.cursolS%2 === 0 ? this.cursolS-3 : this.cursolS-1;
            if (this.point[a].use===1){this.cursolS = a;}
            break;
          case 1:
            a = (this.cursolS%4 === 0||this.cursolS%4 === 1) ? this.cursolS-4*(this.nx0)+2 : this.cursolS-2;
            if (this.point[a].use===1){this.cursolS = a;}
            break;
          case 2:
            a = this.cursolS%2 === 0 ? this.cursolS+1 : this.cursolS+3;
            if (this.point[a].use===1){this.cursolS = a;}
            break;
          case 3:
            a = (this.cursolS%4 === 0||this.cursolS%4 === 1) ? this.cursolS+2 : this.cursolS+4*(this.nx0)-2;
            if (this.point[a].use===1){this.cursolS = a;}
            break;
        }
      }else{
        switch(c){
          case 0:
            a = this.cursol-1;
            if (this.point[a].use===1){this.cursol = a;}
            break;
          case 1:
            a = this.cursol-this.nx0;
            if (this.point[a].use===1){this.cursol = a;}
            break;
          case 2:
            a = this.cursol+1;
            if (this.point[a].use===1){this.cursol = a;}
            break;
          case 3:
            a = this.cursol+this.nx0;
            if (this.point[a].use===1){this.cursol = a;}
            break;
        }
      }
    }
    this.redraw();
  }
////////////////override/////////////////////
  re_wallmove(num){
      if(this.drawing_line != -1){
        var line_style = this.mode[this.mode.qa][this.mode[this.mode.qa].edit_mode][1];
        var array;
        if(this.point[num].surround.indexOf(parseInt(this.last)) != -1){//隣接していたら
          array = "wall";
          var key = (Math.min(num,this.last)).toString()+","+(Math.max(num,this.last)).toString();
          this.re_line(array,key,line_style);
        }
        this.redraw();
      }
  }

////////////////draw/////////////////////

  draw(){
    this.draw_surface("pu_q");
    this.draw_surface("pu_a");
    this.draw_squareframe("pu_q");
    this.draw_squareframe("pu_a");
    this.draw_thermo("pu_q");
    this.draw_thermo("pu_a");
    this.draw_arrowsp("pu_q");
    this.draw_arrowsp("pu_a");
    this.draw_symbol("pu_q",1);
    this.draw_symbol("pu_a",1);
    this.draw_wall("pu_q");
    this.draw_wall("pu_a");
    this.draw_frame();
    this.draw_freeline("pu_q");
    this.draw_freeline("pu_a");
    this.draw_line("pu_q");
    this.draw_line("pu_a");
    this.draw_direction("pu_q");
    this.draw_direction("pu_a");
    this.draw_lattice();
    this.draw_frameBold();
    this.draw_symbol("pu_q",2);
    this.draw_symbol("pu_a",2);
    //this.draw_cage("pu_q");
    //this.draw_cage("pu_a");
    this.draw_cursol();
    this.draw_number("pu_q");
    this.draw_number("pu_a");
    this.draw_freecircle();

    //this.draw_point();
  }

  draw_point() {
    set_font_style(this.ctx,(0.2*this.size).toString(),1);
    for(var i in this.point){
      if(this.point[i].type===0){
        this.ctx.fillStyle = "#000";
        this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
      }else if(this.point[i].type===1){
        this.ctx.fillStyle = "blue";
        this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
      }else if(this.point[i].type===2){
        this.ctx.fillStyle = "red";
        this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
        this.ctx.fillStyle = "rgba(0,0,0,0)";
      }else if(this.point[i].type===3){
        this.ctx.fillStyle = "orange";
        this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
        this.ctx.fillStyle = "rgba(0,0,0,0)";
      }else if(this.point[i].type===4){
        this.ctx.fillStyle = "green";
        this.ctx.text(i,this.point[i].x,this.point[i].y,0.8*this.size);
        this.ctx.fillStyle = "rgba(0,0,0,0)";
      }else if(this.point[i].type===5){
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
    if (this.mode.grid[1]==="1"){
      this.ctx.fillStyle = "#000";
      var verticelist=[];
      for(var i =0; i<this.centerlist.length;i++){
        for(var j of [0,2,3,5]){
          verticelist.push(this.point[this.centerlist[i]].surround[j]);
        }
        if(this.centerlist.indexOf(this.point[this.centerlist[i]].surround[0])!=-1 ||this.centerlist.indexOf(this.point[this.centerlist[i]].surround[1])!=-1){
          verticelist.push(this.point[this.centerlist[i]].surround[1]);
        }
        if(this.centerlist.indexOf(this.point[this.centerlist[i]].surround[4])!=-1 ||this.centerlist.indexOf(this.point[this.centerlist[i]].surround[5])!=-1){
          verticelist.push(this.point[this.centerlist[i]].surround[4]);
        }
      }
    }
    verticelist = Array.from(new Set(verticelist));
    for(var i = 0 ; i < verticelist.length ; i++){
        this.ctx.beginPath();
        this.ctx.arc(this.point[verticelist[i]].x,this.point[verticelist[i]].y,2.1,0,2*Math.PI,true);
        this.ctx.fill();
    }
  }


  draw_surface(pu) {
    for(var i in this[pu].surface){
        set_surface_style(this.ctx,this[pu].surface[i]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.point[this.point[i].surround[0]].x,this.point[this.point[i].surround[0]].y);
        for(var j=1;j<this.point[i].surround.length;j++){
          this.ctx.lineTo(this.point[this.point[i].surround[j]].x,this.point[this.point[i].surround[j]].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
  }

  draw_polygon(ctx,x,y,r,n,th){
    ctx.LineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x-r*Math.cos(th*(Math.PI/180))*this.size,y-r*Math.sin(th*(Math.PI/180))*this.size);
    for(var i=0;i<n-1;i++){
      th += 360/n;
      ctx.lineTo(x-r*Math.cos(th*(Math.PI/180))*this.size,y-r*Math.sin(th*(Math.PI/180))*this.size);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  draw_squareframe(pu) {
    for(var i=0; i<this[pu].squareframe.length;i++){
      if(this[pu].squareframe[i][0]){
        this.ctx.setLineDash([]);
        this.ctx.lineCap = "square";
        this.ctx.strokeStyle = "#ccc";
        this.ctx.lineWidth = this.size*0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(this.point[this[pu].squareframe[i][0]].x,this.point[this[pu].squareframe[i][0]].y);
        for(var j=1;j<this[pu].squareframe[i].length;j++){
          this.ctx.lineTo(this.point[this[pu].squareframe[i][j]].x,this.point[this[pu].squareframe[i][j]].y);
        }
        this.ctx.stroke();
      }
    }
  }

  draw_thermo(pu) {
    for(var i=0; i<this[pu].thermo.length;i++){
      if(this[pu].thermo[i][0]){
        this.ctx.strokeStyle = "rgba(0,0,0,0)";
        this.ctx.fillStyle = "#ccc";
        this.draw_circle(this.ctx,this.point[this[pu].thermo[i][0]].x,this.point[this[pu].thermo[i][0]].y,0.4);
        this.ctx.setLineDash([]);
        this.ctx.lineCap = "square";
        this.ctx.strokeStyle = "#ccc";
        this.ctx.lineWidth = this.size*0.4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.point[this[pu].thermo[i][0]].x,this.point[this[pu].thermo[i][0]].y);
        for(var j=1;j<this[pu].thermo[i].length;j++){
          this.ctx.lineTo(this.point[this[pu].thermo[i][j]].x,this.point[this[pu].thermo[i][j]].y);
        }
        this.ctx.stroke();
      }
    }
  }

  draw_arrowsp(pu) {
    for(var i=0; i<this[pu].arrows.length;i++){
      if(this[pu].arrows[i][0]){
        this.ctx.setLineDash([]);
        this.ctx.lineCap = "square";
        this.ctx.strokeStyle = "#ccc";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.point[this[pu].arrows[i][0]].x,this.point[this[pu].arrows[i][0]].y);
        for(var j=1;j<this[pu].arrows[i].length-1;j++){
          this.ctx.lineTo(this.point[this[pu].arrows[i][j]].x,this.point[this[pu].arrows[i][j]].y);
        }
        this.ctx.stroke();

        j = this[pu].arrows[i].length-1;
        this.ctx.lineJoin = "bevel";
        this.ctx.beginPath();
        this.ctx.arrow(this.point[this[pu].arrows[i][j-1]].x,this.point[this[pu].arrows[i][j-1]].y,
                  this.point[this[pu].arrows[i][j]].x,this.point[this[pu].arrows[i][j]].y,
                [-0.00001,0,-0.3*this.size,0.3*this.size]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.lineJoin = "miter";
        this.ctx.strokeStyle = "rgba(192,192,192,1)";
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.lineWidth = 3;

        this.draw_circle(this.ctx,this.point[this[pu].arrows[i][0]].x,this.point[this[pu].arrows[i][0]].y,0.4);
      }
    }
  }

  draw_direction(pu) {
    for(var i=0; i<this[pu].direction.length;i++){
      if(this[pu].direction[i][0]){
        this.ctx.setLineDash([]);
        this.ctx.lineCap = "square";
        this.ctx.strokeStyle = "#999";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.point[this[pu].direction[i][0]].x,this.point[this[pu].direction[i][0]].y);
        for(var j=1;j<this[pu].direction[i].length-1;j++){
          this.ctx.lineTo(this.point[this[pu].direction[i][j]].x,this.point[this[pu].direction[i][j]].y);
        }
        this.ctx.stroke();

        j = this[pu].direction[i].length-1;
        this.ctx.lineJoin = "bevel";
        this.ctx.beginPath();
        this.ctx.arrow(this.point[this[pu].direction[i][j-1]].x,this.point[this[pu].direction[i][j-1]].y,
                  this.point[this[pu].direction[i][j]].x,this.point[this[pu].direction[i][j]].y,
                [-0.00001,0,-0.25*this.size,0.25*this.size]);
        this.ctx.stroke();
        this.ctx.lineJoin = "miter";
      }
    }
  }

  draw_line(pu) {
    for(var i in this[pu].line){
      if(this[pu].line[i]===98){
        var r = 0.2;
        var x = this.point[i].x;
        var y = this.point[i].y;
        set_line_style(this.ctx,98);
        this.ctx.beginPath();
        this.ctx.moveTo(x+r*Math.cos(45*(Math.PI/180))*this.size,y+r*Math.sin(45*(Math.PI/180))*this.size);
        this.ctx.lineTo(x+r*Math.cos(225*(Math.PI/180))*this.size,y+r*Math.sin(225*(Math.PI/180))*this.size);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x+r*Math.cos(135*(Math.PI/180))*this.size,y+r*Math.sin(135*(Math.PI/180))*this.size);
        this.ctx.lineTo(x+r*Math.cos(315*(Math.PI/180))*this.size,y+r*Math.sin(315*(Math.PI/180))*this.size);
        this.ctx.stroke();
      }else{
        set_line_style(this.ctx,this[pu].line[i]);
        var i1 = i.split(",")[0];
        var i2 = i.split(",")[1];
        this.ctx.beginPath();
        if(this[pu].line[i] === 40){
          var r = 0.8;
          var x1 = r*this.point[i1].x+(1-r)*this.point[i2].x;
          var y1 = r*this.point[i1].y+(1-r)*this.point[i2].y;
          var x2 = (1-r)*this.point[i1].x+r*this.point[i2].x;
          var y2 = (1-r)*this.point[i1].y+r*this.point[i2].y;
          this.ctx.moveTo(x1,y1);
          this.ctx.lineTo(x2,y2);
        }else if(this[pu].line[i] === 30){
          var r = 0.15*this.size;
          var dx = this.point[i1].x-this.point[i2].x;
          var dy = this.point[i1].y-this.point[i2].y;
          var d = Math.sqrt(dx**2+dy**2);
          this.ctx.moveTo(this.point[i1].x-r/d*dy,this.point[i1].y+r/d*dx);
          this.ctx.lineTo(this.point[i2].x-r/d*dy,this.point[i2].y+r/d*dx);
          this.ctx.stroke();
          this.ctx.moveTo(this.point[i1].x+r/d*dy,this.point[i1].y-r/d*dx);
          this.ctx.lineTo(this.point[i2].x+r/d*dy,this.point[i2].y-r/d*dx);
        }else{
          this.ctx.moveTo(this.point[i1].x,this.point[i1].y);
          this.ctx.lineTo(this.point[i2].x,this.point[i2].y);
        }
        this.ctx.stroke();
      }
    }
    for(var i in this[pu].lineE){
      if(this[pu].lineE[i]===98){
        var r = 0.2;
        var x = this.point[i].x;
        var y = this.point[i].y;
        set_line_style(this.ctx,98);
        this.ctx.beginPath();
        this.ctx.moveTo(x+r*Math.cos(45*(Math.PI/180))*this.size,y+r*Math.sin(45*(Math.PI/180))*this.size);
        this.ctx.lineTo(x+r*Math.cos(225*(Math.PI/180))*this.size,y+r*Math.sin(225*(Math.PI/180))*this.size);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x+r*Math.cos(135*(Math.PI/180))*this.size,y+r*Math.sin(135*(Math.PI/180))*this.size);
        this.ctx.lineTo(x+r*Math.cos(315*(Math.PI/180))*this.size,y+r*Math.sin(315*(Math.PI/180))*this.size);
        this.ctx.stroke();
      }else{
        set_line_style(this.ctx,this[pu].lineE[i]);
        var i1 = i.split(",")[0];
        var i2 = i.split(",")[1];
        this.ctx.beginPath();
        if(this[pu].lineE[i] === 30){
          var r = 0.15*this.size;
          var dx = this.point[i1].x-this.point[i2].x;
          var dy = this.point[i1].y-this.point[i2].y;
          var d = Math.sqrt(dx**2+dy**2);
          this.ctx.moveTo(this.point[i1].x-r/d*dy,this.point[i1].y+r/d*dx);
          this.ctx.lineTo(this.point[i2].x-r/d*dy,this.point[i2].y+r/d*dx);
          this.ctx.stroke();
          this.ctx.moveTo(this.point[i1].x+r/d*dy,this.point[i1].y-r/d*dx);
          this.ctx.lineTo(this.point[i2].x+r/d*dy,this.point[i2].y-r/d*dx);
        }else{
          this.ctx.moveTo(this.point[i1].x,this.point[i1].y);
          this.ctx.lineTo(this.point[i2].x,this.point[i2].y);
        }
        this.ctx.stroke();
      }
    }
  }

  draw_freeline(pu) {
    /*freeline*/
    for(var i in this[pu].freeline){
        set_line_style(this.ctx,this[pu].freeline[i]);
        var i1 = i.split(",")[0];
        var i2 = i.split(",")[1];
        this.ctx.beginPath();
        if(this[pu].freeline[i] === 30){
          var r = 0.15*this.size;
          var dx = this.point[i1].x-this.point[i2].x;
          var dy = this.point[i1].y-this.point[i2].y;
          var d = Math.sqrt(dx**2+dy**2);
          this.ctx.moveTo(this.point[i1].x-r/d*dy,this.point[i1].y+r/d*dx);
          this.ctx.lineTo(this.point[i2].x-r/d*dy,this.point[i2].y+r/d*dx);
          this.ctx.stroke();
          this.ctx.moveTo(this.point[i1].x+r/d*dy,this.point[i1].y-r/d*dx);
          this.ctx.lineTo(this.point[i2].x+r/d*dy,this.point[i2].y-r/d*dx);
        }else{
          this.ctx.moveTo(this.point[i1].x,this.point[i1].y);
          this.ctx.lineTo(this.point[i2].x,this.point[i2].y);
        }
        this.ctx.stroke();
    }
  }

  draw_wall(pu) {
    for(var i in this[pu].wall){
      set_line_style(this.ctx,this[pu].wall[i]);
      this.ctx.lineCap="butt";
      var i1 = i.split(",")[0];
      var i2 = i.split(",")[1];
      this.ctx.beginPath();
      this.ctx.moveTo(this.point[i1].x,this.point[i1].y);
      this.ctx.lineTo(this.point[i2].x,this.point[i2].y);
      this.ctx.stroke();
    }
  }


  draw_symbol(pu,layer) {
    /*symbol_layer*/
    for(var i in this[pu].symbol){
      if (this[pu].symbol[i][2] === layer){
        this.draw_symbol_select(this.ctx,this.point[i].x,this.point[i].y,this[pu].symbol[i][0],this[pu].symbol[i][1]);
      }
    }
  }

  draw_number(pu) {
    /*number*/
    for(var i in this[pu].number){
      switch(this[pu].number[i][2]){
        case "1": //normal
          this.draw_numbercircle(pu,i,0.42);
          set_font_style(this.ctx,0.7*this.size.toString(10),this[pu].number[i][1]);
          this.ctx.text(this[pu].number[i][0],this.point[i].x,this.point[i].y+0.06*this.size,this.size*0.8);
          break;
        case "2": //arrow
          var arrowlength = 0.7;
          this.draw_numbercircle(pu,i,0.42);
          set_font_style(this.ctx,0.7*this.size.toString(10),this[pu].number[i][1]);
          var direction = {
            "_0":120,"_1":60,"_2":180,"_3":0,"_4":240,"_5":300
          }
          var direction = (direction[this[pu].number[i][0].slice(-2)]-this.theta+360)%360;
          if(this.reflect[0] === -1){direction = (180-direction+360)%360;}
          if(this.reflect[1] === -1){direction = (360-direction+360)%360;}
          switch(direction){
            case 120:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x-0.1*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x+(arrowlength*0.25+0.15)*this.size, this.point[i].y+(arrowlength*0.25*Math.sqrt(3)-0.15)*this.size,
                          this.point[i].x+(-arrowlength*0.25+0.15)*this.size, this.point[i].y+(-arrowlength*0.25*Math.sqrt(3)-0.15)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 300:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x-0.1*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x+(-arrowlength*0.25+0.2)*this.size, this.point[i].y+(-arrowlength*0.25*Math.sqrt(3)-0.1)*this.size,
                          this.point[i].x+(arrowlength*0.25+0.2)*this.size, this.point[i].y+(arrowlength*0.25*Math.sqrt(3)-0.1)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 60:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x+0.1*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x-(arrowlength*0.25+0.15)*this.size, this.point[i].y+(arrowlength*0.25*Math.sqrt(3)-0.15)*this.size,
                          this.point[i].x-(-arrowlength*0.25+0.15)*this.size, this.point[i].y+(-arrowlength*0.25*Math.sqrt(3)-0.15)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 240:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x+0.1*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x-(-arrowlength*0.25+0.2)*this.size, this.point[i].y+(-arrowlength*0.25*Math.sqrt(3)-0.1)*this.size,
                          this.point[i].x-(arrowlength*0.25+0.2)*this.size, this.point[i].y+(arrowlength*0.25*Math.sqrt(3)-0.1)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 180:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x+0.0*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x+(arrowlength*0.5+0.0)*this.size, this.point[i].y+(arrowlength*0.0-0.3)*this.size,
                          this.point[i].x+(-arrowlength*0.5+0.0)*this.size, this.point[i].y+(-arrowlength*0.0-0.3)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 0:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x+0.0*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x-(arrowlength*0.5+0.0)*this.size, this.point[i].y+(arrowlength*0.0-0.3)*this.size,
                          this.point[i].x-(-arrowlength*0.5+0.0)*this.size, this.point[i].y+(-arrowlength*0.0-0.3)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 150:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x-0.0*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x+(arrowlength*0.25*Math.sqrt(3)+0.1)*this.size, this.point[i].y+(arrowlength*0.25-0.2)*this.size,
                          this.point[i].x+(-arrowlength*0.25*Math.sqrt(3)+0.1)*this.size, this.point[i].y+(-arrowlength*0.25-0.2)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 330:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x-0.0*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x+(-arrowlength*0.25*Math.sqrt(3)+0.15)*this.size, this.point[i].y+(-arrowlength*0.25-0.15)*this.size,
                          this.point[i].x+(arrowlength*0.25*Math.sqrt(3)+0.15)*this.size, this.point[i].y+(arrowlength*0.25-0.15)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 30:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x+0.0*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x-(arrowlength*0.25*Math.sqrt(3)+0.1)*this.size, this.point[i].y+(arrowlength*0.25-0.2)*this.size,
                          this.point[i].x-(-arrowlength*0.25*Math.sqrt(3)+0.1)*this.size, this.point[i].y+(-arrowlength*0.25-0.2)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 210:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x+0.0*this.size,this.point[i].y+0.15*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x-(-arrowlength*0.25*Math.sqrt(3)+0.15)*this.size, this.point[i].y+(-arrowlength*0.25-0.15)*this.size,
                          this.point[i].x-(arrowlength*0.25*Math.sqrt(3)+0.15)*this.size, this.point[i].y+(arrowlength*0.25-0.15)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 90:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x-0.1*this.size,this.point[i].y+0.05*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x+(arrowlength*0.0+0.25)*this.size, this.point[i].y+(arrowlength*0.5-0.0)*this.size,
                          this.point[i].x+(-arrowlength*0.0+0.25)*this.size, this.point[i].y+(-arrowlength*0.5-0.0)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            case 270:
                this.ctx.text(this[pu].number[i][0].slice(0,-2),this.point[i].x-0.1*this.size,this.point[i].y+0.05*this.size,this.size*0.8);
                this.ctx.beginPath();
                this.ctx.arrow(this.point[i].x+(arrowlength*0.0+0.25)*this.size, this.point[i].y+(-arrowlength*0.5-0.0)*this.size,
                          this.point[i].x+(-arrowlength*0.0+0.25)*this.size, this.point[i].y+(arrowlength*0.5-0.0)*this.size,
                          [0, 1, -0.25*this.size, 1, -0.25*this.size, 3]);
                this.ctx.stroke();
                this.ctx.fill();
              break;
            default:
              set_font_style(this.ctx,0.8*this.size.toString(10),this[pu].number[i][1]);
              this.ctx.text(this[pu].number[i][0],this.point[i].x,this.point[i].y+0.06*this.size,this.size*0.8);
              break;
          }
          break;
        case "4"://tapa
          this.draw_numbercircle(pu,i,0.44);
          if (this[pu].number[i][0].length === 1){
            set_font_style(this.ctx,0.7*this.size.toString(10),this[pu].number[i][1]);
            this.ctx.text(this[pu].number[i][0],this.point[i].x,this.point[i].y+0.06*this.size,this.size*0.8);
          }else if (this[pu].number[i][0].length === 2){
            set_font_style(this.ctx,0.48*this.size.toString(10),this[pu].number[i][1]);
            this.ctx.text(this[pu].number[i][0].slice(0,1),this.point[i].x-0.16*this.size,this.point[i].y-0.15*this.size,this.size*0.8);
            this.ctx.text(this[pu].number[i][0].slice(1,2),this.point[i].x+0.18*this.size,this.point[i].y+0.19*this.size,this.size*0.8);
          }else if (this[pu].number[i][0].length === 3){
            set_font_style(this.ctx,0.45*this.size.toString(10),this[pu].number[i][1]);
            this.ctx.text(this[pu].number[i][0].slice(0,1),this.point[i].x-0.22*this.size,this.point[i].y-0.14*this.size,this.size*0.8);
            this.ctx.text(this[pu].number[i][0].slice(1,2),this.point[i].x+0.24*this.size,this.point[i].y-0.05*this.size,this.size*0.8);
            this.ctx.text(this[pu].number[i][0].slice(2,3),this.point[i].x-0.0*this.size,this.point[i].y+0.3*this.size,this.size*0.8);
          }else if (this[pu].number[i][0].length === 4){
            set_font_style(this.ctx,0.4*this.size.toString(10),this[pu].number[i][1]);
            this.ctx.text(this[pu].number[i][0].slice(0,1),this.point[i].x-0.0*this.size,this.point[i].y-0.22*this.size,this.size*0.8);
            this.ctx.text(this[pu].number[i][0].slice(1,2),this.point[i].x-0.26*this.size,this.point[i].y+0.04*this.size,this.size*0.8);
            this.ctx.text(this[pu].number[i][0].slice(2,3),this.point[i].x+0.26*this.size,this.point[i].y+0.04*this.size,this.size*0.8);
            this.ctx.text(this[pu].number[i][0].slice(3,4),this.point[i].x-0.0*this.size,this.point[i].y+0.3*this.size,this.size*0.8);
          }
          break;
        case "5"://small
          this.draw_numbercircle(pu,i,0.17);
          set_font_style(this.ctx,0.25*this.size.toString(10),this[pu].number[i][1]);
          this.ctx.text(this[pu].number[i][0],this.point[i].x,this.point[i].y+0.02*this.size,this.size*0.8);
          break;
        case "6"://medium
          this.draw_numbercircle(pu,i,0.25);
          set_font_style(this.ctx,0.4*this.size.toString(10),this[pu].number[i][1]);
          this.ctx.text(this[pu].number[i][0],this.point[i].x,this.point[i].y+0.03*this.size,this.size*0.8);
          break;
        case "7"://sudoku
          this.draw_numbercircle(pu,i,0.42);
          var sum = 0,pos = 0;
          for(var j=0;j<9;j++){
            if(this[pu].number[i][0][j]===1){
              sum += 1;
              pos = j;
            }
          }
          if(sum === 1){
            set_font_style(this.ctx,0.7*this.size.toString(10),this[pu].number[i][1]);
            this.ctx.text((pos+1).toString(),this.point[i].x,this.point[i].y+0.06*this.size,this.size*0.8);
          }else{
            set_font_style(this.ctx,0.3*this.size.toString(10),this[pu].number[i][1]);
            for(var j=0;j<9;j++){
              if(this[pu].number[i][0][j]===1){
                this.ctx.text((j+1).toString(),this.point[i].x+((j%3-1)*0.25)*this.size,this.point[i].y+(((j/3|0)-1)*0.25+0.01)*this.size);
              }
            }
          }
          break;
        case "8"://long
          if(this[pu].number[i][1]===5){
            set_font_style(this.ctx,0.5*this.size.toString(10),this[pu].number[i][1]);
            set_circle_style(this.ctx,7);
            this.ctx.fillRect(this.point[i].x-0.2*this.size,this.point[i].y-0.25*this.size, this.ctx.measureText(this[pu].number[i][0]).width, 0.5*this.size);
          }
          set_font_style(this.ctx,0.5*this.size.toString(10),this[pu].number[i][1]);
          this.ctx.textAlign = "left";
          this.ctx.text(this[pu].number[i][0],this.point[i].x-0.2*this.size,this.point[i].y);
          break;
      }
    }

    for(var i in this[pu].numberS){
        if(this[pu].numberS[i][1]===5){
          set_circle_style(this.ctx,7);
          this.draw_circle(this.ctx,this.point[i].x,this.point[i].y,0.18);
        }else if(this[pu].numberS[i][1]===6){
          set_circle_style(this.ctx,1);
          this.draw_circle(this.ctx,this.point[i].x,this.point[i].y,0.18);
        }else if(this[pu].numberS[i][1]===7){
          set_circle_style(this.ctx,2);
          this.draw_circle(this.ctx,this.point[i].x,this.point[i].y,0.18);
        }
        if (this[pu].numberS[i][0].length <= 2 ){
          set_font_style(this.ctx,0.28*this.size.toString(10),this[pu].numberS[i][1]);
          this.ctx.textAlign = "center";
          this.ctx.text(this[pu].numberS[i][0],this.point[i].x,this.point[i].y+0.03*this.size);
        }else{
          set_font_style(this.ctx,0.28*this.size.toString(10),this[pu].numberS[i][1]);
          this.ctx.textAlign = "left";
          this.ctx.text(this[pu].numberS[i][0],this.point[i].x-0.15*this.size,this.point[i].y+0.03*this.size);
        }
    }
  }

  draw_numbercircle(pu,i,size){
    if(this[pu].number[i][1]===5){
      set_circle_style(this.ctx,7);
      this.draw_circle(this.ctx,this.point[i].x,this.point[i].y,size);
    }else if(this[pu].number[i][1]===6){
      set_circle_style(this.ctx,1);
      this.draw_circle(this.ctx,this.point[i].x,this.point[i].y,size);
    }else if(this[pu].number[i][1]===7){
      set_circle_style(this.ctx,2);
      this.draw_circle(this.ctx,this.point[i].x,this.point[i].y,size);
    }
  }

  draw_symbol_select(ctx,x,y,num,sym){
    switch(sym){
      /* figure */
      case "circle_L":
        set_circle_style(ctx,num);
        this.draw_circle(ctx,x,y,0.43);
        break;
      case "circle_M":
        set_circle_style(ctx,num);
        this.draw_circle(ctx,x,y,0.35);
        break;
      case "circle_S":
        set_circle_style(ctx,num);
        this.draw_circle(ctx,x,y,0.22);
        break;
      case "circle_SS":
        set_circle_style(ctx,num);
        this.draw_circle(ctx,x,y,0.11);
        break;
      case "square_LL":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.5*Math.sqrt(2),4,45);
        break;
      case "square_L":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.4*Math.sqrt(2),4,45);
        break;
      case "square_M":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.35*Math.sqrt(2),4,45);
        break;
      case "square_S":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.22*Math.sqrt(2),4,45);
        break;
      case "square_SS":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.11*Math.sqrt(2),4,45);
        break;
      case "triup_L":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y+0.5*0.25*this.size,0.5,3,90);
        break;
      case "triup_M":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y+0.4*0.25*this.size,0.4,3,90);
        break;
      case "triup_SS":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y+0.16*0.25*this.size,0.16,3,90);
        break;
      case "tridown_L":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y-0.5*0.25*this.size,0.5,3,-90);
        break;
      case "tridown_M":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y-0.4*0.25*this.size,0.4,3,-90);
        break;
      case "tridown_SS":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y-0.16*0.25*this.size,0.16,3,-90);
        break;
      case "diamond_L":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.43,4,0);
        break;
      case "diamond_M":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.35,4,0);
        break;
      case "diamond_SS":
        set_circle_style(ctx,num);
        this.draw_polygon(ctx,x,y,0.13,4,0);
        break;
      case "ox_B":
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.fillStyle = "rgba(255,255,255,0)";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 2;
        this.draw_ox(ctx,num,x,y);
        break;
      case "ox_E":
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.fillStyle = "rgba(255,255,255,0)";
        ctx.strokeStyle = "rgba(32,128,32,1)";
        ctx.lineWidth = 2;
        this.draw_ox(ctx,num,x,y);
        break;
      case "ox_G":
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.fillStyle = "rgba(255,255,255,0)";
        ctx.strokeStyle = "rgba(153,153,153,1)";
        ctx.lineWidth = 2;
        this.draw_ox(ctx,num,x,y);
        break;
      case "tri":
        this.draw_tri(ctx,num,x,y);
        break;
      case "cross":
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 3;
        this.draw_cross(ctx,num,x,y);
        break;
      case "line":
        this.draw_linesym(ctx,num,x,y);
        break;

      //number
      case "inequality":
        set_circle_style(ctx,10);
        this.draw_inequality(ctx,num,x,y);
        break;
      case "math":
        set_font_style(ctx,0.8*pu.size.toString(10),1);
        this.draw_math(ctx,num,x,y+0.05*pu.size);
        break;
      case "degital":
        this.draw_degital(ctx,num,x,y);
        break;
      case "degital_f":
        this.draw_degital_f(ctx,num,x,y);
        break;
      case "dice":
        set_circle_style(ctx,2);
        this.draw_dice(ctx,num,x,y);
        break;
      case "pills":
        set_circle_style(ctx,3);
        this.draw_pills(ctx,num,x,y);
        break;

      /* arrow */
      case "arrow_B_B":
        set_circle_style(ctx,2);
        this.draw_arrowB(ctx,num,x,y);
        break;
      case "arrow_B_G":
        set_circle_style(ctx,3);
        this.draw_arrowB(ctx,num,x,y);
        break;
      case "arrow_B_W":
        set_circle_style(ctx,1);
        this.draw_arrowB(ctx,num,x,y);
        break;
      case "arrow_N_B":
        set_circle_style(ctx,2);
        this.draw_arrowN(ctx,num,x,y);
        break;
      case "arrow_N_G":
        set_circle_style(ctx,3);
        this.draw_arrowN(ctx,num,x,y);
        break;
      case "arrow_N_W":
        set_circle_style(ctx,1);
        this.draw_arrowN(ctx,num,x,y);
        break;
      case "arrow_S":
        set_circle_style(ctx,2);
        this.draw_arrowS(ctx,num,x,y);
        break;
      case "arrow_Short":
        set_circle_style(ctx,2);
        this.draw_arrowShort(ctx,num,x,y);
        break;
      case "arrow_tri_B":
        set_circle_style(ctx,2);
        this.draw_arrowtri(ctx,num,x,y);
        break;
      case "arrow_tri_G":
        set_circle_style(ctx,3);
        this.draw_arrowtri(ctx,num,x,y);
        break;
      case "arrow_tri_W":
        set_circle_style(ctx,1);
        this.draw_arrowtri(ctx,num,x,y);
        break;
      case "arrow_cross":
        set_circle_style(ctx,2);
        this.draw_arrowcross(ctx,num,x,y);
        break;
      case "arrow_eight":
        set_circle_style(ctx,2);
        this.draw_arroweight(ctx,num,x,y);
        break;

      /* special */
      case "kakuro":
        this.draw_kakuro(ctx,num,x,y);
        break;
      case "compass":
        this.draw_compass(ctx,num,x,y);
        break;
      case "star":
        this.draw_star(ctx,num,x,y);
        break;
      case "tents":
        this.draw_tents(ctx,num,x,y);
        break;
      case "battleship_B":
        set_circle_style(ctx,2);
        this.draw_battleship(ctx,num,x,y);
        break;
      case "battleship_G":
        set_circle_style(ctx,3);
        ctx.fillStyle = "#999";
        this.draw_battleship(ctx,num,x,y);
        break;
      case "battleship_W":
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 2;
        this.draw_battleship(ctx,num,x,y);
        break;
      case "angleloop":
        this.draw_angleloop(ctx,num,x,y);
        break;
      case "firefly":
        this.draw_firefly(ctx,num,x,y);
        break;
      case "sun_moon":
        this.draw_sun_moon(ctx,num,x,y);
        break;
      case "sudokuetc":
        this.draw_sudokuetc(ctx,num,x,y);
        break;
      case "polyomino":
        this.draw_polyomino(ctx,num,x,y);
        break;
      case "pencils":
        this.draw_pencils(ctx,num,x,y);
        break;
    }
  }

  draw_circle(ctx,x,y,r){
    ctx.beginPath();
    ctx.arc(x,y,r*pu.size,0,Math.PI*2,false);
    ctx.fill();
    ctx.stroke();
  }

  draw_x(ctx,x,y,r){
    ctx.beginPath();
    ctx.moveTo(x+r*Math.cos(45*(Math.PI/180))*this.size,y+r*Math.sin(45*(Math.PI/180))*this.size);
    ctx.lineTo(x+r*Math.cos(225*(Math.PI/180))*this.size,y+r*Math.sin(225*(Math.PI/180))*this.size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x+r*Math.cos(135*(Math.PI/180))*this.size,y+r*Math.sin(135*(Math.PI/180))*this.size);
    ctx.lineTo(x+r*Math.cos(315*(Math.PI/180))*this.size,y+r*Math.sin(315*(Math.PI/180))*this.size);
    ctx.stroke();
  }

  draw_ast(ctx,x,y,r){
    var th;
    th = 45 + this.theta%180;
    ctx.beginPath();
    ctx.moveTo(x+r*Math.cos(th*(Math.PI/180))*this.size,y+r*Math.sin(th*(Math.PI/180))*this.size);
    ctx.lineTo(x+r*Math.cos((th+180)*(Math.PI/180))*this.size,y+r*Math.sin((th+180)*(Math.PI/180))*this.size);
    ctx.stroke();
    th = 135 + this.theta%180;
    ctx.beginPath();
    ctx.moveTo(x+r*Math.cos(th*(Math.PI/180))*this.size,y+r*Math.sin(th*(Math.PI/180))*this.size);
    ctx.lineTo(x+r*Math.cos((th+180)*(Math.PI/180))*this.size,y+r*Math.sin((th+180)*(Math.PI/180))*this.size);
    ctx.stroke();
  }

  draw_slash(ctx,x,y,r){
    var th;
    th = 45 + this.theta%180;
    ctx.beginPath();
    ctx.moveTo(x+r*Math.cos(th*(Math.PI/180))*this.size,y+r*Math.sin(th*(Math.PI/180))*this.size);
    ctx.lineTo(x+r*Math.cos((th+180)*(Math.PI/180))*this.size,y+r*Math.sin((th+180)*(Math.PI/180))*this.size);
    ctx.stroke();
  }

  draw_ox(ctx,num,x,y){
    var r = 0.3;
    switch(num){
      case 1:
        this.draw_circle(ctx,x,y,r);
        break;
      case 2:
        this.draw_polygon(ctx,x,y+0.05*this.size,0.3,3,90);
        break;
      case 3:
        this.draw_polygon(ctx,x,y,0.35,4,45);
        break;
      case 4:
        this.draw_x(ctx,x,y,r);
        break;
      case 5:
        r = 0.5;
        ctx.beginPath();
        ctx.moveTo(x+r*Math.cos(45*(Math.PI/180))*pu.size,y+r*Math.sin(45*(Math.PI/180))*pu.size);
        ctx.lineTo(x+r*Math.cos(225*(Math.PI/180))*pu.size,y+r*Math.sin(225*(Math.PI/180))*pu.size);
        ctx.stroke();
        break;
      case 6:
        r = 0.5;
        ctx.beginPath();
        ctx.moveTo(x+r*Math.cos(135*(Math.PI/180))*pu.size,y+r*Math.sin(135*(Math.PI/180))*pu.size);
        ctx.lineTo(x+r*Math.cos(315*(Math.PI/180))*pu.size,y+r*Math.sin(315*(Math.PI/180))*pu.size);
        ctx.stroke();
        break;
      case 7:
        this.draw_x(ctx,x,y,0.5);
        break;
      case 8:
        r = 0.05;
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 2;
        this.draw_circle(ctx,x,y,r);
        break;
      case 9:
        r = 0.3;
        this.draw_circle(ctx,x,y,r);
        this.draw_x(ctx,x,y,0.45);
        break;
      }
    }

  draw_tri(ctx,num,x,y){
    var r = 0.5;
    switch(num){
        case 1:
          set_circle_style(ctx,2);
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y-r*pu.size);
          ctx.fill();
          break;
        case 4:
          set_circle_style(ctx,2);
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y-r*pu.size);
          ctx.fill();
          break;
        case 3:
          set_circle_style(ctx,2);
          ctx.beginPath();
          ctx.moveTo(x+r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.lineTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.fill();
          break;
        case 2:
          set_circle_style(ctx,2);
          ctx.beginPath();
          ctx.moveTo(x+r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.fill();
          break;
        case 5:
          set_circle_style(ctx,2);
          this.draw_polygon(ctx,x,y,r*Math.sqrt(2),4,45);
          break;
        case 6:
          set_circle_style(ctx,3);
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y-r*pu.size);
          ctx.fill();
          break;
        case 7:
          set_circle_style(ctx,3);
          ctx.beginPath();
          ctx.moveTo(x+r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.fill();
          break;
        case 8:
          set_circle_style(ctx,3);
          ctx.beginPath();
          ctx.moveTo(x+r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.lineTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.fill();
          break;
        case 9:
          set_circle_style(ctx,3);
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.lineTo(x-r*pu.size,y-r*pu.size);
          ctx.fill();
          break;
        case 0:
          set_circle_style(ctx,3);
          this.draw_polygon(ctx,x,y,r*Math.sqrt(2),4,45);
          break;
      }
    }

  draw_cross(ctx,num,x,y){
    for (var i=0;i<6;i++){
      if(num[i] === 1){
        var th = this.rotate_theta(i*60-180);
        ctx.beginPath();
        ctx.moveTo(x+ctx.lineWidth*0.3*Math.cos(th),y+ctx.lineWidth*0.3*Math.sin(th));
        ctx.lineTo(x-0.5*pu.size*Math.cos(th),y-0.5*pu.size*Math.sin(th));
        ctx.stroke();
      }
    }
  }

  draw_linesym(ctx,num,x,y){
    var r = 0.32;
    ctx.setLineDash([]);
    ctx.lineCap = "round";
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = 3;
    switch(num){
        case 1:
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-0*pu.size);
          ctx.lineTo(x+r*pu.size,y+0*pu.size);
          ctx.closePath();
          ctx.stroke();
          break;
        case 2:
          ctx.beginPath();
          ctx.moveTo(x-0*pu.size,y-r*pu.size);
          ctx.lineTo(x+0*pu.size,y+r*pu.size);
          ctx.closePath();
          ctx.stroke();
          break;
        case 3:
          r = r/Math.sqrt(2);
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.closePath();
          ctx.stroke();
          break;
        case 4:
          r = r/Math.sqrt(2);
          ctx.beginPath();
          ctx.moveTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.closePath();
          ctx.stroke();
          break;
        case 5:
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-0*pu.size);
          ctx.lineTo(x+r*pu.size,y+0*pu.size);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x-0*pu.size,y-r*pu.size);
          ctx.lineTo(x+0*pu.size,y+r*pu.size);
          ctx.closePath();
          ctx.stroke();
          break;
        case 6:
          r = r/Math.sqrt(2);
          ctx.beginPath();
          ctx.moveTo(x-r*pu.size,y-r*pu.size);
          ctx.lineTo(x+r*pu.size,y+r*pu.size);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x+r*pu.size,y-r*pu.size);
          ctx.lineTo(x-r*pu.size,y+r*pu.size);
          ctx.closePath();
          ctx.stroke();
          break;
      }
    }

  draw_inequality(ctx,num,x,y){
    var th;
    var len = 0.14;
    switch(num){
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        ctx.beginPath();
        th = this.rotate_theta((num-1)*60+45);
        ctx.moveTo(x+len*Math.sqrt(2)*pu.size*Math.cos(th),y+len*Math.sqrt(2)*pu.size*Math.sin(th));
        th = this.rotate_theta((num-1)*60+180);
        ctx.lineTo(x+len*pu.size*Math.cos(th),y+len*pu.size*Math.sin(th));
        th = this.rotate_theta((num-1)*60+315);
        ctx.lineTo(x+len*Math.sqrt(2)*pu.size*Math.cos(th),y+len*Math.sqrt(2)*pu.size*Math.sin(th));
        ctx.fill();
        ctx.stroke();
        break;
      case 7:
        ctx.beginPath();
        th = this.rotate_theta(90+45);
        ctx.moveTo(x+len*Math.sqrt(2)*pu.size*Math.cos(th),y+len*Math.sqrt(2)*pu.size*Math.sin(th));
        th = this.rotate_theta(90+180);
        ctx.lineTo(x+len*pu.size*Math.cos(th),y+len*pu.size*Math.sin(th));
        th = this.rotate_theta(90+315);
        ctx.lineTo(x+len*Math.sqrt(2)*pu.size*Math.cos(th),y+len*Math.sqrt(2)*pu.size*Math.sin(th));
        ctx.fill();
        ctx.stroke();
        break;
      case 8:
        ctx.beginPath();
        th = this.rotate_theta(270+45);
        ctx.moveTo(x+len*Math.sqrt(2)*pu.size*Math.cos(th),y+len*Math.sqrt(2)*pu.size*Math.sin(th));
        th = this.rotate_theta(270+180);
        ctx.lineTo(x+len*pu.size*Math.cos(th),y+len*pu.size*Math.sin(th));
        th = this.rotate_theta(270+315);
        ctx.lineTo(x+len*Math.sqrt(2)*pu.size*Math.cos(th),y+len*Math.sqrt(2)*pu.size*Math.sin(th));
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  draw_math(ctx,num,x,y){
    switch(num){
      case 1:
        ctx.font = 0.8*pu.size + "px sans-serif";
        ctx.text("\u{221E}",x,y);
        break;
      case 2:
        ctx.text("＋",x,y);
        break;
      case 3:
        ctx.text("－",x,y);
        break;
      case 4:
        ctx.text("×",x,y);
        break;
      case 5:
        ctx.text("＊",x,y);
        break;
      case 6:
        ctx.text("÷",x,y);
        break;
      case 7:
        ctx.text("＝",x,y);
        break;
      case 8:
        ctx.text("≠",x,y);
        break;
      case 9:
        ctx.text("≦",x,y);
        break;
      case 0:
        ctx.text("≧",x,y);
        break;

    }
  }

  draw_degital(ctx,num,x,y){
    set_circle_style(ctx,2);
    var w1,w2,w3,w4,z1,z2;
    z1 = 0.17;
    z2 = 0.015;
    w3 = 0.05;
    w4 = 0.05;
    for(var i=0;i<7;i++){
      if(num[0] === 1){
        w1 = z1; w2 = -2*(z1+z2);
        ctx.beginPath();
        ctx.arrow(x-w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+w2*pu.size,
                  [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
        ctx.fill();
      }
      if(num[1] === 1){
        w1 = -(z1+z2); w2 = -2*z1;
        ctx.beginPath();
        ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y-2*z2*pu.size,
                  [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
        ctx.fill();
      }
      if(num[2] === 1){
        w1 = z1+z2; w2 = -2*z1;
        ctx.beginPath();
        ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y-2*z2*pu.size,
                  [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
        ctx.fill();
      }
      if(num[3] === 1){
        w1 = z1; w2 = 0;
        ctx.beginPath();
        ctx.arrow(x-w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+w2*pu.size,
                  [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
        ctx.fill();
      }
      if(num[4] === 1){
        w1 = -(z1+z2); w2 = 2*z1;
        ctx.beginPath();
        ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+2*z2*pu.size,
                  [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
        ctx.fill();
      }
      if(num[5] === 1){
        w1 = z1+z2; w2 = 2*z1;
        ctx.beginPath();
        ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+2*z2*pu.size,
                  [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
        ctx.fill();
      }
      if(num[6] === 1){
        w1 = z1; w2 = 2*(z1+z2);
        ctx.beginPath();
        ctx.arrow(x-w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+w2*pu.size,
                  [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
        ctx.fill();
      }
    }
  }

  draw_degital_f(ctx,num,x,y){
    set_circle_style(ctx,3);
    var w1,w2,w3,w4,z1,z2;
    z1 = 0.17;
    z2 = 0.015;
    w3 = 0.05;
    w4 = 0.05;
    //frame
    w1 = z1; w2 = -2*(z1+z2);
    ctx.beginPath();
    ctx.arrow(x-w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+w2*pu.size,
              [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
    ctx.stroke();
    ctx.fill();
    w1 = -(z1+z2); w2 = -2*z1;
    ctx.beginPath();
    ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y-2*z2*pu.size,
              [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
    ctx.stroke();
    ctx.fill();
    w1 = z1+z2; w2 = -2*z1;
    ctx.beginPath();
    ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y-2*z2*pu.size,
              [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
    ctx.stroke();
    ctx.fill();
    w1 = z1; w2 = 0;
    ctx.beginPath();
    ctx.arrow(x-w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+w2*pu.size,
              [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
    ctx.stroke();
    ctx.fill();
    w1 = -(z1+z2); w2 = 2*z1;
    ctx.beginPath();
    ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+2*z2*pu.size,
              [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
    ctx.stroke();
    ctx.fill();
    w1 = z1+z2; w2 = 2*z1;
    ctx.beginPath();
    ctx.arrow(x+w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+2*z2*pu.size,
              [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
    ctx.stroke();
    ctx.fill();
    w1 = z1; w2 = 2*(z1+z2);
    ctx.beginPath();
    ctx.arrow(x-w1*pu.size, y+w2*pu.size,x+w1*pu.size, y+w2*pu.size,
              [w3*pu.size, w4*pu.size, -w3*pu.size, w4*pu.size]);
    ctx.stroke();
    ctx.fill();

    //contents
    this.draw_degital(ctx,num,x,y);
  }

  draw_dice(ctx,num,x,y){
    for(var i=0;i<9;i++){
      if(num[i] === 1){
        this.draw_circle(ctx,x+(i%3-1)*0.25*pu.size,y+((i/3|0)-1)*0.25*pu.size,0.09);
      }
    }
  }

  draw_pills(ctx,num,x,y){
    var r=0.15;
    ctx.fillStyle = "#999"
    switch(num){
      case 1:
        this.draw_circle(ctx,x,y,r);
      break;
      case 2:
        this.draw_circle(ctx,x-0.22*pu.size,y-0.22*pu.size,r);
        this.draw_circle(ctx,x+0.22*pu.size,y+0.22*pu.size,r);
        break;
      case 3:
        this.draw_circle(ctx,x-0*pu.size,y-0.23*pu.size,r);
        this.draw_circle(ctx,x+0.23*pu.size,y+0.2*pu.size,r);
        this.draw_circle(ctx,x-0.23*pu.size,y+0.2*pu.size,r);
        break;
      case 4:
        this.draw_circle(ctx,x-0.22*pu.size,y-0.22*pu.size,r);
        this.draw_circle(ctx,x+0.22*pu.size,y+0.22*pu.size,r);
        this.draw_circle(ctx,x-0.22*pu.size,y+0.22*pu.size,r);
        this.draw_circle(ctx,x+0.22*pu.size,y-0.22*pu.size,r);
        break;
      case 5:
        this.draw_circle(ctx,x,y,r);
        this.draw_circle(ctx,x-0.24*pu.size,y-0.24*pu.size,r);
        this.draw_circle(ctx,x+0.24*pu.size,y+0.24*pu.size,r);
        this.draw_circle(ctx,x-0.24*pu.size,y+0.24*pu.size,r);
        this.draw_circle(ctx,x+0.24*pu.size,y-0.24*pu.size,r);
        break;
    }
  }


  draw_arrowB(ctx,num,x,y) {
    var len1 = 0.38; //nemoto
    var len2 = 0.4; //tip
    var w1 = 0.2;
    var w2 = 0.4;
    var ri = -0.4;
    this.draw_arrow(ctx,num,x,y,len1,len2,w1,w2,ri);
  }

  draw_arrowN(ctx,num,x,y) {
    var len1 = 0.38; //nemoto
    var len2 = 0.4; //tip
    var w1 = 0.03;
    var w2 = 0.13;
    var ri = -0.25;
    this.draw_arrow(ctx,num,x,y,len1,len2,w1,w2,ri);
  }

  draw_arrowS(ctx,num,x,y) {
    var len1 = 0.3; //nemoto
    var len2 = 0.32; //tip
    var w1 = 0.02;
    var w2 = 0.12;
    var ri = -0.2;
    this.draw_arrow(ctx,num,x,y,len1,len2,w1,w2,ri);
  }

  draw_arrowShort(ctx,num,x,y) {
    var len1 = 0.3; //nemoto
    var len2 = 0.3; //tip
    var w1 = 0.15;
    var w2 = 0.31;
    var ri = -0.33;
    this.draw_arrow(ctx,num,x,y,len1,len2,w1,w2,ri);
  }

  draw_arrowtri(ctx,num,x,y) {
    var len1 = 0.25; //nemoto
    var len2 = 0.4; //tip
    var w1 = 0;
    var w2 = 0.35;
    var ri = 0;
    this.draw_arrow(ctx,num,x,y,len1,len2,w1,w2,ri);
  }

  draw_arrow(ctx,num,x,y,len1,len2,w1,w2,ri){
    var th;
    if(num>0&&num<=6){
      th = this.rotate_theta((num-1)*60-180);
      ctx.beginPath();
      ctx.arrow(x-len1*pu.size*Math.cos(th), y-len1*pu.size*Math.sin(th),x+len2*pu.size*Math.cos(th), y+len2*pu.size*Math.sin(th),
                [0, w1*pu.size, ri*pu.size, w1*pu.size, ri*pu.size, w2*pu.size]);
      ctx.fill();
      ctx.stroke();
    }
  }

  draw_arrowcross(ctx,num,x,y){
    var w1 = 0.025;
    var w2 = 0.12;
    var len1 = 0.5*w1; //nemoto
    var len2 = 0.45; //tip
    var ri = -0.18;
    var th;
    for (var i=0;i<6;i++){
      if(num[i] === 1){
        th = this.rotate_theta(i*60-180);
        ctx.beginPath();
        ctx.arrow(x-len1*pu.size*Math.cos(th), y-len1*pu.size*Math.sin(th),x+len2*pu.size*Math.cos(th), y+len2*pu.size*Math.sin(th),
                  [0, w1*pu.size, ri*pu.size, w1*pu.size, ri*pu.size, w2*pu.size]);
        ctx.fill();
      }
    }
  }

  draw_arroweight(ctx,num,x,y){
    var len1 = -0.2; //nemoto
    var len2 = 0.45; //tip
    var w1 = 0.025;
    var w2 = 0.10;
    var ri = -0.15;
    for(var i=0;i<6;i++){
      if(num[i] === 1){
        this.draw_arrow(ctx,i+1,x,y,len1,len2,w1,w2,ri);
      }
    }
  }

  draw_kakuro(ctx,num,x,y){
    var th = this.rotate_theta(45)*180/Math.PI;
    switch(num){
      case 1:
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "rgba(255,255,255,0)";
        ctx.lineWidth = 1;
        this.draw_polygon(ctx,x,y,0.5*Math.sqrt(2),4,th);
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        this.draw_slash(ctx,x,y,0.5*Math.sqrt(2));
        break;
      case 2:
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "rgba(255,255,255,0)";
        ctx.lineWidth = 1;
        this.draw_polygon(ctx,x,y,0.5*Math.sqrt(2),4,th);
        break;
      case 3:
        ctx.fillStyle = "#ccc";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 1;
        this.draw_polygon(ctx,x,y,0.5*Math.sqrt(2),4,th);
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        this.draw_slash(ctx,x,y,0.5*Math.sqrt(2));
        break;
      case 4:
        ctx.fillStyle = "#ccc";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 1;
        this.draw_polygon(ctx,x,y,0.5*Math.sqrt(2),4,th);
        break;
      case 5:
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 1;
        this.draw_polygon(ctx,x,y,0.5*Math.sqrt(2),4,th);
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        this.draw_slash(ctx,x,y,0.5*Math.sqrt(2));
        break;
      case 6:
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 1;
        this.draw_polygon(ctx,x,y,0.5*Math.sqrt(2),4,th);
        break;
    }
  }


  draw_compass(ctx,num,x,y){
    switch(num){
      case 1:
        var r = 0.5;
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        this.draw_ast(ctx,x,y,r*Math.sqrt(2));
        break;
      case 2:
        var r = 0.33;
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        this.draw_ast(ctx,x,y,r*Math.sqrt(2));
        break;
      case 3:
        var r = 0.5;
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        this.draw_ast(ctx,x,y,r*Math.sqrt(2));
        break;
    }
  }

  draw_tents(ctx,num,x,y){
    switch(num){
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
        ctx.moveTo(x-r1*pu.size,y);
        ctx.lineTo(x+r1*pu.size,y);
        ctx.lineTo(x+r1*pu.size,y+r2*pu.size);
        ctx.lineTo(x-r1*pu.size,y+r2*pu.size);
        ctx.lineTo(x-r1*pu.size,y);
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
        ctx.moveTo(x-r1*Math.cos(90*(Math.PI/180))*pu.size,y-(r1*Math.sin(90*(Math.PI/180))+0)*pu.size);
        ctx.lineTo(x-r2*Math.cos(210*(Math.PI/180))*pu.size,y-(r2*Math.sin(210*(Math.PI/180))+0)*pu.size);
        ctx.lineTo(x-r2*Math.cos(330*(Math.PI/180))*pu.size,y-(r2*Math.sin(330*(Math.PI/180))+0)*pu.size);
        //ctx.arc(x,y-0.1*pu.size,0.3*pu.size,0,2*Math.PI,false);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x-r1*Math.cos(90*(Math.PI/180))*pu.size,y-(r1*Math.sin(90*(Math.PI/180))+0.2)*pu.size);
        ctx.lineTo(x-r2*Math.cos(210*(Math.PI/180))*pu.size,y-(r2*Math.sin(210*(Math.PI/180))+0.2)*pu.size);
        ctx.lineTo(x-r2*Math.cos(330*(Math.PI/180))*pu.size,y-(r2*Math.sin(330*(Math.PI/180))+0.2)*pu.size);
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
        ctx.moveTo(x-r1*Math.cos(90*(Math.PI/180))*pu.size,y-(r1*Math.sin(90*(Math.PI/180))-0.1)*pu.size);
        ctx.lineTo(x-r2*Math.cos(210*(Math.PI/180))*pu.size,y-(r2*Math.sin(210*(Math.PI/180))-0.1)*pu.size);
        ctx.lineTo(x-r2*Math.cos(330*(Math.PI/180))*pu.size,y-(r2*Math.sin(330*(Math.PI/180))-0.1)*pu.size);
        ctx.lineTo(x-r1*Math.cos(90*(Math.PI/180))*pu.size,y-(r1*Math.sin(90*(Math.PI/180))-0.1)*pu.size);
        ctx.lineTo(x-r2*Math.cos(210*(Math.PI/180))*pu.size,y-(r2*Math.sin(210*(Math.PI/180))-0.1)*pu.size);
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
        ctx.moveTo(x-0.35*pu.size,y);
        ctx.quadraticCurveTo(x-0.*pu.size,y+0.37*pu.size,x+0.3*pu.size,y-0.2*pu.size);
        ctx.stroke();
        ctx.moveTo(x-0.35*pu.size,y);
        ctx.quadraticCurveTo(x-0.*pu.size,y-0.37*pu.size,x+0.3*pu.size,y+0.2*pu.size);
        ctx.stroke();
        break;
      case 4:
        set_font_style(ctx,0.8*pu.size.toString(10),1);
        ctx.text("～",x,y-0.11*pu.size);
        ctx.text("～",x,y+0.09*pu.size);
        ctx.text("～",x,y+0.29*pu.size);
        break;
    }
  }

  draw_star(ctx,num,x,y){
    var r1 = 0.38;
    var r2 = 0.382*r1;
    switch(num){
      case 1:
        ctx.fillStyle = "#fff";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y+0.03*pu.size,r1,r2,5);
        break;
      case 2:
        ctx.fillStyle = "#000";  //"#009826";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y+0.03*pu.size,r1,r2,5);
        break;
      case 3:
        ctx.fillStyle = "#999";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y+0.03*pu.size,r1,r2,5);
        break;
      case 4:
        ctx.fillStyle = "#fff";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y,r1,r2*0.9,4);
        break;
      case 5:
        ctx.fillStyle = "#000";  //"#009826";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y,r1,r2*0.9,4);
        break;
      case 6:
        ctx.fillStyle = "#999";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y,r1,r2*0.9,4);
        break;
      case 7:
        ctx.fillStyle = "#fff";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y,r2*0.9,r1,4);
        break;
      case 8:
        ctx.fillStyle = "#000";  //"#009826";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y,r2*0.9,r1,4);
        break;
      case 9:
        ctx.fillStyle = "#999";
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 1;
        this.draw_star0(ctx,x,y,r2*0.9,r1,4);
        break;
      case 0:
        var r = 0.4;
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        this.draw_x(ctx,x,y,r)
        break;
    }
  }

  draw_star0(ctx,x,y,r1,r2,n){
    var th1 = 90;
    var th2 = th1+180/n;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x-r1*Math.cos(th1*(Math.PI/180))*pu.size,y-(r1*Math.sin(th1*(Math.PI/180))-0)*pu.size);
    ctx.lineTo(x-r2*Math.cos(th2*(Math.PI/180))*pu.size,y-(r2*Math.sin(th2*(Math.PI/180))-0)*pu.size);
    for(var i=0;i<n;i++){
      th1 += 360/n;
      th2 += 360/n;
      ctx.lineTo(x-r1*Math.cos(th1*(Math.PI/180))*pu.size,y-(r1*Math.sin(th1*(Math.PI/180))-0)*pu.size);
      ctx.lineTo(x-r2*Math.cos(th2*(Math.PI/180))*pu.size,y-(r2*Math.sin(th2*(Math.PI/180))-0)*pu.size);
    }
    ctx.fill();
    ctx.stroke();
  }

  draw_battleship(ctx,num,x,y){
    var r = 0.4;
    var th;
    switch(num){
      case 1:
        ctx.beginPath();
        ctx.arc(x,y,r*pu.size,0,Math.PI*2,false);
        ctx.fill();
        ctx.stroke();
        break;
        case 2:
          th = this.rotate_theta(45)*180/Math.PI;
          this.draw_polygon(ctx,x,y,0.47,4,th);
          break;
        case 3:
          th = this.rotate_theta(105)*180/Math.PI;
          this.draw_polygon(ctx,x,y,0.47,4,th);
          break;
        case 4:
          th = this.rotate_theta(165)*180/Math.PI;
          this.draw_polygon(ctx,x,y,0.47,4,th);
          break;
        case 5:
          this.draw_battleship_tip(ctx,x,y,0);
          break;
        case 6:
          this.draw_battleship_tip(ctx,x,y,60);
          break;
        case 7:
          this.draw_battleship_tip(ctx,x,y,120);
          break;
        case 8:
          this.draw_battleship_tip(ctx,x,y,180);
          break;
        case 9:
          this.draw_battleship_tip(ctx,x,y,240);
          break;
        case 0:
          this.draw_battleship_tip(ctx,x,y,300);
          break;
    }
  }

  draw_battleship_tip(ctx,x,y,th){
    var r = 0.36;
    th = this.rotate_theta(th);
    ctx.beginPath();
    ctx.arc(x,y,r*pu.size,Math.PI*0.5+th,Math.PI*1.5+th,false);
    ctx.moveTo(x+r*pu.size*Math.sin(th),y-r*pu.size*Math.cos(th));
    ctx.lineTo(x+r*Math.sqrt(2)*pu.size*Math.sin(th+45/180*Math.PI),y-r*Math.sqrt(2)*pu.size*Math.cos(th+45/180*Math.PI));
    ctx.lineTo(x+r*Math.sqrt(2)*pu.size*Math.sin(th+135/180*Math.PI),y-r*Math.sqrt(2)*pu.size*Math.cos(th+135/180*Math.PI));
    ctx.lineTo(x+r*pu.size*Math.sin(th+Math.PI),y-r*pu.size*Math.cos(th+Math.PI));
    ctx.fill();
    ctx.stroke();
  }

  draw_angleloop(ctx,num,x,y){
    var r;
    switch(num){
      case 1:
        r = 0.24;
        set_circle_style(ctx,2);
        this.draw_polygon(ctx,x,y,r,3,90);
        break;
      case 2:
        r = 0.24;
        set_circle_style(ctx,5);
        ctx.fillStyle = "#999";
        this.draw_polygon(ctx,x,y,r,4,45);
        break;
      case 3:
        r = 0.215;
        set_circle_style(ctx,1);
        ctx.lineWidth = 1;
        this.draw_polygon(ctx,x,y,r,5,90);
        break;
      case 4:
        r = 0.25;
        set_circle_style(ctx,1);
        ctx.lineWidth = 2;
        this.draw_x(ctx,x,y,r);
        break;
    }
  }

  draw_firefly(ctx,num,x,y){
    var r1 = 0.36,r2 = 0.09;
    ctx.setLineDash([]);
    ctx.lineCap = "butt";
    switch(num){
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        var th = this.rotate_theta((num-1)*60-180);
        set_circle_style(ctx,1);
        this.draw_circle(ctx,x,y,r1);
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth = 2;
        this.draw_circle(ctx,x-r1*pu.size*Math.cos(th),y-r1*pu.size*Math.sin(th),r2);
        break;
      case 7:
        set_circle_style(ctx,1);
        this.draw_circle(ctx,x,y,r1);
        break;
    }
  }

  draw_sun_moon(ctx,num,x,y){
    var r1 = 0.36,r2 = 0.34;
    switch(num){
      case 1:
        set_circle_style(ctx,1);
        this.draw_circle(ctx,x,y,r1);
        break;
      case 2:
        set_circle_style(ctx,2);
        ctx.beginPath();
        ctx.arc(x,y,r1*pu.size,-0.34*Math.PI,0.73*Math.PI,false);
        ctx.arc(x-0.12*pu.size,y-0.08*pu.size,r2*pu.size,0.67*Math.PI,-0.28*Math.PI,true);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }

  draw_pencils(ctx,num,x,y){
    var r = 0.2;
    ctx.setLineDash([]);
    ctx.lineCap = "butt";
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineJoin = "bevel"
    switch(num){
      case 1:
        ctx.beginPath();
        ctx.moveTo(x+0.5*pu.size,y-0.5*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x+0.5*pu.size,y+0.5*pu.size);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x+r*pu.size,y-r*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x+r*pu.size,y+r*pu.size);
        ctx.closePath();
        ctx.fill();
        break;
      case 2:
        ctx.beginPath();
        ctx.moveTo(x+0.5*pu.size,y+0.5*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x-0.5*pu.size,y+0.5*pu.size);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x+r*pu.size,y+r*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x-r*pu.size,y+r*pu.size);
        ctx.closePath();
        ctx.fill();
        break;
      case 3:
        ctx.beginPath();
        ctx.moveTo(x-0.5*pu.size,y+0.5*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x-0.5*pu.size,y-0.5*pu.size);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x-r*pu.size,y+r*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x-r*pu.size,y-r*pu.size);
        ctx.closePath();
        ctx.fill();
        break;
      case 4:
        ctx.beginPath();
        ctx.moveTo(x-0.5*pu.size,y-0.5*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x+0.5*pu.size,y-0.5*pu.size);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x-r*pu.size,y-r*pu.size);
        ctx.lineTo(x,y);
        ctx.lineTo(x+r*pu.size,y-r*pu.size);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }

  draw_sudokuetc(ctx,num,x,y){
    switch(num){
      case 1:
        var r = 0.14;
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.fillStyle = "#ccc";
        this.draw_polygon(ctx,x-r*pu.size,y+r*pu.size,r*Math.sqrt(2),4,45);
        this.draw_polygon(ctx,x+r*pu.size,y-r*pu.size,r*Math.sqrt(2),4,45);
        ctx.fillStyle = "#666";
        this.draw_polygon(ctx,x-r*pu.size,y-r*pu.size,r*Math.sqrt(2),4,45);
        this.draw_polygon(ctx,x+r*pu.size,y+r*pu.size,r*Math.sqrt(2),4,45);
        break;
      case 2:
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 4;
        this.draw_circle(ctx,x,y,0.71);
        break;
      case 3:
        var r = 0.99;
        set_circle_style(ctx,3);
        ctx.beginPath();
        ctx.moveTo(x,y+r*pu.size);
        ctx.lineTo(x+r*pu.size,y);
        ctx.lineTo(x,y-r*pu.size);
        ctx.lineTo(x-r*pu.size,y);
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

  draw_polyomino(ctx,num,x,y){
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(200,200,200,1)";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.2;
    ctx.lineCap = "butt";
    var r = 0.25;
    for(var i=0;i<9;i++){
      if(num[i] === 1){
        this.draw_polygon(ctx,x+(i%3-1)*r*pu.size,y+((i/3|0)-1)*r*pu.size,r*0.5*Math.sqrt(2),4,45);
      }
    }
  }

  rotate_theta(th){
    th = (th+this.theta);
    if(this.reflect[0] === -1){th = (180-th+360)%360;}
    if(this.reflect[1] === -1){th = (360-th+360)%360;}
    th = th/180*Math.PI;
    return th;
  }
}
