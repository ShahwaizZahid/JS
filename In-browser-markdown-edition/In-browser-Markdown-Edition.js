const documents = [
  {
    id: "1",
    name: "welcome.md",
    date: "20023-11-13",
    content:
      "# Welcome to Markdown\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.\n\n## How to use this?\n\n1. Write markdown in the markdown editor window\n2. See the rendered markdown in the preview window\n\n### Features\n\n- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists\n- Name and save the document to access again later\n- Choose between Light or Dark mode depending on your preference\n\n> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).\n\n#### Headings\n\nTo create a heading, add the hash sign (#) before the heading. The number of number signs you use should correspond to the heading level. You'll see in this guide that we've used all six heading levels (not necessarily in the correct way you should use headings!) to illustrate how they should look.\n\n##### Lists\n\nYou can see examples of ordered and unordered lists above.\n\n###### Code Blocks\n\nThis markdown editor allows for inline-code snippets, like this: <p>I'm inline</p>. It also allows for larger code blocks like this:  \n\n```\n <main>\n  <h1>This is a larger code block</h1>\n</main>\n```",
  },
  {
    id: "2",
    name: "untitled-document.md",
    date: "2023-11-13",
    content: "# Create your new markdown here!",
  },
];

const header = document.querySelector(".header");
const newDocumentContainer = document.querySelector(".new-document-container");
const selectfile = document.querySelector(".select-file-div");
let navOpen = true;
selectfile.addEventListener("click", () => {
  if (!navOpen) {
    console.log("close");
    navOpen = true;
    selectfile.innerHTML = `<i class="fa-regular fa-circle-right fa-2xl"></i>`;
    newDocumentContainer.style.left = "-250px";
    header.style.left = "0";
    document.documentElement.style.overflow = "auto";
  } else {
    navOpen = false;

    console.log("open");
    selectfile.innerHTML = `<i class="fa-regular fa-circle-left fa-2xl"></i>`;
    newDocumentContainer.style.left = "0";
    header.style.left = "250px";
    document.documentElement.style.overflow = "hidden";
  }
});

const converter = new showdown.Converter();

const inputOpenFileName = document.querySelector(".document-file-name");
const previewContent = document.querySelector(".preview-content");
const markdownContent = document.querySelector(".markdown-content");

const NewDocContainer = document.querySelector(".created-docs-container");
const templateCreatedDoc = document.querySelector(".doc-create-template");
const deleteBtn = document.querySelector(".fa-trash-can");
const saveBtn = document.querySelector(".save-delete-conatainer");

let savedDocuments;
if (localStorage.getItem("Object")) {
  savedDocuments = JSON.parse(localStorage.getItem("Object"));
} else {
  savedDocuments = documents;
  localStorage.setItem("Object", JSON.stringify(savedDocuments));
}
//setOpenFileIndex in Local Storage
let openedFileIndex;
openedFileIndex = JSON.parse(localStorage.getItem("setOpenFileIndex"));
if (openedFileIndex == null) {
  openedFileIndex = 0;
}

localStorage.setItem("setOpenFileIndex", openedFileIndex);
retrievedOpenFileIndex = localStorage.getItem("setOpenFileIndex");

//set Index
let numbersOfDocuments = 0;
localStorage.setItem("setIndex", openedFileIndex);

//currentActiveDoc in Local Storage
localStorage.setItem(
  "currentActiveDoc",
  JSON.stringify(savedDocuments[openedFileIndex])
);
const currentDocContent = JSON.parse(localStorage.getItem("currentActiveDoc"));
convertMarkdown(currentDocContent.content, currentDocContent.name);

//convert Markdown to Html
function convertMarkdown(valueToConvert, nameOfFile) {
  markdownContent.value = valueToConvert;
  const convertedHtml = converter.makeHtml(valueToConvert);
  inputOpenFileName.value = nameOfFile;
  previewContent.innerHTML = convertedHtml;
}

//Click & add text in markdown content area
markdownContent.addEventListener("input", convertMarkdownToHTML);
function convertMarkdownToHTML() {
  const htmlOutput = converter.makeHtml(markdownContent.value);
  document.querySelector(".preview-content").innerHTML = htmlOutput;
}

if (savedDocuments.length > 0) {
  for (let i = 0; i < savedDocuments.length; i++) {
    addDocument(i);
  }
}
let Docs = document.querySelectorAll(".created-doc");

Docs[openedFileIndex].classList.add("openFile");

//render content of file docs in new doc section
function addDocument(i) {
  const context = templateCreatedDoc.content.cloneNode(true);

  context.querySelector(".created-doc-date").innerHTML = savedDocuments[i].date;
  context.querySelector(".created-doc-name").innerHTML = savedDocuments[i].name;

  context.querySelector(".created-doc").addEventListener("click", () => {
    if (
      selectfile.innerHTML ===
      `<i class="fa-regular fa-circle-left fa-2xl"></i>`
    ) {
      document.documentElement.style.overflow = "auto";
      selectfile.innerHTML = `<i class="fa-regular fa-circle-right fa-2xl"></i>`;
      newDocumentContainer.style.left = "-250px";
      header.style.left = "0";
    }
    openedFileIndex = i;

    localStorage.setItem("setOpenFileIndex", openedFileIndex);

    markdownContent.innerHTML = savedDocuments[i].content;
    convertMarkdown(savedDocuments[i].content, savedDocuments[i].name);
    findOpenFileDocument();
  });

  numbersOfDocuments++;
  localStorage.setItem("setIndex", numbersOfDocuments);
  NewDocContainer.appendChild(context);
}

const createNewDocBtn = document.querySelector(".new-doc-btn");
createNewDocBtn.addEventListener("click", createNewDoc);

function createNewDoc() {
  let setDate = dateFunction();
  const newDoc = {
    id: openedFileIndex + 10,
    name: "untitled-document.md",
    date: setDate,
    content: "# Create your new markdown here!",
  };

  savedDocuments.push(newDoc);
  addDocument(numbersOfDocuments);
  convertMarkdown(
    savedDocuments[savedDocuments.length - 1].content,
    savedDocuments[savedDocuments.length - 1].name
  );
  openedFileIndex = numbersOfDocuments - 1;
  localStorage.setItem("setOpenFileIndex", openedFileIndex);
  localStorage.setItem("Object", JSON.stringify(savedDocuments));
  findOpenFileDocument();
}

function dateFunction() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

saveBtn.addEventListener("click", () => {
  let docCon = document.querySelectorAll(".created-doc")[openedFileIndex];
  savedDocuments[openedFileIndex].content = markdownContent.value;
  savedDocuments[openedFileIndex].name = inputOpenFileName.value;
  console.log();
  docCon.querySelector(".created-doc-name").innerHTML =
    savedDocuments[openedFileIndex].name;
  localStorage.setItem("Object", JSON.stringify(savedDocuments));
});

let deleteDocContainer = document.querySelector(".delete-doc-container");
let deleteContentContainer = document.querySelector(
  ".delete-content-container"
);
let cantDeleteContainer = document.querySelector(".cant-delete-container");
let deleteContent = document.querySelector(".delete-content");
let cantDeleteContent = document.querySelector(".cantDelete-content");

deleteDocContainer.addEventListener("click", () => {
  deleteDocContainer.style.display = "none";
});

deleteBtn.addEventListener("click", () => {
  deleteDocuments();
});
function deleteDocuments() {
  console.log(savedDocuments[openedFileIndex]);
  deleteDocContainer.style.display = "block";
  console.log(openedFileIndex);
  if (openedFileIndex != 0) {
    cantDeleteContainer.style.display = "none";
    deleteContentContainer.style.display = "block";
    let cancel = document.querySelector(".cancel");
    cancel.addEventListener("click", cancelFunction);
    let deleteFile = document.querySelector(".deleteFile");
    deleteContent.innerHTML = `  Are you sure you want to delete the ‘${savedDocuments[openedFileIndex].name}’ 
document and its contents? This action cannot be reversed.`;
    deleteFile.addEventListener("click", deleteFunction);
  } else {
    deleteContentContainer.style.display = "none";
    cantDeleteContainer.style.display = "block";
    cantDeleteContent.innerHTML = ` You can't delete ‘${savedDocuments[openedFileIndex].name}’ file. You need reserved this acion"`;
    let cancel = document.querySelector(".notCancel");
    cancel.addEventListener("click", cancelFunction);
  }
}

function cancelFunction() {
  deleteDocContainer.style.display = "none";
  cantDeleteContainer.style.display = "none";
  deleteContentContainer.style.display = "none";
}
function deleteFunction() {
  deleteDocContainer.style.display = "none";
  cantDeleteContainer.style.display = "none";
  deleteContentContainer.style.display = "none";

  const allDocument = document.querySelectorAll(".created-doc");
  console.log(deleteContent);

  console.log(openedFileIndex);
  const indexToDelete = openedFileIndex;
  allDocument[openedFileIndex].remove();
  savedDocuments.splice(indexToDelete, 1);
  localStorage.setItem("setIndex", savedDocuments.length);
  localStorage.setItem("Object", JSON.stringify(savedDocuments));
  openedFileIndex = 0;
  localStorage.setItem("setOpenFileIndex", openedFileIndex);
  convertMarkdown(
    savedDocuments[openedFileIndex].content,
    savedDocuments[openedFileIndex].name
  );
}

const previewContentHide = document.querySelector(".heading-preview-content i");
previewContentHide.addEventListener("click", () => {
  if (previewContent.style.display === "block") {
    previewContent.style.display = "none";
    previewContentHide.classList.remove("fa-eye");
    previewContentHide.classList.add("fa-eye-slash");
  } else {
    previewContent.style.display = "block";
    previewContentHide.classList.remove("fa-eye-slash");
    previewContentHide.classList.add("fa-eye");
  }
});

const markdownContentHide = document.querySelector(
  ".heading-markdown-content i"
);
markdownContentHide.addEventListener("click", () => {
  if (markdownContent.style.display === "none") {
    markdownContent.style.display = "block";
    markdownContentHide.classList.add("fa-eye");
  } else {
    markdownContent.style.display = "none";
    markdownContentHide.classList.remove("fa-eye");
    markdownContentHide.classList.add("fa-eye-slash");
  }
});

function findOpenFileDocument() {
  const openFileDocument = document.querySelector(".openFile");
  openFileDocument.classList.remove("openFile");
  const Dosc = document.querySelectorAll(".created-doc");
  Dosc[openedFileIndex].classList.add("openFile");
}

const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
const themeSwitcher = document.querySelector(`input[type= "checkbox"]`);
themeSwitcher.addEventListener("change", () => {
  if (themeSwitcher.checked) {
    document.documentElement.style.setProperty(
      "--header-and-docfile",
      "#F1EB90"
    );
    document.documentElement.style.setProperty("--content-area", "#FAF6F0");
    document.documentElement.style.setProperty("--text-white", "black");
    document.documentElement.style.setProperty("--text-gray", "#132043");
    sun.style.opacity = 1;
    moon.style.opacity = 0;
  } else {
    document.documentElement.style.setProperty(
      "--header-and-docfile",
      "rgb(43, 45, 49)"
    );
    document.documentElement.style.setProperty(
      "--content-area",
      "rgb(21, 22, 25)"
    );
    document.documentElement.style.setProperty("--text-white", "white");
    document.documentElement.style.setProperty(
      "--text-gray",
      "rgb(193, 196, 203)"
    );
    moon.style.opacity = 1;
    sun.style.opacity = 0;
  }
});
