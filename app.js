const cols = document.querySelectorAll('.col')

document.addEventListener('keydown', event => {
    event.preventDefault()
    if (event.code.toLocaleLowerCase() === 'space') {
        setRandColors()
    }
})

document.addEventListener('click', event => {
    const type = event.target.dataset.type
    if (type === 'lock') {
        //tagName в строковом виде дает нам информацию о том, куда мы кликнули
        const node = event.target.tagName.toLowerCase() === 'i' ? event.target : event.target.children[0]
        // node -> вне зависимости куда мы тыкнули - мы получаем иконку
        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {
        copyToClickBoard(event.target.textContent)
    }
})

//Ф-ия будет выдавать код каког-то рандомного цвета
function generateRandColor() {
    const hexCodes = '0123456789ABCDEF'
    let color = ''
    for (let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
    }
    return '#' + color
}

//Ф-ия для копирования цвета из заголовка
function copyToClickBoard(text) {
    return navigator.clipboard.writeText(text)
}


function setRandColors(isInitial) {
    // Параметр - спаршиваем, первоначальная ли загрузка? забираем цвета из хэша : пустой массив
    const colors = isInitial ? getColorsFromHash() : []

    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        const text = col.querySelector('h2')
        const button = col.querySelector('button')

        if (isLocked) {
            colors.push(text.textContent)
            return
        }

        const color = isInitial ? colors[index] ? colors[index] : generateRandColor() : generateRandColor()

        //Цвета складыва/тся в массив только тогда, когда это не первоначальная загрузка
        if (!isInitial) {
            colors.push(color)
        }

        text.textContent = color
        col.style.background = color

        setTextColor(text, color)
        setTextColor(button, color)
    })

    updateColorsHash(colors)
}

function setTextColor(text, color) {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

//Работа с хэшами (чтобы после обновления сохранялись цвета)
function updateColorsHash(colors = []) {
    document.location.hash = colors.map(col => {
        //Убираем решетку удаляя элемент 0
        return col.toString().substring(1)
    }).join('-')
}

function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash.substring(1).split('-').map(color => '#' + color)
    }
    return []
}

setRandColors(true)