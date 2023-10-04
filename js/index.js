
const BASEURL = "http://127.0.0.1:5000"
let buttonDeleteIsActive = false;


async function getFood () {
   try {
      const response = await fetch(BASEURL + '/foods')
      const data = await response.json()
      return data
   } catch (error) {
      console.log('Ops, ocorreu um erro inesperado ao fazer a requisição com API!')
      throw error
   }
}


async function createCards () {
   const dataResponse = await getFood()

   for (let i = 0; i < dataResponse.length; i++) {
      cards({
         id: dataResponse[i].id,
         title: dataResponse[i].name,
         image: dataResponse[i].image,
         price: dataResponse[i].price
      })
   }
}


function cards ({ id, title, price, image }) {
   const cardContainer = document.querySelector(".card-container")
   const contents = `
   <div class="card" data-id="${id}">
      <img src="${image}" width="250px" height="250px">
      <h2>${title}</h2>
      <p>R$${price}</p>
   </div>`
   cardContainer.innerHTML += contents
}


function cleanCards () {
   const cardContainer = document.querySelector(".card-container")
   cardContainer.innerHTML = ""
}


function closeModal () {
   const modalContainer = document.querySelector(".modal-overlay")
   modalContainer.remove()
}


function desabaleButton () {
   const buttonPostMenu = document.querySelector(".post-button")
   buttonPostMenu.innerHTML = "publicando..."
   buttonPostMenu.setAttribute("disabled", true)
}


async function postData () {
   const name = document.querySelector('#name')
   const price = document.querySelector('#price')
   const image = document.querySelector('#image')

   const data = {
      "name": name.value,
      "price": price.value,
      "image": image.value
   }

   if (name.value != "" && price.value != "" && image.value != "") {
      try {
         await fetch(BASEURL + '/save-food', {
            method: "POST",
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
         })
         desabaleButton()
      } catch (error) {
         console.log('Ops, ocorreu um erro inesperado ao fazer a requisição com API!')
         console.log(error)
      } finally {
         closeModal()
         cleanCards()
         createCards()
      }
   }
}


function createModal () {
   const modalContainer = document.querySelector(".modal-container")
   const contents = `
   <div class="modal-overlay">
      <div class="modal-body">
         <button onClick="closeModal()" class="button-close-modal">X</button>
         <h2>Cadastre um novo item ao cardápio</h2>
         <form class="input-container">
            <label for="name">name</label>
            <input type="text" id="name" name="name" required>
            <label for="price">preço</label>
            <input type="text" id="price" name="price" required>
            <label for="image">imagem</label>
            <input type="url" id="image" name="image" required>
         </form>
         <button type="submit" onClick="postData()" class="post-button">publicar</button>
      </div>
   </div>`
   modalContainer.innerHTML += contents
}


async function sendDeleteCard(cardID){
   try {
      const response = await fetch(BASEURL + `/delete/food/${cardID}`, {
         method: "DELETE",
      })
      const data = await response.json()
      return response.status
   } catch (error) {
      console.log('Ops, ocorreu um erro inesperado ao fazer a requisição com API!')
      throw error
   }
}


function addButtonDeleteCard () {

   const cardContainer = document.querySelector(".card-container")

   cardContainer.childNodes.forEach((card, index) => {
      // Verificar se o nó é um elemento HTML
      if (card.nodeType === 1) {
         // Criar o botão de exclusão
         const deleteButton = document.createElement("button");
         deleteButton.classList.add("button-delete-card");
         deleteButton.innerText = "delete";

         // Adicionar um ouvinte de evento para excluir o card
         deleteButton.addEventListener("click", async () => {
            const id =  card.dataset.id
            const response = await sendDeleteCard(id)
            console.log(response)
            if(response == 200){
               cardContainer.removeChild(card);
               console.log(`Card ${index + 1} deleted`);
            }
         });

         // Adicionar o botão de exclusão ao card
         card.appendChild(deleteButton);
      }
   });
}


function removeButtonDeleteCard () {
   const deleteButtons = document.querySelectorAll(".button-delete-card");

   // Itera sobre os botões e remove cada um deles
   deleteButtons.forEach((button) => {
      // Obtém o elemento pai (o card) e remove o botão dele
      const card = button.closest(".card");
      if (card) {
         card.removeChild(button);
      }
   });
}


function buttonActiveDeleteCard () {
   const buttonTrash = document.querySelector(".button-trash")
   buttonDeleteIsActive = !buttonDeleteIsActive;

   if (buttonDeleteIsActive) {
      buttonTrash.style.backgroundColor = "rgb(245, 207, 207)"
      addButtonDeleteCard()
   } else {
      buttonTrash.style.backgroundColor = "#fff"
      removeButtonDeleteCard()
   }
}



createCards()

