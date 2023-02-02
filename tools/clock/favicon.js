function swap(url) {
    let el = document.head.querySelector("link[rel='icon']")
    if (!el) {
        el = document.createElement("link")
        el.setAttribute("rel", "icon")
        el.setAttribute("href", url)
        document.head.appendChild(el)
    } else {
        let parent = el.parentNode;
        if (parent) { parent.removeChild(el); }
        el.href = url;
        if (parent) { parent.appendChild(el); }
    }
    return true
}

const canvas = document.createElement("canvas")
canvas.width = 400
canvas.height = 400

var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90
setInterval(drawClock, 5000);
drawClock();

function drawClock() {
  drawFace(ctx, radius);
  drawTime(ctx, radius);
  swap(canvas.toDataURL())
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.strokeStyle = "#9aacb6";
  ctx.lineWidth = radius*0.25;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
}

function drawTime(ctx, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.07);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#62737d"
    ctx.lineWidth = radius/6;
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}