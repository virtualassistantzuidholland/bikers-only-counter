import { BetaAnalyticsDataClient } from '@google-analytics/data';

export default async function handler(req, res) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: credentials
    });

    const PROPERTY_ID = '506774434';

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'newUsers' }]
    });

    let newUsers = 0;

    if (response.rows && response.rows.length > 0) {
      newUsers = parseInt(response.rows[0].metricValues[0].value, 10);
    }

    res.status(200).json({ newUsers });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching GA data' });
  }
}
