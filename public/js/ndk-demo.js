import NDK from "@nostr-dev-kit/ndk";
import markdownit from "markdown-it";

// Initialize NDK
const ndk = new NDK({
    explicitRelayUrls: [
        'wss://relay.damus.io',
        'wss://relay.nostr.band',
        'wss://relay.primal.net'
    ]
});

// Initialize markdown-it
const md = markdownit({
    html: true,
    linkify: true,
    typographer: true
});

// Cache for profile names
const profileCache = new Map();

// Function to fetch profile name
async function fetchProfileName(npub) {
    if (profileCache.has(npub)) {
        return profileCache.get(npub);
    }

    try {
        const user = ndk.getUser({ npub: npub });
        const profile = await user.fetchProfile();
        const name = profile.name || npub.substring(0, 8) + '...';
        profileCache.set(npub, name);
        return name;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return npub.substring(0, 8) + '...';
    }
}

// Function to replace nostr:npub mentions with profile names
async function replaceNostrMentions(content) {
    const nostrMentionRegex = /nostr:npub1[a-zA-Z0-9]{58}/g;
    const mentions = content.match(nostrMentionRegex) || [];
    
    let processedContent = content;
    for (const mention of mentions) {
        const pubkey = mention.replace('nostr:npub1', 'npub1');
        const name = await fetchProfileName(pubkey);
        processedContent = processedContent.replace(mention, `@${name}`);
    }
    
    return processedContent;
}

// Connect button handler
document.getElementById('connect-button').addEventListener('click', async () => {
    try {
        await ndk.connect();
        document.getElementById('connection-status').className = 'alert alert-success';
        document.getElementById('connection-status').textContent = 'Connected to NDK!';
        
        // Enable the fetch profile button
        document.getElementById('fetch-profile-button').disabled = false;
        
        // Subscribe to some events after connection
        subscribeToEvents();
    } catch (error) {
        document.getElementById('connection-status').className = 'alert alert-danger';
        document.getElementById('connection-status').textContent = 'Connection failed: ' + error.message;
    }
});

// Fetch profile button handler
document.getElementById('fetch-profile-button').addEventListener('click', async () => {
    try {
        const npub = document.getElementById('npub-input').value;
        if (!npub) {
            throw new Error('Please enter an NPUB');
        }

        const user = ndk.getUser({ npub: npub });
        const profile = await user.fetchProfile();
        
        // Update profile result
        const profileResult = document.getElementById('profile-result');
        profileResult.innerHTML = `
            <div class="card">
                <div class="card-body">
                    ${profile.image ? `<img src="${profile.image}" class="rounded-circle mb-3" style="max-width: 150px;">` : ''}
                    <h5 class="card-title">${profile.name || 'Anonymous'}</h5>
                    <p class="card-text">${profile.about || ''}</p>
                    <div class="mt-3">
                        ${profile.website ? `<a href="${profile.website}" class="btn btn-outline-primary me-2" target="_blank">Website</a>` : ''}
                        ${profile.nip05 ? `<span class="badge bg-secondary">${profile.nip05}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        document.getElementById('connection-status').className = 'alert alert-danger';
        document.getElementById('connection-status').textContent = 'Profile fetch failed: ' + error.message;
    }
});

// Function to subscribe to events
function subscribeToEvents() {
    ndk.subscribe(
        { kinds: [30023], authors: ['a10260a2aa2f092d85e2c0b82e95eac5f8c60ea19c68e4898719b58ccaa23e3e']}, // Subscribe to kind 30023 (blog posts)
        { closeOnEose: false },
        {
            onEvent: async (event) => {
                // Add new event to the list
                const blogResult = document.getElementById('blog-result');
                const eventElement = document.createElement('div');
                eventElement.className = 'blog-post';
                
                // Parse the content as JSON to get the title
                let title = 'Untitled';
                let content = event.content;
                try {
                    const parsedContent = JSON.parse(event.content);
                    title = parsedContent.title || 'Untitled';
                    content = parsedContent.content || event.content;
                } catch (e) {
                    // If parsing fails, use the first line of content as title
                    const lines = event.content.split('\n');
                    title = lines[0];
                    content = lines.slice(1).join('\n');
                }

                // Replace nostr:npub mentions with profile names
                content = await replaceNostrMentions(content);

                // Format the date
                const date = new Date(event.created_at * 1000);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Render markdown if markdown-it is initialized, otherwise use plain text
                const renderedContent = md ? md.render(content) : content.replace(/\n/g, '<br>');

                eventElement.innerHTML = `
                    <div class="event-id">ID: ${event.id.substring(0, 8)}...</div>
                    <h5 class="mt-2 mb-3">${title}</h5>
                    <div class="content">${renderedContent}</div>
                    <div class="author">
                        <div>Author: ${event.pubkey.substring(0, 8)}...</div>
                        <div class="text-muted">Posted on ${formattedDate}</div>
                    </div>
                `;
                blogResult.insertBefore(eventElement, blogResult.firstChild);
                
                // Keep only the last 10 events
                if (blogResult.children.length > 10) {
                    blogResult.removeChild(blogResult.lastChild);
                }
            }
        }
    );
} 