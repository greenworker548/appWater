// fetch("http://localhost:3000/posts/1", {
//     method: "PUT",
//     body: JSON.stringify({ "id": 1, "title": "Hello NewWor", "author": "typicode2" })
// })

fetch("http://localhost:3000/water")
    .then((response) => response.json())
    .then((data) => console.log(data))

const data = {
    currentValue: 0,
    dayValue: 0
}

const currentValueNode = document.querySelector(".current-value")
const dayValueNode = document.querySelector(".day-value")
const buttonAddValueNode = document.querySelector(".increment-value")

function render(data) {
    currentValueNode.textContent = data.currentValue
    dayValueNode.textContent = data.dayValue
}

document.addEventListener("DOMContentLoaded", render(data))