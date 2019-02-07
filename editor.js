/*
  I need to revise the redraw Canvas to use the FontMetrics
  and draw all of the lines. This should be pretty easy to do!
*/
console.log("In editor.js!!")

class CanvasEditor{

  constructor(mset){
    this.msetCanvas = mset
    console.log(this.msetCanvas)


    this.fontColor = "black"
    this.fonttype = "32pt Courier"
    this.fontNumericSize = "32"

    this.allLetters = "!@#{$%^&*()_+-={}|[]\\:\";'<>?,./~`}abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"
    this.letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"

    this.msetCanvas.style["font-size"]="40"
    console.log("updated msetCanvas style")

    this.ctx = null;
    this.charWidth = 100;
    this.lineSep = 10
    this.lineHeight=20
    this.lineDescent = 2
    this.state={}
    this.msetCanvasEditor = this
    
    console.log("initialized some vars")
    console.dir(this.getFontSize);
    console.log("printed out this.getFontSize")
    this.fontSize = this.getFontSize()
    console.log('fontSize is ')
    console.dir(this.fontSize)
    console.log("font is "+this.ctx.font)



    this.msetCanvas.width = window.innerWidth*0.9;
    this.msetCanvas.height = window.innerHeight*0.9;
    let numRows = Math.floor(this.msetCanvas.height/this.lineHeight);
    let numCols = Math.floor(this.msetCanvas.width/(this.charWidth))
    console.log("rows:"+numRows+"  cols:"+numCols)


    this.state =
       {text:[""],cursor:[0,0],
        rowOffset:0,
        colOffset:0,
        rows:numRows,cols:numCols}

    // here is how we can get the key which is pressed
    this.msetCanvas.addEventListener('keydown', function(event) {
        console.log("keydown event"); console.dir(event);
        console.dir(this); console.dir(msetCanvasEditor);
        msetCanvasEditor.addKeyPress(event);
        msetCanvasEditor.redrawmsetCanvas();
            });

    // here is how we can get the position of the mouseclick
    this.msetCanvas.addEventListener('mousedown', function(event){
        console.log("mousedown event"); console.dir(event);
        let row = Math.floor(event.offsetY/lineHeight)+state.rowOffset
        let col = Math.round(event.offsetX/(charWidth)) + state.colOffset
        console.log("position="+row+":"+col)
        row = Math.min(row,state.text.length-1)
        col = Math.min(col,state.text[row].length)
        state.cursor = [row,col]
        msetCanvasEditor.redrawmsetCanvas()
    });

  }



  getFontSize(){
      console.log("in getFontSize")
      console.dir(this)
      console.log('this.msetCanvas = ' + this.msetCanvas)


      this.ctx = this.msetCanvas.getContext('2d')
      console.log("line 3 of getFontSize")
      console.log(this.letters)

      this.charWidth = this.ctx.measureTextWidth(this.letters).width/this.letters.length
      console.log(this.msetCanvas.style["font-size"])
      //ctx.font = "32px courier"
      console.log(this.fontNumericSize)
      this.fontName = this.fontNumericSize+"px courier"
      console.log("fontname is "+this.fontName)
      this.ctx.font = this.fontName
      //ctx.font = fontSize+"px courier"
      console.log(this.ctx.font)
      this.msetCanvas.style["font-size"]=this.fontNumericSize
      console.log(this.msetCanvas.style["font-size"])
      this.ctx.fillStyle='black'
      console.log('a')
      this.fontSize = this.ctx.measureText(this.letters)
            console.log('a')
      this.lineSep = Math.round(this.fontSize.height*0.5) // additional distance between lines ...
      console.log('a')
      this.lineHeight = this.fontSize.height+this.lineSep //
      console.log('a')
      this.lineDescent = this.fontSize.descent
      console.log('a')
      let numRows = Math.floor(this.msetCanvas.height/this.lineHeight);
      let numCols = Math.floor(this.msetCanvas.width/(this.charWidth))
      console.log('a')
      this.state.cols = numCols
      this.state.rows = numRows
      console.log("at end of getFontSize")

      return this.ctx.measureText(this.letters);
  }


    clearmsetCanvas(){
      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='white'
      ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
    }




    addKeyPress(event){
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
        this.removePrevChar()
        // remove the character at the current position!!!
        return
      } else if (key=='Enter'){
        this.insertCRLF()
        return
      } else if (allLetters.indexOf(key)<0) {
        //console.log("skipping the key "+key);
        return
      } else {
      //console.log("adding the key "+key)

      //this.printState()
      this.insertKey(key)
      //this.printState()
      }
    }

    removePrevChar(){
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


    insertCRLF(){
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

    insertKey(key){
      console.log("inserting "+key)
      const line = state.text[state.cursor[0]] // get current line
      const first = line.substring(0,state.cursor[1]) // first part
      const rest = line.substring(state.cursor[1])
      const newline = first+key+rest
      state.text[state.cursor[0]] = newline
      state.cursor[1] += 1
    }

    redrawmsetCanvas(){
      this.getFontSize()
      console.log("clear msetCanvas");
      this.clearmsetCanvas()
      console.log("drawing text on msetCanvas: "+JSON.stringify(state.text))
      const ctx = this.msetCanvas.getContext('2d')
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

      this.drawCursor()
    }

    printState(){
      console.log(JSON.stringify(state))
    }


    drawCursor(){
      console.log(JSON.stringify(state))
      const line =state.text[state.cursor[0]]
      const first = line.substring(0,state.cursor[1])
      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='black'


      const visibleColumn = (first.length-state.colOffset)

      const visibleRow = (state.cursor[0]-state.rowOffset)


      const start = visibleColumn*charWidth
      const baseline = visibleRow*lineHeight+lineSep+lineDescent
      const topline = lineHeight-lineSep+lineDescent+1
      //console.log(JSON.stringify([start,baseline,topline]))
      ctx.fillRect(start,baseline, 1,topline)
    }

}

const ed1 = new CanvasEditor(mset)
const ed2 = new CanvasEditor(mset2)
