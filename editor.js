
clearB.addEventListener('click', (event)=>{
  console.log("in clearB event listener")
  clearCanvas()
})

function clearCanvas(){
  const ctx = mset.getContext('2d')
  ctx.fillStyle='white'
  ctx.fillRect(0,0,1000,1000)
}


writeB.addEventListener('click', (event) => {
    console.log("hello world")
    const ctx = mset.getContext('2d')
    ctx.font = '12pt courier'
    ctx.fillStyle='black'
    ctx.fillText("Hello World!",40,40)
  })

let state = {text:[""],cursor:[0,0]}

// here is how we can get the key which is pressed
mset.addEventListener('keydown', function(event) {
    console.log("keydown event"); console.dir(event);
    addKeyPress(event.key,state);
    redrawCanvas();
        });

// here is how we can get the position of the mouseclick
mset.addEventListener('mousedown', function(event){
    console.log("mousedown event"); console.dir(event);
});

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"

function addKeyPress(key){
  if (letters.indexOf(key)<0) {
    console.log("skipping the key "+key);
    return
  }
  console.log("adding the key "+key)

  printState()
  const line = state.text[state.cursor[0]] // get current line
  const first = line.substring(0,state.cursor[1]) // first part
  const rest = line.substring(state.cursor[1])
  const newline = first+key+rest
  state.text[state.cursor[0]] = newline
  state.cursor[1] += 1
  printState()
}

function redrawCanvas(){
  console.log("clear Canvas");
  clearCanvas()
  console.log("drawing text on canvas: "+state.text[0])
  const ctx = mset.getContext('2d')
  ctx.font = '12pt courier'
  ctx.fillStyle='black'
  ctx.fillText(state.text[0],20,20)
}

function printState(){
  console.log(JSON.stringify(state))
}
