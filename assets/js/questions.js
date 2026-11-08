//COMMENT: §§§ SECTION 1: FOUR QUESTIONS ACCORDION CONTROLS §§§
//COMMENT: [KEEP THE APPROVED EXPLANATIONS AVAILABLE WITHIN THEIR COMPACT QUESTION ROWS]
const question_triggers = Array.from(document.querySelectorAll("[data-question-trigger]"));

//COMMENT: §§§ SECTION 2: SINGLE-ACTIVE-QUESTION STATE §§§
//COMMENT: [LET THE OWNER OPEN OR CLOSE ANY QUESTION WHILE KEEPING THE OTHERS VISIBLE]
function set_question_state(trigger_element, is_open) {
    const panel_element = document.getElementById(trigger_element.getAttribute("aria-controls"));
    if (!panel_element) return;
    trigger_element.setAttribute("aria-expanded", String(is_open));
    panel_element.hidden = !is_open;
}

//COMMENT: §§§ SECTION 3: QUESTION INTERACTION BINDINGS §§§
//COMMENT: [USE NATIVE BUTTONS TO PRESERVE POINTER, TOUCH, AND KEYBOARD INTERACTIONS]
question_triggers.forEach((trigger_element) => {
    trigger_element.addEventListener("click", () => {
        const next_state = trigger_element.getAttribute("aria-expanded") !== "true";
        question_triggers.forEach((other_trigger) => set_question_state(other_trigger, false));
        set_question_state(trigger_element, next_state);
    });
});
