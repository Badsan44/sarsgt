# 📊 Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for the KOL Quest form submissions.

## 🎯 What This Does

When users submit the KOL Quest form, their data will be automatically saved to a Google Sheet with the following columns:
- **Timestamp** - When the form was submitted
- **Twitter Handle** - User's Twitter/X handle
- **Wallet Address** - BNB wallet address
- **Follower Count** - Number of followers
- **Main Niche** - Selected content niche
- **Why Join** - User's motivation text

## 📋 Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "KOL Quest Applications"
4. Set up the header row with these columns:
   ```
   A1: Timestamp
   B1: Twitter Handle
   C1: Wallet Address
   D1: Follower Count
   E1: Main Niche
   F1: Why Join
   ```

### Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default code and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Append the data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.twitterHandle,
      data.walletAddress,
      data.followerCount,
      data.mainNiche,
      data.whyJoin
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Save the script (Ctrl+S or Cmd+S)
4. Name your project "KOL Quest Form Handler"

### Step 3: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Type"
3. Select **Web app**
4. Set the following:
   - **Description**: "KOL Quest Form Handler"
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web app URL** - you'll need this!

### Step 4: Update the Form Code

1. Open `/workspace/BBN/src/sections/kolQuest/KolQuestForm.jsx`
2. Find line 121 with `YOUR_SCRIPT_ID`
3. Replace the entire URL with your Web app URL from Step 3

**Example:**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx...your-actual-url.../exec';
```

### Step 5: Test the Integration

1. Build and run your application
2. Fill out the KOL Quest form
3. Submit the form
4. Check your Google Sheet - the data should appear!

## 🔧 Troubleshooting

### Common Issues:

1. **"Script not found" error**
   - Make sure the Web app URL is correct
   - Ensure the script is deployed as "Anyone" can access

2. **No data appearing in sheet**
   - Check the Apps Script execution log
   - Verify the sheet has the correct headers

3. **CORS errors**
   - This is normal with `mode: 'no-cors'`
   - Data will still be sent successfully

### Testing the Script Directly:

You can test your Google Apps Script by running this in the script editor:

```javascript
function testScript() {
  const testData = {
    timestamp: new Date().toISOString(),
    twitterHandle: '@testuser',
    walletAddress: '0x1234567890123456789012345678901234567890',
    followerCount: '1000',
    mainNiche: 'crypto',
    whyJoin: 'Test submission'
  };
  
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow([
    testData.timestamp,
    testData.twitterHandle,
    testData.walletAddress,
    testData.followerCount,
    testData.mainNiche,
    testData.whyJoin
  ]);
}
```

## 📈 Benefits

✅ **Real-time data collection** - Submissions appear instantly  
✅ **Easy to manage** - View, sort, and filter applications  
✅ **Export capabilities** - Download as CSV, Excel, etc.  
✅ **No backend required** - Serverless solution  
✅ **Free to use** - No additional costs  

## 🔒 Security Notes

- The Google Apps Script runs under your Google account
- Only you can access the spreadsheet (unless you share it)
- Form submissions are sent directly to Google's servers
- No sensitive data is stored in the frontend code

---

**Need help?** Check the Google Apps Script documentation or contact support.