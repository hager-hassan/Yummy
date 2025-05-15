const menuWidth = $('.side-bar .left-part').innerWidth();
const row = document.querySelector('.main-container');
const contactSection = document.querySelector('.contact-section');
const searchInputs = document.querySelector('.search-inputs')
const mealSection = document.querySelector('.meal-section');
const main = document.querySelector('main');

let URLIngredient = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
let URLCategory = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
let URLArea = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=';
let URLSearchName = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
let URLSearchLetter = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';
let URLMail = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

let numOfErrors = 0;
let errorFlag = false;
let isClosed = true;

const userName = document.getElementById('userName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const age = document.getElementById('age');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const searchByName = document.getElementById('searchByName');
const searchByFirstLetter =document.getElementById('searchByFirstLetter');

const submitButton = document.getElementById('submitButton');

const Regex = {
    userName: /^[a-zA-Z]{3,15}(?: [a-zA-Z]{3,15}){0,4}$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    age: /^(1[3-9]|[2-9][0-9])$/,
    email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
}

const errorMessages = {
    userName: document.getElementById('userNameErrorMessage'),
    email: document.getElementById('emailErrorMessage'),
    phone: document.getElementById('phoneErrorMessage'),
    age: document.getElementById('ageErrorMessage'),
    password: document.getElementById('passwordErrorMessage'),
    confirmPassword: document.getElementById('confirmPasswordErrorMessage')
};

// ! open and close side bar
$('.side-bar').css({left: `-${menuWidth}px`});

$('.side-bar .right-part .menu i').on('click' ,() =>{
    if(isClosed){
        $('.side-bar').css({left: `-${menuWidth}px`});
        $('#menuClose').addClass('d-none');
        $('#menu').removeClass('d-none');

        $('.side-bar .links li').each(function(index){
            $(this).animate({
                opacity :0,
            })
        });

        isClosed = false;
    }
    else{
        $('.side-bar').css({ left: `0px` });
        $('#menu').addClass('d-none');
        $('#menuClose').removeClass('d-none');

        $('.side-bar .links li').each(function(index){
            $(this)
                .css({
                    opacity: 0,
                    position: 'relative',
                    top: '100px'
                })
                .delay(100 * index)
                .animate({
                    top: '0px',
                    opacity: 1
                }, 700);
        });

        isClosed = true;
        }
})

// ! side bar links
// * 1-search
$('#search').on('click' , () =>{
    hideAllSections();
    searchInputs.classList.remove('d-none');
    $('.container').removeClass('min-vh-100');
    row.innerHTML = '';
    row.classList.remove('d-none');
})

// * 2-categories
$('#categories').on('click' , () =>{
    Loader ()
    hideAllSections()
    $('.container').removeClass('min-vh-100');
    row.classList.remove('d-none');
    showCategories()
})

// * 3-areas
$('#area').on('click' , () =>{
    Loader ()
    hideAllSections()
    $('.container').removeClass('min-vh-100');
    row.classList.remove('d-none');
    showAreas()
})

// * 4-ingredients
$('#ingredients').on('click' , () =>{
    Loader ()
    hideAllSections()
    $('.container').removeClass('min-vh-100');
    row.classList.remove('d-none');
    showIngredients()
})

// * 5-contact
$('#contact').on('click' , () =>{
    hideAllSections();
    row.classList.add('d-none');
    contactSection.classList.remove('d-none');
    $('.container').addClass('min-vh-100');
})

// ! to hide sections
function hideAllSections() {
    searchInputs.classList.add('d-none');
    contactSection.classList.add('d-none');
    mealSection.classList.add('d-none');
}

// ! event to show meals or meal
row.addEventListener('click', (event) => {
    let container = event.target.closest('.item');
    let specificMeal = event.target.closest('.specific-meal');
    
    if (specificMeal) {
        Loader();
        let ID = specificMeal.getAttribute('meal-id');
        hideAllSections();
        row.classList.add('d-none');
        mealSection.classList.remove('d-none');
        showMeal(ID);
        return;
    }

    if (container) {
        Loader();
        let text = container.querySelector('p')?.textContent?.trim();
        if (text) {
            text = text.split(' ').join('_');

            let url;

            if (container.classList.contains('areas')) {
                url = URLArea + text;
            } else if (container.classList.contains('category-layer')) {
                url = URLCategory + text;
            } else if (container.classList.contains('ingredients')) {
                url = URLIngredient + text;
            }

            if (url) {
                showMeals(url);
            }
        }
    }
});

// ! event to handel search by name
searchByName.addEventListener('input' , () =>{
    let mealName = searchByName.value.trim();
    
    if(mealName !== '' && mealName !== null && mealName !== undefined){
        Loader();
        let url = URLSearchName+mealName;
        showMeals(url);
    }
})

// ! event to handel search by first letter
searchByFirstLetter.addEventListener('input' , () =>{
    let mealLetter = searchByFirstLetter.value.trim();

    if(mealLetter.length !== 1){
        searchByFirstLetter.value = mealLetter.charAt(0);
        mealLetter = searchByFirstLetter.value;
    }
    
    if(mealLetter !== '' && mealLetter !== null && mealLetter !== undefined){
        Loader();
        let url = URLSearchLetter+mealLetter;
        showMeals(url);
    }
})

// ! for contact inputs validation
function isEmpty() {
    return (
        userName.value.trim() === '' ||
        email.value.trim() === '' ||
        phone.value.trim() === '' ||
        age.value.trim() === '' ||
        password.value.trim() === '' ||
        confirmPassword.value.trim() === ''
    );
}

function clearInputs() {
    userName.value = '';
    email.value = '';
    phone.value = '';
    age.value = '';
    password.value = '';
    confirmPassword.value = '';
}

function matchPassword() {
    if (confirmPassword.value !== password.value) {
        errorMessages['confirmPassword'].classList.remove('d-none');
        errorFlag = true;
        numOfErrors += 1;
        return false;
    } else {
        errorMessages['confirmPassword'].classList.add('d-none');
        return true;
    }
}

function regexValidation(field) {
    const regex = Regex[field.id];
    const value = field.value.trim();

    if (regex.test(value)) {
        errorMessages[field.id].classList.add('d-none');
        return true;
    } else {
        errorMessages[field.id].classList.remove('d-none');
        errorFlag = true;
        numOfErrors += 1;
        return false;
    }
}

submitButton.addEventListener('click', function (event) {
    event.preventDefault();

    if (isEmpty()) {
        alert('All fields are required!');
        return;
    }

    numOfErrors = 0;
    errorFlag = false;

    regexValidation(userName);
    regexValidation(email);
    regexValidation(phone);
    regexValidation(age);
    regexValidation(password);

    matchPassword();

    if (errorFlag || numOfErrors !== 0) {
        return;
    }

    alert("Form submitted successfully!");
    clearInputs();
});

// ! to show categories
async function showCategories() {
    try {
        let url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        let result = await fetch(url);
        
        if (!result.ok) {
            if (result.status >= 400 && result.status < 500) {
                main.innerHTML = "<p class='text-danger m-auto'>Client error Please check your input or the URL!</p>";
            } else if (result.status >= 500 && result.status < 600) {
                main.innerHTML = "<p class='text-danger m-auto'>Server error Please try again later!</p>";
            }
            return;
        }

        let data = await result.json();

        let categories = data.categories.map(category => {
            let caption = category.strCategoryDescription.split(' ', 10).join(' ');
            return `
                <div class="col">
                    <div class="item-container position-relative rounded overflow-hidden">
                        <img src="${category.strCategoryThumb}" class="w-100">
                        <div class="layer item category-layer position-absolute top-0 start-0 end-0 bottom-0 d-flex align align-items-center justify-content-center flex-column p-3 p-sm-2 text-center">
                            <p class="m-0 fw-bold">${category.strCategory}</p>
                            <p class="m-0 small">${caption}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        row.innerHTML = categories.join('');

    } catch (error) {
        console.error("Unexpected error:", error);
        main.innerHTML = "<p class='text-danger m-auto'>An unexpected error occurred Please check your connection!</p>";
    }
}

// ! to show areas
async function showAreas() {
    try {
        let url = `https://www.themealdb.com/api/json/v1/1/list.php?a=list`;
        let result = await fetch(url);
        
        if (!result.ok) {
            if (result.status >= 400 && result.status < 500) {
                main.innerHTML = "<p class='text-danger m-auto'>Client error Please check your input or the URL!</p>";
            } else if (result.status >= 500 && result.status < 600) {
                main.innerHTML = "<p class='text-danger m-auto'>Server error Please try again later!</p>";
            }
            return;
        }

        let data = await result.json();

        let areas = data.meals.map(meal => {
            return `
                <div class="col">
                    <div class="item-container item areas d-flex align-items-center justify-content-center flex-column">
                        <i class="fa-solid fa-house-laptop"></i>
                        <p class="m-0 fw-bold text-center">${meal.strArea}</p>
                    </div>
                </div>
            `;
        });

        row.innerHTML = areas.join('');

    } catch (error) {
        console.error("Unexpected error:", error);
        main.innerHTML = "<p class='text-danger m-auto'>An unexpected error occurred Please check your connection!</p>";
    }
}

// ! to show ingredients
async function showIngredients() {
    try {
        let url = `https://www.themealdb.com/api/json/v1/1/list.php?i=list`;
        let result = await fetch(url);
        
        if (!result.ok) {
            if (result.status >= 400 && result.status < 500) {
                main.innerHTML = "<p class='text-danger m-auto'>Client error Please check your input or the URL!</p>";
            } else if (result.status >= 500 && result.status < 600) {
                main.innerHTML = "<p class='text-danger m-auto'>Server error Please try again later!</p>";
            }
            return;
        }

        let data = await result.json();

        let ingredients = data.meals.slice(0 , 21).map(ingredient => {
            let caption = ingredient.strDescription.split(' ', 25).join(' ');

            return `
                <div class="col">
                    <div class="item-container item ingredients d-flex align-items-center justify-content-center flex-column">
                        <i class="fa-solid fa-drumstick-bite"></i>
                        <p class="m-0 fw-bold text-center py-1">${ingredient.strIngredient}</p>
                        <p class="ingredients-desc text-center">${caption}</p>
                    </div>
                </div>
            `;
        });

        row.innerHTML = ingredients.join('');

    } catch (error) {
        console.error("Unexpected error:", error);
        main.innerHTML = "<p class='text-danger m-auto'>An unexpected error occurred Please check your connection!</p>";
    }
}

// ! to show meals
async function showMeals(url){
        try {
        let result = await fetch(url);
        
        if (!result.ok) {
            if (result.status >= 400 && result.status < 500) {
                main.innerHTML = "<p class='text-danger m-auto'>Client error Please check your input or the URL!</p>";
            } else if (result.status >= 500 && result.status < 600) {
                main.innerHTML = "<p class='text-danger m-auto'>Server error Please try again later!</p>";
            }
            return;
        }

        let data = await result.json();

        let meals = data.meals.slice(0 , 20).map(meal => {
            return `
                <div class="col">
                    <div class="item-container specific-meal position-relative rounded overflow-hidden" meal-id="${meal.idMeal}">
                        <img src="${meal.strMealThumb}" class="w-100">
                        <div class="layer position-absolute top-0 start-0 end-0 bottom-0 d-flex align align-items-center justify-content-center flex-column p-3 p-sm-2 text-center">
                            <p class="m-0 fw-bold">${meal.strMeal}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        row.innerHTML = meals.join('');

    } catch (error) {
        console.error("Unexpected error:", error);
        main.innerHTML = "<p class='text-danger m-auto'>An unexpected error occurred Please check your connection!</p>";
    }
}

// ! to show meal
async function showMeal(ID) {
    try{
        let url = URLMail+ID;

        let result = await fetch(url);

        if (!result.ok) {
            if (result.status >= 400 && result.status < 500) {
                main.innerHTML = "<p class='text-danger m-auto'>Client error Please check your input or the URL!</p>";
            } else if (result.status >= 500 && result.status < 600) {
                main.innerHTML = "<p class='text-danger m-auto'>Server error Please try again later!</p>";
            }
            return;
        }

        let data = await result.json()
        let meal = data.meals[0];

        let tags = '';
        if (meal.strTags) {
            tags = meal.strTags.split(',').map((tag) => {
                return `<span class="p-1 m-2 rounded fw-normal tags">${tag}</span>`;
            }).join('');
        } 
        else {
            tags = '<span class="p-1 m-2 rounded fw-normal tags">No tags available</span>';
        }

        let ingredients = [];

        for (let i = 1; i <= 20; i++) {
            let ingredient = meal[`strIngredient${i}`];
            let measure = meal[`strMeasure${i}`];
    
            if (ingredient && ingredient.trim() !== "" && measure && measure.trim() !== "") {
                    ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
                }
        }

        let recipes = ingredients.map((recipe) => {
            return `<span class="p-1 m-2 rounded fw-normal recipes">${recipe}</span>`
        })

        recipes = recipes.join('');


        mealSection.innerHTML = `<div class="col-12 col-md-4">
                    <div class="px-4 px-md-0">
                        <img src="${meal.strMealThumb}" class="w-100">
                        <p class="text-white fw-semibold meal-name">${meal.strMeal}</p>
                    </div>
                </div>

                <div class="col-12 col-md-8">
                    <div class="px-4 px-md-0">
                        <p class="text-white fw-semibold instructions">Instructions</p>
                        <p class="text-white">${meal.strInstructions}</p>
                        <p class="text-white fw-bold info">Area : <span class="fw-medium">${meal.strArea}</span></p>
                        <p class="text-white fw-bold info">Category : <span class="fw-medium">${meal.strCategory}</span></p>
                        <p class="text-white fw-bold info">Recipes : <br>
                            ${recipes}
                        </p>
                        <p class="text-white fw-bold info">Tags : <br>
                            ${tags}
                        </p>
                        <div class="mt-3">
                            <span class="source rounded"><a href="${meal.strSource}" target="_blank" class="text-white fw-medium">Source</a></span>
                            <span class="youtube rounded"><a href="${meal.strYoutube}" target="_blank" class="text-white fw-medium">Youtube</a></span>
                        </div>
                    </div>
                </div>`

    }
    catch(error){
        console.error("Unexpected error:", error);
        main.innerHTML = "<p class='text-danger m-auto'>An unexpected error occurred Please check your connection!</p>";
    }
}

// ! to show and hide loader
function Loader (){
    $('body').css({overflow : 'hidden'});
    $('.loader-container').removeClass('d-none');
    $('.loader-container').fadeIn(0 , () =>{
        $('.loader-container').fadeOut(1200 , ()=>{
        $('body').css({overflow : 'auto'});
        $('.loader-container').addClass('d-none');
    });
    });
} 

showMeals(URLSearchName);

jQuery(function () {
    $('.loader-container').fadeOut(2000 , ()=>{
        $('body').css({overflow : 'auto'});
        $('.loader-container').addClass('d-none');
    });
})