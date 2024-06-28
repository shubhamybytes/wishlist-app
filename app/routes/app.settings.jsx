import { useState, useCallback } from "react";

import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  useBreakpoints,
  InlineGrid,
  TextField,
  Divider,
  RangeSlider,
  Button,
  
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import db from '../db.server'


export async function loader() {
  let settings = await db.settings.findFirst();
  
  return json(settings)
}

export async function action({request}) {
  const data = await request.formData();
  const setting = Object.fromEntries(data);
  
  await db.settings.upsert({
    where: {
      id: 1
    },
    update: {
      id: 1,
      name: setting.name,
      description: setting.description
    },
    create: {
      id: 1,
      name: setting.name,
      description: setting.description
    }
    
  })

  return json(setting)
}


export default function SettingsPage() {
  
  const { smUp } = useBreakpoints();
  const setting = useLoaderData();
  const [formData, setFormData] = useState(setting);

  
  return (
    <Page fullWidth={false}>
      <TitleBar title="Settings" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap={{ xs: "800", sm: "400" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box
                  as="section"
                  paddingInlineStart={{ xs: 400, sm: 0 }}
                  paddingInlineEnd={{ xs: 400, sm: 0 }}
                >
                  <BlockStack gap="400">
                    <Text as="h3" variant="headingMd">
                      Settings
                    </Text>
                  </BlockStack>
                </Box>
                <Card roundedAbove="sm">
                <Form method="POST">
                  <BlockStack gap="400">
                  
                    <TextField
                      
                      label="Name"
                      name="name"
                      value={formData?.name}
                      onChange={(value) =>
                        setFormData({ ...formData, name: value })
                      }
                    />
                    <TextField
                      
                      label="Description"
                      name="description"
                      value={formData?.description}
                      onChange={(value) =>
                        setFormData({ ...formData, description: value })
                      }
                    />
                    
                      <Button submit={true}>
                        Submit
                      </Button>
                    
                  </BlockStack>
                  </Form>
                </Card>
              </InlineGrid>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      
    </Page>
  );
}
