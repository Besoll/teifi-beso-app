import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { Button, Card, Layout, List, Modal, Page, Pagination } from "@shopify/polaris";
import { apiVersion, accessToken, apiUrlDomain } from "../shopify.server";
import AddNewProduct from "../components/AddNewProduct";
import UpdateSKU from "../components/UpdateSKU";
import UpdateStatus from "../components/UpdateStatus";


type ProductEdge = {
  node: {
    id: string;
    title: string;
    status: string;
    variants: {
      edges: { node: { sku: string, id: string } }[];
    };
  };
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

type ProductsResponse = {
  edges: ProductEdge[];
  pageInfo: PageInfo;
};


// Define GraphQL query with dynamic cursor-based pagination
const query = ({
  first,
  last,
  after,
  before,
}: {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
}): string => `{
  products(${first ? `first: ${first}` : ""}${last ? `last: ${last}` : ""}${
  after ? `, after: \"${after}\"` : ""
}${before ? `, before: \"${before}\"` : ""}) {
    edges {
      node {
        id
        title
        status
        variants(first: 1) {
          edges {
            node {
              id
              sku              
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}`;


export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const after = url.searchParams.get("after") || undefined;
  const before = url.searchParams.get("before") || undefined;
  const first = !before ? 5 : undefined; // Fetch first 5 products if before is not set
  const last = before ? 5 : undefined; // Fetch last 5 products if before is set

  //API URL
  const apiUrl = `${apiUrlDomain}/admin/api/${apiVersion}/graphql.json`;

  try {
    const response = await fetch(apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          "X-Shopify-Access-Token": accessToken,
        },
        body: query({ first, last, after, before }),
      }
    );

    if (response.ok) {
      const { data } = (await response.json()) as { data: { products: ProductsResponse } };
      return data.products;
    }

    throw new Error("Failed to fetch products");
  } catch (err) {
    console.error(err);
    throw new Response("Error loading products", { status: 500 });
  }
};

const Products = () => {
  const { edges, pageInfo } = useLoaderData<ProductsResponse>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalActive, setIsCreateModalActive] = useState(false);
  const [isUpdateSKUModalActive, setIsUpdateSKUModalActive] = useState(false);
  const [isUpdateStatusModalActive, setIsUpdateStatusModalActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null); // Tracks which ID is currently "copied"
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductStatus, setSelectedProductStatus] = useState<string | null>(null);

  const toggleCreateModal = () => setIsCreateModalActive(!isCreateModalActive);
  const toggleUpdateSKUModal = () => setIsUpdateSKUModalActive(!isUpdateSKUModalActive);
  const toggleUpdateStatusModal = () => setIsUpdateStatusModalActive(!isUpdateStatusModalActive);
 

  const handlePagination = (cursor: string | undefined, direction: "next" | "previous") => {
    const newParams = new URLSearchParams(searchParams);

    if (direction === "next") {
      if (cursor) newParams.set("after", cursor);
      newParams.delete("before");
    } else if (direction === "previous") {
      if (cursor) newParams.set("before", cursor);
      newParams.delete("after");
    }

    setSearchParams(newParams);
  };

  const handleCopyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id); // Mark the current button as "Copied"

      // Reset after 5 seconds
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 3000);
    });
  };


  // Open Modal with Dynamic Product ID and Status
  const openUpdateStatusModal = (id: string, status: string) => {
    setSelectedProductId(id);
    setSelectedProductStatus(status);
    setIsUpdateStatusModalActive(true);
  };

  const closeUpdateStatusModal = () => {
    setIsUpdateStatusModalActive(false);
    setSelectedProductId(null);
    setSelectedProductStatus(null);
  };

  return (
    <Page
      title="Products"
      primaryAction={{
        content: "Add New Product",
        onAction: toggleCreateModal,
      }}
      secondaryActions={[
        {
          content: "Update SKU",
          onAction: toggleUpdateSKUModal,
        },
      ]}
      
    >
      <Layout>
        <Layout.Section>
          <Card>
            <List type="bullet">
              {edges.map(({ node }) => {
                 const variantId = node.variants.edges[0]?.node.id;
                 const isCopied = copiedId === variantId;

                 return(
                  <List.Item key={node.id}>
                    <h2>{node.title}</h2>
                    <p>SKU: {node.variants.edges[0]?.node.sku || "--"}</p>
                    <p>ID: {node.id}</p>

                    {/* Copy Button with Dynamic Text and Flash Effect */}
                    <Button
                      onClick={() => handleCopyToClipboard(variantId)} 
                      size="micro"                      
                    >
                      {isCopied ? "Copied VID" : "Copy Variant ID"} {node.variants.edges[0]?.node.id || "--"}
                    </Button>
                    {' '}
                    <Button
                      onClick={() => openUpdateStatusModal(node.id, node.status)}
                      size="micro"
                      disclosure="up"
                    >
                      Current Status: {node.status}
                    </Button>                  
                  </List.Item>
                );
              })}
            </List>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Pagination
            hasPrevious={pageInfo.hasPreviousPage}
            onPrevious={() => handlePagination(pageInfo.startCursor, "previous")}
            hasNext={pageInfo.hasNextPage}
            onNext={() => handlePagination(pageInfo.endCursor, "next")}
          />
        </Layout.Section>
      </Layout>


      
         {/* Update Status Modal */}
         <Modal
            open={isUpdateStatusModalActive}
            onClose={closeUpdateStatusModal}
            title="Update Status"
          >
            <Modal.Section>
              {selectedProductId && selectedProductStatus && (
                <UpdateStatus
                  productIdOrigin={selectedProductId}
                  currentStatus={selectedProductStatus}
                  onClose={closeUpdateStatusModal}
                />
              )}
            </Modal.Section>
          </Modal>

      {/* Add New Product Modal */}
      <Modal
        open={isCreateModalActive}
        onClose={toggleCreateModal}
        title="Add New Product"
      >
        <Modal.Section>
          <AddNewProduct onClose={toggleCreateModal} />
        </Modal.Section>
      </Modal>

      {/* Update SKU Modal */}
      <Modal
        open={isUpdateSKUModalActive}
        onClose={toggleUpdateSKUModal}
        title="Update SKU"
      >
        <Modal.Section>
          <UpdateSKU onClose={toggleUpdateSKUModal} />
        </Modal.Section>
      </Modal>      
      
    </Page>
  );
};

export default Products;
