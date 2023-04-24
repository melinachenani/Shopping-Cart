//Selectors

const toggler = document.querySelector(".nav__toggler");
const navbar = document.querySelector(".nav");
const cartModal = document.querySelector(".cart");
const openModal = document.querySelector(".btn-shopping-cart");
const closeModal = document.querySelector(".cart-item-confirm");
const backdrop = document.querySelector(".backdrop");
const productsDOM = document.querySelector(".products-center");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

let cart = [];
let buttonsDOM = [];


//Event Listeners

openModal.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backdrop.addEventListener("click", closeModalFunction);
toggler.addEventListener("click", hamburgerMenu);


//Functions

function hamburgerMenu(){
    navbar.classList.toggle("nav__expanded")
}
function showModalFunction (){
    backdrop.style.display= "block";
    cartModal.style.opacity= "1";
    cartModal.style.top= "20%"
}
function closeModalFunction (){
    cartModal.style.opacity= "0";
    backdrop.style.display= "none";
    cartModal.style.top= "-100%" 
}

import { productsData } from "./products.js";


// 1.get products

class Products{
    // get from api end point
    getProducts() {
        return productsData;
    }
}

//2.display products

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach((item) => {
            result += `<section class="product">
                    <div class="img-container">
                        <img src=${item.imageUrl}>
                    </div>
                    <div class="product-description">
                        <p class="product-price">Price: $${item.price}</p>
                        <p class="product-title">${item.title}</p>
                    </div>
                    <div class="btn-one">
                        <button class="btn btn-primary" data-id=${item.id}>Add to Cart</button>
                    </div>
                </section>`;
            productsDOM.innerHTML =result;
        });
    }
    getAddToCartBtns() {
        const addToCartBtns = [...document.querySelectorAll(".btn-primary")];
//        console.log(addToCartBtns);
    buttonsDOM = addToCartBtns;
    addToCartBtns.forEach(btn =>{
        const id = btn.dataset.id;
//        console.log(id);
//        check if this product id is in cart or not

        const isInCart = cart.find( (p)=> p.id === parseInt(id));
        if(isInCart){
          btn.innerText = "In Cart";
          btn.disabled = true;
        }
        btn.addEventListener("click", (event)=> {
//          console.log(event);
//          console.log(event.target);
//          console.log(event.target.dataset);
//          console.log(event.target.dataset.id);
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          //get product from products
          const addedProduct = {...Storage.getProduct(id), quantity: 1};
          //add to cart
          cart = [...cart, addedProduct];
          //save cart to local storage
          Storage.saveCart(cart);
          //update cart value
          this.setCartValue(cart);
          //add to cart item
          this.addCartItem(addedProduct);
        });
    });
    }
    setCartValue(cart){
        //1. cart items
        //2. cart total price
        let tempCartItems = 0;
        const totalPrice = cart.reduce((acc,curr) =>{
            tempCartItems +=curr.quantity; //2+1=>3
            return acc + curr.quantity * curr.price;
        }, 0);
//        cartTotal.innerText =`Total price: $${totalPrice.toFixed(2)}`;  
//        toFixed is for decimal numbers 
//        the number in the parenthesis is for how many fractional parts it has
        cartTotal.innerText =`Total price: $${totalPrice}`;
        cartItems.innerText = tempCartItems;
    }
    addCartItem(cartItem){
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML=`
        <img class="cart-item-img" src=${cartItem.imageUrl}>
        <div class="cart-item-desc">
            <div class="products-desc">
                <h4>${cartItem.title}</h4>
                <h5>$${cartItem.price}</h5>
            </div>
                <div class="desc-icons">
                    <i class="fa fa-chevron-up" data-id=${cartItem.id}>></i>
                    <p>${cartItem.quantity}</p>
                    <i class="fa fa-chevron-down" data-id=${cartItem.id}>></i>
                </div>
                    <i class="fa fa-trash" data-id=${cartItem.id}>></i>
        </div>`;
        cartContent.appendChild(div);    
    }
    setupApp(){
//        get cart from Storage
        cart = storage.getCart();
//        addCartItem
        cart.forEach((cartItem) => this.addCartItem(cartItem));
        this.setCartValue(cart);
//        setvalues: price + items
    }
    cartLogic(){
        //clear cart :
        clearCart.addEventListener("click", () =>this.clearCart());
        //cart functionality
        cartContent.addEventListener("click",(event)=>{
            //console.log(event.target);
            if(event.target.classList.contains("fa-chevron-up")){
                //console.log(event.target.dataset.id);
                const addQuantity = event.target;
                //1.get item from cart
                const addedItem = cart.find((cItem) => cItem.id == addQuantity.dataset.id);
                addedItem.quantity++;
                //2.save cart
                this.setCartValue(cart);
                //3.update cart value
                Storage.saveCart(cart);
                //4.update cart item in ui: when clicked on chevron-up increase the number of products!
                //console.log(addQuantity.nextElementSibling);
                addQuantity.nextElementSibling.innerText = addedItem.quantity;
            }else if (event.target.classList.contains("fa-trash")) {
                const removeItem = event.target;
                const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);

                this.removeItem(_removedItem.id);
                Storage.saveCart(cart);
                cartContent.removeChild(removeItem.parentElement.parentElement);
                //remove from cartItem
                //remove
            }else if(event.target.classList.contains("fa-chevron-down")){
                const subQuantity = event.target;
                //1.get item from cart
                const subStractedItem = cart.find((cItem) => cItem.id == subQuantity.dataset.id);
                if(subStractedItem.quantity ===1){
                    this.removeItem(subStractedItem.id);
                    cartContent.removeChild(subQuantity.parentElement.parentElement.parentElement);
                    return;
                }
                subStractedItem.quantity--;
                //2.save cart
                this.setCartValue(cart);
                //3.update cart value
                Storage.saveCart(cart);
                console.log(subQuantity.parentElement.parentElement);
                subQuantity.previousElementSibling.innerText = subStractedItem.quantity;
            }
        })
    }
    clearCart(){
        //remove method: (DRY) =>  
        cart.forEach(cItem => this.removeItem(cItem.id));
        // remove cart content children
        while(cartContent.children.length) {
            cartContent.removeChild(cartContent.children[0]);
            closeModalFunction();
        }
    }
    removeItem(id){
        //console.log(id);
        //updating the cart
        cart = cart.filter(cItem => cItem.id !== id);
        //total price and cart item
        this.setCartValue(cart);
        //update storage
        Storage.saveCart(cart);
        //get add to cart btn => update text and enable the buttons
        this.getSingleButton(id);
    }
    getSingleButton(id){
        const button = buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
        button.disabled = false;
        button.innerText = `Add to cart`;
    }
}

//3.storage

class Storage {
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        const _products = JSON.parse(localStorage.getItem("products"));
//        return _products.find((p) => p.id === id);
        return _products.find((p) => p.id === parseInt(id));
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    //set up: get cart and set up app;
    ui.setupApp();
    const products = new Products();
    //get all products
    const productsData = products.getProducts();
    //console.log(productsData);
    ui.displayProducts(productsData);
    ui.getAddToCartBtns();
    ui.cartLogic();
    Storage.saveProducts(productsData);
});
