import type { LoaderFunction } from "@remix-run/node";
import { apiVersion, accessToken, apiUrlDomain } from "../shopify.server";

export const action: LoaderFunction = async ({ request }) => {
  const { title, status } = await request.json();

  //API URL
  const apiUrl = `${apiUrlDomain}/admin/api/${apiVersion}/graphql.json`;
  // console.log('Access URL:', apiUrl);
  // console.log('Access Token:', accessToken);

  const createProductQuery = `
    mutation CreateProduct($title: String!, $status: ProductStatus!) {
      productCreate(input: { title: $title, status: $status }) {
        product {
          id
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;  

  try {
    // Step 1: Create Product
    const productResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: createProductQuery,
        variables: { title, status },
      }),
    });

    const productData = await productResponse.json();

    if (productData.errors || productData.data.productCreate.userErrors.length) {
      throw new Error(
        productData.data.productCreate.userErrors[0]?.message || "Error creating product"
      );
    }

    return new Response(JSON.stringify({ message: "Product created successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
