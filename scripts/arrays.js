// 1. instead of creating the cards manually, we should use array functions to convert the data into cards
const courseToCard = ({
  prefix,
  number,
  title,
  url,
  desc,
  prereqs,
  credits,
}) => {
  const prereqLinks = prereqs
    .map((prereq) => `<a href="#" class="card-link">${prereq}</a>`)
    .join();
  const courseTemplate = `<div class="col">
            <div class="card" style="width: 18rem;">
              <h3 class="card-header"><a href="${url}">${title}</a></h3>
              <div class="card-body">
                <h5 class="card-title">${prefix} ${number}</h5>
                <p class="card-text">${desc}</p>
                ${prereqLinks}
                <div id="credits'class="card-footer text-muted">
                  ${credits}
                </div>
              </div>
            </div>
          </div>`;
  return courseTemplate;
};

let filteredCardsData = data.items;
const resultsContainer = document.querySelector("#filtered-results");
const courseCards = data.items.map(courseToCard);
let filteredCourseCards = courseCards;
resultsContainer.innerHTML = filteredCourseCards.join("");

// 2. maybe we only show those that match the search query?
//

const filterCourseCard = (markup, query) => {

  let course; // Add course to array to keep track of credits
  if (markup.toLowerCase().includes(query.toLowerCase())) {
    (data.items).forEach((item) => {
      if (markup.includes(`<h5 class="card-title">${item.prefix} ${item.number}</h5>`)) {
        course = item;
      }
    });

    if (course) { // Add to array if course matched query
      filteredCardsData.push(course);
    }
  }
  return markup.toLowerCase().includes(query.toLowerCase());
};

const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", (ev) => {
  ev.preventDefault();

  filteredCardsData = []; // clear filteredCardsData after making a new search
  const searchField = document.querySelector('input[name="query-text"]');
  const queryText = searchField.value;

  filteredCourseCards = courseCards.filter((card) =>
    filterCourseCard(card, queryText)
  );

  resultsContainer.innerHTML = filteredCourseCards.join("");
  updateSummary();
});

// 3. we update the result count and related summary info as we filter
function updateSummary() {
  // Update count
  const count = document.getElementById("result-count");
  const countValue = filteredCourseCards.length;
  count.innerText = `${countValue} items`;

  // Update credits
  const creditHrsNumElem = document.getElementById("credit-hrs-num");
  const prereqNumElem = document.getElementById("prereq-num");
  creditHrsNumElem.innerText = 0;
  prereqNumElem.innerText = 0;
  Array.from(filteredCardsData).forEach((item) => {
    creditHrsNumElem.innerText = parseInt(creditHrsNumElem.innerText) + item.credits;
    prereqNumElem.innerText = parseInt(prereqNumElem.innerText) + sumPreqCredits(item);
  });
}

// Sum the Prereq Credits of a course
function sumPreqCredits(course) {
  let sum = 0;

  course.prereqs.forEach((pre) => {
    let preqCredit = 0;
    (data.items).forEach((course) => { // Find credit of a prereq
      if (course.number == pre) {
        // make sure you are not adding classes that are already in the filtered list
        let isFiltered = filteredCardsData.includes((item) => item.number == pre);
        preqCredit = isFiltered ? 0 : course.credits;
      }
    });
    sum += preqCredit;
  });
  return sum;
}

updateSummary(); // Initial call