const toggler = document.querySelector(".nav__toggler");
const navbar = document.querySelector(".nav");
toggler.addEventListener("click", (e) => {
    console.log("clicked");
    navbar.classList.toggle("nav__expanded")
});

//Selectors
const cartModal = document.querySelector(".cart");
const openModal = document.querySelector(".btn-shopping-cart");
const closeModal = document.querySelector(".cart-item-confirm");
const backdrop = document.querySelector(".backdrop");


//Event Listeners
openModal.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backdrop.addEventListener("click", closeModalFunction);

//Functions
function showModalFunction (){
    backdrop.style.display= "block";
    cartModal.style.opacity= "1";
}
function closeModalFunction (){
    cartModal.style.opacity= "0";
    backdrop.style.display= "none";
}
