// ================= Promise =================

// Объект Promise (промис) используется для отложенных и асинхронных вычислений.
const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('foo');
    }, 300);
});

promise1.then((value) => {
    console.log(value);
    // expected output: "foo"
});

console.log(promise1);
// expected output: [object Promise]

// ==================== Синтаксис ========================
/**
 * new Promise(executor);
 new Promise(function(resolve, reject) { ... });
 */

// ===================== Параметры =========================
// executor
// Объект функции с двумя аргументами resolve и reject. Функция executor  получает оба аргумента и выполняется сразу, еще до того как конструктор вернет созданный объект. Первый аргумент (resolve) вызывает успешное исполнение промиса, второй (reject) отклоняет его.
// Обычно функция executor описывает выполнение какой-то асинхронной работы, по завершении которой необходимо вызвать функцию resolve или reject. Обратите внимание, что возвращаемое значение функции executor игнорируется.

// ====================== Описание ========================
// Интерфейс Promise (промис) представляет собой обертку для значения, неизвестного на момент создания промиса. Он позволяет обрабатывать результаты асинхронных операций так, как если бы они были синхронными: вместо конечного результата асинхронного метода возвращается обещание (промис) получить результат в некоторый момент в будущем.

// Promise может находиться в трёх состояниях:
/**
 ожидание (pending): начальное состояние, не исполнен и не отклонен.
 исполнено (fulfilled): операция завершена успешно.
 отклонено (rejected): операция завершена с ошибкой.
 */

// При создании промис находится в ожидании (pending), а затем может стать исполненным  (fulfilled), вернув полученный результат (значение), или отклоненным (rejected), вернув причину отказа. В любом из этих случаев вызывается обработчик, прикрепленный к промису методом then. (Если в момент назначения обработчика промис уже исполнен или отклонен, обработчик все равно будет вызван, т.е. асинхронное исполнение промиса и назначение обработчика не будет происходить в «состоянии гонки», как, например, в случае с событиями в DOM.)

// Так как методы Promise.prototype.then() и Promise.prototype.catch() сами возвращают промис, их можно вызывать цепочкой, создавая соединения.

/**
 * ===================== Создание промиса ======================
 */
// Объект Promise создается при помощи ключевого слова new и своего конструктора. Конструктор Promise принимает в качестве аргумента функцию, называемую "исполнитель" (executor function). Эта функция должна принимать две функции-коллбэка в качестве параметров. Первый из них (resolve) вызывается, когда асинхронная операция завершилась успешно и вернула результат своего исполнения в виде значения. Второй коллбэк (reject) вызывается, когда операция не удалась, и возвращает значение, указывающее на причину неудачи, чаще всего объект ошибки.

const myFirstPromise = new Promise((resolve, reject) => {
    // выполняется асинхронная операция, которая в итоге вызовет:
    //
    //   resolve(someValue); // успешное завершение
    // или
    //   reject("failure reason"); // неудача
});

// Чтобы снабдить функцию функционалом обещаний, нужно просто вернуть в ней объект Promise:
const url = 'https://jsonplaceholder.typicode.com/posts/1'

function myAsyncFunction(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', url);
        xhr.onload = function(e) {
            if (this.status == 200) {
                console.log('response', this.response); // JSON response
            }
        };
        // xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
}

myAsyncFunction(url)

// ==================== Примеры =========================
// Простой пример
let mySecondPromise = new Promise((resolve, reject) => {
    // Мы вызываем resolve(...), когда асинхронная операция завершилась успешно, и reject(...), когда она не удалась.
    // В этом примере мы используем setTimeout(...), чтобы симулировать асинхронный код.
    // В реальности вы, скорее всего, будете использовать XHR, HTML5 API или что-то подобное.
    setTimeout(function () {
        resolve("Success!"); // Ура! Всё прошло хорошо!
    }, 250);
});

mySecondPromise.then((successMessage) => {
    // successMessage - это что угодно, что мы передали в функцию resolve(...) выше.
    // Это необязательно строка, но если это всего лишь сообщение об успешном завершении, это наверняка будет она.
    console.log("Ура! " + successMessage);
});


// Продвинутый пример
// <button id="btn">Создать Promise!</button>
// <div id="log"></div>

// Данный небольшой пример показывает механизм работы с Promise. Метод testPromise() вызывается при каждом нажатии на <button>. При этом создаётся промис, которое успешно выполняется при помощи window.setTimeout, со значением 'result' в случайном интервале от 1 до 3-х секунд.
// исполнение промиса протоколируется при помощи продолжения p1.then. Это показывает как синхронная часть метода отвязана от асинхронного завершения промиса.

var promiseCount = 0;

function testPromise() {
    var thisPromiseCount = ++promiseCount;

    var log = document.getElementById('log');
    log.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') Запуск (запуск синхронного кода)');

    // Создаём промис, возвращающее 'result' (по истечении 3-х секунд)
    var p1 = new Promise(
        // Функция разрешения позволяет завершить успешно или
        // отклонить промис
        function (resolve, reject) {
            log.insertAdjacentHTML('beforeend', thisPromiseCount +
                ') Запуск промиса (запуск асинхронного кода)');
            // Это всего лишь пример асинхронности
            window.setTimeout(
                function () {
                    // Обещание исполнено!
                    resolve(thisPromiseCount)
                }, Math.random() * 2000 + 1000);
        });

    // Указываем, что сделать с исполненным промисм
    p1.then(
        // Записываем в протокол
        function (val) {
            log.insertAdjacentHTML('beforeend', val +
                ') Обещание исполнено (асинхронный код завершён)');
        });

    log.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') Обещание создано (синхронный код завершён)');
}

window.onload = function () {
    if ("Promise" in window) {
        document.getElementById("btn").addEventListener("click", testPromise);
    } else {
        log = document.getElementById('log');
        log.innerHTML = "Демонстрация невозможна, поскольку ваш браузер не поддерживает интерфейс <code>Promise<code>.";
    }
}
// Данный пример запускается при нажатии на кнопку. Для этого вам необходим браузер, поддерживающий Promise. При последовательных нажатиях на кнопку с коротким интервалом, вы можете увидеть как различные промиса будут исполнены один за другим.


// ==========================  Свойства =============================
/**
 * Promise.length
 Значение свойства всегда равно 1 (количество аргументов конструктора).
 */

/**
 * Promise.prototype
 Представляет прототип для конструктора Promise.
 */

// ========================== Методы =================================
/**
 * Promise.all(iterable)
 Ожидает исполнения всех промисов или отклонения любого из них.
 Возвращает промис, который исполнится после исполнения всех промисов в iterable. В случае, если любой из промисов будет отклонен, Promise.all будет также отклонен.
 */

/**
 * Promise.allSettled(iterable)
 Ожидает завершения всех полученных промисов (как исполнения так и отклонения).
 Возвращает промис, который исполняется когда все полученные промисы завершены (исполнены или отклонены), содержащий массив результатов исполнения полученных промисов.
 */

/**
 * Promise.race(iterable)
 Ожидает исполнения или отклонения любого из полученных промисов.
 Возвращает промис, который будет исполнен или отклонен с результатом исполнения первого исполненного или отклонённого промиса из .iterable.
 */

/**
 * Promise.reject(reason)
 * Возвращает промис, отклонённый из-за reason.
 */

/**
 * Promise.resolve(value)
 Возвращает промис, исполненный с результатом value.
 */


// ======================== Прототип Promise ========================
// Свойства
/**
 * Promise.prototype.constructor
 Возвращает функцию, которая создала прототип экземпляра. Это функция всех обещаний по умолчанию.
 */

// Методы
/**
 * Promise.prototype.catch(onRejected)
 Добавляет функцию обратного вызова для обработки отклонения обещания, которая возвращает новое обещание выполненное с переданным значением, если она вызвана, или оригинальное значение resolve, если обещание выполнено.
 */

/**
 * Promise.prototype.then(onFulfilled, onRejected)
 Добавляет обработчик выполнения и отклонения обещания, и возвращает новое обещание выполненное со значением вызванного обработчика, или оригинальное значение, если обещание не было обработано (т.е. если соответствующий обработчик onFulfilled или onRejected не является функцией).
 */


