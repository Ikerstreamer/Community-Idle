function ButtonClick()
{
  player.buttons++
  document.getElementById("money")="You have " + player.buttons + "buttons."
}
var player = {buttons:0}
