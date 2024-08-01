document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.querySelector("#create-btn");
    addBtn.addEventListener('click', createEvent);

    function taskNerde(task) {
        const taskList = document.querySelector('#tasklist');
        const tr = document.createElement('tr');

        const name = document.createElement('td');
        name.classList.add('new-name');
        name.textContent = task.name;
        tr.appendChild(name);

        const city = document.createElement('td');
        city.classList.add('new-city');
        city.textContent = task.city;
        tr.appendChild(city);

        const age = document.createElement('td');
        age.classList.add('new-age');
        age.textContent = task.age;
        tr.appendChild(age);

        const actionCell = document.createElement('td');
        actionCell.classList.add('action-td');
        const editSpan = document.createElement('span');
        editSpan.textContent = 'Edit';
        editSpan.classList.add('edit');
        actionCell.appendChild(editSpan);
        const deleteSpan = document.createElement('span');
        deleteSpan.textContent = 'Delete';
        deleteSpan.classList.add('delete');
        actionCell.appendChild(deleteSpan);
        tr.appendChild(actionCell);


        function Delete(taskId){
            fetch(`https://66a7891653c13f22a3d01a89.mockapi.io/tasks/${taskId}`,{
                method:"DELETE",
            })
            .then(res=>{
                if(res.ok){
                    console.log("Task başarıyla silindi:",task);
                    const taskRow= document.querySelector(`
                    [data-task-id]=${taskId}`
                    );
                    if(taskRow){
                        taskRow.remove();
                    }
                }
            })
            .catch(error=>{
                console.error("HATA:",error);
            });
        }

        deleteSpan.setAttribute('data-task-id', task.id);
        deleteSpan.addEventListener('click', ()=>{
            const deleteId= deleteSpan.getAttribute('data-task-id');
            Delete(deleteId);
            taskList.removeChild(tr);
        });



        function editCell(tdElement){
            const input= document.createElement('input');
            input.type="text";
            input.classList.add('input-edit');

            input.value= tdElement.textContent;
            tdElement.textContent="";
            tdElement.appendChild(input);

            return input;
            /*Burada edit ortamını hazırladı. td içindeki değeri inputa aktardı ve inputu da td nin içine aldı*/
        }

        function Edit(taskId, tr){
            const nameCell= tr.querySelector(".new-name");
            const cityCell= tr.querySelector('.new-city');
            const ageCell= tr.querySelector('.new-age');

            const nameInput=editCell(nameCell);
            const cityInput= editCell(cityCell);
            const ageInput=editCell(ageCell);

            const editBtn= tr.querySelector('.edit');
            editBtn.textContent="Save";

            function saveClick(){
                const updateName= nameInput.value;
                const updateCity= cityInput.value;
                const updateAge= ageInput.value;

                const updateData= {
                    name: updateName,
                    age: updateAge,
                    city: updateCity,
                }

                fetch(`https://66a7891653c13f22a3d01a89.mockapi.io/tasks/${taskId}`,{
                    method: "PUT",
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify(updateData),
                })
                .then(res=>{
                    if(res.ok){
                        return res.json();
                    }
                })
                .then(task=>{
                    console.log("Task başarıyla güncellendi:",updateData);
                    nameCell.textContent= updateName;
                    ageCell.textContent= updateAge;
                    cityCell.textContent= updateCity;
                    editBtn.textContent="Edit";
                    editBtn.removeEventListener('click', saveClick)
                    editBtn.addEventListener('click', editClick)

                })


            }
            function editClick(){
                editBtn.removeEventListener('click', editClick);
                editBtn.addEventListener('click', saveClick);
            }
            editBtn.removeEventListener('click', editClick);
            editBtn.addEventListener('click', saveClick);
        }

        editSpan.setAttribute('data-task-id', task.id);
        editSpan.addEventListener('click',()=>{
            const editId= editSpan.getAttribute('data-task-id');
            Edit(editId,tr);
        })


        taskList.appendChild(tr);
    }


    function createEvent() {
        const nameTextBox = document.querySelector('#name');
        const cityTextBox = document.querySelector('#city');
        const ageTextBox = document.querySelector('#age');

        if (nameTextBox.value.trim() === "" || cityTextBox.value.trim() === "" || ageTextBox.value.trim() === "") {
            console.log('Textboxes cannot be empty!');
            alert('Lütfen alanları boş bırakmayın!');
            return;
        }

        const newTask = {
            name: nameTextBox.value,
            age: ageTextBox.value,
            city: cityTextBox.value,
        };

        fetch(`https://66a7891653c13f22a3d01a89.mockapi.io/tasks`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newTask),
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(task => {
            console.log("New task added:", task);
            taskNerde(task);
        })
        .catch(error => {
            console.error('HATAAA: ', error);
        });

        nameTextBox.value = "";
        cityTextBox.value = "";
        ageTextBox.value = "";
    }

    function loadTasksFromAPI() {
        fetch(`https://66a7891653c13f22a3d01a89.mockapi.io/tasks`)
        .then(res => res.json())
        .then(tasks => {
            tasks.forEach(task => {
                taskNerde(task);
            });
        })
        .catch(error => {
            console.error('API yüklenirken hata oluştu: ', error);
        });
    }

    loadTasksFromAPI();

    function saveTasksToLocalStorage() {
        const tasks = Array.from(document.querySelectorAll(".new-name")).map(
        (nameCell) => {
            const tr = nameCell.parentElement;
            return {
                name: nameCell.textContent,
                age: tr.querySelector(".new-age").textContent,
                city:tr.querySelector(".new-city").textContent,
            };
        }
        );
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    window.addEventListener("beforeunload", () => {
        saveTasksToLocalStorage();
    });
});
