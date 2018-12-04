/*
  I need to revise the redraw Canvas to use the FontMetrics
  and draw all of the lines. This should be pretty easy to do!
*/
console.log("In editor.js!!")

class Editor{
  constructor(mset){
    this.mset=mset
    this.fontColor = "black"
    this.fonttype = "32pt Courier"
    this.fontNumericSize = "32"

    this.allLetters = "!@#{$%^&*()_+-={}|[]\\:\";'<>?,./~`}abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"
    this.letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"

    mset.style["font-size"]="40"

    this.ctx = null;
    this.charWidth = 100;
    this.lineSep = 10
    this.lineHeight=20
    this.lineDescent = 2
    this.state={}

    this.mset.width = window.innerWidth*0.9;
    this.mset.height = window.innerHeight*0.9;

    this.fontSize = this.getFontSize()


  }


  getFontSize(){
    let theEditor = this
    this.ctx = this.mset.getContext('2d')
    this.charWidth = this.ctx.measureTextWidth(this.letters).width/this.letters.length
    console.log(this.mset.style["font-size"])
    //ctx.font = "32px courier"
    console.log(this.fontNumericSize)
    this.fontName = this.fontNumericSize+"px courier"
    console.log("fontname is "+this.fontName)
    this.ctx.font = this.fontName
    //ctx.font = fontSize+"px courier"
    console.log(this.ctx.font)
    this.mset.style["font-size"]=this.fontNumericSize
    console.log(this.mset.style["font-size"])
    this.ctx.fillStyle='black'
    this.fontSize = this.ctx.measureText(this.letters)
    this.lineSep = Math.round(this.fontSize.height*0.5) // additional distance between lines ...
    this.lineHeight = this.fontSize.height+this.lineSep //
    this.lineDescent = this.fontSize.descent

    this.numRows = Math.floor(this.mset.height/this.lineHeight);
    this.numCols = Math.floor(this.mset.width/(this.charWidth))

    this.state.cols = this.numCols
    this.state.rows = this.numRows

    this.state =
       {text:[""],cursor:[0,0],
        rowOffset:0,
        colOffset:0,
        rows:this.numRows,cols:this.numCols}

    // here is how we can get the key which is pressed
    this.mset.addEventListener('keydown', (event) =>{
        console.log("keydown event"); console.dir(event);
        this.addKeyPress(event);
        console.log("in keydown listener. this=")
        console.dir(this)
        this.redrawCanvas();
            });

    console.log("In constructor: this=")
    console.dir(this)
    // here is how we can get the position of the mouseclick
    this.mset.addEventListener('mousedown', function(event){
        console.log("mousedown event"); console.dir(event);
        console.log("in eventlistener, this = "); console.dir(this)
        let row = Math.floor(event.offsetY/theEditor.lineHeight)+theEditor.state.rowOffset
        let col = Math.round(event.offsetX/(theEditor.charWidth)) + theEditor.state.colOffset

        row = Math.min(row,theEditor.state.text.length-1)
        col = Math.min(col,theEditor.state.text[row].length)
        theEditor.state.cursor = [row,col]
        theEditor.redrawCanvas()
    });

    //return ctx.measureText(letters);
  }

  clearCanvas(){
    const ctx = this.mset.getContext('2d')
    this.ctx.fillStyle='white'
    this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
  }



  addKeyPress(event){
    console.log("at top of addKeyPress. this=")

    console.dir(this)
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
      if (this.state.cursor[1]>0){
        const lineLen = this.state.text[this.state.cursor[0]].length
        if (this.state.cursor[1]>this.lineLen){
          this.state.cursor[1] = this.lineLen
        }
        this.state.cursor[1]--;
      } else {
        if (this.state.cursor[0]>0) {
          this.state.cursor[0]--
          this.state.cursor[1] = this.state.text[this.state.cursor[0]].length
        }
      }
      return
    } else if (key=='ArrowRight'){
      //console.log('moving right')
      if (this.state.cursor[1]<this.state.text[this.state.cursor[0]].length){
        this.state.cursor[1]++;
      } else {
        if (this.state.cursor[0]<this.state.text.length-1) {
          this.state.cursor[0]++
          this.state.cursor[1]=0
        }
      }

      return
    } else if (key=='ArrowUp'){
      //console.log('moving up')
      if (this.state.cursor[0]>0){
        this.state.cursor[0]--;
      }
      return
    } else if (key=='ArrowDown'){
      //console.log('moving down')
      if (this.state.cursor[0]<this.state.text.length-1){
        this.state.cursor[0]++;
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
    } else if (this.allLetters.indexOf(key)<0) {
      //console.log("skipping the key "+key);
      return
    } else {
    //console.log("adding the key "+key)

    //printState()
    this.insertKey(key)
    //printState()
    }
  }



  removePrevChar(){
    const row = this.state.cursor[0]
    const line = this.state.text[row]
    const lineLen = this.state.text[row].length
    if (this.state.cursor[1]>lineLen){
      this.state.cursor[1] = lineLen
    }
    const col = this.state.cursor[1]
    if (col>0){
      this.state.text.splice(row,1,
        line.substring(0,col-1)+line.substring(col))
      this.state.cursor[1]--;
    } else if(row>0){
      const prevLine = this.state.text[row-1]
      this.state.text.splice(row-1,2,
        prevLine+line)
      this.state.cursor=[row-1,prevLine.length]
    }

  }


  insertCRLF(){
    //console.log('moving to new line!!')
    //console.log(JSON.stringify(state))

    const newrow =this.state.cursor[0]
    const pos = this.state.cursor[1]
    const line = this.state.text[newrow]
    //console.log("process CRLF!")
    //console.log(JSON.stringify([newrow, pos,line]))
    //console.log(JSON.stringify(state.text))
    this.state.text.splice(newrow,1,
      line.substring(0,pos),line.substring(pos))
    this.state.cursor[0]++;
    this.state.cursor[1]=0;
    //console.log(JSON.stringify(state.text))
    //state.text = state.text.slice(0,newrow).concat([""]).concat(state.text.slice(newrow))
    //console.log(JSON.stringify([state,newrow]))


  }


  insertKey(key){
    console.log("inserting "+key)
    const line = this.state.text[this.state.cursor[0]] // get current line
    const first = line.substring(0,this.state.cursor[1]) // first part
    const rest = line.substring(this.state.cursor[1])
    const newline = first+key+rest
    this.state.text[this.state.cursor[0]] = newline
    this.state.cursor[1] += 1
    console.log("at end of insertKey. this.state=")
    console.dir(this.state)
  }


  redrawCanvas(){
    this.getFontSize()
    console.log("clear Canvas");
    this.clearCanvas()
    console.log("drawing text on canvas: "+JSON.stringify(this.state.text))
    const ctx = this.mset.getContext('2d')
    //ctx.font = fonttype
    ctx.fillStyle='black'

    if ((this.state.cursor[0]<this.state.rowOffset)  ) {
      this.state.rowOffset = this.state.cursor[0]-5;
      this.state.rowOffset = Math.max(this.state.rowOffset, 0);
    } else if (this.state.cursor[0]>= this.state.rowOffset+this.state.rows){
      this.state.rowOffset += 5;
    }

    if ((this.state.cursor[1]<this.state.colOffset)  ) {
      this.state.colOffset = this.state.cursor[1]-5;
      this.state.colOffset = Math.max(this.state.colOffset, 0);
    } else if (this.state.cursor[1]>= this.state.colOffset+this.state.cols){
      this.state.colOffset = this.state.cursor[1]-(this.state.cols-5);
      this.state.colOffset = Math.max(this.state.colOffset,0)
    }

    console.log(JSON.stringify([this.state,this.state.rowOffset]))
    var rowEnd = Math.min(this.state.text.length,this.state.rows+this.state.rowOffset)
    console.log("rowStart = "+this.state.rowOffset+" rowEnd = "+rowEnd)

    for(let i=this.state.rowOffset; i< rowEnd ; i++){
      const line =this.state.text[i].substring(this.state.colOffset,this.state.colOffset+this.state.cols+5)
      const text = this.ctx.measureText(line)
      const start = 0
      const baseline = (1+i-this.state.rowOffset)*this.lineHeight+this.lineDescent
      const topline = this.lineHeight
      ctx.fillText(line,start,baseline)
    }

    this.drawCursor()
  }

  printstate(){
    console.log(JSON.stringify(this.state))
  }

  drawCursor(){
    console.log(JSON.stringify(this.state))
    const line =this.state.text[this.state.cursor[0]]
    const first = line.substring(0,this.state.cursor[1])
    const ctx = mset.getContext('2d')
    ctx.fillStyle='black'


    const visibleColumn = (first.length-this.state.colOffset)

    const visibleRow = (this.state.cursor[0]-this.state.rowOffset)


    const start = visibleColumn*this.charWidth
    const baseline = visibleRow*this.lineHeight+this.lineSep+this.lineDescent
    const topline = this.lineHeight-this.lineSep+this.lineDescent+1
    //console.log(JSON.stringify([start,baseline,topline]))
    ctx.fillRect(start,baseline, 1,topline)
  }

}



let editor = new Editor(mset)
