import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  Form
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  IndexTable,
  DataTable,
  useIndexResourceState,
  EmptyState,
  Thumbnail,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const wishlistData = await db.wishlist.findMany();
  const productIdArray = wishlistData.map((item) => item.productId);
  const wihslistProducts = await admin.rest.resources.Product.all({
    session: admin.rest.session,
    ids: productIdArray.join(","),
  });

  return json({ wishlistData, wihslistProducts });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);


  return json({

  });
};



export default function Index() {
  const nav = useNavigation();
  const { wishlistData, wihslistProducts } = useLoaderData();

  const actionData = useActionData();
  const submit = useSubmit();
  const shopify = useAppBridge();

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );
  const resourceName = {
    singular: "Item",
    plural: "Items",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(wihslistProducts.data);
  const rowMarkup = wihslistProducts.data.map(
    ({ id, image, title, vendor, updated_at }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail source={image.src} alt={image.alt} size="large" />
        </IndexTable.Cell>
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>{vendor}</IndexTable.Cell>
        <IndexTable.Cell>{updated_at}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  const dataTable = () => {
    const rows = wishlistData.map((item) => [
      item.id,
      item.customerId,
      item.productId,
      item.shop,
    ]);
    return (
      <DataTable
        columnContentTypes={["numeric", "text", "text", "text"]}
        headings={["Wishlist ID", "Customer ID", "Product ID", "Shop"]}
        rows={rows}
        showHeader={true}
      />
    );
  };

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page fullWidth={true}>
      <TitleBar title="Wishlist Items">
        

        
      </TitleBar>

      <BlockStack gap="50">
        <Layout>
          <Layout.Section>
            <Card>
              {!wishlistData.length > 0 ? (
                <EmptyState
                  heading="No Data To Display"
                  action={{ content: "Add transfer" }}
                  secondaryAction={{
                    content: "Learn more",
                    url: "https://help.shopify.com",
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>
                    Track and receive your incoming inventory from suppliers.
                  </p>
                </EmptyState>
              ) : (
                <IndexTable
                  resourceName={resourceName}
                  itemCount={wihslistProducts.data.length}
                  selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  headings={[
                    { title: "Product Image" },
                    { title: "Title" },
                    { title: "Vendor" },
                    { title: "Updated On" },
                  ]}
                >
                  {rowMarkup}
                </IndexTable>
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
