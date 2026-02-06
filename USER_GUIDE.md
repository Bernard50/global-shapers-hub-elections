# 🗳️ Global Shapers Hub Election Portal - User Guide

Welcome to your Hub Election Portal! This guide will help you set up and run a smooth, transparent, and secure election for your Global Shapers Hub.

---

## 🔑 1. Getting Started (For Hub Admins)

### Creating Your Hub
1.  On the landing page, click **"Host Your Election"**.
2.  **Invitation Guard**: Enter the **Global Invitation Code**. 
    - *If you don't have one, click "Request Invitation Code" to email the system administrator.*
3.  Fill in your Hub name (e.g., "Yola Hub"), City, Country, and Year.
3.  **Crucial**: Create a strong **Admin Key**. This is your password to manage the election. *Store this safely; if you lose it, you cannot access the results!*

### Managing Candidates
1.  Log in as Admin using your Hub ID and Admin Key.
2.  Go to the **"Candidates"** tab.
3.  Add candidates for each role (Curator, Vice Curator, Impact Officer).
4.  Upload a clear photo and a short bio/manifesto for each person.

### Managing Voters (Simplified Whitelist)
You can now quickly authorize your members using the **Bulk Import** feature:
1.  Go to the **"Voters"** tab.
2.  Click **"Bulk Add Voters"**.
3.  Paste your member list in this format: `Full Name, Member ID` (one per line).
    - Example: `John Doe, YOLA-001`
4.  Click **"Import Voters"**.
5.  Voters are now ready to vote! They only need their Name and Member ID to access the portal. No tokens required!

---

## 🗳️ 2. How to Vote (For Hub Members)

### Accessing the Ballot
1.  On the landing page, click **"Cast Your Ballot"**.
2.  **Select Your Hub** from the dropdown menu.
3.  Enter your **Full Name** and your **Member ID** (as provided by your Hub Admin).
4.  Click **"Verify & Access"**.

### Casting Your Vote
1.  Browse the candidates for each position.
2.  Select your preferred candidate by clicking their card.
3.  Click **"Review Vote"** to see your selections.
4.  Confirm your choices to submit.
5.  Once submitted, you will see a **"Vote Recorded Successfully!"** message.

---

## 📊 3. Viewing Results (After Voting Ends)

1.  Log in as Admin.
2.  Navigate to the **"Final Results"** tab.
3.  Here you can see the vote counts for each candidate and the overall turnout.
4.  You can export these results or take a screenshot for your Hub's records.

---

## 🛠️ 4. Technical Integration (Optional)

### Syncing with Supabase
If you are the developer or tech-lead, ensure you have run the **SQL Setup Script** in your Supabase SQL Editor. This ensures the database is optimized for the Simplified Whitelist auth and prevents duplicate voting.

---

**Need Help?**
If you encounter any issues, please contact your Hub's technical lead or clear your browser cache and try again.

*Shaping our future, one vote at a time!* 🌍✨
