//COMMENT: §§§ SECTION 1: SHARED MENU CONTROLS §§§
//COMMENT: [KEEP GLOBAL NAVIGATION CONSISTENT ON THE MICROSITE AND OPTIONAL DESTINATIONS]
const menu_elements = Array.from(document.querySelectorAll("[data-menu]"));
const menu_open_buttons = Array.from(document.querySelectorAll("[data-menu-open]"));
let active_menu_element = null;
let active_menu_trigger = null;
let inactive_page_elements = [];

//COMMENT: §§§ SECTION 2: MENU FOCUS AND PAGE STATE §§§
//COMMENT: [ENSURE ONLY THE ACTIVE DRAWER CAN RECEIVE KEYBOARD INPUT]
function focusable_menu_controls(menu_element) {
    return Array.from(menu_element.querySelectorAll('a[href], button:not([disabled])'));
}

//COMMENT: [PRESERVE AN UNINTERRUPTED KEYBOARD READING ORDER WHILE THE DRAWER IS OPEN]
function set_page_inert(menu_element, is_inert) {
    if (is_inert) {
        inactive_page_elements = Array.from(document.body.children).filter((element) => (
            element !== menu_element && element.tagName !== "SCRIPT" && !element.hasAttribute("inert")
        ));
        inactive_page_elements.forEach((element) => element.setAttribute("inert", ""));
        return;
    }
    inactive_page_elements.forEach((element) => element.removeAttribute("inert"));
    inactive_page_elements = [];
}

//COMMENT: [APPLY THE OPEN AND CLOSED STATES AT THE COMPONENT LEVEL]
function set_menu_state(menu_element, is_open, trigger_element = null, restore_focus = true) {
    if (!menu_element) return;
    if (is_open) {
        active_menu_element = menu_element;
        active_menu_trigger = trigger_element;
        menu_element.removeAttribute("inert");
        menu_element.setAttribute("aria-hidden", "false");
        trigger_element?.setAttribute("aria-expanded", "true");
        document.body.classList.add("has-open-menu");
        set_page_inert(menu_element, true);
        focusable_menu_controls(menu_element)[0]?.focus();
        return;
    }
    menu_element.setAttribute("aria-hidden", "true");
    menu_element.setAttribute("inert", "");
    active_menu_trigger?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("has-open-menu");
    set_page_inert(menu_element, false);
    if (restore_focus) active_menu_trigger?.focus();
    active_menu_element = null;
    active_menu_trigger = null;
}

//COMMENT: §§§ SECTION 3: MENU EVENTS AND IN-PAGE NAVIGATION §§§
//COMMENT: [RETAIN THE EXISTING MENU OPEN, CLOSE, ESCAPE, AND FOCUS LOOP BEHAVIOUR]
menu_open_buttons.forEach((open_button) => {
    open_button.addEventListener("click", () => {
        set_menu_state(document.getElementById(open_button.getAttribute("aria-controls")), true, open_button);
    });
});
menu_elements.forEach((menu_element) => {
    menu_element.querySelectorAll("[data-menu-close]").forEach((control) => {
        control.addEventListener("click", () => set_menu_state(menu_element, false));
    });
    menu_element.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener("click", () => set_menu_state(menu_element, false, null, false));
    });
});
document.addEventListener("keydown", (event) => {
    if (!active_menu_element) return;
    if (event.key === "Escape") {
        event.preventDefault();
        set_menu_state(active_menu_element, false);
        return;
    }
    if (event.key !== "Tab") return;
    const controls = focusable_menu_controls(active_menu_element);
    if (!controls.length) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === controls[0]) {
        event.preventDefault(); controls[controls.length - 1].focus();
    } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
        event.preventDefault(); controls[0].focus();
    }
});
