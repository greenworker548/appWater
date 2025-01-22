// начальный объект значений
const initialData = {
    currentValue: 0,
    dayValue: 0
}

// начальный массив истории пополнения
const intialHistoryData = []

// узлы из DOM дерева
const currentValueNode = document.querySelector(".current-value")
const dayValueNode = document.querySelector(".day-value")
const buttonAddValueNode = document.querySelector(".increment-value")
const buttonResetValueNode = document.querySelector(".reset-value")
const selectValueNode = document.querySelector(".select-value")
const template = document.querySelector("template")
const listHistoryNode = document.querySelector(".history-value")
const listHistoryItemNode = template.content.querySelector(".history-item")

// рендер вставки цифр в узлы
function render(data) {
    currentValueNode.textContent = data.currentValue
    dayValueNode.textContent = data.dayValue
}

// функция запроса значений с сервера и заполнения локального хранилища значений
// так же получение данных от пользователя, если дневная норма пустая
async function renderData() {
    const response = await fetch("http://localhost:3000/water")
    const data = await response.json()

    initialData.currentValue = data[0].currentValueWater

    if(data[0].valueWaterDay == 0) {
        const userValue = +prompt("Введите дневную норму воды!")
        initialData.dayValue = userValue
        updateData(initialData.currentValue, initialData.dayValue)
    } else {
        initialData.dayValue = data[0].valueWaterDay
    }

    render(initialData)
}

function renderHistiryData() {
    intialHistoryData.map((item) => {
        const listElem = listHistoryItemNode.cloneNode(true)
        listElem.textContent = item

        listHistoryNode.append(listElem)
    })
}

// функция отправления POST запроса для обновления значений на сервере
function updateData(newCurrentValue, newDayWalue) {
    fetch("http://localhost:3000/water/1", {
        method: "PUT",
        body: JSON.stringify({
            "id": 1,
            "currentValueWater": newCurrentValue,
            "valueWaterDay": newDayWalue
        })
    })
}

// функция рендера локала при изменении и запуска обновления сервера
function addValueWater() {
    const selectValue = +selectValueNode.value
    const dataValue = initialData.currentValue
    const sumValue = dataValue + selectValue

    initialData.currentValue = sumValue
    
    updateData(sumValue, initialData.dayValue)

    writeHistryItem()
    renderHistiryData()

    render(initialData)
}

// функция обнуления значения дневной нормы
function resetCurrentValue() {
    initialData.currentValue = 0
    
    updateData(0, initialData.dayValue)

    render(initialData)
}

function writeHistryItem() {
    const time = new Date()

    intialHistoryData.push(time)
}

// обработчики событий
document.addEventListener("DOMContentLoaded", renderData)
buttonAddValueNode.addEventListener("click", addValueWater)
buttonResetValueNode.addEventListener("click", resetCurrentValue)