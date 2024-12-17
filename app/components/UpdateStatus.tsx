import React, { useState } from "react";
import { Button, Form, FormLayout, Select, TextField } from "@shopify/polaris";

type UpdateStatusProps = {
  onClose: () => void; // Callback to close the modal
  productIdOrigin: string;
  currentStatus: string;
};

const UpdateStatus = ({ onClose, productIdOrigin, currentStatus }: UpdateStatusProps) => {
  const productId = productIdOrigin;
  const status = currentStatus
  const [newStatus, setnewStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  console.log("Start 1 request to update SKU:", { productId, newStatus });

  const handleUpdateStatus = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validate productId format
    const transformedProductId = productId.startsWith("gid://")
      ? productId
      : `gid://shopify/Product/${productId}`;

    // if (!/^gid:\/\/shopify\/Product\/\d+$/.test(transformedProductId)) {
    //   setError("Invalid Product ID format. It must be a Shopify Global ID.");
    //   setIsSubmitting(false);
    //   return;
    // }

    try {
      const response = await fetch("/api/status-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update status");
      }
  
      setSuccess(result.success);
      onClose();
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsSubmitting(false);
      }
    };


  return (
    <Form onSubmit={handleUpdateStatus}>
      <FormLayout>

        <TextField
          label="Product ID"
          value={productId}          
          autoComplete="on"
          readOnly
        />       
        
        <Select
          label="New Status"
          options={[
            { label: currentStatus, value: currentStatus },
            { label: "ACTIVE", value: "ACTIVE" },
            { label: "DRAFT", value: "DRAFT" },
            { label: "ARCHIVED", value: "ARCHIVED" },
          ]}
          
          onChange={(value) => {
            setnewStatus(value);          
          }}
          value={newStatus}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
        <Button  loading={isSubmitting} onClick={handleUpdateStatus}>
          Update Status
        </Button>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
      </FormLayout>
    </Form>
  );
};

export default UpdateStatus;

