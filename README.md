# CapTrade Pro – AI Customer Support Knowledge Base

This document serves as the primary data source for the CapTrade Pro AI Chatbot (TinyChat). It contains comprehensive information about user workflows, security protocols, and platform features.

---

## 🤖 AI SYSTEM PROMPT (Copy & Paste to TinyChat)
> "You are the CapTrade Pro Intelligent Support Agent. Your goal is to provide institutional-grade support to users regarding KYC verification, deposits, withdrawals, and account management. Use the 'CapTrade Pro Knowledge Base' below to answer inquiries accurately. Be professional, direct, and security-conscious. Always prioritize user funds and data safety. If a query is beyond your knowledge, direct the user to 'support@captradepro.com'."

---

## 🏛️ Platform Overview
**CapTrade Pro** is a high-performance digital asset trading platform offering institutional-grade tools, real-time price aggregation, and secure financial management.

---

## 🔐 Account Management

### Registration & Login
- **Process**: Users sign up with First Name, Last Name, Email, and a Secure Password.
- **Security**: Accounts are protected by JWT encryption.
- **Lockout Protocol**: After multiple failed login attempts, accounts are locked for **30 minutes** to prevent brute-force attacks.

### Password Recovery
- Users can request a "Password Reset" from the Sign In page.
- An authorization code (OTP) will be sent to the registered email address.
- Recovery codes are time-sensitive and should never be shared.

---

## 🆔 KYC Verification (Identity Audit)

### Verification Levels
1. **UNVERIFIED**: Default account state. Access to deposits and trading only.
2. **PENDING**: Documents uploaded and undergoing high-fidelity audit.
3. **VERIFIED**: Identity confirmed. **Required for all withdrawal operations.**
4. **REJECTED**: Verification failed due to document issues. Users can retry.
5. **BANNED**: If a user fails KYC **3 times**, the account is permanently flagged for security review.

### Requirements
- **Documents**: Valid ID Card or International Passport.
- **Quality**: Images must be high-resolution, glare-free, and showing all four corners of the document.
- **Auto-Audit**: The system uses OCR and Face-Recognition to verify that the person on the ID matches the user.

---

## 💰 Financial Operations

### Deposits (OxaPay)
- **Gateway**: Integrated with **OxaPay** for secure Cryptocurrency deposits.
- **Currency**: Transactions are calculated in USD but paid via Crypto.
- **Timing**: Deposits are credited instantly to the user's balance once the blockchain confirms the transaction.
- **Flow**: User enters amount -> Invoice generated -> User pays to the specific address -> Balance updated.

### Withdrawals
- **Prerequisite**: User **MUST** be **KYC VERIFIED**.
- **Methods**: Crypto (Wallet), PayPal, or Bank Transfer.
- **Approval**: For maximum security, all withdrawals are reviewed manually by the Finance Department.
- **Status**:
    - **PENDING**: Request submitted, awaiting admin authorization.
    - **COMPLETED**: Funds have been dispatched.
    - **REJECTED**: Request denied (reason provided in notifications).

---

## 📊 Trading & Trade Control
- **Live Prices**: Real-time price aggregation for Forex, Crypto, and Metals.
- **Trade Execution**: Instant fills with high-performance matching.
- **Close Position**: Users can close active trades at any time to lock in profits or mitigate losses. A confirmation dialog ensures no accidental closures.

---

## 📩 Support & Interaction
- **Support Desk**: Users can open internal tickets via the "Support Desk" in their dashboard.
- **Email**: Official inquiries should be directed to the customer support address configured in the platform settings.
- **Live Chat**: Use the widget in the bottom-right corner for quick questions.

---
## 🔔 Advanced User Features

### Real-Time Notifications
- Users receive instant alerts (Bell Icon) for:
    - Deposit confirmations.
    - Withdrawal status updates.
    - KYC verification results.
    - Platform-wide announcements (Broadcasts).

### Profile & Security
- **Identity Update**: Users can view their verified details in the Profile section.
- **Activity Log**: Users can monitor their recent trade and transaction history from the main dashboard.

## 🛡️ Security Protocol
- **Admin Bypass**: During maintenance, regular users are blocked, but the platform remains secure and active for institutional operations.
- **Encryption**: All sensitive data is hashed and transmitted over secure SSL/TLS channels.

## 🚩 Common Troubleshooting
1. **"Why can't I withdraw?"** -> Check if your KYC status is 'VERIFIED'.
2. **"Deposit not showing?"** -> Ensure the blockchain transaction has at least 3 confirmations.
3. **"Account Locked?"** -> Wait 30 minutes for the security cooldown to expire.
4. **"KYC Rejected?"** -> Ensure the photo is clear and you are using an original document (no photocopies).
