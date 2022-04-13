if (document.getElementById('profile_page') != null) {
    const createPetModal = new bootstrap.Modal(document.getElementById('createPetModal'));
    const editPetModal = new bootstrap.Modal(document.getElementById('editPetModal'));
    const createPetBtn = document.getElementById('create_pet');
    const checkYourIDsModal = new bootstrap.Modal(document.getElementById('checkYourIDsModal'));
    const checkYourIDsBtn = document.getElementById('yours_ids');
    const form = document.querySelector('#submit_form');
    const edit_form = document.querySelector('#edit_form');

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

        let formData = new FormData();
        formData.append('pet_name', document.getElementById('petName').value);
        formData.append('image',document.getElementById('photoUpload').files[0]);
        formData.append('woofid', document.getElementById('woof_not_activated').value);
        formData.append('owners_name', document.getElementById('ownerName').value);
        formData.append('country', document.getElementById('country').value);
        formData.append('zip', document.getElementById('zip').value);
        formData.append('address', document.getElementById('address').value);
        formData.append('phone', document.getElementById('phoneNumber').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('additional', document.getElementById('addInformation').value);

        try {
            const response = await fetch('/profile', {
                method: 'POST',
                body: formData
               
            });
            const data = await response.json();
            
            console.log(data);
        
            if (data.message == 'Success') {
                //toast bootstrap handling... 
                const toastEl = document.getElementById('toast-success');
                const toast_success = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-success-content').textContent = 'Profile was created!';
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
    
    /* #########
        PROFILE EDIT
    ########### */

    function profile_edit(profile_id) {
        async_profile_edit(profile_id);
    } 

    const async_profile_edit = async (profile_id) => {

        try {
            const response = await fetch(`/edit_pet_profile/${profile_id}`, {
                method: 'GET',
            });
            
            const data = await response.json();
            
            console.log(data);
           
            if (data.message == 'Success') {
                let info = JSON.parse(data.pet_to_edit);
                //console.log(info);

                //fills the inputs with the recived data
                document.getElementById('petNameEdit').value = info.pet_name;
                document.getElementById('woof_not_activated_edit').value = data.woofid;
                document.getElementById('woof_not_activated_edit').disabled = true;
                document.getElementById('ownerNameEdit').value = info.owner;
                document.getElementById('countryEdit').value = info.country;
                document.getElementById('zipEdit').value = info.zip_code;
                document.getElementById('addressEdit').value = info.address;
                document.getElementById('phoneNumberEdit').value = info.phone;
                document.getElementById('emailEdit').value = info.email;
                document.getElementById('addInformationEdit').value = info.additional;

                //sets the id atritube on the form and opens up the modal
                edit_form.setAttribute('data-id', profile_id);
                editPetModal.show();
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

    edit_form.addEventListener('submit', (e) => {
        e.preventDefault();

        edit_profile(edit_form.getAttribute('data-id'));
    });



    const edit_profile = async (profile_id) => {
        
        //Poderia ainda fazer uma validação e limpeza dos inputs tanto no backend como no frontend...
        let formData = new FormData();
        formData.append('pet_name', document.getElementById('petNameEdit').value);
        formData.append('image',document.getElementById('photoUploadEdit').files[0]);
        formData.append('woofid', document.getElementById('woof_not_activated_edit').value);
        formData.append('owners_name', document.getElementById('ownerNameEdit').value);
        formData.append('country', document.getElementById('countryEdit').value);
        formData.append('zip', document.getElementById('zipEdit').value);
        formData.append('address', document.getElementById('addressEdit').value);
        formData.append('phone', document.getElementById('phoneNumberEdit').value);
        formData.append('email', document.getElementById('emailEdit').value);
        formData.append('additional', document.getElementById('addInformationEdit').value);

        try {
            const response = await fetch(`edit_pet_profile/${profile_id}`, {
                method: 'POST',
                body: formData
               
            });
            const data = await response.json();
            
            console.log(data);
        
            if (data.message == 'Success') {
                //toast bootstrap handling... 
                const toastEl = document.getElementById('toast-success');
                const toast_success = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-success-content').textContent = 'Success!';
                toast_success.show();

                editPetModal.hide();
                
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

                //<img src="${document.location.origin}/static/${info.image}" alt="Circle Image Pet" class="pet-image rounded-circle img-fluid">

                //creating the html 
                let html_card = `
                    <div class="section-title text-center">
                      <div class="round-profile">
                      <img src="${document.location.origin}/static/${info.image}" alt="Circle Image Pet" class="rounded mx-auto d-block img-fluid">
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