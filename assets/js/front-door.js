//COMMENT: §§§ SECTION 1: FOUR QUESTIONS CONTENT §§§

//COMMENT: [DEFINE OWNER-FACING RELEVANCE AND THE DEEPER NOBLE EXAMINATION FOR EACH QUESTION]
const question_content = {
    direction: {
        copy: "Where you want the business to go changes what needs attention now. Even when the destination is not fully decided, the possibilities you are considering help clarify what matters most and where to focus first.",
        action_label: "Explore Direction",
        action_href: "#direction-focus",
        focus: {
            question: "Is the business pointed toward the future you are actually considering?",
            introduction: "Understanding your direction brings strategy, leadership, timing and intended transition pathway into the same conversation.",
            examination_title: "Strategic Alignment Review",
            looks_at: "Your transition goals, leadership structure, succession readiness, strategic positioning, and intended pathway.",
            brings_into_focus: "Whether the business is aligned with the direction you want to pursue and what may need to shift before you get there."
        }
    },
    value: {
        copy: "The value of your business is being shaped every day by the decisions you make, often before you can see the effect. Understanding what is strengthening the business, and what may be weakening it, helps you protect what is working, improve what is not, and make future decisions from a stronger position.",
        action_label: "Explore Value",
        action_href: "#value-focus",
        focus: {
            question: "What makes your business valuable today, and what could strengthen its value for what comes next?",
            introduction: "Understanding what makes your business valuable brings quality, durability, transferability, and the evidence a future owner, lender, or successor would rely on into the same conversation.",
            examination_title: "Valuation and Financial Health Check",
            looks_at: "Normalized EBITDA, sector multiples, revenue quality, customer concentration, margin sustainability, and the drivers that influence economic value.",
            brings_into_focus: "What creates value today, which factors could strengthen it, and where the business may be carrying avoidable economic risk."
        }
    },
    independence: {
        copy: "The role you play in the business matters, but so does what happens when you are not there. Understanding where the business depends on you helps clarify what needs to become stronger, giving you more choice in the role you choose to play.",
        action_label: "Explore Independence",
        action_href: "#independence-focus",
        focus: {
            question: "How much does your business depend on you?",
            introduction: "Understanding where your business depends on you brings ownership, operating systems, team capability, continuity, and resilience into the same conversation.",
            examination_title: "Operational Readiness and Continuity Review",
            looks_at: "Owner dependency, process documentation, systems maturity, team stability, customer concentration, and continuity risks.",
            brings_into_focus: "How well the business can operate without you and where dependence on the owner may limit resilience, value, or transition choices."
        }
    },
    outcome: {
        copy: "On paper, a transition can look successful and still miss what matters to you. Knowing what you want to protect and what you want the transition to make possible gives you a clearer basis for the decisions that shape the outcome.",
        action_label: "Explore Outcome",
        action_href: "#outcome-focus",
        focus: {
            question: "What does a successful transition look like for you?",
            introduction: "Understanding the outcome you want brings the business, the ownership transition, and the role you want to play into the same conversation.",
            examination_title: "Business Continuity Baseline",
            looks_at: "A structured re-score across the business using the same dimensions examined at the beginning of the work.",
            brings_into_focus: "What has changed, where the business stands now, and how that position affects the outcome and choices you want to pursue."
        }
    }
};

const question_trigger_elements = Array.from(
    document.querySelectorAll("[data-question-trigger]")
);
const question_detail_element = document.querySelector("[data-question-detail]");
const question_detail_copy_element = document.querySelector("[data-question-detail-copy]");
const question_detail_action_element = document.querySelector("[data-question-detail-action]");
const question_detail_action_label_element = document.querySelector("[data-question-detail-action-label]");
const question_field_element = document.querySelector("[data-front-door-questions]");
const question_overview_element = document.querySelector("[data-four-questions-overview]");
const question_focus_element = document.querySelector("[data-question-focus]");
const question_focus_title_element = document.querySelector("[data-question-focus-title]");
const question_focus_introduction_element = document.querySelector("[data-question-focus-introduction]");
const question_focus_examination_title_element = document.querySelector("[data-question-focus-examination-title]");
const question_focus_looks_at_element = document.querySelector("[data-question-focus-looks-at]");
const question_focus_brings_focus_element = document.querySelector("[data-question-focus-brings-focus]");
const question_focus_back_element = document.querySelector("[data-question-focus-back]");
const stacked_question_layout_query = window.matchMedia("(max-width: 720px)");

let active_question_key = null;
let active_focus_question_key = null;
let focus_entered_from_overview = false;


//COMMENT: §§§ SECTION 2: QUESTION STATE MANAGEMENT §§§

//COMMENT: [KEEP THE SHARED DETAIL FIELD ADJACENT TO THE ACTIVE QUESTION WHEN THE FIELD STACKS]
function position_question_detail() {
    if (!question_field_element || !question_detail_element) {
        return;
    }

    if (!stacked_question_layout_query.matches || !active_question_key) {
        if (question_field_element.nextElementSibling !== question_detail_element) {
            question_field_element.insertAdjacentElement(
                "afterend",
                question_detail_element
            );
        }

        return;
    }

    const active_trigger_element = question_trigger_elements.find(
        (trigger_element) => (
            trigger_element.dataset.questionTrigger === active_question_key
        )
    );

    if (!active_trigger_element) {
        return;
    }

    if (active_trigger_element.nextElementSibling !== question_detail_element) {
        active_trigger_element.insertAdjacentElement(
            "afterend",
            question_detail_element
        );
    }
}


//COMMENT: [RETURN ALL QUESTIONS TO EQUAL STATUS]
function clear_active_question(update_url = true) {
    active_question_key = null;

    question_trigger_elements.forEach((trigger_element) => {
        trigger_element.classList.remove("is-active");
        trigger_element.setAttribute("aria-expanded", "false");
    });

    if (question_detail_element) {
        question_detail_element.hidden = true;
    }

    if (question_detail_action_element) {
        question_detail_action_element.hidden = true;
    }

    position_question_detail();

    if (update_url && window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }
}


//COMMENT: [LOAD THE SELECTED QUESTION INTO THE SHARED DETAIL FIELD]
function show_question_detail(question_key, update_url = true) {
    const selected_content = question_content[question_key];

    if (
        !selected_content
        || !question_detail_element
        || !question_detail_copy_element
    ) {
        return;
    }

    active_question_key = question_key;

    question_trigger_elements.forEach((trigger_element) => {
        const is_selected = (
            trigger_element.dataset.questionTrigger === question_key
        );

        trigger_element.classList.toggle("is-active", is_selected);
        trigger_element.setAttribute(
            "aria-expanded",
            String(is_selected)
        );
    });

    question_detail_copy_element.textContent = selected_content.copy;

    if (
        question_detail_action_element
        && question_detail_action_label_element
        && selected_content.action_href
        && selected_content.action_label
        && selected_content.focus
    ) {
        question_detail_action_element.href = selected_content.action_href;
        question_detail_action_label_element.textContent = selected_content.action_label;
        question_detail_action_element.hidden = false;
    } else if (question_detail_action_element) {
        question_detail_action_element.hidden = true;
    }

    position_question_detail();
    question_detail_element.hidden = false;

    if (update_url && window.location.hash !== `#${question_key}`) {
        history.replaceState(null, "", `#${question_key}`);
    }
}


//COMMENT: §§§ SECTION 3: FOCUS MODE §§§

//COMMENT: [SWITCH VIEWS AS ONE FOUR QUESTIONS EXPERIENCE, WITH A RESTRAINED DIGITAL TRANSITION]
function update_four_questions_view(update_function) {
    const prefers_reduced_motion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        !prefers_reduced_motion
        && typeof document.startViewTransition === "function"
    ) {
        document.startViewTransition(update_function);
        return;
    }

    update_function();
}


//COMMENT: [LOAD ONE QUESTION INTO THE SHARED FOCUS MODE SO ALL FOUR DEEP DIVES USE THE SAME SYSTEM]
function populate_question_focus(question_key) {
    const selected_content = question_content[question_key];
    const focus_content = selected_content?.focus;

    if (
        !focus_content
        || !question_focus_element
        || !question_focus_title_element
        || !question_focus_introduction_element
        || !question_focus_examination_title_element
        || !question_focus_looks_at_element
        || !question_focus_brings_focus_element
        || !question_focus_back_element
    ) {
        return false;
    }

    active_focus_question_key = question_key;
    question_focus_element.dataset.questionFocus = question_key;
    question_focus_back_element.href = `#${question_key}`;
    question_focus_title_element.textContent = focus_content.question;
    question_focus_introduction_element.textContent = focus_content.introduction;
    question_focus_examination_title_element.textContent = focus_content.examination_title;
    question_focus_looks_at_element.textContent = focus_content.looks_at;
    question_focus_brings_focus_element.textContent = focus_content.brings_into_focus;

    return true;
}


//COMMENT: [OPEN THE SELECTED QUESTION AS A FOCUSED STATE WITHOUT LEAVING FOUR QUESTIONS]
function show_question_focus(question_key, should_focus_heading = false) {
    if (
        !question_overview_element
        || !question_focus_element
        || !populate_question_focus(question_key)
    ) {
        return;
    }

    update_four_questions_view(() => {
        question_overview_element.hidden = true;
        question_focus_element.hidden = false;
        document.body.classList.add("is-question-focus");
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    if (should_focus_heading && question_focus_title_element) {
        requestAnimationFrame(() => {
            question_focus_title_element.focus({ preventScroll: true });
        });
    }
}


//COMMENT: [RETURN TO THE SAME EXPANDED QUESTION SO THE OWNER RETAINS CONTEXT]
function show_four_questions_overview(
    question_key = null,
    should_focus_trigger = false
) {
    if (!question_overview_element || !question_focus_element) {
        return;
    }

    update_four_questions_view(() => {
        question_focus_element.hidden = true;
        question_overview_element.hidden = false;
        document.body.classList.remove("is-question-focus");
        active_focus_question_key = null;

        if (question_key && question_content[question_key]) {
            show_question_detail(question_key, false);
        } else {
            clear_active_question(false);
        }

        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    if (should_focus_trigger && question_key) {
        const target_trigger_element = question_trigger_elements.find(
            (trigger_element) => (
                trigger_element.dataset.questionTrigger === question_key
            )
        );

        if (target_trigger_element) {
            requestAnimationFrame(() => {
                target_trigger_element.focus({ preventScroll: true });
            });
        }
    }
}


//COMMENT: [RENDER ADDRESSABLE STATES FOR DIRECT LINKS AND BROWSER HISTORY]
function render_location_state(should_move_focus = false) {
    const requested_state = window.location.hash.replace("#", "");
    const focus_match = requested_state.match(/^(direction|value|independence|outcome)-focus$/);

    if (focus_match && question_content[focus_match[1]]?.focus) {
        show_question_focus(focus_match[1], should_move_focus);
        return;
    }

    focus_entered_from_overview = false;

    if (question_content[requested_state]) {
        show_four_questions_overview(
            requested_state,
            should_move_focus
        );
        return;
    }

    show_four_questions_overview(null, false);
}


//COMMENT: §§§ SECTION 4: QUESTION INTERACTIONS §§§

//COMMENT: [ALLOW EACH QUESTION TO OPEN OR CLOSE THE SHARED DETAIL FIELD]
question_trigger_elements.forEach((trigger_element) => {
    trigger_element.addEventListener("click", () => {
        const question_key = trigger_element.dataset.questionTrigger;

        if (active_question_key === question_key) {
            clear_active_question();
            return;
        }

        show_question_detail(question_key);
    });
});


//COMMENT: [OPEN THE ACTIVE QUESTION IN FOCUS MODE FROM THE OWNER-RELEVANCE FIELD]
if (question_detail_action_element) {
    question_detail_action_element.addEventListener("click", (event) => {
        const selected_content = question_content[active_question_key];

        if (!active_question_key || !selected_content?.focus) {
            return;
        }

        event.preventDefault();
        focus_entered_from_overview = true;
        history.pushState(
            { four_questions_state: `${active_question_key}-focus` },
            "",
            `#${active_question_key}-focus`
        );
        show_question_focus(active_question_key, true);
    });
}


//COMMENT: [RETURN TO THE EXPANDED QUESTION WITHOUT CREATING A SECOND LOOP IN HISTORY]
if (question_focus_back_element) {
    question_focus_back_element.addEventListener("click", (event) => {
        event.preventDefault();

        const return_question_key = active_focus_question_key;

        if (!return_question_key || !question_content[return_question_key]) {
            show_four_questions_overview(null, true);
            return;
        }

        if (focus_entered_from_overview) {
            history.back();
            return;
        }

        history.replaceState(
            { four_questions_state: return_question_key },
            "",
            `#${return_question_key}`
        );
        show_four_questions_overview(return_question_key, true);
    });
}


//COMMENT: [REPOSITION THE SAME DETAIL FIELD WHEN THE RESPONSIVE QUESTION LAYOUT CHANGES]
function handle_question_layout_change() {
    position_question_detail();
}

if (typeof stacked_question_layout_query.addEventListener === "function") {
    stacked_question_layout_query.addEventListener(
        "change",
        handle_question_layout_change
    );
} else {
    stacked_question_layout_query.addListener(handle_question_layout_change);
}


//COMMENT: [ALLOW KEYBOARD USERS TO RETURN TO THE EQUAL-QUESTION STATE]
document.addEventListener("keydown", (event) => {
    if (
        event.key !== "Escape"
        || !active_question_key
        || (question_focus_element && !question_focus_element.hidden)
    ) {
        return;
    }

    clear_active_question();
});


//COMMENT: [KEEP BROWSER BACK/FORWARD NAVIGATION SYNCHRONIZED WITH THE VISUAL STATE]
window.addEventListener("popstate", () => {
    render_location_state(true);
});


//COMMENT: §§§ SECTION 5: INITIAL STATE §§§

//COMMENT: [RESTORE THE REQUESTED QUESTION OR FOCUS MODE ON LOAD]
render_location_state(false);
