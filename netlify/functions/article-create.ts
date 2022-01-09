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
    const { title, description, link } = JSON.parse(event.body);

    const { data, error } = await supabase
        .from('Article')
        .insert([
            { title, description, url: link },
        ]);
    
    if (error) {
      console.log('error occurred', error);
      return;
    }
    
    console.log('data entered into Article table', data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        title,
        description,
        message: `You submitted ${title}: ${description}. Read more at ${link}.`,
      }),
    };
  };