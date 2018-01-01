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
        case "click":
            if (button.disabled) return;
            player.clicks++;
            var speedup = 1; //set to 1 for normal speed
            switch (button.type) {
                case "create": //create a button
                    setTimeout(function() {
                        try {
                            setClicked(button, false);
                            var newbutton = randomButton(button.power);
                            newbutton.id = player.buttons.length;
                            player.buttons.push(newbutton);
                            player.buttonsmade++;
                            button.speed*= 1.1;
                            updateButtonStats(button);  
                        } catch (error) {
                            console.error(error);
                        }
                    }, button.speed / speedup);
                    break;
                case "shards":
                    setTimeout(function() {
                        try {
                            setClicked(button, false);
                            player.shards += button.power;
                            update("shardsbox", player.shards);
                        } catch (error) {
                            console.error(error);
                        }
                    }, button.speed / speedup);
                    break;
                case "speed":
                    setTimeout(function() {
                        try {
                            setClicked(button, false);
                            player.buttons[button.target].speed *= Math.pow(0.95 , button.power);
                            updateButtonStats(player.buttons[button.target]);
                        } catch (error) {
                            console.error(error);
                        }
                    }, button.speed / speedup);
                    break;
                default:
                    console.error("unrecognized type: " + button.type);
                    break;
            }
                setClicked(button, true);
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
        button.disabled = false;
        button.element.classList.remove("disabled");
        button.timeupdate = false;
    }
}

function randomButton(power) {
    var ret;
    if (player.buttonsmade < 2) { //first 3 buttons made are fixed
        switch (player.buttonsmade) {
            case 0:
                ret = {
                    type: "shards",
                    speed: 1000,
                    power: power
                };
                show("shardsarea");
                break;
            case 1:
                ret = {
                    type: "speed",
                    speed: 3000,
                    power: power,
                    target: -1
                };
                break;
            default:
                console.log("Um.");
        }
    } else {
        var options = [{
            type: "shards",
            speed: 1000 / power,
            power: power*(1+(Math.random()*0.50-0.25)),
        },{
            type: "speed",
            speed: 3000 / power,
            power: power*(1+(Math.random()*0.50-0.25)),
            target: -1
        }]
        var ratio = [3,1];
        var sum = 0,check;
        for(var i=0;i<ratio.length;i++) sum+=ratio[i];
        var rand = Math.random()*sum;
        for (check=0;rand<ratio[check];check++) rand -= ratio[i];
        ret = options[check];
        //todo: add more button types
        show("shardsarea");
    }
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
            line5="";
            break;
        case "speed":
            desc = "Upgrade button speed";
            line5 = '<button class="target">Select target</button>';
            ability = function() {
                SelectTarget(button.id);
            };
            break;
    }
    elem.innerHTML = desc + '<br>Power: <span class="power">' + button.power.toFixed(2) + '</span>x<br>Speed: <span class="time">' + (button.speed / 1000).toFixed(1) + '</span>s<br><span class="timeleft">0.0</span>/<span class="time">' + (button.speed / 1000).toFixed(1) + '</span><br>'+line5;
    if (ability) elem.getElementsByClassName("target")[0].onclick = ability;
        elem.onclick = function() {ButtonClick(button.id);};
    var td = document.createElement("td");
    td.appendChild(elem);
    document.getElementById("row").appendChild(td);
    return elem;
}

function SelectTarget(id) {
    switch (player.buttons[id].type) {
        case "speed":
            player.mode.name = "target";
            player.mode.id = id;
            player.buttons[id].disabled = true;
      break;
    }
}

function show(thing) {
    document.getElementById(thing).classList.remove("hidden");
}

function update(set, to) {
    document.getElementById(set).innerHTML = to;
}

function updateButtonStats(button)
{
    button.element.getElementsByClassName("time")[0].innerHTML=(button.speed / 1000).toFixed(1);
    button.element.getElementsByClassName("time")[1].innerHTML=(button.speed / 1000).toFixed(1);
    button.element.getElementsByClassName("power")[0].innerHTML=button.power.toFixed(2);    
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
                speed: 5000,
                power: 1.0,
                disabled: false,
                id: 0,
                element: document.getElementById("firstbutton")
            }
        ],
        mode: {
            name: "click",
            id: 0
        },
        clicks: 0,
        buttonsmade: 0,
        shards: 0
    };
    window.loops = {}; //put setinterval ids here
    //game loop
    loops.game = setInterval(function() {
        for (var i = 0; i < player.buttons.length; i++) {
            var button = player.buttons[i];
            if (!button.timeupdate) {
                continue;
            }
            button.time += 0.1;
            button.element.getElementsByClassName("timeleft")[0].innerHTML = button.time.toFixed(1);
        }
    }, 100);
    //autosave
    loops.autosave = setInterval(function() {
        set_save("autosave", player);
    }, 30000);

    //load game

    var save_data = get_save('autosave');
    var save_data = false; //loading doesn't work so it's skipped for now
    if (save_data) {
        player = save_data;
    }
}


//a comment that was once used to test a github webhook but is now a place where you can put whatever you want
