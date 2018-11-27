/*
  I need to revise the redraw Canvas to use the FontMetrics
  and draw all of the lines. This should be pretty easy to do!
*/
console.log("In editor.js!!")


const fontColor = "black"
let fonttype = "32pt Courier"
let fontNumericSize = "32"

const allLetters = "!@#{$%^&*()_+-={}|[]\\:\";'<>?,./~`}abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"

mset.style["font-size"]="40"

let ctx = null;
let charWidth = 100;
let lineSep = 10
let lineHeight=20
let lineDescent = 2
let state={}

function getFontSize(){

  ctx = mset.getContext('2d')
  charWidth = ctx.measureTextWidth(letters).width/letters.length
  console.log(mset.style["font-size"])
  //ctx.font = "32px courier"
  console.log(fontNumericSize)
  fontName = fontNumericSize+"px courier"
  console.log("fontname is "+fontName)
  ctx.font = fontName
  //ctx.font = fontSize+"px courier"
  console.log(ctx.font)
  mset.style["font-size"]=fontNumericSize
  console.log(mset.style["font-size"])
  ctx.fillStyle='black'
  fontSize = ctx.measureText(letters)
  lineSep = Math.round(fontSize.height*0.5) // additional distance between lines ...
  lineHeight = fontSize.height+lineSep //
  lineDescent = fontSize.descent

  numRows = Math.floor(mset.height/lineHeight);
  numCols = Math.floor(mset.width/(charWidth))

  state.cols = numCols
  state.rows = numRows

  //return ctx.measureText(letters);
}

fontSize = getFontSize()
console.log('fontSize is ')
console.dir(fontSize)
console.log("font is "+ctx.font)






mset.width = window.innerWidth*0.9;
mset.height = window.innerHeight*0.9;
numRows = Math.floor(mset.height/lineHeight);
numCols = Math.floor(mset.width/(charWidth))
console.log("rows:"+numRows+"  cols:"+numCols)

function clearCanvas(){
  const ctx = mset.getContext('2d')
  ctx.fillStyle='white'
  ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
}



state =
   {text:[""],cursor:[0,0],
    rowOffset:0,
    colOffset:0,
    rows:numRows,cols:numCols}

// here is how we can get the key which is pressed
mset.addEventListener('keydown', function(event) {
    console.log("keydown event"); console.dir(event);
    addKeyPress(event);
    redrawCanvas();
        });

// here is how we can get the position of the mouseclick
mset.addEventListener('mousedown', function(event){
    console.log("mousedown event"); console.dir(event);
    let row = Math.floor(event.offsetY/lineHeight)+state.rowOffset
    let col = Math.round(event.offsetX/(charWidth)) + state.colOffset
    console.log("position="+row+":"+col)
    row = Math.min(row,state.text.length-1)
    col = Math.min(col,state.text[row].length)
    state.cursor = [row,col]
    redrawCanvas()
});


function addKeyPress(event){
  const key = event.key
  //console.log(key)
  if (event.ctrlKey){
    console.log("hit the ctrl key ")
    console.dir(event)
    return
    // process ^F ^B ^N ^P to move cursor ...
    // ^A beginning of line ^E end of line
    // ^D delete next character
  } else if (key=='ArrowLeft'){
    //console.log('moving left')
    if (state.cursor[1]>0){
      const lineLen = state.text[state.cursor[0]].length
      if (state.cursor[1]>lineLen){
        state.cursor[1] = lineLen
      }
      state.cursor[1]--;
    } else {
      if (state.cursor[0]>0) {
        state.cursor[0]--
        state.cursor[1] = state.text[state.cursor[0]].length
      }
    }
    return
  } else if (key=='ArrowRight'){
    //console.log('moving right')
    if (state.cursor[1]<state.text[state.cursor[0]].length){
      state.cursor[1]++;
    } else {
      if (state.cursor[0]<state.text.length-1) {
        state.cursor[0]++
        state.cursor[1]=0
      }
    }

    return
  } else if (key=='ArrowUp'){
    //console.log('moving up')
    if (state.cursor[0]>0){
      state.cursor[0]--;
    }
    return
  } else if (key=='ArrowDown'){
    //console.log('moving down')
    if (state.cursor[0]<state.text.length-1){
      state.cursor[0]++;
    }
    return
  } else if (key=='Backspace'){
    //console.log('backspace')
    removePrevChar()
    // remove the character at the current position!!!
    return
  } else if (key=='Enter'){
    insertCRLF()
    return
  } else if (allLetters.indexOf(key)<0) {
    //console.log("skipping the key "+key);
    return
  } else {
  //console.log("adding the key "+key)

  //printState()
  insertKey(key)
  //printState()
  }
}

function removePrevChar(){
  const row = state.cursor[0]
  const line = state.text[row]
  const lineLen = state.text[row].length
  if (state.cursor[1]>lineLen){
    state.cursor[1] = lineLen
  }
  const col = state.cursor[1]
  if (col>0){
    state.text.splice(row,1,
      line.substring(0,col-1)+line.substring(col))
    state.cursor[1]--;
  } else if(row>0){
    const prevLine = state.text[row-1]
    state.text.splice(row-1,2,
      prevLine+line)
    state.cursor=[row-1,prevLine.length]
  }

}
function insertCRLF(){
  //console.log('moving to new line!!')
  //console.log(JSON.stringify(state))

  const newrow =state.cursor[0]
  const pos = state.cursor[1]
  const line = state.text[newrow]
  //console.log("process CRLF!")
  //console.log(JSON.stringify([newrow, pos,line]))
  //console.log(JSON.stringify(state.text))
  state.text.splice(newrow,1,
    line.substring(0,pos),line.substring(pos))
  state.cursor[0]++;
  state.cursor[1]=0;
  //console.log(JSON.stringify(state.text))
  //state.text = state.text.slice(0,newrow).concat([""]).concat(state.text.slice(newrow))
  //console.log(JSON.stringify([state,newrow]))


}

function insertKey(key){
  console.log("inserting "+key)
  const line = state.text[state.cursor[0]] // get current line
  const first = line.substring(0,state.cursor[1]) // first part
  const rest = line.substring(state.cursor[1])
  const newline = first+key+rest
  state.text[state.cursor[0]] = newline
  state.cursor[1] += 1
}

function redrawCanvas(){
  getFontSize()
  console.log("clear Canvas");
  clearCanvas()
  console.log("drawing text on canvas: "+JSON.stringify(state.text))
  const ctx = mset.getContext('2d')
  //ctx.font = fonttype
  ctx.fillStyle='black'

  if ((state.cursor[0]<state.rowOffset)  ) {
    state.rowOffset = state.cursor[0]-5;
    state.rowOffset = Math.max(state.rowOffset, 0);
  } else if (state.cursor[0]>= state.rowOffset+state.rows){
    state.rowOffset += 5;
  }

  if ((state.cursor[1]<state.colOffset)  ) {
    state.colOffset = state.cursor[1]-5;
    state.colOffset = Math.max(state.colOffset, 0);
  } else if (state.cursor[1]>= state.colOffset+state.cols){
    state.colOffset = state.cursor[1]-(state.cols-5);
    state.colOffset = Math.max(state.colOffset,0)
  }

  console.log(JSON.stringify([state,state.rowOffset]))
  var rowEnd = Math.min(state.text.length,state.rows+state.rowOffset)
  console.log("rowStart = "+state.rowOffset+" rowEnd = "+rowEnd)

  for(i=state.rowOffset; i< rowEnd ; i++){
    const line =state.text[i].substring(state.colOffset,state.colOffset+state.cols+5)
    const text = ctx.measureText(line)
    const start = 0
    const baseline = (1+i-state.rowOffset)*lineHeight+lineDescent
    const topline = lineHeight
    ctx.fillText(line,start,baseline)
  }

  drawCursor()
}

function printState(){
  console.log(JSON.stringify(state))
}

function drawCursor(){
  console.log(JSON.stringify(state))
  const line =state.text[state.cursor[0]]
  const first = line.substring(0,state.cursor[1])
  const ctx = mset.getContext('2d')
  ctx.fillStyle='black'


  const visibleColumn = (first.length-state.colOffset)

  const visibleRow = (state.cursor[0]-state.rowOffset)


  const start = visibleColumn*charWidth
  const baseline = visibleRow*lineHeight+lineSep+lineDescent
  const topline = lineHeight-lineSep+lineDescent+1
  //console.log(JSON.stringify([start,baseline,topline]))
  ctx.fillRect(start,baseline, 1,topline)
}
