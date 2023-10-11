const { Cluster } = require('puppeteer-cluster');
const ExcelJS = require('exceljs');

const {
    completeContactUsFormClean,
    completeContactUsFormSpam
} = require('./spamFunctions');

const testURL = 'https://annalisetestsite.staging005.townsquareinteractive.com/contact/';

async function testForm(page) {
    const testRuns = 10;
    let cleanSuccessCount = 0;
    let cleanErrorCount = 0;
    let spamSuccessCount = 0;
    let spamErrorCount = 0;

    // Test with clean data 100 times
    for (let i = 0; i < testRuns; i++) {
        try {
            await page.goto(testURL);
            await completeContactUsFormClean(page);
            cleanSuccessCount++;
            console.log(`Clean Form Completion(s): ${cleanSuccessCount}`);
        } catch (error) {
            console.error(`Error during clean test run ${i + 1}`);
            console.error(error);
            cleanErrorCount++;
        }
    }

    // Test with spam data 100 times
    for (let i = 0; i < testRuns; i++) {
        try {
            await page.goto(testURL);
            await completeContactUsFormSpam(page);
            spamSuccessCount++;
            console.log(`Spam Form Completion(s): ${spamSuccessCount}`);
        } catch (error) {
            console.error(`Error during spam test run ${i + 1}`);
            console.error(error);
            spamErrorCount++;
        }
    }

    return {
        cleanSuccessRuns: cleanSuccessCount,
        cleanErrorRuns: cleanErrorCount,
        spamSuccessRuns: spamSuccessCount,
        spamErrorRuns: spamErrorCount
    };
}

(async () => {
    const results = [];

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 4, // You're testing one function that includes both spam and clean
        puppeteerOptions: {
            headless: true,
        }
    });

    await cluster.task(async ({ page }) => {
        const result = await testForm(page);
        results.push(result);
    });

    cluster.queue({}); // Queue the task. No data object required since testForm handles both spam and clean.

    await cluster.idle();
    await cluster.close();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Results');

    worksheet.columns = [
        { header: 'Clean Success Runs', key: 'cleanSuccessRuns' },
        { header: 'Clean Error Runs', key: 'cleanErrorRuns' },
        { header: 'Spam Success Runs', key: 'spamSuccessRuns' },
        { header: 'Spam Error Runs', key: 'spamErrorRuns' }
    ];

    worksheet.addRows(results);

    await workbook.xlsx.writeFile('test_results.xlsx');
    console.log('Testing done! Results saved to test_results.xlsx.');
})();
