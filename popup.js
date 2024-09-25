document.getElementById('startScraping').addEventListener('click',  () => {
    // Get the LinkedIn profile URLs from the textarea
    const linksText = document.getElementById('links').value;
    const links = linksText.split('\n').map(link => link.trim()).filter(link => link);


    // Ensure the user provides at least 3 LinkedIn profile links
    if (links.length < 3) {
        alert('Please enter at least 3 LinkedIn profile links.');
        return;
    }

    // Start opening LinkedIn profiles sequentially
    openProfilesSequentially(links, 0);
});

// Function to open LinkedIn profiles one by one with a delay
function openProfilesSequentially(links, index) {
    if (index >= links.length) {
        // If all profiles have been opened, stop the function
        console.log("All profiles opened.");
        return;
    }

    let link = links[index];

    // Ensure the URL starts with "http" or "https"
    if (!link.startsWith('http')) {
        link = 'https://' + link;
    }

    // Open the LinkedIn profile in a new tab
    chrome.tabs.create({ url: link }, (tab) => {
        console.log(`Opened LinkedIn profile: ${link}`);

        // Inject the scraping script after the tab is opened
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: scrapeLinkedInProfile
        });
    });

    // Delay for opening the next tab (10 seconds per profile to avoid rate limiting)
    setTimeout(() => {
        openProfilesSequentially(links, index + 1); // Open the next profile after the delay
    }, 30000); 
}

// Scrape the LinkedIn profile information
function scrapeLinkedInProfile() {
  

    const name = document.querySelector('h1.t-24')?.innerText || 'N/A';
    const location = document.querySelector('span.text-body-small')?.innerText || 'N/A';
    const about = document.querySelector('.about__description')?.innerText || 'N/A';
    const bio = document.querySelector('.text-body-medium')?.innerText || 'N/A';
    const followerCount = parseInt(document.querySelector('.t-black--light.t-bold')?.innerText) || 0;
    const connectionCount = parseInt(document.querySelector('.t-bold')?.innerText) || 0;

    const profileData = {
        name,
        url: window.location.href,
        about,
        bio,
        location,
        followerCount,
        connectionCount
    };

    console.log('Scraped profile data:', profileData);

    // Send the profile data to the Node.js API
    fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    })
    .then(response => response.json())
    .then(data => console.log('Profile data posted successfully:', data))
    .catch(error => console.error('Error posting profile data:', error));
}



