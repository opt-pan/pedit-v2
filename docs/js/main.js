onload = function(){

boot();

document.addEventListener("beforeunload", function(eve){
    eve.returnValue = "ページを移動します";
},{passive: false});

var ua = navigator.userAgent;
if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
    ondown_key = "touchstart";
    onup_key = "touchend";
    onmove_key = "touchmove";
    onleave_key = "touchmove";
} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
    ondown_key = "touchstart";
    onup_key = "touchend";
    onmove_key = "touchmove";
    onleave_key = "touchmove";
} else {
    ondown_key = "mousedown";
    onup_key = "mouseup";
    onmove_key = "mousemove";
    onleave_key = "mouseleave";
}

var checkms = 0;//hover event用一時変数

//canvas
canvas.addEventListener(onup_key, onUp, {passive: false});
canvas.addEventListener(onmove_key, onMove, {passive: false});
canvas.addEventListener('mouseout', onOut, {passive: false});
canvas.addEventListener('contextmenu',onContextmenu,{passive: false});
document.addEventListener('keydown',onKeyDown,{passive: false});

function onDown(e) {
  if(e.type === "mousedown") {
      var event = e;
  } else {
      var event = e.changedTouches[0];
      //e.preventDefault();
  }
  var num = coord_point(event);
  if(pu.point[num].use===1){
    if (event.button === 2){
        pu.drawonDownR(num);
    }else{  //左クリックorタップ
        pu.drawonDown(num);
    }
  }
}

function onUp(e) {
  if(e.type === "mouseup") {
      var event = e;
  } else {
      var event = e.changedTouches[0];
      //e.preventDefault();
  }
  var num = coord_point(event);
  pu.drawonUp(num);
}

function onMove(e) {
  if(e.type === "mousemove") {
      var event = e;
  } else {
      var event = e.changedTouches[0];
  }
  e.preventDefault();
  var num = coord_point(event);
  if(pu.point[num].use===1){
    pu.drawonMove(num);
  }
}

function onOver(e) {
  return;
}

function onOut() {
  pu.drawonOut();
  return;
}

function onContextmenu(e){ //右クリック
  e.preventDefault();
}

function onKeyDown(e){
  if(e.target.type === "number" || e.target.type === "text"){
    //入力フォーム用
  }else{
    var key = e.key;
    var shift_key = e.shiftKey;
    var ctrl_key = e.ctrlKey;
    var alt_key = e.altKey;

    var str_num = "1234567890";
    var str_alph_low = "abcdefghijklmnopqrstuvwxyz";
    var str_alph_up =  "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var str_sym = "!\"#$%&\'()-=^~|@[];+:*,.<>/?_";

    if(key === "F2"){ //function_key
      pu.mode_qa("pu_q");
      event.returnValue = false;
    }else if(key === "F3"){
      pu.mode_qa("pu_a");
      event.returnValue = false;
    }
    if (key ==="ArrowLeft" ||key ==="ArrowRight" ||key ==="ArrowUp" ||key ==="ArrowDown" ){ //arrow
      pu.key_arrow(key);
      event.returnValue = false;
    }

    if(!ctrl_key){
      if (str_num.indexOf(key) != -1 || str_alph_low.indexOf(key) != -1 ||str_alph_up.indexOf(key) != -1|| str_sym.indexOf(key) != -1){
        pu.key_number(key);
      }else if (key === " "){
        pu.key_space();
        event.returnValue = false;
      }else if (key === "Backspace"){
        pu.key_backspace();
        event.returnValue = false;
      }
    }

    if(ctrl_key){
      switch(key){
        case "d"://Ctrl+d
        case "D":
          duplicate();
          event.returnValue = false;
          break;
        case "y"://Ctrl+y
        case "Y":
          pu.redo();
          event.returnValue = false;
          break;
        case "z": //Ctrl+z
        case "Z":
          pu.undo();
          event.returnValue = false;
          break;
        case " ": //Ctrl+space
          pu.key_shiftspace();
          event.returnValue = false;
          break;
      }
    }
  }
}

function coord_point(e){
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  var min0,min = 10e6;
  var num = 0;
  for (var i in pu.point){
    if(pu.type.indexOf(pu.point[i].type) != -1){
      min0 = (x-pu.point[i].x)**2+(y-pu.point[i].y)**2;
      if(min0<min){
        min = min0;
        num = i;
      }
    }
  }
  return parseInt(num);
}


let count = 0;
let timer;
var undo_button = document.getElementById("tb_undo")
var redo_button = document.getElementById("tb_redo")
undo_button.addEventListener(ondown_key, e => {
  e.preventDefault();
  timer = setInterval(() => {
    count++;
    if(count>20){
      pu.undo();
    }
  }, 20);
}, {passive: false});

undo_button.addEventListener(onup_key, e => {
  e.preventDefault();
  if (count) {
    clearInterval(timer);
    count = 0;
  }
}, {passive: false});

undo_button.addEventListener(onleave_key, e => {
  e.preventDefault();
  clearInterval(timer);
  count = 0;
});

redo_button.addEventListener(ondown_key, e => {
  e.preventDefault();
  timer = setInterval(() => {
    count++;
    if(count>20){
      pu.redo();
    }
  }, 20);
}, {passive: false});

redo_button.addEventListener(onup_key, e => {
  e.preventDefault();
  if (count) {
    clearInterval(timer);
    count = 0;
  }
}, {passive: false});

redo_button.addEventListener(onleave_key, e => {
  e.preventDefault();
  clearInterval(timer);
  count = 0;
});


//クリックイベント
document.addEventListener(ondown_key, window_click, {passive: false});

function window_click(e) {
  //console.log(e.target.id);
  //modalwindow
  if (e.target.className === "modal") {
    document.getElementById(e.target.id).style.display = 'none';
    e.preventDefault();
  }
  switch(e.target.id){
    //canvas
    case "canvas":
      onDown(e);
      if(checkms === 0){
        e.preventDefault();
      }
      break;
    //top/bottom button
    case "newboard":
      newboard();
      e.preventDefault(); break;
    case "rotation":
      rotation();
      e.preventDefault(); break;
    case "newsize":
      newsize();
      e.preventDefault(); break;
    case "saveimage":
      saveimage();
      e.preventDefault(); break;
    case "savetext":
      savetext();
      e.preventDefault(); break;
    //case "duplicate":
      //duplicate();
    //  break;
    case "tb_undo":
      pu.undo();
      e.preventDefault(); break;
    case "tb_redo":
      pu.redo();
      e.preventDefault(); break;
    case "tb_reset":
      ResetCheck();
      break;
    case "tb_delete":
      DeleteCheck();
      break;

    //panel_menu
    case "panel_1_lbmenu":
      panel_pu.mode_set('number');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_A_lbmenu":
      panel_pu.mode_set('alphabet');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_a_lbmenu":
      panel_pu.mode_set('alphabet_s');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_!_lbmenu":
      panel_pu.mode_set('key_symbol');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_ja_K_lbmenu":
      panel_pu.mode_set('ja_K');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_ja_H_lbmenu":
      panel_pu.mode_set('ja_H');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_Kan_lbmenu":
      panel_pu.mode_set('Kan');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_Rome_lbmenu":
      panel_pu.mode_set('Rome');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_Greek_lbmenu":
      panel_pu.mode_set('Greek');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_europe_lbmenu":
      panel_pu.mode_set('europe');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_Cyrillic_lbmenu":
      panel_pu.mode_set('Cyrillic');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_Chess_lbmenu":
      panel_pu.mode_set('Chess');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_card_lbmenu":
      panel_pu.mode_set('card');
      panel_pu.select_close();
      e.preventDefault(); break;
    case "panel_select_lbmenu":
      panel_pu.select_open();
      e.preventDefault(); break;
    case "float-canvas":
      f_mdown(e);
      if(checkms === 0){
        e.preventDefault();
      }
      break;
    //savetext
    case "address_edit":
      savetext_edit();
      e.preventDefault(); break;
    case "address_solve":
      savetext_solve();
      e.preventDefault(); break;
    case "pp_file":
      make_ppfile();
      e.preventDefault(); break;
    case "savetextarea":
      return;
    case "savetextname":
      return;
    case "closeBtn_save1":
      savetext_copy();
      e.preventDefault(); break;
    case "closeBtn_save2":
      savetext_download();
      e.preventDefault(); break;
    //case "closeBtn_save3":
    //  savetext_window();
    //  break;
    case "closeBtn_save4":
      document.getElementById('modal-save').style.display='none';
      e.preventDefault(); break;
    case "rt_right":
      pu.rotate_right();
      e.preventDefault(); break;
    case "rt_left":
      pu.rotate_left();
      e.preventDefault(); break;
    case "rt_LR":
      pu.rotate_LR();
      e.preventDefault(); break;
    case "rt_UD":
      pu.rotate_UD();
      e.preventDefault(); break;
    case "rt_center":
      pu.rotate_center();
      e.preventDefault(); break;
    case "rt_size":
      pu.rotate_size();
      e.preventDefault(); break;
    case "rt_reset":
      pu.rotate_reset();
      e.preventDefault(); break;
    case "closeBtn_rotate1":
      document.getElementById('modal-rotate').style.display='none';
      e.preventDefault(); break;
    //saveimage
    case "nb_margin1_lb":
      document.getElementById("nb_margin1").checked = true;
      e.preventDefault(); break;
    case "nb_margin2_lb":
      document.getElementById("nb_margin2").checked = true;
      e.preventDefault(); break;
    case "saveimagename":
      return;
    //case "closeBtn_image1":
    //  saveimage_window();
    //  break;
    case "closeBtn_image2":
      saveimage_download();
      e.preventDefault(); break;
    case "closeBtn_image3":
      document.getElementById('modal-image').style.display='none';
      e.preventDefault(); break;
    //newboard
    case "nb_size1":
    case "nb_size2":
    case "nb_size3":
      return; //textbox
    case "nb_space1":
    case "nb_space2":
    case "nb_space3":
    case "nb_space4":
      return; //textbox
    case "nb_grid1_lb":
    case "nb_grid2_lb":
    case "nb_grid3_lb":
    case "nb_lat1_lb":
    case "nb_lat2_lb":
    case "nb_out1_lb":
    case "nb_out2_lb":
      pu.mode_grid(e.target.id.slice(0,-3));
      e.preventDefault(); break;
    case "closeBtn_nb1":
      CreateCheck();
      e.preventDefault(); break;
    case "closeBtn_nb2":
      newgrid();
      e.preventDefault(); break;
    case "closeBtn_nb3":
      document.getElementById('modal').style.display='none';
      e.preventDefault(); break;
    //newsize
    case "nb_size3_r":
      return;
    case "closeBtn_size1":
      newgrid_r();
      e.preventDefault(); break;
    case "closeBtn_size2":
      document.getElementById('modal-newsize').style.display='none';
      e.preventDefault(); break;
    case "float-key-header":
      mdown(e);
      e.preventDefault(); break;
    case "float-key-header-lb":
      mdown(e);
      e.preventDefault(); break;
    //buttons
    case "panel_button":
      panel_onoff();
      e.preventDefault(); break;
    case "edge_button":
      edge_onoff();
      e.preventDefault(); break;
    case "pu_q_label":
      pu.mode_qa("pu_q");
      e.preventDefault(); break;
    case "pu_a_label":
      pu.mode_qa("pu_a");
      e.preventDefault(); break;
  }
  //メインモード
  if(e.target.id.slice(0,3)==="mo_"){
    pu.mode_set(e.target.id.slice(3,-3));
    e.preventDefault();
  }
  //サブモード
  if(e.target.id.slice(0,4)==="sub_"){
    pu.submode_check(e.target.id.slice(0,-3));
    e.preventDefault();
  }
    //スタイルモード
  if(e.target.id.slice(0,3)==="st_"){
    pu.stylemode_check(e.target.id.slice(0,-3));
    e.preventDefault();
  }
    //シンボル
  if(e.target.id.slice(0,3)==="ms_"){
    checkms = 1;
    pu.subsymbolmode(e.target.id.slice(3));
    e.preventDefault();
    //シンボルホバーetc
  }else if(e.target.id.slice(0,2)==="ms"){
    checkms = 1;
    return;
  }else if(checkms === 1){
    checkms = 0;
    return;
  }
}

//panel(drag_window)
    var x_window;
    var y_window;

    function mdown(e) {
        var elements = document.getElementById("float-key-header");
        elements.classList.add("drag");

        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        x_window = event.pageX - elements.offsetLeft;
        y_window = event.pageY - elements.offsetTop;
        var drag = document.getElementsByClassName("drag")[0];
        document.body.addEventListener(onmove_key, mmove, {passive: false});
    }

    function mmove(e) {

        var drag = document.getElementsByClassName("drag")[0];
        var body = document.getElementById("float-key-body");
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }
        e.preventDefault();

        drag.style.top = event.pageY - y_window + "px";
        drag.style.left = event.pageX - x_window + "px";
        body.style.top = event.pageY - y_window + "px";
        body.style.left = event.pageX - x_window + "px";

        drag.addEventListener(onup_key, mup, {passive: false});
        document.body.addEventListener("mouseleave", mup, {passive: false});
        document.body.addEventListener("touchleave", mup, {passive: false});

    }

    function mup(e) {
        var drag = document.getElementsByClassName("drag")[0];
        if(drag){
          document.body.removeEventListener(onmove_key, mmove, {passive: false});
          drag.removeEventListener(onup_key, mup, {passive: false});

          drag.classList.remove("drag");
        }
    }


    //パネル入力設定
    var float_canvas = document.getElementById("float-canvas");

    function f_mdown(e) {
      if(e.type === "mousedown") {
        var event = e;
        var xf = event.offsetX;
        var yf = event.offsetY;
      } else {
        var float_canvas = document.getElementById("float-canvas");
        var event = e.changedTouches[0];
        var xf = event.pageX-(float_canvas.getBoundingClientRect().x-document.documentElement.getBoundingClientRect().left);
        var yf = event.pageY-(float_canvas.getBoundingClientRect().y-document.documentElement.getBoundingClientRect().top);
      }
      var sizef = panel_pu.sizef;
      var numxf = Math.floor(xf/(sizef+3));
      var numyf = Math.floor(yf/(sizef+3));
      var n = numxf+numyf*panel_pu.nxf;
      var paneletc = ["ja_K","ja_H","Kan","Rome","Greek","Cyrillic","europe","Chess","card"];

      if(pu.mode[pu.mode.qa].edit_mode === "symbol"){
        panel_pu.edit_num = n;
        if(document.getElementById('panel_button').textContent === "ON"&&pu.onoff_symbolmode_list[pu.mode[pu.mode.qa].symbol[0]]){
          if (0<=panel_pu.edit_num&&panel_pu.edit_num<=8){
            pu.key_number((panel_pu.edit_num+1).toString());
          }else if (panel_pu.edit_num===9){
            pu.key_number(0);
          }else if (panel_pu.edit_num===11){
            pu.key_space();
          }
        }
        panel_pu.draw_panel();
      }else if(panel_pu.panelmode === "number"){
        if (0<=n&&n<=9){
          pu.key_number(panel_pu.cont[n].toString());
        }else if (n===10){
          pu.key_backspace();
        }else if (n===11){
          pu.key_space();
        }
      }else if(panel_pu.panelmode === "alphabet" || panel_pu.panelmode === "alphabet_s"){
        if (0<=n&&n<=27){
          pu.key_number(panel_pu.cont[n].toString());
        }else if (n===28){
          pu.key_number(" ");
        }else if (n>=29){
          pu.key_space();
        }
      }else if(panel_pu.panelmode === "key_symbol"){
        if (panel_pu.cont[n] && panel_pu.cont[n]!=" "){
          pu.key_number(panel_pu.cont[n]);
        }else if (panel_pu.cont[n]===" "){
          pu.key_space();
        }
      }else if(paneletc.indexOf(panel_pu.panelmode)!=-1){
        if (panel_pu.cont[n] && panel_pu.cont[n]!="　"){
          pu.key_number(panel_pu.cont[n]);
        }else if (panel_pu.cont[n]==="　"){
          pu.key_space();
        }
      }
    }

};
