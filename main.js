function ButtonClick()
{
  player.buttons++
  document.getElementById("money").innerHTML="You have " + player.buttons + " buttons."
}
var player = {buttons:0}

function set_save(name, value) {
    localStorage.setItem(name, btoa(JSON.stringify(value, function(k, v) { return (v === Infinity) ? "Infinity" : v; })))
}

function get_save(name) {
    if (localStorage.getItem(name) !== null) {
        return JSON.parse(atob(localStorage.getItem(name), function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
    }
}

//autosave
setInterval(function () {
    set_save("autosave",player)
}, 30000);

//load game

var save_data = get_save('autosave');
if (save_data) {
  player = save_data;
}
