import { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { apiVersion, accessToken, apiUrlDomain } from "../shopify.server";

export const action = async ({ request }: { request: Request }) => {
  
    const body = JSON.parse(await request.text());
    const { productId, newSku } = body;

    console.log("Received request to update SKU:", { productId, newSku });

    // Validate and ensure productId and newSku are provided
    if (!productId || !newSku) {
      throw new Error("Both productId and newSku are required.");
    }

    // // Validate productId to ensure it is a valid Shopify Global ID
    // if (!/^gid:\/\/shopify\/Product\/\d+$/.test(productId)) {
    //   throw new Error("Invalid productId format. It must be a Shopify Global ID.");
    // }

    // API 
    const apiUrl = `${apiUrlDomain}/admin/api/${apiVersion}/graphql.json`;

    // Fetch Product Details
    const mutation = `
      mutation UpdateProductVariantSKU($input: ProductVariantUpdateInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            sku
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      "input": {
        "id": productId,
        "sku": newSku
      }
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
  }
