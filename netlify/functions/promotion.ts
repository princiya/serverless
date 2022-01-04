import { Handler }  from "@netlify/functions";

export const handler: Handler = async (event) => {
    const { title, description, link } = JSON.parse(event.body);
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        title,
        description,
        message: `You submitted ${title}: ${description}. Read more at ${link}.`,
      }),
    };
  };