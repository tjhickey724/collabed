/*
  I need to revise the redraw Canvas to use the FontMetrics
  and draw all of the lines. This should be pretty easy to do!
*/
console.log("In editor.js!!!!!")

class CanvasEditor{

  constructor(mset){
    this.msetCanvas = mset


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
    this.state={}
    let msetCE = this

    this.fontSize = this.getFontSize()



    this.msetCanvas.width = window.innerWidth*0.9;
    this.msetCanvas.height = window.innerHeight*0.9;
    let numRows = Math.floor(this.msetCanvas.height/this.lineHeight);
    let numCols = Math.floor(this.msetCanvas.width/(this.charWidth))


    this.state =
       {text:[""],cursor:[0,0],
        rowOffset:0,
        colOffset:0,
        rows:numRows,cols:numCols}

    let theState = this.state


    // here is how we can get the key which is pressed
    this.msetCanvas.addEventListener('keydown', function(event) {
        msetCE.addKeyPress(event);
        msetCE.redrawmsetCanvas();
            });

    // here is how we can get the position of the mouseclick
    this.msetCanvas.addEventListener('mousedown', function(event){
        let row = Math.floor(event.offsetY/msetCE.lineHeight)+
                            msetCE.state.rowOffset
        let col = Math.round(event.offsetX/(msetCE.charWidth)) +
                msetCE.state.colOffset
        row = Math.min(row,msetCE.state.text.length-1)
        col = Math.min(col,msetCE.state.text[row].length)
        msetCE.state.cursor = [row,col]
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
      this.state.cols = numCols
      this.state.rows = numRows

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
        if (state.cursor[0]>0){
          state.cursor[0]--;
        }
        return
      } else if (key=='ArrowDown'){
        if (state.cursor[0]<state.text.length-1){
          state.cursor[0]++;
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
      const newrow =this.state.cursor[0]
      const pos = this.state.cursor[1]
      const line = this.state.text[newrow]

      this.state.text.splice(newrow,1,
        line.substring(0,pos),line.substring(pos))
      this.state.cursor[0]++;
      this.state.cursor[1]=0;
    }

    insertKey(key){
      const line = this.state.text[this.state.cursor[0]] // get current line
      const first = line.substring(0,this.state.cursor[1]) // first part
      const rest = line.substring(this.state.cursor[1])
      const newline = first+key+rest
      this.state.text[this.state.cursor[0]] = newline
      this.state.cursor[1] += 1
    }

    redrawmsetCanvas(){
      this.getFontSize()
      this.clearmsetCanvas()
      let theState = this.state
      const ctx = this.msetCanvas.getContext('2d')
      //ctx.font = fonttype
      ctx.fillStyle='black'

      if ((theState.cursor[0]<theState.rowOffset)  ) {
        theState.rowOffset = theState.cursor[0]-5;
        theState.rowOffset = Math.max(theState.rowOffset, 0);
      } else if (theState.cursor[0]>= theState.rowOffset+theState.rows){
        theState.rowOffset += 5;
      }

      if ((theState.cursor[1]<theState.colOffset)  ) {
        theState.colOffset = theState.cursor[1]-5;
        theState.colOffset = Math.max(theState.colOffset, 0);
      } else if (theState.cursor[1]>= theState.colOffset+theState.cols){
        theState.colOffset = theState.cursor[1]-(theState.cols-5);
        theState.colOffset = Math.max(theState.colOffset,0)
      }

      var rowEnd = Math.min(theState.text.length,theState.rows+theState.rowOffset)


      for(let i=theState.rowOffset; i< rowEnd ; i++){
        const line =theState.text[i].substring(theState.colOffset,theState.colOffset+theState.cols+5)
        const text = ctx.measureText(line)
        const start = 0
        const baseline = (1+i-theState.rowOffset)*this.lineHeight+this.lineDescent
        const topline = this.lineHeight
        ctx.fillText(line,start,baseline)
      }

      this.drawCursor()
    }

    printState(){
      console.log(JSON.stringify(this.state))
    }


    drawCursor(){
      const line =this.state.text[this.state.cursor[0]]
      const first = line.substring(0,this.state.cursor[1])
      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='black'


      const visibleColumn = (first.length-this.state.colOffset)

      const visibleRow = (this.state.cursor[0]-this.state.rowOffset)


      const start = visibleColumn*this.charWidth
      const baseline = visibleRow*this.lineHeight+this.lineSep+this.lineDescent
      const topline = this.lineHeight-this.lineSep+this.lineDescent+1
      ctx.fillRect(start,baseline, 1,topline)
    }

}

const ed1 = new CanvasEditor(mset)
