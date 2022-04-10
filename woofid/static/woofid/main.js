if (document.getElementById('profile_page') != null) {
    const createPetModal = new bootstrap.Modal(document.getElementById('createPetModal'));
    const createPetBtn = document.getElementById('create_pet');
    const checkYourIDsModal = new bootstrap.Modal(document.getElementById('checkYourIDsModal'));
    const checkYourIDsBtn = document.getElementById('yours_ids');

    //open the create pet modal
    createPetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createPetModal.show();
    });

    //clears the form when the modal closes
    createPetModal._element.addEventListener('hidden.bs.modal', function (e) {
        console.log(1);
        //document.querySelector("form").reset();
    });

    //open the checkYourIDsModal
    checkYourIDsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        checkYourIDsModal.show();
    });

    
    
    
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
            
            console.log(data);
           
            if (data.message == 'Success') {
                let info = JSON.parse(data.info);
                console.log(info);

            }else {
                 //toast bootstrap handling...
                const toastEl = document.getElementById('toast-error');
                const toast_error = new bootstrap.Toast(toastEl, []);
                document.querySelector('.toast-error-content').textContent = 'Opps, something went wrong.';
                toast_error.show();

            }

            input.value = ``;
        }catch(error) {
            console.log(error)
        }

    }

}