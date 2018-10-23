clearB.addEventListener('click', (event)=>{
  console.log("in clearB event listener")
  const ctx = mset.getContext('2d')
  ctx.fillStyle='white'
  ctx.fillRect(0,0,1000,1000)
})


writeB.addEventListener('click', (event) => {
    console.log("hello world")
    const ctx = mset.getContext('2d')
    ctx.font = '12pt courier'
    ctx.fillStyle='black'
    ctx.fillText("Hello World!",40,40)
  })
