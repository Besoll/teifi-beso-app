import React, { useState } from "react";
import { Button, Form, FormLayout, TextField } from "@shopify/polaris";

type UpdateSKUProps = {
  onClose: () => void; // Callback to close the modal
};

const UpdateSKU = ({ onClose }: UpdateSKUProps) => {
  const [productId, setProductId] = useState<string>("");
  const [newSku, setNewSku] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdateSKU = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
  
    try {
      const response = await fetch("/api/update-sku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newSku }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to update SKU");
      }
  
      setSuccess(result.success);
      onClose();
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setProductId(text);
    } catch (err) {
      console.error("Failed to read from clipboard: ", err);
    }
  };

  return (
    <Form onSubmit={handleUpdateSKU}>
      <FormLayout>
        <TextField
          label="Product ID"
          value={productId}
          onChange={setProductId}
          autoComplete="off"
          requiredIndicator
        />
        <Button onClick={handlePasteFromClipboard} size="slim">
          Auto Paste
        </Button>
        <TextField
          label="New SKU"
          value={newSku}
          onChange={setNewSku}
          autoComplete="off"
          requiredIndicator
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
        <Button  loading={isSubmitting} onClick={handleUpdateSKU}>
          Update SKU
        </Button>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
      </FormLayout>
    </Form>
  );
};

export default UpdateSKU;