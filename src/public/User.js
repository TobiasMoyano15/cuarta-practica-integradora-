
document.addEventListener('DOMContentLoaded', function () {
    const volverBtn = document.querySelector('#volverBtn');
    volverBtn.addEventListener('click', async () => {
        window.location.href = '/products';
    });

    const handleFileUpload = (formId, suffix) => {
        const form = document.getElementById(formId);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            formData.append('suffix', suffix);
            console.log(formData)

            const uid = document.getElementById('user-details').getAttribute('data-uid');
            try {
                const response = await fetch(`/api/users/${uid}/documents`, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    alert('Archivo subido correctamente');
                } else {
                    const errorText = await response.text();
                    alert('El archivo no se subió: ' + errorText);
                }
            } catch (error) {
                console.error('Error al subir el archivo:', error);
                alert('El archivo no se subió');
            }
        });
    };

    handleFileUpload('uploadProfileFiles', 'Profile');
    handleFileUpload('uploadProductsFiles', 'Product');
    handleFileUpload('uploadDocumentsFiles', 'Document');
    handleFileUpload('uploadId', 'Id');
    handleFileUpload('uploadAddressDocument', 'AddressDocument');
    handleFileUpload('uploadAccountStatusDocument', 'AccountStatusDocument');
});