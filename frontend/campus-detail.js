const params = new URLSearchParams(window.location.search);
const selectedIndex = Math.max(Number(params.get("id") || "1") - 1, 0);

async function loadCampusDetail() {
  const response = await fetch("/api/college");
  const college = await response.json();
  const item = college.campus_life[selectedIndex] || college.campus_life[0];
  const number = String((college.campus_life.indexOf(item) + 1) || 1).padStart(2, "0");

  document.title = `${item.title} | Campus Life`;
  document.getElementById("detail-number").textContent = number;
  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-description").textContent = item.description;
  document.getElementById("detail-content").replaceChildren(
    ...item.details.map((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      return p;
    })
  );
}

loadCampusDetail();
