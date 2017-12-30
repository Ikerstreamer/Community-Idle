function ButtonClick()
{
  player.buttons++
  document.getElementById("money").innerHTML="You have " + player.buttons + "buttons."
}
var player = {buttons:0}
