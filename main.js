var speedup = 1; //set to 1 for normal speed. Change for testing
function ButtonClick(id) {
    var button = player.buttons[id];
    switch (player.mode.name) {
        case "target":
            if (button.disabled && button.id==player.mode.id){
                button.disabled = false;    
                return;
            }
            var dest = player.buttons[player.mode.id];
            dest.target = button.id;
            dest.element.getElementsByClassName("target")[0].innerHTML = "Target: " + button.id;
            player.mode.name = "click";
            player.buttons[player.mode.id].disabled
            break;
        case "delete":
            if(button.type == "create")
            {
            var count = 0;
            for(i=0;i<player.buttons.length;i++) if(player.buttons[i].type == "create") count++;
                if(count<=1) return;
            }
            for(i=0;i<player.buttons.length;i++)if(player.buttons[i].target==id)player.buttons[i].target=-1;
            player.shards+=5*button.power*button.speed/button.baseSpeed
            button.element.parentNode.parentNode.removeChild(button.element.parentNode) //cut off at td level
            button=null;
            player.mode.name="click"
            break;
        case "click":
            if (button.disabled) return;
            player.clicks++;
            switch (button.type) {
                case "create": //create a button
                    setTimeout(function() {
                        try {
                            setClicked(button, false);
                            var newbutton = randomButton(button.power);
                            newbutton.id = player.buttons.length;
                                updateButtonStats(newbutton);
                            player.buttons.push(newbutton);
                            player.buttonsmade++;
                            button.speed*=1.2;
                            updateButtonStats(button);  
                        } catch (error) {
                            console.error(error);
                        }
                    }, button.speed / speedup);
                    setClicked(button,true);
                    break;
                case "shards":
                    setTimeout(function() {
                        try {
                            setClicked(button, false);
                            //player.shards += button.power;
                            //update("shardsbox", player.shards.toFixed(1));
                        } catch (error) {
                            console.error(error);
                        }
                    }, button.speed / speedup);
                    button.shardPerSec=(button.power/button.speed)*1000;
                    button.shardGain=button.power;
                    setClicked(button,true);
                    break;
                case "speed":
                    var target = player.buttons[button.target];
                    if(button.target>-1&&target!=null) {
                        button.shardPerSec=(target.speedCost/button.speed)*button.costmult*1000;
                        button.shardUse+=target.speedCost*button.costmult;
                        setClicked(button,true);
                    }
                    break;
                case "power":
                    var target = player.buttons[button.target];
                    if(button.target>-1&&target!=null) {
                        button.shardPerSec=(target.powerCost/button.speed)*button.costmult*1000;
                        button.shardUse+=target.powerCost*button.costmult;
                        setClicked(button,true);
                    }
                    break;
                default:
                    console.error("unrecognized type: " + button.type);
                    break;
            }
            break;
    }
}

function setClicked(button, disable) {
    if (disable) {
        button.disabled = true;
        button.element.classList.add("disabled");
        button.time = 0;
        button.timeupdate = true;
    } else {
        switch(button.type) {
            case "speed":
                var target=player.buttons[button.target];
                button.shardUse = false;
                button.costmult+=0.1
                button.element.getElementsByClassName("costmult")[0].innerHTML=button.costmult.toFixed(1);
                target.speed *= Math.pow(0.95,button.power);
                target.speedCost = 1.1*(target.baseSpeed/target.speed)*target.baseSpeedCost;
                updateButtonStats(target);
                break;
            case "power":
                var target=player.buttons[button.target];
                button.shardUse = false;
                button.costmult+=0.1
                button.element.getElementsByClassName("costmult")[0].innerHTML=button.costmult.toFixed(1);
                target.power *= Math.pow(1.1,button.power);
                target.powerCost = 1.25*(target.power/target.basePower)*target.basePowerCost;
                updateButtonStats(target);
                break;
        } 
        button.disabled = false;
        button.element.classList.remove("disabled");
        button.timeupdate = false;
    }
}


function randomButton(power) {
    var ret;
    if (player.buttonsmade < 4) { //first 3 buttons made are fixed
        switch (player.buttonsmade) {
            case 0:
                ret = {
                    type: "shards",
                    speed: 2000,
                    speedCost: 10,
                    powerCost: 25,
                    power: power
                };
                show("shardsarea");
                break;
            case 1:
                ret = {
                    type: "speed",
                    speed: 4000,
                    speedCost: 20,
                    powerCost: 35,
                    power: power,
                    target: -1,
                    costmult: 1.0
                };
                break;
            case 2:
                ret = {
                    type: "shards",
                    speed: 2000,
                    speedCost: 10,
                    powerCost: 25,
                    power: power*1.2
                };
                break;
            case 3:
                ret = {
                    type: "power",
                    speed: 8000,
                    speedCost: 35,
                    powerCost: 50,
                    power: power,
                    target: -1,
                    costmult: 1.0
                }; 
                break;
            default:
                console.log("Um.");
        }
    } else {
        var options = [{
            type: "shards",
            speed: 2000 / power,
            speedCost: 10,
            powerCost: 25,
            power: power*(1+(Math.random()*0.35)),
        },{
            type: "speed",
            speed: 4000 / power,
            speedCost: 20,
            powerCost: 35,
            power: power*(1+(Math.random()*0.35)),
            target: -1,
            costmult: 1.0
        },{
            type: "power",
            speed: 8000 / power,
            speedCost: 35,
            powerCost: 50,
            power: power*(1+(Math.random()*0.35)),
            target: -1,
            costmult: 1.0
        }]
        var ratio = [14,4,3];
        var sum = 0,check;
        for(var i=0;i<ratio.length;i++) sum+=ratio[i];
        var rand = Math.random()*sum;
        for (check=0;rand>ratio[check];check++) rand -= ratio[check];
        ret = options[check];
        //todo: add more button types
        show("shardsarea");
    }
    ret.baseSpeed=ret.speed;
    ret.basePower=ret.power;
    ret.baseSpeedCost=ret.speedCost;
    ret.basePowerCost=ret.powerCost;
    ret.shardUse=false;
    ret.shardGain=false;
    ret.element = renderButton(ret); //at some point: skip rendering buttons that won't be seen
    return ret;
}

function renderButton(button) {
    var elem = document.createElement("div");
    elem.classList = ["button"];
    var desc;
    var line5;
    var ability = false;
    switch (button.type) {
        case "shards":
            desc = "Create button shards";
            line5 = 'ID: <span class="id"></span>'
            break;
        case "speed":
            desc = "Upgrade button speed";
            line5 = '<span class="costmult">1.0</span>x cost <button class="target">Select target</button>';
            ability = function() {
                SelectTarget(button.id);
            };
            break;
        case "power":
            desc = "Upgrade button power";
            line5 = '<span class="costmult">1.0</span>x cost <button class="target">Select target</button>';
            ability = function() {
                SelectTarget(button.id);
            };
            break;
    }
    elem.innerHTML ='<b>' + desc + '</b><br>Power: <span class="power">' + button.power.toFixed(2) +'x ('+ button.powerCost.toFixed(1) +')</span><br>Speed: <span class="time">' + (button.speed / 1000).toFixed(1) +'s ('+ button.speedCost.toFixed(1) +')</span><br><span class="timeleft">0.0</span>/<span class="time">' + (button.speed / 1000).toFixed(1) + '</span><br>'+line5;
    if (ability) elem.getElementsByClassName("target")[0].onclick = ability;
        elem.onclick = function() {ButtonClick(button.id);};
    var td = document.createElement("td");
    td.appendChild(elem);
    document.getElementById("row"+button.type).appendChild(td);
    return elem;
}

function SelectTarget(id) {
    if(player.mode.name=="target" && player.mode.id == id) {
        player.mode.name="click";
        player.buttons[id].element.getElementsByClassName("target")[0].innerHTML = "Select target";
        return;
    }
    if(player.buttons[id].disabled) return;
    player.buttons[id].element.getElementsByClassName("target")[0].innerHTML = '<b>Choose target</b>';
    player.mode.name = "target";
    player.mode.id = id;
    player.buttons[id].disabled = true;
}

function show(thing) {
    document.getElementById(thing).classList.remove("hidden");
}

function update(set, to) {
    document.getElementById(set).innerHTML = to;
}

function updateButtonStats(button)
{
    if(button.type=="shards" || button.type=="create" )button.element.getElementsByClassName("id")[0].innerHTML=button.id;
    button.element.getElementsByClassName("time")[0].innerHTML=(button.speed / 1000).toFixed(1)+'s ('+button.speedCost.toFixed(1)+')';
    button.element.getElementsByClassName("time")[1].innerHTML=(button.speed / 1000).toFixed(1);
    button.element.getElementsByClassName("power")[0].innerHTML=button.power.toFixed(2)+'x ('+button.powerCost.toFixed(1)+')';
    if(button.costmult){
        button.element.getElementsByClassName("costmult")[0].innerHTML=button.costmult.toFixed(1);
    }  
}

function set_save(name, value) {
    localStorage.setItem(name, btoa(JSON.stringify(value, function(k, v) {
        return (v === Infinity) ? "Infinity" : v;
    })));
}

function get_save(name) {
    if (localStorage.getItem(name) !== null) {
        return JSON.parse(atob(localStorage.getItem(name), function(k, v) {
            return (v === Infinity) ? "Infinity" : v;
        }));
    }
}


function init() {
    window.player = {
        buttons: [{
            type: "create",
            shardUse:false,
            shardGain:false,
            speed: 5000,
            baseSpeed: 5000,
            speedCost: 25,
            baseSpeedCost: 25,
            power: 1.0,
            basePower: 1.0,
            powerCost: 50,
            basePowerCost: 50,
            disabled: false,
            id: 0,
            element: document.getElementById("firstbutton")
        }],
        mode: {
            name: "click",
            id: 0
        },
        clicks: 0,
        buttonsmade: 0,
        shards: 0
    };
    window.loops = {}; //put setinterval ids here
    window.ft=0.02 //frametime
    //game loop
    loops.game = setInterval(function() {
        for (var i = 0; i < player.buttons.length; i++) {
            var button = player.buttons[i];
            if (!button.timeupdate) continue;
            if(button.shardUse!=false){   
                if(player.shards>=button.shardPerSec*ft*speedup)
                {
                    player.shards-=button.shardPerSec*ft*speedup;
                    button.shardUse-=button.shardPerSec*ft*speedup;
                    //update("shardsbox",player.shards.toFixed(1));
                    if(button.shardUse<=0)
                    {
                      setClicked(button, false);
                    }
                    button.time += ft*speedup;
                    button.element.getElementsByClassName("timeleft")[0].innerHTML = button.time.toFixed(1);
                }
            }else if(button.shardGain!=false)
            { 
                player.shards+=button.shardPerSec*ft*speedup;
                button.shardGain-=button.shardPerSec*ft*speedup;
                //update("shardsbox",player.shards.toFixed(1));
                if(button.shardGain<=0)
                {
                  setClicked(button, false);
                }
                button.time += ft*speedup;
                button.element.getElementsByClassName("timeleft")[0].innerHTML = button.time.toFixed(1);
            }else
            {
                button.time += ft*speedup;
                button.element.getElementsByClassName("timeleft")[0].innerHTML = button.time.toFixed(1);
            }
        }
        update("shardsbox",player.shards.toFixed(1));
    }, 20);
    //autosave
    loops.autosave = setInterval(function() {
        set_save("autosave", player);
    }, 30000);

    //load game

    var save_data = get_save('autosave');

    if (save_data) {
        player = save_data;
        if(player.buttonsmade>=1)show("shardsarea");
        update("shardsbox",player.shards.toFixed(1));
        player.buttons[0].element = document.getElementById("firstbutton");
        updateButtonStats(player.buttons[0]);
        for(var i=1;i<player.buttons.length;i++){
            player.buttons[i].element = renderButton(player.buttons[i]);
                updateButtonStats(player.buttons[i]);
        }
    }
}

function reset() {
    document.getElementById("BtnTable").innerHTML = '<tr id="rowcreate"><td><div onclick="ButtonClick(0)" id="firstbutton" class="button"><b>Create a new button</b><br>Power: <span class="power">1.00x (50.0)</span><br>Time: <span class="time">5.0s (25.0)</span><br><span class="timeleft">0.0</span>/<span class="time">5.0</span><br>ID: <span class="id"></span></div></td></tr><tr id="rowshards"></tr><tr id="rowspeed"></tr><tr id="rowpower"></tr>';       player = {
        buttons: [{
            type: "create",
            shardUse:false,
            shardGain:false,
            speed: 5000,
            baseSpeed: 5000,
            speedCost: 25,
            baseSpeedCost: 25,
            power: 1.0,
            basePower: 1.0,
            powerCost: 50,
            basePowerCost: 50,
            disabled: false,
            timeUpdate: false,
            time: 0,
            id: 0,
            element: document.getElementById("firstbutton")
        }],
        mode: {
            name: "click",
            id: 0
        },
        clicks: 0,
        buttonsmade: 0,
        shards: 0
    };
        document.getElementById("shardsarea").classList.add("hidden");
        update("shardsbox",player.shards.toFixed(1));
        updateButtonStats(player.buttons[0]);
}
