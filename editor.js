/*
  I need to revise the redraw Canvas to use the FontMetrics
  and draw all of the lines. This should be pretty easy to do!
*/
console.log("In editor.js!!!!!")

class TextWindow{
  /**
    This class will represent a text object and a window onto that text object
  **/
  constructor(ddll){
    this.string = ""
    this.text = [""]
    this.windowOffset = 0  // the position of 1st visible character in the windowOffset
    this.lastWindowOffset = 0
    this.cursor = [0,0]
    this.rowOffset=0
    this.colOffset=0
    this.rows = 10
    this.cols = 80
  }

  setRowsCols(rows,cols){
    this.rows = rows
    this.cols = cols
  }

  getNumRows(){
    return this.rows
  }

  getNumCols(){
    return this.cols
  }

  getRowOffset(){
    return this.rowOffset
  }

  setRowOffset(row){
    this.rowOffset = row
  }

  getColOffset(){
    return this.colOffset
  }

  setColOffset(col){
    this.colOffset = col
  }

  getLastRow(){
    return this.text.length-1
  }

  getRowLength(row){
    return this.text[row].length
  }

  setCursor(row,col){
    this.cursor = [row,col]
  }

  getCurrentRow(){
    return this.cursor[0]
  }

  setCurrentRow(row){
    this.cursor[0] = row
  }

  getCurrentCol(){
    return this.cursor[1]
  }

  setCurrentCol(col){
    this.cursor[1]= col
  }

  insertChar(row,col,key){
    const line = this.getLine(row)
    const first = line.substring(0,col) // first part
    const rest = line.substring(col)
    const newline = first+key+rest
    this.text[row]=newline
  }

  removeChar(row,col){
    const line = this.text[row]
    this.text.splice(row,1,
      line.substring(0,col-1)+line.substring(col))
  }

  joinWithNextLine(row){
    console.log("in joinWithNexLine")
    console.log(JSON.stringify(this.text))
    this.text.splice(row,2,
      this.text[row]+ this.text[row+1])
    console.log(JSON.stringify(this.text))
  }

  splitRow(row,pos){
    const line = this.text[row]
    this.text.splice(row,1,
      line.substring(0,pos),line.substring(pos))
  }

  getLine(row){
    return this.text[row]
  }

  getCurrentLine() {
    return this.text[this.cursor[0]]
  }

  getCurrentLineLength(){
    return this.text[this.cursor[0]].length
  }

}

class CanvasEditor{

  constructor(mset,textWindow){
    this.msetCanvas = mset
    this.state = textWindow

    this.fontColor = "black"
    this.fonttype = "32pt Courier"
    this.fontNumericSize = "32"

    this.allLetters = "!@#{$%^&*()_+-={}|[]\\:\";'<>?,./~`}abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"
    this.letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"

    this.msetCanvas.style["font-size"]="40"

    this.ctx = null;
    this.charWidth = 100;
    this.lineSep = 10
    this.lineHeight=20
    this.lineDescent = 2
    let msetCE = this

    this.fontSize = this.getFontSize()



    this.msetCanvas.width = window.innerWidth*0.9;
    this.msetCanvas.height = window.innerHeight*0.9;
    let numRows = Math.floor(this.msetCanvas.height/this.lineHeight);
    let numCols = Math.floor(this.msetCanvas.width/(this.charWidth))

    this.state.setRowsCols(numRows,numCols);
    console.log("inside the constructor!!!!")
    console.dir(this.state)

    // this.state =
    //    {text:[""],
    //     cursor:[0,0],
    //     rowOffset:0,
    //     colOffset:0,
    //     rows:numRows,cols:numCols}

    let theState = this.state


    // here is how we can get the key which is pressed
    this.msetCanvas.addEventListener('keydown', function(event) {
        msetCE.addKeyPress(event);
        msetCE.redrawmsetCanvas();
            });

    // here is how we can get the position of the mouseclick
    this.msetCanvas.addEventListener('mousedown', function(event){
        let row = Math.floor(event.offsetY/msetCE.lineHeight)+
                            msetCE.state.getRowOffset()
        let col = Math.round(event.offsetX/(msetCE.charWidth)) +
                msetCE.state.getColOffset()
        row = Math.min(row,msetCE.state.getLastRow())
        col = Math.min(col,msetCE.state.getRowLength(row))
        msetCE.state.setCursor(row,col)
        msetCE.redrawmsetCanvas()
    });

  }



  getFontSize(){

      this.ctx = this.msetCanvas.getContext('2d')
      this.charWidth = this.ctx.measureTextWidth(this.letters).width/this.letters.length
      this.fontName = this.fontNumericSize+"px courier"
      this.ctx.font = this.fontName
      this.msetCanvas.style["font-size"]=this.fontNumericSize
      this.ctx.fillStyle='black'
      this.fontSize = this.ctx.measureText(this.letters)
      this.lineSep = Math.round(this.fontSize.height*0.5) // additional distance between lines ...
      this.lineHeight = this.fontSize.height+this.lineSep //
      this.lineDescent = this.fontSize.descent
      let numRows = Math.floor(this.msetCanvas.height/this.lineHeight);
      let numCols = Math.floor(this.msetCanvas.width/(this.charWidth))

      // this.state.cols = numCols
      // this.state.rows = numRows
      //let state = this.state
    //  console.dir(state)
      this.state.setRowsCols(numRows,numCols)

      return this.ctx.measureText(this.letters);
  }


    clearmsetCanvas(){
      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='white'
      ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
    }




    addKeyPress(event){
      const key = event.key
      let state = this.state
      if (event.ctrlKey){
        return
        // process ^F ^B ^N ^P to move cursor ...
        // ^A beginning of line ^E end of line
        // ^D delete next character
      } else if (key=='ArrowLeft'){
        let ccol = state.getCurrentCol()
        if (ccol>0){
          const lineLen = state.getCurrentLineLength() //state.text[state.cursor[0]].length
          if (ccol>lineLen){
             state.setCurrentCol(lineLen) //state.cursor[1] = lineLen
          }
          state.setCurrentCol(ccol-1)
          //state.cursor[1]--;
        } else {
          let crow = state.getCurrentRow()
          if (crow>0) {
            state.setCurrentRow(crow-1)
            state.setCurrentCol(state.getRowLength(crow-1))
            // state.cursor[0]--
            // state.cursor[1] = state.text[state.cursor[0]].length
          }
        }
        return
      } else if (key=='ArrowRight'){
          let ccol = state.getCurrentCol()
          if (ccol< state.getCurrentLineLength()){
             state.setCurrentCol(state.getCurrentCol()+1)
          } else {
             let crow = state.getCurrentRow()
             if (crow<state.getLastRow()) {
                state.setCursor(crow+1,0)
             }
          }

        return
      } else if (key=='ArrowUp'){
        let crow = state.getCurrentRow()
        if (crow>0){
          state.setCurrentRow(crow-1)
          let ccol = state.getCurrentCol()
          let linelen = state.getRowLength(crow-1)
          state.setCurrentCol(Math.min(ccol,linelen))
        }
        return
      } else if (key=='ArrowDown'){
        let crow = state.getCurrentRow()
        let lastRow = state.getLastRow()

        if (crow<lastRow){
          state.setCurrentRow(crow+1)
          let ccol = state.getCurrentCol()
          let linelen = state.getRowLength(crow+1)
          state.setCurrentCol(Math.min(ccol,linelen))
        }

        return
      } else if (key=='Backspace'){
        this.removePrevChar()
        // remove the character at the current position!!!
        return
      } else if (key=='Enter'){
        this.insertCRLF()
        return
      } else if (this.allLetters.indexOf(key)<0) {
        return
      } else {

      this.insertKey(key)
      }
    }

    removePrevChar(){
      const row = this.state.getCurrentRow()
      const col = this.state.getCurrentCol()
      const line = this.state.getCurrentLine()
      const lineLen = line.length
      if (col>lineLen){
        col = lineLen
        this.state.setCurrentCol(col)
      }
      if (col>0){
        this.state.removeChar(row,col)
        this.state.setCursor(row,col-1)
      } else if(row>0){
        const prevLine = this.state.getLine(row-1)
        this.state.joinWithNextLine(row-1)
        this.state.setCursor(row-1,prevLine.length)
      }
    }


    insertCRLF(){
      const row =this.state.getCurrentRow()
      const pos = this.state.getCurrentCol()

      this.state.splitRow(row,pos)
      this.state.setCursor(row+1,0)
    }

    insertKey(key){
      const row = this.state.getCurrentRow()
      const col = this.state.getCurrentCol()

      this.state.insertChar(row,col,key)
      this.state.setCursor(row,col+1)
    }

    redrawmsetCanvas(){
      this.getFontSize()
      this.clearmsetCanvas()
      let theState = this.state
      const ctx = this.msetCanvas.getContext('2d')
      //ctx.font = fonttype
      ctx.fillStyle='black'

      if ((theState.getCurrentRow()<theState.getRowOffset())  ) {
        theState.setRowOffset(Math.max(0,theState.getCurrentRow()-5))
      } else if (theState.getCurrentRow() >=
                   theState.getRowOffset()+theState.getNumRows()){
        theState.setRowOffset(theState.getRowOffset()+5)
      }

      let col = theState.getCurrentCol()
      let colOffset = theState.getColOffset()
      let numCols = theState.getNumCols()
      if ((col<colOffset)  ) {
        theState.setColOffset(Math.max(0,col-5))
      } else if (col>= colOffset+numCols){
        theState.setColOffset(Math.max(0,colOffset + numCols-5));
      }
      colOffset = theState.getColOffset()

      let rowOffset = theState.getRowOffset()
      let numRows = theState.getNumRows()
      let rowEnd = Math.min(theState.getLastRow(),numRows+rowOffset)
      numCols = theState.getNumCols()


      for(let i=rowOffset; i<= rowEnd ; i++){
        const line =theState.getLine(i).substring(colOffset,colOffset+numCols+5)
        const text = ctx.measureText(line)
        const start = 0
        const baseline = (1+i-rowOffset)*this.lineHeight+this.lineDescent
        const topline = this.lineHeight
        ctx.fillText(line,start,baseline)
      }

      this.drawCursor()
    }

    printState(){
      console.log(JSON.stringify(this.state))
    }


    drawCursor(){
      const line =this.state.getCurrentLine()
      const col = this.state.getCurrentCol()
      const row = this.state.getCurrentRow()
      const colOffset = this.state.getColOffset()
      const rowOffset = this.state.getRowOffset()
      const visibleColumn = (col-colOffset)
      const visibleRow = (row-rowOffset)

      const start = visibleColumn*this.charWidth
      const baseline = visibleRow*this.lineHeight+this.lineSep+this.lineDescent
      const topline = this.lineHeight-this.lineSep+this.lineDescent+1

      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='black'
      ctx.fillRect(start,baseline, 1,topline)
    }

}

const tw = new TextWindow("dummy DDLL")
const ed1 = new CanvasEditor(mset,tw)
