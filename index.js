// Хранилище данных состояния
const state = {
    currentValue: 0,
    dayValue: 0,
    history: []
};

// DOM элементы
const dom = {
    currentValueNode: document.querySelector(".current-value"),
    dayValueNode: document.querySelector(".day-value"),
    buttonAddValueNode: document.querySelector(".increment-value"),
    buttonResetValueNode: document.querySelector(".reset-value"),
    selectValueNode: document.querySelector(".select-value"),
    listHistoryNode: document.querySelector(".history-value"),
    historyTemplate: document.querySelector("template").content.querySelector(".history-item")
};

// Функция обновления DOM
function updateUI() {
    dom.currentValueNode.textContent = state.currentValue;
    dom.dayValueNode.textContent = state.dayValue;
    renderHistory();
}

// Рендер истории
function renderHistory() {
    dom.listHistoryNode.innerHTML = ""; // Очистка списка
    state.history.forEach(item => {
        const listElem = dom.historyTemplate.cloneNode(true);
        listElem.textContent = item;
        dom.listHistoryNode.append(listElem);
    });
}

// Получение данных с сервера
async function fetchData() {
    try {
        const response = await fetch("http://localhost:3000/water");
        const [data] = await response.json();

        state.currentValue = data.currentValueWater;
        if (data.valueWaterDay === 0) {
            state.dayValue = getUserDayValue();
            await updateDataOnServer();
        } else {
            state.dayValue = data.valueWaterDay;
        }

        updateUI();
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

// Запрос дневной нормы от пользователя
function getUserDayValue() {
    return +prompt("Введите дневную норму воды!") || 0;
}

// Обновление данных на сервере
async function updateDataOnServer() {
    try {
        await fetch("http://localhost:3000/water/1", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: 1,
                currentValueWater: state.currentValue,
                valueWaterDay: state.dayValue
            })
        });
    } catch (error) {
        console.error("Ошибка обновления данных на сервере:", error);
    }
}

// Добавление воды
function addWaterValue() {
    const increment = +dom.selectValueNode.value || 0;
    state.currentValue += increment;
    state.history.push(new Date().toLocaleTimeString());
    updateDataOnServer();
    updateUI();
}

// Сброс текущего значения
function resetCurrentValue() {
    state.currentValue = 0;
    updateDataOnServer();
    updateUI();
}

// Обработчики событий
function setupEventListeners() {
    document.addEventListener("DOMContentLoaded", fetchData);
    dom.buttonAddValueNode.addEventListener("click", addWaterValue);
    dom.buttonResetValueNode.addEventListener("click", resetCurrentValue);
}

setupEventListeners();
