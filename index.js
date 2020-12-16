//Controlling user inputs
const inputContent = {
    school: '',
    year: ''
}

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
    input.addEventListener("keyup", function (e) {
        const {
            name,
            value
        } = e.target;
        inputContent[name] = value;
    })
    input.value = inputContent[input.name]
})

//handle form submission
const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    removeItems(".item")
    removeItems(".summary")
    document.querySelector(".details").classList.add("hidden")
    if (!inputContent.year || !inputContent.school) {
        printError();
        return;
    };
    //see fetch.js and populateSeason.js
    getSeason(inputContent.year, inputContent.school).then(populateSeason)
})