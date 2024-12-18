Shopify Remix App - Product Management Tool (TypeScript)
This Shopify app is built using Remix with TypeScript. It enables seamless management of products, including adding new products, updating SKUs, and managing product statuses. It leverages Shopify Polaris for UI components and uses the Shopify GraphQL Admin API for backend interactions.

Features
Add New Products: Create products with custom titles, SKUs, and statuses.
Update Product SKU: Modify the SKU for an existing product. (Requires write_inventory scope.)
Update Product Status: Change product statuses between Active, Draft, and Archived.
Clipboard Integration: Features "Click to Copy" and "Click to Paste" buttons for efficient product management.
Pagination Support: Cursor-based pagination for navigating through products.
Responsive UI: Built with Shopify Polaris for a clean and modern user experience.
Tech Stack
Framework: Remix
Language: TypeScript
UI Components: Shopify Polaris
Backend: Shopify GraphQL Admin API
Environment: Node.js (v18+)
Installation and Setup
Step 1: Initialize the Project
Run the following command to create a Shopify app using Remix and TypeScript:

bash
Copy code
npm init @shopify/app@latest
Select Remix as the framework.
Select TypeScript.
Provide the App Name when prompted.
Step 2: Install Dependencies and Start Development
Navigate to your app folder and start the development server:

bash
Copy code
cd <App Name>
npm run dev
Follow the prompts to install the app in your Shopify Admin.

Step 3: Configure Scopes and Redeploy
Open the shopify.app.toml file and update the scopes section to include the write_inventory scope:

toml
Copy code
scopes = "write_products, write_inventory"
Push the updated configuration to Shopify:

bash
Copy code
npm run shopify app config push
Restart the development server with a reset:

bash
Copy code
npm run dev -- --reset
Open the preview URL in your browser. (You will be asked to log into your Shopify Partner account.)

Install the app in your development store.

Step 4: Environment Variables
Add the following environment variables to your .env file:

bash
Copy code
SHOPIFY_API_KEY=b557b91e9cd94f4cc1b8eba5771e3663
SHOPIFY_ACCESS_TOKEN=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
SHOPIFY_API_URL=https://teifi-jobs-68005ff9.myshopify.com
How It Works: SKU Update Limitation
Updating a product SKU requires the write_inventory scope.
Shopify treats SKUs as sensitive data, and updating them is only permitted with this scope.
Note: Due to lack of access to the teifi-jobs-68005ff9.myshopify.com store, the app cannot test the scope on this store directly.
Solution: Redeploy the app with the correct scopes to your store for full functionality.
Usage Instructions
Add a New Product:

Click the "Add New Product" button.
Fill in the product details (title, SKU, status).
Click "Create Product".
Update Product SKU:

Click the "Update SKU" button.
Enter the new SKU.
Confirm the changes.
Update Product Status:

Use the "Update Status" button to select a new status (Active, Draft, or Archived).
Clipboard Integration:

Use "Click to Copy" for quick copying of product or variant IDs.
Copied values reset automatically after 5 seconds for improved UX.
Pagination:

Use the navigation buttons to browse products.
Scripts
Command	Description
npm run dev	Start the development server
npm run build	Build the app for production
npm run deploy	Deploy the app to Shopify
npm run shopify app config push	Push updated app configuration
Project Structure
app/: Contains Remix routes and components.
api.update-sku.ts: API for updating SKUs.
shopify.server.ts: Server-side API interaction.
shopify.app.toml: Shopify app configuration file.
Prerequisites
Node.js: Version 18+.
Shopify Partner Account: Required for development and deployment.
Development Store: A Shopify development store for testing.
Repository
GitHub: https://github.com/Besoll

Contact
For any inquiries, feel free to reach out:

Email: beso@besok-k.nl
Phone: +31 613 73 45 46
Notes
Testing on teifi-jobs:

Redeploy the app to the teifi-jobs-68005ff9.myshopify.com store with the correct scopes.
Follow the OAuth flow to install the app.
Features:

Click-to-Copy and Click-to-Paste with automatic reset after 5 seconds.
Product status updates with three options (Active, Draft, Archived).
Fully functional product creation.
License
This project is licensed under the MIT License.