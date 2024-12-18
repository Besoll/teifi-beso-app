import { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { apiVersion, accessToken, apiUrlDomain, authenticate, addDocumentResponseHeaders  } from "../shopify.server";


export const action: ActionFunction = async ({ request }) => {
  const { productId, newSku } = await request.json();
  console.log("Received request to update SKU:", { productId, newSku });

  if (!productId || !newSku) {
    return json({ error: "Both productId and newSku are required." }, { status: 400 });
  }



  const getInventoryItemIdQuery = `
    query GetInventoryItemId($variantId: ID!) {
      productVariant(id: $variantId) {
        id
        inventoryItem {
          id
          sku
        }
      }
    }
  `;

  const variables = {
    variantId: productId
  };

  const apiUrl = `${apiUrlDomain}/admin/api/${apiVersion}/graphql.json`;
  // Step 1: Fetch InventoryItemId
  try {
    const fetchInventoryResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: getInventoryItemIdQuery,
        variables, 
      }),
    });

    const inventoryResult = await fetchInventoryResponse.json();

    console.log("Full inventoryResult Response:", JSON.stringify(inventoryResult, null, 2));
    // Accessing data
    const inventoryItemId = inventoryResult?.data?.productVariant?.inventoryItem?.id;
    console.log("Received Inventory ITEM ID:", inventoryItemId );
  

    if (!inventoryItemId) {
      return json({ error: "InventoryItemId not found for the given productId." }, 
        { status: 404 });
    }

    // Step 2: Update SKU
    const updateInventoryItemMutation = `
      mutation UpdateInventoryItem($id: ID!, $input: InventoryItemInput!) {
        inventoryItemUpdate(id: $id, input: $input) {
          inventoryItem {
            id
            sku
          }
          userErrors {
            message
          }
        }
      }
    `;

    const updateVariables = {
      id: inventoryItemId,
      input: {
        sku: newSku,
      },
    };

    const updateResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: updateInventoryItemMutation,
        variables: updateVariables,
      }),
    });

    const updateResult = await updateResponse.json();

    const userErrors = updateResult.data?.inventoryItemUpdate?.userErrors;

    if (userErrors && userErrors.length > 0) {
      console.error("User Errors:", userErrors);
      return json({ error: "Failed to update SKU.", userErrors }, { status: 400 });
    }

    const updatedInventoryItem = updateResult.data?.inventoryItemUpdate?.inventoryItem;

    return json({
      message: "SKU updated successfully",
      inventoryItemId: updatedInventoryItem.id,
      sku: updatedInventoryItem.sku,
    });
  } catch (error) {
    console.error("Error updating SKU:", error);
    return json({ error: "Internal server error." }, { status: 500 });
  }
};
