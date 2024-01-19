import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";


export const GET: APIRoute = async({ url }):Promise<Response> => {
  
  // Query is in searchParams
  const query: string | null = url.searchParams.get('query');
  
  // Query is not in searchParams
  if(query === null){
    return new Response(JSON.stringify({
      error: 'Query param is missing'
    }),{
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection('blog');

  // Filter articles based on query
  const searchResults = allBlogArticles.filter((article) => {
    const titleMatch: boolean = article.data.title                // Verifica si la consulta está presente en el título del artículo
      .toLowerCase()                                              // (ignorando mayúsculas y minúsculas).
      .includes(query!.toLowerCase());

    const bodyMatch: boolean = article.body                       // Verifica si la consulta está presente en el cuerpo del artículo
      .toLowerCase()                                              // (también ignorando mayúsculas y minúsculas).
      .includes(query!.toLowerCase());

    const slugMatch: boolean = article.slug                       // Verifica si la consulta está presente en el "slug" del artículo
      .toLowerCase()                                              // (una versión simplificada y formateada del título que se utiliza en las URL).
      .includes(query!.toLowerCase());

    return titleMatch || bodyMatch || slugMatch;
  });

  return new Response(JSON.stringify({ searchResults }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}