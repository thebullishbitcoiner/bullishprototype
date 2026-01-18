# NIP-46 (Nostr Remote Signing) Demonstration Page Plan

## Overview
Create a comprehensive demonstration page that showcases all major NIP-46 (Nostr Remote Signing) functionality. NIP-46 enables secure remote signing of Nostr events, allowing clients to request a remote signer (bunker) to sign events on behalf of users without exposing private keys. This is particularly useful for hardware devices, mobile apps, or web applications that need to sign Nostr events securely.

**Reference**: [NIP-46 Specification](https://nips.nostr.com/46)

## Page Structure

### 1. Header Section
- **Title**: "NIP-46 Remote Signing Demo"
- **Subtitle**: Brief explanation of NIP-46 and its purpose (remote signing via bunker/remote-signer)
- **Connection Status Indicator**: Visual badge showing connected/disconnected state
- **Connection Info Display**: Show connected remote-signer details (remote-signer-pubkey, user-pubkey, relays)

### 2. Connection Management Section
**Purpose**: Demonstrate establishing and managing NIP-46 connections

**Features**:
- **Connection Method Selection**: Choose between two connection methods:
  - **Bunker Connection** (`bunker://`): Connection initiated by remote-signer
  - **NostrConnect Connection** (`nostrconnect://`): Connection initiated by client
- **Bunker URL Input**: Text field for pasting `bunker://` connection string
  - Format: `bunker://<remote-signer-pubkey>?relay=<wss://relay>&secret=<optional-secret>`
- **NostrConnect URL Generator**: Generate `nostrconnect://` URL with:
  - Client pubkey (auto-generated ephemeral keypair)
  - Relay URLs (user input)
  - Secret (auto-generated for security)
  - Permissions (optional, comma-separated list)
  - App metadata (name, url, image)
- **QR Code Display**: Show connection URL as QR code for easy sharing
- **QR Code Scanner**: Option to scan connection QR code
- **Disconnect Button**: Terminate active connection
- **Connection Details Card**: Display:
  - Remote-signer pubkey
  - User pubkey (retrieved via `get_public_key`)
  - Client pubkey (ephemeral keypair)
  - Connected relays
  - Connection method used

**UI Components**:
- Connection status alert (info/success/warning/danger)
- Connection form with validation
- Tabbed interface for connection methods
- QR code display component
- Connection history (localStorage)

### 3. Remote Signer Information Section
**Purpose**: Display remote signer state and user information

**Features**:
- **User Public Key Display**: Show the user's public key (retrieved via `get_public_key`)
- **Remote Signer Public Key**: Display the remote-signer's pubkey
- **Client Public Key**: Display the ephemeral client pubkey
- **Connection Health**: Ping the remote signer to check connection status
- **Refresh Button**: Manually refresh information
- **Auto-ping**: Periodic ping to verify connection (optional)

**UI Components**:
- Public key display cards (with copy-to-clipboard)
- Connection health indicator
- Loading states for async operations

### 4. Event Signing Section
**Purpose**: Demonstrate remote signing of Nostr events

**Features**:
- **Event Builder**: Interactive form to create Nostr events:
  - **Kind Selector**: Choose event kind (1=text note, 3=contacts, 4=DM, etc.)
  - **Content Input**: Text area for event content
  - **Tags Editor**: Add/edit tags (p-tags, e-tags, etc.)
  - **Created At**: Auto-set to current time (editable)
- **Sign Event Button**: Request remote signer to sign the event
- **Signed Event Display**: Show the complete signed event (JSON)
- **Event Preview**: Human-readable preview of the event
- **Copy Signed Event**: Copy signed event to clipboard
- **Publish Option**: Optionally publish signed event to relays
- **Signing History**: List of recently signed events

**UI Components**:
- Event builder form with validation
- JSON viewer for signed events
- Event preview card
- Signing status indicator (pending/success/failed)
- History list with timestamps

### 4.1 Quick Sign Examples
**Purpose**: Pre-configured examples for common event types

**Features**:
- **Text Note (Kind 1)**: Quick sign a simple text note
- **Reply to Note**: Sign a reply event with e-tag and p-tag
- **Reaction (Kind 7)**: Sign a reaction event
- **Custom Kind**: Template for any event kind
- **Event Templates**: Save and reuse common event structures

**UI Components**:
- Quick action buttons
- Template selector
- Pre-filled forms

### 5. Encryption/Decryption Section
**Purpose**: Demonstrate NIP-04 and NIP-44 encryption operations

#### 5.1 NIP-04 Encryption/Decryption
**Features**:
- **Encrypt**: Encrypt plaintext for a recipient pubkey
  - Recipient pubkey input
  - Plaintext input
  - Encrypt button
  - Display encrypted ciphertext
- **Decrypt**: Decrypt NIP-04 ciphertext
  - Sender pubkey input
  - Ciphertext input
  - Decrypt button
  - Display decrypted plaintext

**UI Components**:
- Encryption form
- Decryption form
- Result display areas
- Copy-to-clipboard buttons

#### 5.2 NIP-44 Encryption/Decryption
**Features**:
- **Encrypt**: Encrypt plaintext using NIP-44
  - Recipient pubkey input
  - Plaintext input
  - Encrypt button
  - Display encrypted ciphertext
- **Decrypt**: Decrypt NIP-44 ciphertext
  - Sender pubkey input
  - Ciphertext input
  - Decrypt button
  - Display decrypted plaintext

**UI Components**:
- Encryption form
- Decryption form
- Result display areas
- Copy-to-clipboard buttons
- Tabbed interface for NIP-04 vs NIP-44

### 6. Advanced Features Section
**Purpose**: Demonstrate advanced NIP-46 capabilities

**Features**:
- **Permission Management**: 
  - View requested permissions from connection
  - Display permission format: `method[:params]` (e.g., `sign_event:4`, `nip44_encrypt`)
  - Show which permissions are active
- **Auth Challenges**: 
  - Handle auth challenge responses
  - Display auth URL in popup/new tab
  - Monitor for authentication completion
  - Retry original request after auth
- **Batch Operations**: 
  - Sign multiple events in sequence
  - Encrypt/decrypt multiple messages
- **Connection Recovery**: 
  - Auto-reconnect on disconnect
  - Handle relay failures gracefully
- **Event Publishing**: 
  - Publish signed events to relays
  - Track publication status
  - Support multiple relays

**UI Components**:
- Collapsible advanced options
- Permission display panel
- Auth challenge modal
- Batch operation interface
- Connection recovery status

### 7. Error Handling & Status Section
**Purpose**: Demonstrate proper error handling and monitoring

**Features**:
- **Error Display**: Clear error messages for failed operations
  - Parse and display error responses from remote-signer
  - Show actionable error messages
- **Retry Mechanisms**: Retry failed operations with exponential backoff
- **Connection Recovery**: Auto-reconnect on disconnect
- **Status Log**: Activity log showing:
  - All requests sent (method, params, request ID)
  - All responses received (result, error, response ID)
  - Connection events
  - Timestamps for all operations
- **Network Status**: Relay connection status for each relay
- **Request/Response Viewer**: Inspect raw NIP-44 encrypted messages (for debugging)

**UI Components**:
- Error alert components
- Status log viewer (scrollable, filterable)
- Network indicator for each relay
- Request/response inspector (collapsible)

## Technical Implementation Details

### Dependencies
- `nostr-tools` - Core Nostr functionality (event creation, signing, relays)
- `nip44` or `@nostr-dev-kit/ndk` - NIP-44 encryption support
- Bootstrap 5.3.3 - UI framework (already in project)
- QR code library - For connection URL display/scanning
- LocalStorage API - Connection persistence

### Key Functions to Implement

1. **Connection Management**
   ```javascript
   - connectBunker(bunkerUrl) // Parse bunker:// URL and connect
   - connectNostrConnect(nostrconnectUrl) // Parse nostrconnect:// URL
   - generateNostrConnectUrl(clientPubkey, relays, secret, perms, metadata)
   - disconnect()
   - getConnectionStatus()
   - saveConnection()
   - loadSavedConnections()
   - generateClientKeypair() // Generate ephemeral client keypair
   ```

2. **NIP-46 Protocol Implementation**
   ```javascript
   - sendRequest(method, params) // Send encrypted request (kind 24133)
   - handleResponse(event) // Handle encrypted response (kind 24133)
   - encryptRequest(request, remoteSignerPubkey) // NIP-44 encrypt
   - decryptResponse(encryptedContent, remoteSignerPubkey) // NIP-44 decrypt
   - subscribeToResponses() // Subscribe to kind 24133 events
   ```

3. **NIP-46 Methods**
   ```javascript
   - connect(remoteSignerPubkey, secret, permissions)
   - getPublicKey() // Get user's public key
   - signEvent(event) // Sign a Nostr event
   - ping() // Health check
   - nip04Encrypt(recipientPubkey, plaintext)
   - nip04Decrypt(senderPubkey, ciphertext)
   - nip44Encrypt(recipientPubkey, plaintext)
   - nip44Decrypt(senderPubkey, ciphertext)
   ```

4. **Event Management**
   ```javascript
   - createEvent(kind, content, tags, created_at)
   - validateEvent(event)
   - publishEvent(signedEvent, relays)
   - formatEventForSigning(event) // Prepare event for sign_event method
   ```

5. **Error Handling**
   ```javascript
   - handleNIP46Error(error)
   - handleAuthChallenge(authUrl)
   - retryOperation(operation, maxRetries)
   - validateConnection()
   - validateBunkerUrl(url)
   - validateNostrConnectUrl(url)
   ```

### State Management
- Connection state (connected/disconnected/connecting)
- Client keypair (ephemeral, generated on page load)
- Remote signer state (remote-signer-pubkey, user-pubkey, relays)
- Request/response tracking (request IDs, pending requests)
- Signed events history
- UI state (loading, errors, modals, active tabs)

### Security Considerations
- **Client Keypair**: Generate ephemeral keypair, store in memory only (or localStorage with user consent)
- **Never expose user private keys**: All signing happens remotely
- **Validate all inputs**: Validate bunker:// and nostrconnect:// URLs
- **Secret validation**: Always validate secret in connect responses
- **NIP-44 encryption**: All communication encrypted using NIP-44
- **Sanitize displayed data**: Don't expose sensitive information in UI
- **Use HTTPS for production**: Secure connections only
- **Clear sensitive data on disconnect**: Clear client keypair and connection info
- **Permission management**: Only request necessary permissions
- **Relay security**: Use trusted relays for NIP-46 communication

## UI/UX Design Guidelines

### Color Scheme
- Use existing dark theme (Bootstrap dark theme)
- Success: Green for successful operations
- Warning: Yellow for pending operations
- Danger: Red for errors
- Info: Blue for informational messages

### Responsive Design
- Mobile-first approach
- Card-based layout for sections
- Collapsible sections for mobile
- Touch-friendly buttons and inputs

### User Feedback
- Loading spinners for async operations
- Success/error toast notifications
- Progress indicators for long operations
- Clear error messages with actionable steps

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast for readability

## Page Flow

1. **Initial Load**
   - Generate or load ephemeral client keypair
   - Check for saved connection
   - Display connection prompt if not connected
   - Show remote signer info if connected

2. **Connection Flow (Bunker)**
   - User enters/pastes `bunker://` URL
   - Parse URL to extract remote-signer-pubkey, relays, secret
   - Generate client keypair if not exists
   - Send `connect` request to remote-signer
   - Wait for `connect` response
   - Validate secret if provided
   - Call `get_public_key` to retrieve user pubkey
   - Display connection success

3. **Connection Flow (NostrConnect)**
   - User selects NostrConnect method
   - Generate client keypair if not exists
   - User enters relay URLs
   - Generate secret
   - Optionally specify permissions and app metadata
   - Generate `nostrconnect://` URL
   - Display URL as QR code
   - User shares URL with remote-signer
   - Wait for `connect` response from remote-signer
   - Validate secret
   - Call `get_public_key` to retrieve user pubkey
   - Display connection success

4. **Event Signing Flow**
   - User builds event (kind, content, tags)
   - User clicks "Sign Event"
   - Format event for `sign_event` method
   - Send encrypted request (kind 24133)
   - Wait for encrypted response
   - Handle auth challenge if needed
   - Display signed event
   - Optionally publish to relays

5. **Encryption/Decryption Flow**
   - User selects NIP-04 or NIP-44
   - User enters recipient/sender pubkey and text
   - Send encrypt/decrypt request
   - Wait for response
   - Display result
   - Copy to clipboard option

6. **Auth Challenge Flow**
   - Receive auth challenge response
   - Extract auth URL from error field
   - Open auth URL in popup/new tab
   - Monitor for authentication completion
   - Retry original request with same request ID
   - Display success or failure

## Testing Checklist

- [ ] Bunker connection (`bunker://` URL)
- [ ] NostrConnect connection (`nostrconnect://` URL)
- [ ] Connection persistence (page reload)
- [ ] Client keypair generation and storage
- [ ] `get_public_key` method
- [ ] `sign_event` method (various event kinds)
- [ ] `ping` method
- [ ] `nip04_encrypt` method
- [ ] `nip04_decrypt` method
- [ ] `nip44_encrypt` method
- [ ] `nip44_decrypt` method
- [ ] Auth challenge handling
- [ ] Permission management
- [ ] Error handling (network errors, invalid inputs, rejected requests)
- [ ] Disconnect/reconnect
- [ ] Mobile responsiveness
- [ ] QR code generation/scanning
- [ ] LocalStorage operations
- [ ] Event publishing to relays
- [ ] Request/response logging
- [ ] Secret validation
- [ ] Multiple relay support

## Future Enhancements

1. **Multi-remote-signer Support**: Connect to multiple remote signers simultaneously
2. **Event Templates**: Save and reuse common event structures
3. **Event Library**: Pre-built templates for common event kinds
4. **NIP-89 Discovery**: Discover remote signers via NIP-89 events
5. **NIP-05 Discovery**: Discover remote signers via NIP-05 metadata
6. **Batch Signing**: Sign multiple events in one operation
7. **Event Scheduling**: Schedule events to be signed and published later
8. **Export Formats**: Export signed events (JSON, hex)
9. **Theme Customization**: User-selectable themes
10. **Offline Mode**: Cache signed events for offline viewing
11. **Event Verification**: Verify signed events before publishing
12. **Relay Management**: Add/remove relays dynamically

## File Structure

```
public/
  nip46-demo.html          (main demo page)
  js/
    nip46-client.js        (NIP-46 client implementation)
    nip46-demo.js          (Demo page logic)
    nip46-utils.js         (Utility functions)
```

## Implementation Priority

### Phase 1 (Core Functionality)
1. Client keypair generation and management
2. Bunker connection (`bunker://` URL parsing and connection)
3. NostrConnect connection (`nostrconnect://` URL generation)
4. Basic NIP-46 protocol implementation (encrypted requests/responses)
5. `get_public_key` method
6. `sign_event` method (basic event signing)
7. Connection status display

### Phase 2 (Enhanced Features)
1. QR code support (generation and scanning)
2. `ping` method
3. NIP-04 encrypt/decrypt methods
4. NIP-44 encrypt/decrypt methods
5. Event builder UI
6. Signed event display and publishing
7. Connection persistence (localStorage)
8. Error handling improvements

### Phase 3 (Advanced Features)
1. Auth challenge handling
2. Permission management UI
3. Request/response logging
4. Event templates and quick actions
5. Batch operations
6. Multiple relay support
7. NIP-89/NIP-05 discovery

### Phase 4 (Polish)
1. UI/UX improvements
2. Mobile optimization
3. Comprehensive error messages
4. Documentation and examples
5. Performance optimization

## Notes

- **NIP-46 vs NWC**: This plan is for NIP-46 (Nostr Remote Signing), not Nostr Wallet Connect (NWC). The current `nwc.html` file uses NWC for Lightning wallet operations, which is different from NIP-46.
- **Protocol Reference**: All implementation should follow [NIP-46 specification](https://nips.nostr.com/46)
- **Event Kind 24133**: All NIP-46 communication uses kind 24133 events with NIP-44 encryption
- **Client Keypair**: The client generates an ephemeral keypair that doesn't need to be shared with the user
- **Remote Signer**: The remote-signer (bunker) holds the user's actual keys and signs events on their behalf
- **Connection Methods**: Two connection methods are supported:
  - `bunker://` - Initiated by remote-signer
  - `nostrconnect://` - Initiated by client
- **Secret Validation**: Always validate the secret in connect responses to prevent connection spoofing
- **Follow existing patterns**: Use the same code style and patterns from `bitcoin-connect.html` and other demo pages
- **Bootstrap dark theme**: Use the existing Bootstrap dark theme for consistency
- **Consider separate page**: Create `nip46-demo.html` as a new page to avoid confusion with `nwc.html`
