const fs = require('fs');

let emailList = [];
let currentEmailIndex = 0;

function loadEmailsFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        emailList = data.split('\n').filter(email => email.trim().length > 0); // Update the emailList here
        return emailList;
    } catch (error) {
        console.error(`Error reading emails from file: ${error.message}`);
        return [];
    }
}

async function getNextEmail() {
    const email = emailList[currentEmailIndex];
    currentEmailIndex = (currentEmailIndex + 1) % emailList.length;
    return email;
}

async function isPostSuccessful() {
    try {
      const response = await fetch('https://staging005.townsquareinteractive.com/laravel/api/v1/formdata/postform', {
        method: 'POST'
      });
  
      return response.status === 200;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
}

async function completeContactUsFormClean(page) {
    // Selector Variables
    const firstNameFieldSelector = 'input[data-fieldlabel="First"]';
    const lastNameFieldSelector = 'input[data-fieldlabel="Last"]';
    const phoneFieldSelector = 'input[data-fieldlabel="Phone"]';
    const emailFieldSelector = 'input[data-fieldlabel="Email"]';
    const submitButtonSelector = 'input[value="Submit"]';

    //let formCompletions = 0;

    try {
        // Wait for the selectors to appear on the page
        const firstNameField = await page.waitForSelector(firstNameFieldSelector);
        const lastNameField = await page.waitForSelector(lastNameFieldSelector);
        const phoneField = await page.waitForSelector(phoneFieldSelector);
        const emailField = await page.waitForSelector(emailFieldSelector);
        const submitButton = await page.waitForSelector(submitButtonSelector);

        // If elements are found, fill out the form
        if (firstNameField && lastNameField && phoneField && emailField) {
            await page.type(firstNameFieldSelector, 'Clean Alex');
            await page.type(lastNameFieldSelector, 'Clean Alex');
            await page.type(phoneFieldSelector, '5555555555');
            await page.type(emailFieldSelector, 'alex.roberts@townsquareinteractive.com');
            await page.click(submitButtonSelector);
            //formCompletions += 1;
        } else {
            console.log(`Contact Us Form Fields: Not Found`);
        }

    } catch (e) {
        console.error(`Error encountered while completing Contact Us Form: ${e.message}`);
    }

    const postSuccess = await isPostSuccessful();
    if (postSuccess) {
        console.log('Clean POST Request: Successful');
    } else {
        console.log('Clean POST Request: Failed');
    }

    //return console.log(`Contact Us Form Fields: ${formCompletions}`);
}


async function completeContactUsFormSpam(page) {
    if (!emailList.length) {
        loadEmailsFromFile('./spam_emails.txt'); // Provide path here
    }

    const firstNameFieldSelector = 'input[data-fieldlabel="First"]';
    const lastNameFieldSelector = 'input[data-fieldlabel="Last"]';
    const phoneFieldSelector = 'input[data-fieldlabel="Phone"]';
    const emailFieldSelector = 'input[data-fieldlabel="Email"]';
    const submitButtonSelector = 'input[value="Submit"]';
    let currentEmail = await getNextEmail();

    try {
        await page.waitForSelector(firstNameFieldSelector);
        await page.waitForSelector(lastNameFieldSelector);
        await page.waitForSelector(phoneFieldSelector);
        await page.waitForSelector(emailFieldSelector);
        await page.waitForSelector(submitButtonSelector);

        await page.type(firstNameFieldSelector, 'Spam Alex');
        await page.type(lastNameFieldSelector, 'Spam Alex');
        await page.type(phoneFieldSelector, '5555555555');
        await page.type(emailFieldSelector, currentEmail);
        await page.click(submitButtonSelector);

    } catch (e) {
        console.error(`Error encountered while completing Contact Us Form: ${e.message}`);
    }

    const postSuccess = await isPostSuccessful();
    if (postSuccess) {
        console.log(`Spam POST Request for ${currentEmail}: Successful`); // Use the stored email here
    } else {
        console.log(`Spam POST Request for ${currentEmail}: Failed`); // And here
    }
}



module.exports = {
    completeContactUsFormClean,
    completeContactUsFormSpam
};