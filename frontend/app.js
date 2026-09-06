const byId = (id) => document.getElementById(id);

function makeCard(className, html) {
  const element = document.createElement("article");
  element.className = className;
  element.innerHTML = html;
  return element;
}

function setupTheme() {
  const savedTheme = localStorage.getItem("college-theme") || "dark";
  document.body.dataset.theme = savedTheme;

  const updateButtons = () => {
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      const isLight = document.body.dataset.theme === "light";
      button.textContent = isLight ? "Black Theme" : "White Theme";
      button.setAttribute("aria-pressed", String(isLight));
    });
  };

  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
      document.body.dataset.theme = nextTheme;
      localStorage.setItem("college-theme", nextTheme);
      updateButtons();
    });
  });

  updateButtons();
}

function activateButton(buttons, activeButton) {
  buttons.forEach((button) => button.classList.toggle("active", button === activeButton));
}

async function loadCollege() {
  const response = await fetch("/api/college");
  const college = await response.json();

  byId("college-kicker").textContent = college.kicker;
  byId("college-name").textContent = college.name;
  byId("college-summary").textContent = college.summary;
  byId("college-about-main").textContent = college.about.join(" ");

  byId("highlights").replaceChildren(
    ...college.highlights.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    })
  );

  byId("stats").replaceChildren(
    ...college.stats.map((stat) =>
      makeCard(
        "stat",
        `<strong>${stat.value}</strong><span>${stat.label}</span>`
      )
    )
  );

  byId("courses").replaceChildren(
    ...college.courses.map((course, index) =>
      makeCard(
        "course-card",
        `<div class="course-topline">
          <span>${course.type}</span>
          <button class="course-arrow" type="button" aria-expanded="false" aria-controls="course-details-${index}" title="View ${course.title} details">
            &rarr;
          </button>
        </div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <blockquote>${course.quote}</blockquote>
        <div class="course-details" id="course-details-${index}" hidden>
          <dl>
            <div><dt>Duration</dt><dd>${course.duration}</dd></div>
            <div><dt>Fees</dt><dd>${course.fees}</dd></div>
            <div><dt>Focus</dt><dd>${course.focus}</dd></div>
          </dl>
          <h4>Why students choose it</h4>
          <ul>
            ${course.why_choose.map((reason) => `<li>${reason}</li>`).join("")}
          </ul>
        </div>`
      )
    )
  );

  document.querySelectorAll(".course-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      const details = byId(button.getAttribute("aria-controls"));
      const isOpen = button.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".course-arrow").forEach((otherButton) => {
        if (otherButton !== button) {
          otherButton.setAttribute("aria-expanded", "false");
          otherButton.closest(".course-card").classList.remove("expanded");
          byId(otherButton.getAttribute("aria-controls")).hidden = true;
        }
      });

      button.setAttribute("aria-expanded", String(!isOpen));
      button.closest(".course-card").classList.toggle("expanded", !isOpen);
      details.hidden = isOpen;
    });
  });

  const syllabusTabs = byId("syllabus-tabs");
  const syllabusTitle = byId("syllabus-title");
  const syllabusFrame = byId("syllabus-frame");
  const syllabusButtons = college.courses.map((course, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = course.title;
    button.addEventListener("click", () => {
      activateButton(syllabusButtons, button);
      syllabusTitle.textContent = course.title;
      syllabusFrame.src = `${course.syllabus_pdf}#view=FitH`;
      history.replaceState(null, "", `#syllabus-${index + 1}`);
    });
    return button;
  });
  syllabusTabs.replaceChildren(...syllabusButtons);
  syllabusButtons[0]?.click();

  const feesTabs = byId("fees-tabs");
  const feesViewer = byId("fees-viewer");
  const feesButtons = college.courses.map((course, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = course.title;
    button.addEventListener("click", () => {
      activateButton(feesButtons, button);
      feesViewer.innerHTML = `
        <p class="viewer-label">Selected fee</p>
        <h3>${course.title}</h3>
        <strong>${course.fees}</strong>
        <p>${course.type} stream. Annual fee shown for the current demo structure.</p>
      `;
      history.replaceState(null, "", `#fees-${index + 1}`);
    });
    return button;
  });
  feesTabs.replaceChildren(...feesButtons);
  feesButtons[0]?.click();

  byId("campus-life").replaceChildren(
    ...college.campus_life.map((item, index) =>
      makeCard(
        "campus-card",
        `<a class="campus-number" href="campus-detail.html?id=${index + 1}" aria-label="Open ${item.title} details">${String(index + 1).padStart(2, "0")}</a>
        <div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
        <span class="campus-arrow" aria-hidden="true">&rarr;</span>`
      )
    )
  );

  byId("faculty").replaceChildren(
    ...college.faculty.map((person) =>
      makeCard("person-card", `<h4>${person.name}</h4><p>${person.role}</p>`)
    )
  );

  byId("alumni").replaceChildren(
    ...college.alumni.map((person) =>
      makeCard(
        "quote-card",
        `<p>&ldquo;${person.quote}&rdquo;</p><strong>${person.name}</strong><span>${person.role}</span>`
      )
    )
  );

  byId("contacts").replaceChildren(
    ...college.contacts.map((contact) =>
      makeCard(
        "contact-card",
        `<h3>${contact.campus}</h3><p>${contact.address}</p><a href="tel:${contact.phone.replaceAll(" ", "")}">${contact.phone}</a><a href="mailto:${contact.email}">${contact.email}</a>`
      )
    )
  );

  byId("links").replaceChildren(
    ...college.links.map((link) => {
      const a = document.createElement("a");
      a.href = link.url;
      a.textContent = link.label;
      a.target = "_blank";
      a.rel = "noreferrer";
      return a;
    })
  );
}

document.querySelector(".menu-button").addEventListener("click", (event) => {
  const nav = byId("mobile-nav");
  const isOpen = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    byId("mobile-nav").classList.remove("open");
    document.querySelector(".menu-button").setAttribute("aria-expanded", "false");
  });
});

setupTheme();
loadCollege();
