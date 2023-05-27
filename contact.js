  // CDN Link
const css = [  "https://cdn.jsdelivr.net/gh/raghavendratechnic/web-m.rtw@main/contact.min.css",
];

css.forEach(function(css) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = css;
  head.appendChild(link);
});

document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Get form data
  var firstName = document.getElementById("firstName").value.trim();
  var lastName = document.getElementById("lastName").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  // Check if any field is blank
  if (firstName === "") {
    toastNotif(`<i class='warn'></i>${formConfig.blanks.blankName}`);
    return;
  }

  // Check if email is in a valid format
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "" || !emailRegex.test(email)) {
    toastNotif(`<i class='warn'></i>${formConfig.blanks.invalidEmail}`);
    return;
  }

  if (message === "") {
    toastNotif(`<i class='warn'></i>${formConfig.blanks.blankMessage}`);
    return;
  }

  // Check if message exceeds the character limit
  if (message.length > 3000) {
    toastNotif(formConfig.longMessage);
    return;
  }

  // Check if bot token or chat ID is empty
  if (formConfig.botToken === "" || formConfig.chatId === "") {
    toastNotif(`<i class='warn'></i>${formConfig.failed}`);
    return;
  }

  // Telegram Bot API endpoint URL
  var apiUrl = `https://api.telegram.org/bot${formConfig.botToken}/sendMessage`;

  // Formatted message to send to Telegram
  var telegramMessage = `<b>${formConfig.text}</b>
<b>• First Name:</b> <code>${firstName}</code>
<b>• Last Name:</b> <code>${lastName}</code>
<b>• Email:</b> ${email}
<b>• Message:</b> <code>${message}</code>`;

  // Blog Information 
  var adminTitle = 'Raghavendra Technic';
  var adminUrl = 'https://raghavendratechnic.blogspot.com';

  var textWithLinks = `${telegramMessage}\n\nNote: This Form was submitted at Page <a href="${formConfig.blogData.pageUrl}">${formConfig.blogData.pageTitle}</a> on Blog <a href="${formConfig.blogData.homeUrl}">${formConfig.blogData.homeTitle}</a>.\nMade with Love by <a href="${adminUrl}">${adminTitle}</a>.`;

  // Display loading message and disable submit button
  started();

  // Send data to Telegram using fetch API
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: formConfig.chatId,
      text: textWithLinks,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{
            text: formConfig.textF,
            url: formConfig.blogData.pageUrl
          }]
        ]
      }
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        // Form submission successful
        toastNotif(`<i class='check'></i>${formConfig.send}`);
        // Show success message after 2 seconds
        setTimeout(function() {
          showSuccessMessage();
          // Reset the form 
          document.getElementById("contactForm").reset();
        }, 2000);
      } else {
        // Form submission failed
        toastNotif(`<i class='warn'></i>${formConfig.failed}`);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
});

function started() {
  // Disable submit button to prevent multiple submits
  document.querySelector('form[id=contactForm] button[type=submit]').disabled = true;
  toastNotif(`<i class='info'></i>${formConfig.started}`);
}

function showSuccessMessage() {
  var formContainer = document.getElementById("contactForm");

  // Hide the form
  formContainer.style.display = "none";
  document.querySelector(".fxPu").classList.add("visible");
  document.querySelector(".paragraph").classList.remove("hidden");
}

const closeButton = document.querySelector(".fxPuCl");

function hidePopup() {
  document.querySelector(".fxPu").classList.remove("visible");
}

closeButton.addEventListener("click", hidePopup);
