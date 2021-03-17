// ==UserScript==
// @name         Check CORS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Control Bot
// @author       You
// @match        https://www.wildberries.ru/*
// @grant        none
// ==/UserScript==

function start () {
    localStorage.removeItem('arr_link');
    localStorage.removeItem('posit');
    localStorage.removeItem('work_link');
 //   send_bot('em_start');
    setTimeout(change_url, 1000);
    function change_url () {
        location.href = 'https://www.wildberries.ru/';
    }
}
setInterval(start, 180000);  // интеравал для цикла em_start;

let link_arr  = localStorage.getItem('arr_link');
let position  = 0;
let basket    = 'https://www.wildberries.ru/lk/basket';

if (!link_arr) {new_req()}
else {
    link_arr = JSON.parse(link_arr);
    position = parseInt(localStorage.getItem('posit'));
    if(position > link_arr.length || position == link_arr.length) {
        // return false;
        start_new_ring();
    }
    check_cur_link()
};

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function clean_price (str) {
    let tmp = '';
    for (let i = 0; i < str.length; i++) {
        if(parseInt(str[i]) > -1 && parseInt(str[i]) < 10) {
            tmp = tmp + str[i];
        }
    }
    return tmp;
}

function new_req() {
    const request = new XMLHttpRequest();
    const url = "https://wild.abelikov5.ru/";
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-url');
    //request.onload =
    request.addEventListener("load", () => {
        if (request.status == 200) {
            request_200 (request.responseText);
        } else {
            console.log('status' + request.status + ': ' + request.statusText);
        }
    });
    request.send();
}

function request_200 (resp) {
    localStorage.setItem('arr_link', resp);
    localStorage.setItem('posit',    0);
    link_arr = JSON.parse(resp);
    position = 0;
    let work_link = 'https://www.wildberries.ru/catalog/' + link_arr[0][0] + '/detail.aspx?targetUrl=SP';
    location.href = work_link;
}

function empty_basket () {
    let curr_link = location.href;

    if (curr_link == basket) {
        console.log('at func empty bsk');
        function emp_bsk() {
            let basket_price = document.querySelector('.i-empty-basket');
            if (basket_price) {
                let work_link = 'https://www.wildberries.ru/catalog/' + link_arr[position][0] + '/detail.aspx?targetUrl=SP';
                location.href = work_link;
            } else {
                return 0;
            }
        }
        setTimeout(emp_bsk, 1000);
    }
    return 0;
}

function check_cur_link() {
    let work_link = 'https://www.wildberries.ru/catalog/' + link_arr[position][0] + '/detail.aspx?targetUrl=SP';
    let curr_link = location.href;
    // if () {
        empty_basket();
    //     console.log('пустая корзина', empty_basket());

    //     return false;
    //     location.href = work_link;
    // }

    localStorage.setItem('work_link', work_link)

    if (work_link == curr_link) {
        start_parsing();
    } else {
        // send_bot('different link')
        check_basket();
    }
}

function start_parsing() {
    let price1 = document.querySelector('.final-cost');

    if (price1) {
        price1 = clean_price(price1.textContent);
        if (price1 != parseInt(link_arr[position][1])) {
            update_price_google(link_arr[position][0], price1);
            send_bot ('ВНИМАНИЕ! Цена для артикула <a href="' + localStorage.getItem('work_link') + '">' + link_arr[position][0] + '</a> отличается от контрольного значения. Было <b>' + link_arr[position][1] + '</b>, цена сейчас <b>' + price1 + '</b>');
            setTimeout(next_ring, randomInteger(4000, 5000));
        } else {

 //           send_bot('Ok! ' + link_arr[position][0]);
        }
    } else {
 //       send_bot ('ВНИМАНИЕ! Не получается проверить цену для артикула ' + link_arr[position][0]);
        next_ring();
    }

    setTimeout(add_cart, randomInteger(1000, 5000)); // вызываем функцию от 1 до 5 секунд

    function add_cart() {
        let cart = document.querySelector('.cart-btn-wrap').querySelector('button');
        cart.click();
        setTimeout(go_basket, randomInteger(1000, 5000));
    }
    function go_basket() {
        location.href = basket;
        console.log('basket')
    }
}

function next_ring() {
    position = parseInt(localStorage.getItem('posit')) + 1;
    localStorage.setItem('posit', position);
    if(position > link_arr.length || position == link_arr.length) {
        //return false;
        start_new_ring();
    }
    let work_link = 'https://www.wildberries.ru/catalog/' + link_arr[position][0] + '/detail.aspx?targetUrl=SP';
    location.href = work_link;
}

function check_basket () {
    function del_item() {
        position = parseInt(localStorage.getItem('posit')) + 1;
        localStorage.setItem('posit', position);
        console.log('posit ', position, 'link lenth ', link_arr.length)
        if(position > link_arr.length || position == link_arr.length) {
            let item_in = document.querySelector('.btn-del');
            if (item_in) {item_in.click()}
            start_new_ring();
        }
        let work_link = 'https://www.wildberries.ru/catalog/' + link_arr[position][0] + '/detail.aspx?targetUrl=SP';
        localStorage.setItem('work_link',  work_link);
        let item = document.querySelectorAll('.btn-del');
        if (item) {
            item.forEach(el => {
                el.click();
            });
        }
    }
    function at_basket() {
        let basket_price = document.querySelector('.price-new')
        console.log('at basket');
        if (basket_price) {
            basket_price = clean_price(basket_price.textContent);
            console.log('basket price: ', basket_price);
            if (basket_price != parseInt(link_arr[position][1])) {
 //               update_price_google(link_arr[position][0], basket_price);
                send_bot ('ВНИМАНИЕ! Цена для артикула В КОРЗИНЕ ' + link_arr[position][0] + ' отличается от контрольного значения. Было <b>' + link_arr[position][1] + '</b>, сейчас цена на WildBerries <b>' + basket_price + '</b>');
                del_item()
            }
        } else {
 //           send_bot ('ВНИМАНИЕ! Не получается проверить цену в КОРЗИНЕ для артикула ' + link_arr[position][0]);
            del_item();
        }
        setTimeout(del_item, randomInteger(2000, 5000))
    }
    setTimeout(at_basket, randomInteger(4000, 7000))
}

function start_new_ring () {
    function start () {
        localStorage.removeItem('arr_link');
        localStorage.removeItem('posit');
        localStorage.removeItem('work_link');
//        send_bot('start');
        setTimeout(change_url, 1000);
        function change_url () {
            location.href = 'https://www.wildberries.ru/';
        }
    }
    setInterval(start, 180000);
}

function update_price_google (artic, price) {
    const request = new XMLHttpRequest();
    const url = "https://wild.abelikov5.ru/update.php?artic=" + artic + '&price=' + price;
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-url');
    //request.onload =
/*    request.addEventListener("load", () => {
        if (request.status == 200) {
            request_200 (request.responseText);
        } else {
            console.log('status' + request.status + ': ' + request.statusText);
        }
    });*/
    request.send();
}

function send_bot (mess) {
    let bot_link = 'https://api.telegram.org/bot1622386325:AAEGfOQZeu9031aanx26vrClAzgyUE4qMBQ/sendMessage?chat_id=-1001186207923&text=' + mess + '&parse_mode=html';
    console.log(bot_link);
    const request = new XMLHttpRequest();
    request.open('GET', bot_link, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-url');
    request.send();
}
