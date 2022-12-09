// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
// Grab our credentials from a .env file or environment variables
const {
  SUPABASE_API_URL,
  SUPABASE_API_KEY
} = process.env;

// Connect to our database
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_API_URL, SUPABASE_API_KEY);

const handler = async (event) => {
  try {
    // Parse the form data from the request body
    const body = JSON.parse(event.body);
    const { reservoirId, reservoirNameSuggestion, notes } = body;

    const { data, error } = await supabase
      .from('Feedback form')
      .insert([
        {
          reservoir_id: reservoirId,
          reservoir_suggested_name: reservoirNameSuggestion,
          notes
        }
      ])

    return {
      statusCode: 200,
      body: 'success',
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: error.toString()
    }
  }
}

module.exports = { handler }
