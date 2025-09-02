// ========================
// ПОДАЧА ЗАЯВКИ — ФОРМА
// ========================
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        phone: document.getElementById('phone').value.replace(/\D/g, ''),
        city: document.getElementById('city').value.trim(),
        church: document.getElementById('church').value.trim(),
        consent: document.querySelector('input[name="consent"]').checked ? "✅ Да" : "❌ Нет"
    };

    // --- Отправка в Telegram ---
    const telegramBotToken = '8336719253:AAESZ3wUiHBU3kLmPMwpJtfZeungVOEkMh4';
    const telegramChatIds = ['-1003073647900'];

    let message = `<b>📥 Новая заявка</b>%0A`;
    message += `<b>Имя:</b> ${formData.firstName}%0A`;
    message += `<b>Фамилия:</b> ${formData.lastName}%0A`;
    message += `<b>Телефон:</b> ${formData.phone}%0A`;
    message += `<b>Город:</b> ${formData.city}%0A`;
    message += `<b>Церковь:</b> ${formData.church || '—'}%0A`;
    message += `<b>Согласие:</b> ${formData.consent}%0A`;

    let sendCount = 0, errorCount = 0;

    telegramChatIds.forEach(chatId => {
        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&parse_mode=html&text=${message}`)
            .then(response => {
                if (!response.ok) errorCount++;
                else sendCount++;
                if (sendCount + errorCount === telegramChatIds.length) finalizeFormSubmit(errorCount === 0);
            })
            .catch(() => {
                errorCount++;
                if (sendCount + errorCount === telegramChatIds.length) finalizeFormSubmit(false);
            });
    });

    // --- Отправка в Google Apps Script ---
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzQyZgPZF_-mGCbH7-IFw2BlURExh6v3txMZialuwRzL_-WwR9Hwa_PDZe3jxbZytRELg/exec';
    fetch(scriptURL, { method: 'POST', body: JSON.stringify(formData) })
        .then(response => response.text())
        .catch(error => console.error('Ошибка Google Script:', error));
});

// ========================
// ФУНКЦИИ ПОСЛЕ ОТПРАВКИ
// ========================
function finalizeFormSubmit(success) {
    if (success) {
        showMainregPopup('mainregSuccessPopup');
        document.getElementById('contactForm').reset();
    } else {
        showMainregPopup('mainregErrorPopup');
    }
    popupBg_mti.classList.remove('active');
    popup_mti.classList.remove('active');
    unlockScroll();
}

function showMainregPopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'block';

    const closeBtn = popup.querySelector('.mainreg-popup-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => popup.style.display = 'none');

    setTimeout(() => popup.style.display = 'none', 15000);
}

// ========================
// POPUP ФОРМА
// ========================
let popupBg_mti = document.querySelector('.popup__bg_mti');
let popup_mti = document.querySelector('.popup_mti');
let openPopupButtons_mti = document.querySelectorAll('.open-popup_mti');
let closePopupButton_mti = document.querySelector('.close-popup_mti');
let closePopupButtonSubmit_mti = document.querySelector('.close_through_submit_mti');

let scrollPosition = 0;

function lockScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.classList.add('lock-scroll');
    document.body.style.top = `-${scrollPosition}px`;
}

function unlockScroll() {
    document.body.classList.remove('lock-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
}



openPopupButtons_mti.forEach(button => button.addEventListener('click', e => {
    e.preventDefault();
    popupBg_mti.classList.add('active');
    popup_mti.classList.add('active');
    lockScroll();
}));

if (closePopupButton_mti) closePopupButton_mti.addEventListener('click', () => { popupBg_mti.classList.remove('active'); popup_mti.classList.remove('active'); unlockScroll(); });
if (closePopupButtonSubmit_mti) closePopupButtonSubmit_mti.addEventListener('click', () => { if (checkFormValidity()) { popupBg_mti.classList.remove('active'); popup_mti.classList.remove('active'); unlockScroll(); } });
document.addEventListener('click', e => { if (e.target === popupBg_mti) { popupBg_mti.classList.remove('active'); popup_mti.classList.remove('active'); unlockScroll(); } });

function checkFormValidity() {
    const fields = ['firstName','lastName','email','phone','dob','city','church','pastor','education','motivation','additionalInfo'];
    return fields.every(id => document.getElementById(id)?.value.trim()) && document.querySelector('input[name="consent"]')?.checked;
}

// ========================
// МАСКА ТЕЛЕФОНА
// ========================
$(document).ready(function() {
    $("input[name='phone']").mask("+7(999) 999-9999");
    $(".bezvalue_wrap").html("<input class='bezvalue' type='text' name='bezvalue' value='Dolly Duck' />");
    $(".bezvalue").hide();

    $('.datatitle').on('click', function() {
        $('#titlezagalovor').html($(this).attr('data-title'));
    });
});

// ========================
// КАПИТАЛИЗАЦИЯ ПЕРВОЙ БУКВЫ
// ========================
function capitalizeFirstLetter(input) {
    input.value = input.value.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

['firstName','lastName','city','church','pastor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => capitalizeFirstLetter(el));
});

// ========================
// АККОРДЕОНЫ
// ========================
document.querySelectorAll('.accordion-toggle').forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('open');
    button.nextElementSibling.classList.toggle('open');
}));

// ========================
// ЛАЙТБОКС
// ========================
const lightboxDoc = document.getElementById('lightbox-doc');
if (lightboxDoc) {
    const lightboxImgDoc = lightboxDoc.querySelector('img');
    const closeBtnDoc = lightboxDoc.querySelector('.lightbox-close');

    document.querySelectorAll('.accordion-content img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxDoc.classList.add('active');
            lightboxImgDoc.src = img.dataset.full || img.src;
        });
    });

    closeBtnDoc?.addEventListener('click', () => lightboxDoc.classList.remove('active'));
    lightboxDoc.addEventListener('click', e => { if (e.target === lightboxDoc) lightboxDoc.classList.remove('active'); });
}

// ========================
// AOS ANIMATION
// ========================
AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });

// ========================
// ВИДЖЕТ ЧАТА
// ========================
document.querySelector('.chat-toggle')?.addEventListener('click', () => {
    document.querySelector('.chat-widget').classList.toggle('open');
});
