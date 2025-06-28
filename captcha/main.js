
const NUMBER_OF_DISKS = 4
const DISK_HEIGHT = 15
const TOWER_RADIUS = 65
const towers = [
    {
        element: document.getElementById("tower-left"),
        left: 65,
        disks: []
    },
    {
        element: document.getElementById("tower-center"),
        left: 195,
        disks: []
    },
    {
        element: document.getElementById("tower-right"),
        left: 325,
        disks: []
    }
]

const container = document.getElementById("captcha-container")

let selectedDisk = null
let startTower = null
let endTower = null

container.addEventListener("pointerdown", handlePickup)
container.addEventListener("pointerup", handlePlace)
container.addEventListener('touchmove', (e) => e.preventDefault())
container.addEventListener("contextmenu", (e) => e.preventDefault())

function initialize() {
    for(let i = NUMBER_OF_DISKS; i > 0; i--) {
        towers[0].disks.push(i)
    }
    updateTower(towers[0])
}

function handlePickup(e) {
    if(!e.target.classList.contains("top") || !e.isPrimary)
        return
    
    selectedDisk = e.target
    startTower = towers.find(tower => tower.element === e.target.parentElement)

    startTower.element.removeChild(selectedDisk)
    container.appendChild(e.target)

    let x = e.pageX
    let y = e.pageY
    selectedDisk.style.left = x + "px"
    selectedDisk.style.top = y + "px"
    selectedDisk.classList.add("moving")

    container.setPointerCapture(e.pointerId)
    container.addEventListener("pointermove", handleMove)
}

function handlePlace(e) {
    if(selectedDisk === null)
        return
    selectedDisk.style.left = 0
    selectedDisk.style.top = 0
    selectedDisk.classList.remove("moving")

    container.releasePointerCapture(e.pointerId)
    container.removeEventListener("pointermove", handleMove)

    let x = e.pageX
    let y = e.pageY
    endTower = towers.find(tower => Math.abs(tower.left - x) < TOWER_RADIUS)

    if(!endTower || startTower === endTower || (endTower.disks.length > 0 && endTower.disks.at(-1) < startTower.disks.at(-1))) {
        startTower.element.prepend(selectedDisk)
    } else {
        if(endTower.element.firstElementChild) {
            endTower.element.firstElementChild.classList.remove("top")
        }
        
        if(startTower.element.firstElementChild) {
            startTower.element.firstElementChild.classList.add("top")
        }
        endTower.element.prepend(selectedDisk)
        endTower.disks.push(startTower.disks.pop())
    }

    startTower = null
    endTower = null
    selectedDisk = null
    
    if(towers[0].disks.length === 0 && towers[1].disks.length === 0) {
        setTimeout(() => {
                window.top.postMessage("success", '*');
            }, 1000);
    }
}

function handleMove(e) {
    let x = e.pageX
    let y = e.pageY
    selectedDisk.style.left = x + "px"
    selectedDisk.style.top = y + "px"
}

function updateTower(tower) {
    tower.element.innerHTML = ''
    if(tower.disks.length === 0)
        return
    for(let i=tower.disks.length-1; i>=0; i--) {
        let disk = document.createElement("img")
        disk.src = `img/disk-${tower.disks[i]}.png`
        disk.classList.add("disk")
        disk.setAttribute("draggable", "false")
        if(i === tower.disks.length - 1)
            disk.classList.add("top")
        tower.element.appendChild(disk)
    }
}

initialize()




