const initialData = {
    currentValue: 0,
    dayValue: 0
}

const currentValueNode = document.querySelector(".current-value")
const dayValueNode = document.querySelector(".day-value")
const buttonAddValueNode = document.querySelector(".increment-value")
const buttonResetValueNode = document.querySelector(".reset-value")
const selectValueNode = document.querySelector(".select-value")

function render(data) {
    currentValueNode.textContent = data.currentValue
    dayValueNode.textContent = data.dayValue
}

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

function addValueWater() {
    const selectValue = +selectValueNode.value
    const dataValue = initialData.currentValue
    const sumValue = dataValue + selectValue

    initialData.currentValue = sumValue
    
    updateData(sumValue, initialData.dayValue)

    render(initialData)
}

function resetCurrentValue() {
    initialData.currentValue = 0
    
    updateData(0, initialData.dayValue)

    render(initialData)
}

document.addEventListener("DOMContentLoaded", renderData)
buttonAddValueNode.addEventListener("click", addValueWater)
buttonResetValueNode.addEventListener("click", resetCurrentValue)