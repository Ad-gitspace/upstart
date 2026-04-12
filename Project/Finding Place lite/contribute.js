document.getElementById('contributeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Clear previous messages
    statusMessage.className = 'message-box';
    statusMessage.textContent = '';

    // Process images
    const imageFiles = document.getElementById('images').files;
    
    if (imageFiles.length > 100) {
        statusMessage.textContent = '❌ Error: You can only upload a maximum of 100 images.';
        statusMessage.className = 'message-box message-error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Contribution';
        return;
    }

    const imagesArray = [];
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
            reader.onload = (e) => resolve({
                name: file.name,
                type: file.type,
                dataUrl: e.target.result
            });
            reader.readAsDataURL(file);
        });
        imagesArray.push(await base64Promise);
    }

    // Gather form data
    const contributionData = {
        name: document.getElementById('templeName').value.trim(),
        location: {
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            district: document.getElementById('district').value.trim()
        },
        details: {
            Deity: document.getElementById('deity').value.trim(),
            Architecture_Style: document.getElementById('architecture').value.trim(),
            Nearest_City: document.getElementById('nearestCity').value.trim()
        },
        description: document.getElementById('description').value.trim(),
        images: imagesArray,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch('/api/contribute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contributionData)
        });

        const result = await response.json();

        if (response.ok) {
            statusMessage.textContent = '🙏 Thank you! Your contribution has been submitted successfully.';
            statusMessage.className = 'message-box message-success';
            document.getElementById('contributeForm').reset();
        } else {
            throw new Error(result.error || 'Failed to submit contribution.');
        }

    } catch (error) {
        statusMessage.textContent = `❌ Error: ${error.message}`;
        statusMessage.className = 'message-box message-error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Contribution';
    }
});
