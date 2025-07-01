document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isNewUser = urlParams.get('new');

    const onboardingModal = document.getElementById('onboarding-modal');
    const onboardingForm = document.getElementById('onboarding-form');
    const mainContent = document.querySelector('.dashboard-container');

    if (isNewUser && onboardingModal) {
        mainContent.style.display = 'none';
        onboardingModal.style.display = 'flex';
    }

    if (onboardingForm) {
        onboardingForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const profilePicFile = document.getElementById('profile-pic-upload').files[0];
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (profilePicFile && userInfo && userInfo.token) {
                const formData = new FormData();
                formData.append('profilePic', profilePicFile);

                try {
                    const res = await fetch('/api/upload/profile-pic', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${userInfo.token}`,
                        },
                        body: formData,
                    });

                    const data = await res.json();

                    if (res.ok) {
                        alert('Profile updated successfully!');
                        onboardingModal.style.display = 'none';
                        mainContent.style.display = 'flex';
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else {
                        alert(data.message || 'An error occurred.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Could not connect to the server.');
                }
            } else {
                // Handle case where there's no picture to upload
                onboardingModal.style.display = 'none';
                mainContent.style.display = 'flex';
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        });
    }

    const sidebarNavItems = document.querySelectorAll('.sidebar-nav li');
    const dashboardTabs = document.querySelectorAll('.dashboard-tab-content');
    const rideRequestForm = document.querySelector('.modern-form');
    const destinationInput = document.getElementById('destination');

    sidebarNavItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-target');

            if (targetId) {
                // Update active state in sidebar
                sidebarNavItems.forEach(navItem => navItem.classList.remove('active'));
                this.classList.add('active');

                // Show the correct tab content
                dashboardTabs.forEach(tab => {
                    if (tab.id === targetId) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            }
        });
    });

    if (rideRequestForm) {
        rideRequestForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const destination = destinationInput.value;
            if (destination) {
                alert(`Your ride to ${destination} has been requested!`);
                destinationInput.value = '';
            } else {
                alert('Please enter a destination.');
            }
        });
    }

    const rideRequestCards = document.querySelectorAll('.ride-request-card');
    const modal = document.getElementById('rider-profile-modal');
    const closeButton = document.querySelector('.close-button');
    const modalRiderName = document.getElementById('modal-rider-name');
    const modalRiderRating = document.getElementById('modal-rider-rating');
    const modalAvgRating = document.getElementById('modal-avg-rating');
    const modalReviewsContainer = document.getElementById('modal-reviews-container');

    rideRequestCards.forEach(card => {
        const viewProfileButton = card.querySelector('.view-profile-button');
        const acceptButton = card.querySelector('.accept-button');
        const declineButton = card.querySelector('.decline-button');

        viewProfileButton.addEventListener('click', function() {
            const riderName = card.getAttribute('data-rider-name');
            const riderRating = card.getAttribute('data-rider-rating');
            const avgRating = card.getAttribute('data-avg-rating');
            const reviews = JSON.parse(card.getAttribute('data-reviews'));

            modalRiderName.textContent = riderName;
            modalRiderRating.textContent = riderRating;
            modalAvgRating.textContent = avgRating;

            modalReviewsContainer.innerHTML = '';
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review');

                const reviewHeader = document.createElement('div');
                reviewHeader.classList.add('review-header');
                reviewHeader.innerHTML = `<strong>${review.driver}</strong> <span class="star-rating">${'&#9733;'.repeat(review.stars)}${'&#9734;'.repeat(5 - review.stars)}</span>`;

                const reviewComment = document.createElement('p');
                reviewComment.classList.add('review-comment');
                reviewComment.textContent = review.comment;

                reviewElement.appendChild(reviewHeader);
                reviewElement.appendChild(reviewComment);
                modalReviewsContainer.appendChild(reviewElement);
            });

            modal.style.display = 'block';
        });

        acceptButton.addEventListener('click', function() {
            alert('Ride accepted!');
            // card.remove(); // Temporarily disabled for testing
        });

        declineButton.addEventListener('click', function() {
            alert('Ride declined.');
            // card.remove(); // Temporarily disabled for testing
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
