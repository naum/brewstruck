
nw.Screen.Init()

let win = nw.Window.get()
win.showDevTools()
win.maximize()

const activeScreen = nw.Screen.screens[0]
console.dir(activeScreen)

function genesis () {
  let conelem = document.getElementById('console')
}

document.addEventListener('DOMContentLoaded', () => {
  genesis()
})
