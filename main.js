function ButtonClick(id)
{
  var button=player.buttons[id]
  if(button.disabled) return
  player.clicks++
  var speedup=1 //set to 1 for normal speed
  switch(button.type){
    case "create": //create a button
      setTimeout(
        function(){
          try{
            setClicked(button,false)
            var newbutton=randomButton(button.power)
            newbutton.id=player.buttons.length
            player.buttons.push(newbutton)
            player.buttonsmade++
          }catch(error){
            console.error(error)
          }
        }
      ,button.speed/speedup)
      break;
    case "shards":
      setTimeout(
        function(){
          try{
            setClicked(button,false)
            player.shards+=button.power
            update("shardsbox",player.shards)
          }catch(error){
            console.error(error)
          }
        }
      ,button.speed/speedup)
      break;
    default:
      console.error("unrecognized type: "+button.type)
      break;
  }
  setClicked(button,true)
}
function setClicked(button,disable){
  if(disable){
    button.disabled=true
    button.element.classList.add("disabled")
    button.time=0
    button.timeupdate=true
  }else{
    button.disabled=false
    button.element.classList.remove("disabled")
    button.timeupdate=false
  }
}
function randomButton(power){
  var ret;
  if(player.buttonsmade<1){ //first 3 buttons made are fixed
    switch(player.buttonsmade){
      case 0:
        ret={type:"shards",speed:1000,power:power}
        show("shardsarea")
        break
      default:
        console.log("Um.")
    }
  }else{
    ret={type:"shards",speed:1000/power,power:power} //todo: add more button types
    show("shardsarea")
  }
  ret.element=renderButton(ret) //at some point: skip rendering buttons that won't be seen
  return ret
}
function renderButton(button){
  var elem=document.createElement("div")
  elem.classList=["button"]
  elem.onclick=function(){ButtonClick(button.id)}
  var desc;
  switch(button.type){
    case "shards":
      desc="Create button shards"
      break;
  }
  elem.innerHTML=desc+'<br>Power: <span class="speed">'+button.power.toFixed(1)+'</span>x<br>Speed: <span class="time">'+(button.speed/1000).toFixed(1)+'</span>s<br><span class="timeleft">0.0</span>/<span class="time">'+(button.speed/1000).toFixed(1)+'</span>'
  var td=document.createElement("td")
  td.appendChild(elem)
  document.getElementById("row").appendChild(td)
  return elem
}

function show(thing){
  document.getElementById(thing).classList.remove("hidden")
}
function update(set,to){
  document.getElementById(set).innerHTML=to
}



function set_save(name, value) {
    localStorage.setItem(name, btoa(JSON.stringify(value, function(k, v) { return (v === Infinity) ? "Infinity" : v; })))
}

function get_save(name) {
    if (localStorage.getItem(name) !== null) {
        return JSON.parse(atob(localStorage.getItem(name), function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
    }
}


function init(){
  window.player = {
    buttons:[{type:"create",speed:5000,power:1.0,disabled:false,id:0,element:document.getElementById("firstbutton")}],
    clicks:0,
    buttonsmade:0,
    shards:0
  }
  window.loops={} //put setinterval ids here
  //game loop
  loops.game=setInterval(function () {
    for(var i=0;i<player.buttons.length;i++){
      var button=player.buttons[i]
      if(!button.timeupdate){continue}
      button.time+=0.1
      button.element.getElementsByClassName("timeleft")[0].innerHTML=button.time.toFixed(1)
    }
  }, 100);
  //autosave
  loops.autosave=setInterval(function () {
      set_save("autosave",player)
  }, 30000);

  //load game

  var save_data = get_save('autosave');
  var save_data=false //loading doesn't work so it's skipped for now
  if (save_data) {
    player = save_data;
  }
}


//a comment that was once used to test a github webhook but is now a place where you can put whatever you want
