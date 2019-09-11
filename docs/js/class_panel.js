class Panel{
  constructor(){
    this.panelmode = "number";
    this.canvasf = document.getElementById("float-canvas");
    this.ctxf = this.canvasf.getContext("2d");
    this.fkh = document.getElementById("float-key-header");
    this.fkm = document.getElementById("float-key-menu");
    this.fkb = document.getElementById("float-key-body");

    this.spacef = 3;
    this.sizef = 36;//Math.min(45,Math.max(pu.size,28));
    this.nxf = 4;
    this.nyf = 3;

    this.cont = [];
    this.str = "";
    this.edit_num = 0;
  }

  mode_set(mode) {
    this.panelmode = mode;
    this.draw_panel();
  }

  canvas_size_setting(height){
    this.canvasf.width=((this.sizef+this.spacef)*this.nxf-this.spacef)*pu.resol;
    this.canvasf.height=((this.sizef+this.spacef)*this.nyf-this.spacef)*pu.resol;
    this.ctxf.scale(pu.resol,pu.resol);
    this.canvasf.style.width = ((this.sizef+this.spacef)*this.nxf-this.spacef).toString()+"px";
    this.canvasf.style.height = ((this.sizef+this.spacef)*this.nyf-this.spacef).toString()+"px";
    this.fkh.style.width = ((this.sizef+this.spacef)*this.nxf+this.spacef).toString()+"px";
    this.fkb.style.width = ((this.sizef+this.spacef)*this.nxf+this.spacef).toString()+"px";
    this.fkb.style.height = ((this.sizef+this.spacef)*this.nyf+this.spacef+height).toString()+"px";
  }

  draw_number(){
    set_surface_style(this.ctxf,99);
    for(var i = 0 ; i < this.nxf*this.nyf ; i++){
        this.ctxf.fillRect((i%this.nxf)*(this.sizef+this.spacef),(i/this.nxf|0)*(this.sizef+this.spacef), this.sizef, this.sizef);
    }
    for(var i = 0 ; i < this.nxf*this.nyf ; i++){
      set_font_style(this.ctxf,0.8*this.sizef.toString(10),pu.mode[pu.mode.qa][pu.mode[pu.mode.qa].edit_mode][1]);
      this.ctxf.strokeText(this.cont[i].toString(),(i%this.nxf+0.45)*(this.sizef+this.spacef),((i/this.nxf|0)+0.55)*(this.sizef+this.spacef));
      this.ctxf.fillText(this.cont[i].toString(),(i%this.nxf+0.45)*(this.sizef+this.spacef),((i/this.nxf|0)+0.55)*(this.sizef+this.spacef));
    }
  }

  draw_panel() {
    if(pu.mode[pu.mode.qa].edit_mode === "number"){
      switch(this.panelmode){
        case "number":
          this.nxf = 4;
          this.nyf = 3;
          this.sizef = 36;
          this.canvas_size_setting(45);
          this.fkb.style.paddingTop = "0px";
          this.fkb.style.display = "block";
          this.fkm.style.display = "flex";
          this.cont = [1,2,3,4,5,6,7,8,9,0,"?",""];
          this.draw_number();
          break;
        case "alphabet":
          this.nxf = 6;
          this.nyf = 5;
          this.sizef = 36;
          this.canvas_size_setting(45);
          this.fkb.style.paddingTop = "0px";
          this.fkb.style.display = "block";
          this.fkm.style.display = "flex";
          this.cont = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
          "P","Q","R","S","T","U","V","W","X","Y","Z","!","?","_",""];
          this.draw_number();
          break;
        case "key_symbol":
          this.nxf = 6;
          this.nyf = 5;
          this.sizef = 36;
          this.canvas_size_setting(45);
          this.fkb.style.paddingTop = "0px";
          this.fkb.style.display = "block";
          this.fkm.style.display = "flex";
          this.str = "!?#$%&()[]+－×＊/÷＝\u{221E}^<>～|@;:,._   "
          this.cont = this.str.split("");
          this.draw_number();
          break;
        case "ja_K":
          this.nxf = 10;
          this.nyf = 9;
          this.sizef = 28;
          this.canvas_size_setting(45);
          this.fkb.style.paddingTop = "0px";
          this.fkb.style.display = "block";
          this.fkm.style.display = "flex";
          this.str = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ"+
          "ヤユヨ　　ラリルレロワヲン　　ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォャュョッ　ー。、　　"
          this.cont = this.str.split("");
          this.draw_number();
          break;
        case "ja_H":
          this.nxf = 10;
          this.nyf = 9;
          this.sizef = 28;
          this.canvas_size_setting(45);
          this.fkb.style.paddingTop = "0px";
          this.fkb.style.display = "block";
          this.fkm.style.display = "flex";
          this.str = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふめもまみむめも"+
          "やゆよ　　らりるれろわをん　　がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉゃゅょっ　ー。、　　"
          this.cont = this.str.split("");
          this.draw_number();
          break;
        case "Kan":
          this.nxf = 10;
          this.nyf = 9;
          this.sizef = 28;
          this.canvas_size_setting(45);
          this.fkb.style.paddingTop = "0px";
          this.fkb.style.display = "block";
          this.fkm.style.display = "flex";
          this.str = "黒白灰緑赤青黄水数独偶奇大中小上下左右　同違長短縦横行列遠近高低以央最各交差方向"+
          "一二三四五六七八九十壁領域部屋点線輪　　書含入出通切曲直進　丸角形例題解答正誤図計算言葉文字盤面矢印"
          this.cont = this.str.split("");
          this.draw_number();
          break;
      }
    }else if (pu.mode[pu.mode.qa].edit_mode === "symbol"){
      this.nxf = 4;
      this.nyf = 3;
      this.sizef = 36;
      this.canvas_size_setting(5);
      this.fkb.style.paddingTop = "20px";
      this.fkb.style.display = "block";
      this.fkm.style.display = "none";

      set_surface_style(this.ctxf,99);
      for(var i = 0 ; i < 10 ; i++){
          this.ctxf.fillRect((i%this.nxf)*(this.sizef+this.spacef),(i/this.nxf|0)*(this.sizef+this.spacef), this.sizef, this.sizef);
      }
      i = 11;
      this.ctxf.fillRect((i%this.nxf)*(this.sizef+this.spacef),(i/this.nxf|0)*(this.sizef+this.spacef), this.sizef, this.sizef);

      if(pu.onoff_symbolmode_list[pu.mode[pu.mode.qa].symbol[0]]) {
        this.cont = this.makecont(pu.onoff_symbolmode_list[pu.mode[pu.mode.qa].symbol[0]]);
      }else{
        this.cont = [1,2,3,4,5,6,7,8,9,0," "];
      }
      var size = pu.size;
      pu.size = this.sizef;
      for(var i = 0 ; i < this.cont.length ; i++){
        pu.draw_symbol_select(this.ctxf,(i%this.nxf+0.45)*(this.sizef+this.spacef),((i/this.nxf|0)+0.45)*(this.sizef+this.spacef),this.cont[i],pu.mode[pu.mode.qa].symbol[0]);
      }
      pu.size = size;

      if(!pu.onoff_symbolmode_list[pu.mode[pu.mode.qa].symbol[0]]){//onoffモードでなければ赤カーソル
        var i_n
        if(this.edit_num>=0&&this.edit_num<=11&&this.edit_num!=10){
          i_n = this.edit_num;
        }
        set_line_style(this.ctxf,100);
        this.ctxf.strokeRect((i_n%this.nxf)*(this.sizef+this.spacef),(i_n/this.nxf|0)*(this.sizef+this.spacef), this.sizef, this.sizef);
      }
    }else{
      this.fkb.style.display = "none";
    }
  }

  makecont(n){
    var a = [];
    for(var i=0;i<n;i++){
      a[i]=[];
      for(var j=0;j<n;j++){
        if(i===j){
          a[i][j] = 1;
        }else{
          a[i][j] = 0;
        }
      }
    }
    return a;
  }
}
