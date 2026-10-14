//COMMENT: §§§ SECTION 1: SPECIALIST EXPERTISE ACCORDION §§§
const expertise_items = Array.from(document.querySelectorAll("[data-expertise-item]"));

function set_expertise_item(target, update_hash = true) {
    expertise_items.forEach((item) => {
        const active = item === target;
        item.classList.toggle("is-active", active);
        const trigger = item.querySelector(".expertise-item__trigger");
        const panel = item.querySelector(".expertise-item__panel");
        trigger?.setAttribute("aria-expanded", String(active));
        panel?.setAttribute("aria-hidden", String(!active));
        panel?.toggleAttribute("inert", !active);
    });
    if (target && update_hash) history.replaceState(null, "", `#${target.id}`);
}

expertise_items.forEach((item) => item.querySelector(".expertise-item__trigger")?.addEventListener("click", () => set_expertise_item(item)));

function open_requested_expertise() {
    const key = window.location.hash.replace("#", "");
    const target = expertise_items.find((item) => item.id === key);
    if (target) { set_expertise_item(target, false); requestAnimationFrame(() => target.scrollIntoView({block:"center", behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"})); }
}
window.addEventListener("hashchange", open_requested_expertise);
open_requested_expertise();
