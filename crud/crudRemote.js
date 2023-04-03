const baseUrl = "https://crudcrud.com/api/76eefe477cbd49e3a4994efb1e08748a";

function saveLocal(lista) {
  localStorage.setItem("@itemstore", JSON.stringify(lista));
}

function getLocal() {
  return JSON.parse(localStorage.getItem("@itemstore")) || [];
}

function saveRemote(item) {
  return fetch(`${baseUrl}/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

function deleteRemote(id) {
    return fetch(`${baseUrl}/item/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
}

function updateRemote(id, newitem) {
    return fetch(`${baseUrl}/item/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(newitem),
    });
}

async function getAll() {
  const response = await fetch(`${baseUrl}/item`);
  const data = await response.json();
  return data;
}

async function onclickTrash(item) {
    await deleteRemote(item);
    const list = await getAll();
    saveLocal(list)
    createItemsList(list);
};

async function EditSubmit(id) {
    console.log(id)
    const nomeEl = document.getElementById("itemNameEdit");
    const precoEl = document.getElementById("itemPriceEdit");
    const nome = nomeEl.value;
    const preco = precoEl.value;

    if (nome === "") return;
    if (preco === "") return;

    const item = { name: nome, price: preco };

    console.log(item);

    await updateRemote(id, item);
    const list = await getAll();
    saveLocal(list)
    createItemsList(list);
}

async function onclickEdit(id) {
    const list = await getAll();
    const ul = document.querySelector("ul");
    ul.innerHTML = "";

    console.log(id)
    list.map((item) => {
        if (item._id === id) {
            ul.innerHTML += 
            `<li>
                <p><b>Edit item ${item.name}</b></p>
                <div>
                    <input id="itemNameEdit" type="text" placeholder="Item name" value=${item.name}>
                <div>
                <div>
                    <input id="itemPriceEdit" type="number" placeholder="Item price" value=${item.price}> 
                </div>
                <button onclick='EditSubmit(${JSON.stringify(item._id)})'>Save</button>
            </li>
            
            `
        } else {
            ul.innerHTML += 
            `<li>
                ${item.name} - R$${item.price}  
                <button onclick='onclickTrash(${JSON.stringify(item._id)})'><i class="fa fa-trash-o"></i></button>
                <button onclick='onclickEdit(${JSON.stringify(item._id)})'><i class="fa fa-edit"></i></button>
            </li>`
        }
      });
}

function createItemsList(list) {

  const ul = document.querySelector("ul");
  ul.innerHTML = "";
  list.map((item) => {
    ul.innerHTML += 
    `<li>
        ${item.name} - R$${item.price}  
        <button onclick='onclickTrash(${JSON.stringify(item._id)})'><i class="fa fa-trash-o"></i></button>
        <button onclick='onclickEdit(${JSON.stringify(item._id)})'><i class="fa fa-edit"></i></button>
    </li>`
  });
}

async function onSubmit() {
  resetError();
  event.preventDefault();
  const nomeEl = document.getElementById("itemName");
  const precoEl = document.getElementById("itemPrice");
  const nome = nomeEl.value;
  const preco = precoEl.value;

  let list = await getAll();

  if (verifyEntry(nome, preco)) {
    return
  }

  if (verifyItemAlreadyExists(nome, list)) {
    return
  }

  const item = { name: nome, price: preco };

  await saveRemote(item);
  list = await getAll();
  saveLocal(list)
  createItemsList(list);

  nomeEl.value = "";
  precoEl.value = "";
}

window.onload = async () => {
  resetError();
  let list = ''

  if (getLocal().length !== 0) {
    console.log(getLocal())
    list = getLocal()
  } else {
    list = await getAll(); 
  }
  createItemsList(list);
};

function verifyItemAlreadyExists(item,lista) {
  if (lista.find((a) => a.name === item)) {
    document.querySelector("#errorNameExists").style.display = "inline";
    return true
  } else {
    return false
  }
}

function verifyEntry (entryname, entryprice) {
  let deuErro = false
  if (entryname == "") {
    document.querySelector("#errorName").style.display = "inline";
    deuErro = true
  }
  if (entryprice == "") {
    document.querySelector("#errorPrice").style.display = "inline";
    deuErro = true
  }
  return deuErro
}

function resetError() {
  document.querySelectorAll(".error").forEach((el) => {
      el.style.display = 'none'
  });
}