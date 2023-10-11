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
            await page.type(firstNameFieldSelector, 'Spam Alex');
            await page.type(lastNameFieldSelector, 'Spam Alex');
            await page.type(phoneFieldSelector, '5555555555');
            await page.type(emailFieldSelector, 'spammer@spam.com');
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
        console.log('Spam POST Request: Successful');
    } else {
        console.log('Spam POST Request: Failed');
    }

    //return console.log(`Contact Us Form Fields: ${formCompletions}`);
}



module.exports = {
    completeContactUsFormClean,
    completeContactUsFormSpam
};