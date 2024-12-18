# Shopify App - Product Management Tool

This Shopify app is a **Remix-based application** built with **TypeScript**, providing tools to add products, update SKUs, and manage product statuses directly in the Shopify admin. It uses **Shopify Polaris** for the UI and interacts with Shopify's **GraphQL Admin API**.

---

## 🚀 Features

- **Add New Products**: Quickly create new products with titles, SKUs, and statuses.
- **Update Product SKU**: Modify SKUs with proper permissions (`write_inventory` scope).
- **Manage Product Status**: Update product statuses (`Active`, `Draft`, or `Archived`).
- **Clipboard Tools**: Use "Click-to-Copy" and "Click-to-Paste" for smooth data transfers.
- **Responsive UI**: Modern UI using Shopify Polaris.
- **Pagination**: Browse products using cursor-based pagination.

---

## 🛠️ Tech Stack

- **Framework**: Remix
- **Language**: TypeScript
- **UI**: Shopify Polaris
- **Backend**: Shopify GraphQL Admin API
- **Environment**: Node.js (v18+)

---

## 📦 Installation and Setup

Follow these steps to set up the app locally:

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/).
2. **Shopify Partner Account**: [Create a Shopify Partner Account](https://partners.shopify.com/signup).
3. **Development Store**: Use a [Shopify Development Store](https://help.shopify.com/en/partners/dashboard/development-stores).

---

### Quick Start

Run the following commands to install and start the app:

```bash
# Initialize the project
npm install

# Deploy the app configuration
npm run deploy

# Start the development server
npm run dev
Open the **preview URL** provided in your terminal.  
Install the app into your Shopify store.  
🎉 **Enjoy!** 🎉

---

## Update Scopes to Modify SKU

Shopify treats SKUs as sensitive data. To update SKUs, you need to add the `write_inventory` scope.

### Steps to Update Scopes

1. Open the `shopify.app.toml` file and update the `scopes` section:

   ```toml
   scopes = "write_products, write_inventory"
Deploy the updated configuration:

bash
Copy code
npm run deploy
Restart the development server:

bash
Copy code
npm run dev
Open the preview URL and update the app in the Shopify Admin.

🎉 Enjoy Again! 🎉

🌐 Environment Variables
Add the following environment variables to your .env file:

bash
Copy code
SHOPIFY_API_KEY=b557b91e9cd94f4cc1b8eba5771e3663
SHOPIFY_ACCESS_TOKEN=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
SHOPIFY_API_URL=https://teifi-jobs-68005ff9.myshopify.com
🧩 How to Use
Add a New Product
Navigate to the "Add Product" section.
Fill in the product details (Title, SKU, Status).
Click the Create Product button.
Update Product SKU
Go to the "Update SKU" section.
Enter the new SKU for the selected product.
Click the Update button.
Note: To update SKUs, ensure your app has the write_inventory scope.

Manage Product Status
Select a product from the list.
Use the Status Update dropdown to change the product status:
Active
Draft
Archived
Clipboard Integration
Use Click-to-Copy for quick copying of product or variant IDs.
Use Click-to-Paste to paste copied IDs where needed.
Data resets automatically after 5 seconds.
🔧 Scripts
Command	Description
npm install	Install project dependencies
npm run dev	Start the development server
npm run deploy	Deploy the app to Shopify
npm run shopify app config push	Push updated app configuration


##  Project Structure
.
├── app/
│   ├── routes/
│   │   ├── api.update-sku.ts       # Handles SKU updates
│   │   ├── api.create-product.ts   # Handles product creation
│   ├── shopify.server.ts           # Shopify API interactions
│   ├── app.products.tsx            # Product management interface
├── shopify.app.toml                # Shopify app configuration
├── package.json                    # Project dependencies and scripts
├── .env                            # Environment variables
└── prisma/                         # Prisma database configuration



Notes
SKU Updates Require Special Permissions
To update SKUs, your app must include the write_inventory scope. Due to Shopify's latest rules, SKUs are now considered sensitive data.

Important:
If you do not have access to teifi-jobs-68005ff9.myshopify.com, the app must be redeployed to your own development store with updated scopes.

💡 Additional Features
Click-to-Copy / Paste: Simplifies data handling.
Status Update Dropdown: Quickly update product statuses.
5-Second Clipboard Reset: Ensures smooth and clear UX.
Create Product Button: Seamless product creation flow.
🔗 Repository
GitHub: Besoll
📧 Contact
For questions or collaboration, feel free to reach out:

Email: beso@besok-k.nl
Phone: +31 613 73 45 46
📜 License
This project is licensed under the MIT License.

🎉 Enjoy building with Shopify and Remix! 🎉


### How to Use This:
1. Copy the content above.
2. Paste it into the `README.md` file of your project.
3. Save the file and commit it to your GitHub repository.

This will render exactly as you see it, with proper headings, code blocks, and sections. Let me know if anything else is needed! 🚀

