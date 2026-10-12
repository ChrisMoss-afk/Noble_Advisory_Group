//COMMENT: §§§ SECTION 1: GENERAL CONTACT FORM §§§
//COMMENT: [KEEP THE GENERAL CONTACT EXPERIENCE LOW-FRICTION IN THE STATIC PROTOTYPE]
const contact_form = document.querySelector("[data-contact-form]");
const contact_error = document.querySelector("[data-contact-error]");
const contact_confirmation = document.querySelector("[data-contact-confirmation]");

contact_form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contact_form.checkValidity()) {
        contact_error.textContent = "Please complete the required fields before sending your inquiry.";
        contact_form.reportValidity();
        return;
    }
    contact_error.textContent = "";
    contact_form.querySelector(".contact-form__fields")?.setAttribute("hidden", "");
    contact_form.querySelector(".contact-form__actions")?.setAttribute("hidden", "");
    contact_confirmation.hidden = false;
    contact_confirmation.focus();
});
