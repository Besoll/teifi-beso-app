import { json } from "@remix-run/node";
import { apiUrlDomain, apiVersion, accessToken } from "../shopify.server";

export const action = async ({ request }: { request: Request }) => {
  const { productId, newStatus } = await request.json();

  console.log("Received request to update SKU:", { productId, newStatus });

  const mutation = `
    mutation UpdateProductStatus($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: productId,
      status: newStatus,
    },
  };

  try {
    const response = await fetch(`${apiUrlDomain}/admin/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      return json({ error: "Failed to update product status" }, { status: 400 });
    }

    if (result.data.productUpdate.userErrors.length > 0) {
      console.error("User Errors:", result.data.productUpdate.userErrors);
      return json(
        { error: result.data.productUpdate.userErrors[0].message },
        { status: 400 }
      );
    }

    return json({ success: "Product status updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "An error occurred while updating product status" }, { status: 500 });
  }
};