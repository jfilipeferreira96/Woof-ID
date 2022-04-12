if (document.getElementById('profile_page') != null) {
    const createPetModal = new bootstrap.Modal(document.getElementById('createPetModal'));
    const createPetBtn = document.getElementById('create_pet');
    const checkYourIDsModal = new bootstrap.Modal(document.getElementById('checkYourIDsModal'));
    const checkYourIDsBtn = document.getElementById('yours_ids');
    const form = document.querySelector('form');

    //open the create pet modal
    createPetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ajax_checks_available_ids();
    });

    //clears the form when the modal closes
    createPetModal._element.addEventListener('hidden.bs.modal', function (e) {
        document.querySelector("form").reset();
        document.getElementById('woof_not_activated').innerHTML = ``;
    });

    //open the checkYourIDsModal
    checkYourIDsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ajax_check_ids();
    });

    //devolve todos os ids e apresenta na modal ids
    const ajax_check_ids = async () => {
        
        try {
            const response = await fetch(`/profile_keys`, {
                method: 'GET',
            });
            const data = await response.json();
            
            console.log(data);
           
            if (data.message == 'Success') {

                let ids = data.result_list;
                let html = ``;
                //creates an li with all the woofs_id that this user has
                ids.forEach(id => {
                    html += ` <li>${id.woofid}</li>`;
                });
                document.getElementById('list_of_woofs_ids').innerHTML = html;

                checkYourIDsModal.show();
            }
            
        }catch(error) {
            console.log(error)
        }
    }

    //devolver os ids disponiveis ao abrir a modal criar profile
    const ajax_checks_available_ids = async () => {
        
        try {
            const response = await fetch(`/available_keys`, {
                method: 'GET',
            });
            const data = await response.json(); 
            //console.log(data);
            let select = document.getElementById('woof_not_activated');

            if (data.message == 'Success') {
                let ids = data.result_list;
                let html = `<option value="" disabled selected>Available Woof ID's</option>`;

                if (ids.length > 0) {

                    ids.forEach(id => {
                        html += ` <option class="warning" value="${id.woofid}">${id.woofid}</option>`;
                    });
                    
                } else {
                    html = ` <option value="" class="warning">There is no Woof Id's available.</option>`;
                }
                //at last, adds the <option> to the select field
                select.insertAdjacentHTML('beforeend', html);
            }

            createPetModal.show();
        }catch(error) {
            console.log(error)
        }
    }

    /* Pedido async que grava o create a profile pet */

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //Poderia ainda fazer uma validação e limpeza dos inputs tanto no backend como no frontend...
        create_profile();
    });

   
    const create_profile = async () => {
        console.log(document.getElementById('photoUpload').files[0]);
        console.log(document.getElementById('photoUpload').files);
        console.log(JSON.stringify({ 'teste': document.getElementById('photoUpload').files[0] }));
        try {
            const response = await fetch('/profile', {
                method: 'POST',
                headers: {
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: ({
                    "pet_name": document.getElementById('petName').value,
                    "image": document.getElementById('photoUpload').files[0],
                    "woofid": document.getElementById('woof_not_activated').value,
                    "owners_name": document.getElementById('ownerName').value,
                    "country": document.getElementById('country').value,
                    "zip": document.getElementById('zip').value,
                    "address": document.getElementById('address').value,
                    "phone": document.getElementById('phoneNumber').value,
                    "email": document.getElementById('email').value,
                    "additional": document.getElementById('addInformation').value
                })
               
            });
            const data = await response.json();
            
            console.log(data);
        
            if (data.message == 'Success') {
                //toast bootstrap handling... 
                const toastEl = document.getElementById('toast-success');
                const toast_success = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-success-content').textContent = 'Your Woof ID is now activated!';
                toast_success.show();

                createPetModal.hide();
                
            } else {
                //toast bootstrap handling...
                const toastEl = document.getElementById('toast-error');
                const toast_error = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-error-content').textContent = 'Opps, something went wrong.';
                toast_error.show();
            }

        }catch(error) {
            console.log(error)
        } 
    }
    
}
if (document.getElementById('auth_page') != null) {
    const form = document.querySelector('form');
    const input = document.getElementById('auth');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if(input.value.length < 7) return;

        authentication_id(input.value, e.target[0].value);
    });

    const authentication_id = async (content, csrftoken) => {
        
        try {
            const response = await fetch(`/authentication`, {
                method: 'PUT',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
                },
                body: JSON.stringify({
                    "woofid": content
                })
            });
            const data = await response.json();
            
            console.log(data);
           
            if (data.message == 'Success') {
                //toast bootstrap handling... 
                const toastEl = document.getElementById('toast-success');
                const toast_success = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-success-content').textContent = 'Your Woof ID is now activated!';
                toast_success.show();
            }
            else {
                 //toast bootstrap handling...
                const toastEl = document.getElementById('toast-error');
                const toast_error = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-error-content').textContent = 'Opps, something went wrong.';
                toast_error.show();
            }

            
        }catch(error) {
            console.log(error)
        }

         input.value = ``;
    }

}

if (document.getElementById('getmehome') != null) {

    const form = document.querySelector('form');
    const input = document.getElementById('woofid_input');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (input.value.length < 7) return;
        
        authentication_id(input.value, e.target[0].value);
    });

    const authentication_id = async (content, csrftoken) => {
        
        try {
            const response = await fetch(`/get-me-home`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
                },
                body: JSON.stringify({
                    "woofid": content
                })
            });
            const data = await response.json();
            
            if (data.message == 'Success') {
                //resets the html that we created in the past search
                document.querySelector('.single-testimonial > div') != null ? document.querySelector('.single-testimonial > div').innerHTML = '' : '';

                let info = JSON.parse(data.info);
                console.log(info);

                //Handling of the page layout sections
                document.getElementById('getmehome').style = "min-height: 50vh;"
                document.getElementById('info').classList.remove('d-none');

                //creating the html 
                let html_card = `
                    <div class="section-title text-center">
                      <div class="round-profile">
                      <img src="${document.location.origin}/static/${info.image}" alt="Circle Image Pet" class="pet-image rounded-circle img-fluid">
                    </div>
                    <div class="info">
                      <h4 id="pets_name">${info.pet_name}</h4>
                      <div class="text-center content mt-3">
                        <p><i class="fas fa-user-alt mx-2"></i>${info.owner}</p>
                        <p><i class="fa fa-phone mx-2"></i>${info.phone}</p>
                        <p><i class="fa fa-envelope mx-2"></i>${info.email}</p>
                        <p><i class="fa fa-map-marker-alt mx-2"></i>${info.address} - ${info.zip_code}, ${info.country}</p>
                        <p class="">${info.additional}</p>
                      </div>
                    </div>    
                `;

                document.querySelector('.single-testimonial').insertAdjacentHTML('beforeend', html_card);

            }else {
                //toast bootstrap handling...
                const toastEl = document.getElementById('toast-error');
                const toast_error = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-error-content').textContent = 'Opps, something went wrong.';
                toast_error.show();
                //Handling of the page layout sections
                if (!document.getElementById('info').classList.contains('d-none')) {
                    document.getElementById('getmehome').style = "min-height: 100vh;"
                    document.getElementById('info').classList.add('d-none');
                }
                
            }

            input.value = ``;
        }catch(error) {
            console.log(error)
        }

    }

}