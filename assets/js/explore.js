//COMMENT: §§§ SECTION 1: PROCESS STAGE SYSTEM §§§

//COMMENT: [KEEP ONE PROCESS STAGE OPEN INSIDE THE CONTINUOUS EXPLORE EXPERIENCE]
const process_stage_elements = Array.from(
    document.querySelectorAll("[data-process-stage]")
);
const process_trigger_elements = process_stage_elements
    .map((stage_element) => stage_element.querySelector(".process-stage__trigger"))
    .filter(Boolean);

function set_process_stage(active_stage_element, options = {}) {
    const { move_focus = false } = options;

    if (!active_stage_element) {
        return;
    }

    process_stage_elements.forEach((stage_element) => {
        const is_active = stage_element === active_stage_element;
        const trigger_element = stage_element.querySelector(".process-stage__trigger");
        const panel_element = stage_element.querySelector(".process-stage__panel");

        stage_element.classList.toggle("is-active", is_active);
        trigger_element?.setAttribute("aria-expanded", String(is_active));

        if (panel_element) {
            panel_element.setAttribute("aria-hidden", String(!is_active));
            panel_element.toggleAttribute("inert", !is_active);
        }
    });

    if (move_focus) {
        active_stage_element.querySelector(".process-stage__trigger")?.focus();
    }
}

process_stage_elements.forEach((stage_element, stage_index) => {
    const trigger_element = stage_element.querySelector(".process-stage__trigger");

    if (!trigger_element) {
        return;
    }

    trigger_element.addEventListener(
        "click",
        () => set_process_stage(stage_element)
    );

    trigger_element.addEventListener("keydown", (event) => {
        let next_index = null;

        if (["ArrowRight", "ArrowDown"].includes(event.key)) {
            next_index = (stage_index + 1) % process_trigger_elements.length;
        } else if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
            next_index = (
                stage_index - 1 + process_trigger_elements.length
            ) % process_trigger_elements.length;
        } else if (event.key === "Home") {
            next_index = 0;
        } else if (event.key === "End") {
            next_index = process_trigger_elements.length - 1;
        }

        if (next_index === null) {
            return;
        }

        event.preventDefault();
        process_trigger_elements[next_index]?.focus();
    });
});

//COMMENT: §§§ SECTION 2: DIRECT SECTION LINKS §§§

//COMMENT: [ALLOW DIRECT HASH LINKS TO LAND CLEANLY BELOW THE STICKY HEADER AND LOCAL INDEX]
function align_requested_section() {
    const requested_id = window.location.hash.replace("#", "");

    if (!requested_id) {
        return;
    }

    const target_element = document.getElementById(requested_id);

    if (!target_element) {
        return;
    }

    requestAnimationFrame(() => {
        target_element.scrollIntoView({
            block: "start",
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth"
        });
    });
}

window.addEventListener("hashchange", align_requested_section);

if (window.location.hash) {
    align_requested_section();
}
