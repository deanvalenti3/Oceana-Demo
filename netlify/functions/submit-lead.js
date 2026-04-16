// Netlify Function: submit-lead
// Receives Netlify Forms outgoing webhook, writes lead to Airtable.
// Triggered by: Site → Forms → [form name] → Outgoing notifications → Webhook

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse webhook payload from Netlify Forms
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    console.error('submit-lead: failed to parse webhook body', e);
    return { statusCode: 400, body: 'Bad Request' };
  }

  const data = payload.data || {};

  // Build normalized Name field
  const firstName = (data.first_name || '').trim();
  const lastName = (data.last_name || '').trim();
  const name = [firstName, lastName].filter(Boolean).join(' ');

  // Map dates select value to human-readable label
  const DATE_LABELS = {
    'june-14':  'June 14–21',
    'july-5':   'July 5–12',
    'july-19':  'July 19–26',
    'aug-2':    'Aug 2–9',
    'sept-6':   'Sept 6–13',
    'flexible': 'Flexible',
  };
  const datesLabel = DATE_LABELS[data.dates] || data.dates || '';

  // Map to Airtable schema
  const record = {
    fields: {
      'Submitted At':    new Date().toISOString(),
      'Name':            name,
      'Email':           data.email        || '',
      'Phone':           data.phone        || '',
      'Guest Count':     data.party_size   || '',
      'Trip Timeline':   data.trip_timeline || '',
      'Preferred Dates': datesLabel,
      'Message':         data.message      || '',
      'Source Page':     data.source_page  || '',
      'Form Name':       data['form-name'] || payload.name || '',
      'Status':          'New',
    },
  };

  // Env vars — set these in Netlify UI under Site → Environment variables
  const baseId    = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';
  const token     = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;

  if (!baseId || !token) {
    console.error('submit-lead: missing AIRTABLE_BASE_ID or AIRTABLE_PERSONAL_ACCESS_TOKEN');
    // Return 200 so Netlify does not retry the webhook endlessly
    return { statusCode: 200, body: 'Configuration error — check function logs' };
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`submit-lead: Airtable API error ${response.status}:`, body);
      // Return 200 to prevent Netlify webhook retry loop
      return { statusCode: 200, body: 'Airtable write failed — check function logs' };
    }

    console.log('submit-lead: lead written to Airtable', data.email);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('submit-lead: network error writing to Airtable', err);
    return { statusCode: 200, body: 'Internal error — check function logs' };
  }
};
