'use strict';

const productsURL = 'http://127.0.0.1:8000';

let interval = setInterval(() => {
    let vaqt = new Date();
    let yil = vaqt.getFullYear().toString();
    let oy = (vaqt.getMonth() + 1).toString().padStart(2, '0');
    let kun = vaqt.getDate().toString().padStart(2, '0');

    let vaqt_sana = document.querySelector('.vaqt_sana');
    vaqt_sana.textContent = `${kun}.${oy}.${yil}`
    
    let soat = vaqt.getHours().toString().padStart(2, '0');
    let minut = vaqt.getMinutes().toString().padStart(2, '0');
    let sekund = vaqt.getSeconds().toString().padStart(2, '0');
    
    let vaqt_soat = document.querySelector('.vaqt_soat');
    vaqt_soat.textContent = `${soat}:${minut}:${sekund}`;
}, 1000);


let calc = document.querySelector('.calc');
let calcInt = document.querySelector('.calc-input');
calcInt.focus()

let btns = calc.querySelectorAll('button');
btns.forEach((item) => {
    item.addEventListener('click', (e) => {
        if(item.id >= 0 && item.id <= 9){
            let info = String(calcInt.value);
            calcInt.value = Number(info + item.textContent);
        }
        if(item.textContent.toLowerCase() == 'c'){
            calcInt.value = '';
        }
        if(item.id == 'back'){
            console.log(calcInt.value)
        }
    })
})

// Fetch
let searchProductBtn = document.getElementById('enter')
let place = document.querySelector('.disp_products');

let needID = [];
let purchaseProducts = [];

async function getFetch(){
    let pos = await fetch(productsURL);
    let resp = await pos.json();
    needID = resp;
}

function searchID(){
    if(Number(calcInt.value) > 0 && Number(calcInt.value) < 999){
        let searchingID = Number(calcInt.value);

        needID.forEach((item, index) => {
            if(item.kod == searchingID){
                if(purchaseProducts.includes(item)){
                    purchaseProducts.forEach((item) => {
                        if(item.kod == searchingID){
                            console.log('bor');
                            item['soni'] = item['soni'] + 1;
                        }
                    })
                }else {
                    item['soni'] = 1;
                    purchaseProducts.push(item);
                }
                console.log(purchaseProducts)
            }
        })

        putDOM();
        calcInt.value = '';
    }else {
        calcInt.value = '';
        calcInt.style.borderColor = 'red';
        calcInt.focus();
    }
}
searchProductBtn.addEventListener('click', (e) => searchID());
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        searchID();
    }
})

function putDOM(){
    place.innerHTML = `<header>
                            <p>#</p>
                            <p>Kod</p>
                            <p>Nomi</p>
                            <p>Narxi</p>
                            <p>Soni</p>
                            <p>Umumiy</p>
                        </header>`;
    purchaseProducts.forEach((item, index) => {
        let div = document.createElement('div');
        div.innerHTML = `<p>${index + 1}</p>
                            <p>${item.kod}</p>
                            <p>${item.nomi}</p>
                            <p>${Math.floor(item.narxi)}</p>
                            <p>${item.soni}</p>
                            <p>${Math.floor(item.narxi)}</p>`;
        place.append(div);
    })
}

// Add Product
let addProductPlace = document.querySelector('.add-product');
let box = addProductPlace.querySelector('.box');

function seeAddProduct(){
    addProductPlace.style.display = 'flex';
    console.log('aaa')
}

addProductPlace.addEventListener('click', (e) => {
    addProductPlace.style.display = 'none';
})
box.addEventListener('click', (e) => {
    e.stopPropagation()
})


// Post
const addBtn = document.getElementById('addProductBtn');
const nomi = document.getElementById('nomi');
const kodi = document.getElementById('kodi');
const narxi = document.getElementById('narxi');

async function postData(nomi, kodi, narxi){
    console.log(nomi, kodi, narxi);
    await fetch(productsURL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            kod: kodi,
            nomi: nomi,
            narxi: narxi
        })
    })

    getFetch()
}

addBtn.addEventListener('click', (e) => {
    if(nomi.value != '' && kodi.value != '' && narxi.value != ''){
        let permission = 0;
        needID.forEach((item, index) => {
            if(item.kodi == kodi.value){
                permission += 1;
                kodi.style.borderColor = 'red';
            }
        })
        if(permission == 0){
            postData(nomi.value, kodi.value, narxi.value);
            nomi.value = '';
            kodi.value = '';
            narxi.value = '';
        }
    }
    else {
        alert('to\'ldiring');
    }
})


// Delete Product
async function deleteProduct(id){
    await fetch(`${productsURL}/${id}`, {
        method: 'DELETE',
    })

    getFetch()
    allProductPut();
}

getFetch()



// All Products
const viewAllProducts = document.querySelector('.view-all-products');
const allProductPlace = document.getElementById('allProduct');
const allProductForm = document.querySelector('.allProductForm');
let allProductFormDiv = document.querySelector('.allProductFormDiv');

async function allProductPut(){
    allProductFormDiv.innerHTML = '';
    needID.forEach((item, index) => {
        let div = document.createElement('div');
        div.innerHTML = `<p>${index + 1}. ${item.nomi} (Kod: ${item.kod}) - $${item.narxi}</p>
                    <span class='allProductFormActions'>
                        <button>edit</button>
                        <button id="${item.id}">delete</button>
                    </span>`
        allProductFormDiv.append(div);
    });
}

allProductForm.addEventListener('click', (e) => {
    e.stopPropagation();
});

allProductFormDiv.addEventListener('click', async (e) => {
    if(e.target.textContent == 'delete'){
        console.log(e.target.id);
        await deleteProduct(e.target.id);
        await allProductPut();
    };
})

viewAllProducts.addEventListener('click', (e) => {
    allProductPlace.style.display = 'flex';
    allProductPut();
});
allProductPlace.addEventListener('click', (e) => {
    allProductPlace.style.display = 'none';
});








