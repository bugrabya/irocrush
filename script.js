const game = document.getElementById("game")
const width = 8
const squares = []

let score = 0
const scoreText = document.getElementById("score")

const candies = [
    "images/red.png",
    "images/blue.png",
    "images/green.png",
    "images/yellow.png"
]

let dragged = null
let replaced = null

let startX = 0
let startY = 0

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}

// ---------------- BOARD ----------------
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const img = document.createElement("img")
        img.src = randomCandy()
        img.id = i
        img.draggable = true

        // PC
        img.addEventListener("dragstart", () => dragged = img)
        img.addEventListener("dragover", e => e.preventDefault())
        img.addEventListener("drop", () => replaced = img)
        img.addEventListener("dragend", dragEnd)

        // MOBILE
        img.addEventListener("touchstart", touchStart)
        img.addEventListener("touchend", touchEnd)

        game.appendChild(img)
        squares.push(img)
    }

    removeAllMatches()
}

// ---------------- DRAG / TOUCH ----------------
function dragEnd() {
    if (!dragged || !replaced) return

    const from = parseInt(dragged.id)
    const to = parseInt(replaced.id)

    const valid = [from - 1, from + 1, from - width, from + width]
    if (!valid.includes(to)) {
        resetDrag()
        return
    }

    swap(dragged, replaced)

    setTimeout(() => {
        if (findMatches().length > 0) {
            removeAllMatches()
        } else {
            swap(dragged, replaced)
        }
        resetDrag()
    }, 200)
}

function touchStart(e) {
    dragged = e.target
    startX = e.changedTouches[0].clientX
    startY = e.changedTouches[0].clientY
}

function touchEnd(e) {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY

    const diffX = endX - startX
    const diffY = endY - startY

    const draggedId = parseInt(dragged.id)
    let targetId = draggedId

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30) targetId = draggedId + 1
        else if (diffX < -30) targetId = draggedId - 1
    } else {
        if (diffY > 30) targetId = draggedId + width
        else if (diffY < -30) targetId = draggedId - width
    }

    replaced = squares[targetId]
    dragEnd()
}

function resetDrag() {
    dragged = null
    replaced = null
}

// ---------------- GAME LOGIC ----------------
function swap(a, b) {
    let temp = a.src
    a.src = b.src
    b.src = temp
}

function findMatches() {
    let matches = []

    // horizontal
    for (let i = 0; i < 64; i++) {
        if (i % width > 5) continue
        let a = squares[i].src
        if (a &&
            a === squares[i + 1].src &&
            a === squares[i + 2].src
        ) {
            matches.push(i, i + 1, i + 2)
        }
    }

    // vertical
    for (let i = 0; i < 48; i++) {
        let a = squares[i].src
        if (a &&
            a === squares[i + width].src &&
            a === squares[i + width * 2].src
        ) {
            matches.push(i, i + width, i + width * 2)
        }
    }

    return [...new Set(matches)]
}

function removeAllMatches() {
    const matches = findMatches()
    if (matches.length === 0) return

    matches.forEach(i => squares[i].classList.add("pop"))

    // SCORE
    score += matches.length * 100
    scoreText.innerText = score

    setTimeout(() => {
        matches.forEach(i => {
            squares[i].src = randomCandy()
            squares[i].classList.remove("pop")
        })
        removeAllMatches()
    }, 200)
}

// ---------------- START ----------------
createBoard()
