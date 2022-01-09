import { Handler }  from "@netlify/functions";
require('dotenv').config({ 
  path: '.env' 
});
const {
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY
} = process.env;

// Connect to our database 
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export const handler: Handler = async (event) => {
    let { data } = await supabase
    .from('Article')
    .select('*');

    console.log('data', JSON.stringify(data));

    return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
  };