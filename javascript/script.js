const runButton = document.getElementById('runButton');
const saveButton = document.getElementById('saveButton');
const expandButton = document.getElementById('expandButton');
const themeButton = document.getElementById('themeButton');
const orientButton = document.getElementById('orientButton');
const preview = document.getElementById('preview-frame');
const outputArea = document.getElementById('outputArea');
const body = document.body;
const container = document.getElementById('mainContainer');

const fileTabs = document.getElementById("fileTabs");
const addFile = document.getElementById("addFile");
let fileCount = 1;

function switchTab(fileId){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.querySelectorAll("textarea").forEach(e=>e.classList.remove("active"));
  const tab=document.querySelector(`.tab[data-file='${fileId}']`);
  if(tab) tab.classList.add("active");
  const editor=document.getElementById("editor-"+fileId);
  if(editor) editor.classList.add("active");
}

addFile.addEventListener("click",()=> {
  fileCount++;
  const fileId="file"+fileCount;
  const fileName="file"+fileCount+".html";
  const newTab=document.createElement("div");
  newTab.className="tab";
  newTab.dataset.file=fileId;
  newTab.dataset.name=fileName;
  newTab.innerHTML=`<span class="tab-name">${fileName}</span> <span class="close-btn">×</span>`;
  fileTabs.insertBefore(newTab, addFile);
  const newEditor=document.createElement("textarea");
  newEditor.id="editor-"+fileId;
  newEditor.value="<!-- New file "+fileCount+" -->";
  document.querySelector(".code-area").appendChild(newEditor);
  switchTab(fileId);
});

fileTabs.addEventListener("click",(e)=>{
  if(e.target.classList.contains("close-btn")){
    const tab=e.target.parentElement;
    const fileId=tab.dataset.file;
    document.getElementById("editor-"+fileId).remove();
    tab.remove();
    switchTab("file1");
  } else if(e.target.classList.contains("tab")&&!e.target.classList.contains("add-tab")){
    switchTab(e.target.dataset.file);
  }
});

// 👉 Ithu kuda add pannunga
fileTabs.addEventListener("dblclick",(e)=>{
  if(e.target.classList.contains("tab-name")){
    const tab = e.target.parentElement; 
    const oldName = tab.dataset.name;
    const newName = prompt("Enter new file name:", oldName);
    if(newName && newName.trim() !== ""){
      tab.dataset.name = newName.trim();
      e.target.textContent = newName.trim();
    }
  }
});


function runCode(){
  const editors=document.querySelectorAll("textarea");
  let htmlContent="", cssContent="", jsContent="";
  editors.forEach(editor=>{
    const name=editor.id.replace("editor-","");
    const tab=document.querySelector(`.tab[data-file='${name}']`);
    if(!tab) return;
    const fileName=tab.dataset.name;
    const code=editor.value;
    if(fileName.endsWith(".html")) htmlContent=code;
    else if(fileName.endsWith(".css")) cssContent+=code;
    else if(fileName.endsWith(".js")) jsContent+=code;
  });
  if(cssContent) htmlContent=htmlContent.replace('</head>',`<style>${cssContent}</style></head>`);
  if(jsContent) htmlContent=htmlContent.replace('</body>',`<script>${jsContent}<\/script></body>`);
  preview.srcdoc=htmlContent;
}

function saveCode(){
  const activeTab=document.querySelector(".tab.active");
  const activeEditor=document.querySelector("textarea.active");
  if(!activeTab||!activeEditor) return;
  const fileName=activeTab.dataset.name;
  const code=activeEditor.value;
  const blob=new Blob([code],{type:"text/plain"});
  const link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download=fileName;
  link.click();
  alert(fileName+" saved!");
}

function toggleExpand(){ outputArea.classList.toggle("fullscreen"); }
function toggleTheme(){ body.classList.toggle("light"); }
function toggleOrientation(){ container.classList.toggle("side"); container.classList.toggle("top"); }

runButton.addEventListener("click",runCode);
saveButton.addEventListener("click",saveCode);
expandButton.addEventListener("click",toggleExpand);
themeButton.addEventListener("click",toggleTheme);
orientButton.addEventListener("click",toggleOrientation);

window.addEventListener("load",()=>{
  const editors=document.querySelectorAll("textarea");
  editors.forEach(editor=>{
    const name=editor.id.replace("editor-","");
    const tab=document.querySelector(`.tab[data-file='${name}']`);
    if(tab && localStorage.getItem("saved-"+tab.dataset.name)) editor.value=localStorage.getItem("saved-"+tab.dataset.name);
  });
  runCode();
});

// ------------------- Login/Register JS -------------------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profileSection = document.getElementById("profileSection");
const profileName = document.getElementById("profileName");
const authModal = document.getElementById("authModal");
const authMessage = document.getElementById("authMessage");
const loginTabBtn = document.getElementById("loginTabBtn");
const registerTabBtn = document.getElementById("registerTabBtn");

let authMode = "login";

loginBtn.addEventListener("click",()=>openAuth("login"));
loginTabBtn.addEventListener("click",()=>switchTabMode("login"));
registerTabBtn.addEventListener("click",()=>switchTabMode("register"));

function openAuth(mode){
  authModal.style.display="flex";
  switchTabMode(mode);
  clearFields();
  authMessage.textContent="";
}

function switchTabMode(mode){
  authMode = mode;
  if(mode==="login"){
    loginTabBtn.classList.add("active");
    registerTabBtn.classList.remove("active");
    document.getElementById("loginFields").style.display="block";
    document.getElementById("registerFields").style.display="none";
  } else {
    loginTabBtn.classList.remove("active");
    registerTabBtn.classList.add("active");
    document.getElementById("loginFields").style.display="none";
    document.getElementById("registerFields").style.display="block";
  }
}

function clearFields(){
  document.getElementById("loginEmail").value="";
  document.getElementById("loginPassword").value="";
  document.getElementById("regName").value="";
  document.getElementById("regEmail").value="";
  document.getElementById("regPassword").value="";
  document.getElementById("regConfirmPassword").value="";
}

document.getElementById("authSubmit").addEventListener("click", ()=>{
  if(authMode==="login"){
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if(!email || !password){ authMessage.textContent="Enter email & password!"; return; }
    let users = JSON.parse(localStorage.getItem("users") || "{}");
    if(!users[email] || users[email].password !== password){
      authMessage.textContent="Invalid credentials!";
      return;
    }
    loginUser(users[email].name, email);
  } else { 
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const confirm = document.getElementById("regConfirmPassword").value.trim();
    if(!name || !email || !password || !confirm){ authMessage.textContent="All fields required!"; return; }
    if(password !== confirm){ authMessage.textContent="Passwords do not match!"; return; }
    let users = JSON.parse(localStorage.getItem("users") || "{}");
    if(users[email]){ authMessage.textContent="Email already registered!"; return; }
    users[email] = { name, password };
    localStorage.setItem("users", JSON.stringify(users));
    authMessage.style.color="green";
    authMessage.textContent="Registration successful! Please login.";
    switchTabMode("login");
  }
});

function loginUser(name, email){
  localStorage.setItem("currentUser", JSON.stringify({name,email}));
  profileName.textContent="👤 "+name;
  profileSection.style.display="flex";
  loginBtn.style.display="none";
  authModal.style.display="none";
}

logoutBtn.addEventListener("click",()=>{
  localStorage.removeItem("currentUser");
  profileSection.style.display="none";
  loginBtn.style.display="inline-block";
});

window.addEventListener("load",()=>{
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if(currentUser){ loginUser(currentUser.name, currentUser.email); }
});

authModal.addEventListener("click",(e)=>{ if(e.target===authModal) authModal.style.display="none"; });