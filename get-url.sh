#!/bin/bash
API_SUBSTITUTION=".execute-api.localhost.localstack.cloud:4566/prod"

PRODUCTS_API_ID=$(awslocal apigateway get-rest-apis | jq '.items[] | select( .name | contains("ShopAPI")) | .id' | sed 's/"//g')
PRODUCTS_API_URL="https://${PRODUCTS_API_ID}${API_SUBSTITUTION}"


# Replace path in products.ts with fresh api-gateway url
sed -i'.bak' "s|\`\${API_PATHS\.bff}.product\`|\"$PRODUCTS_API_URL/products\"|g" src/queries/products.ts
sed -i'.bak' "s|\`\${API_PATHS\.bff}.product/\${id}\`|\`$PRODUCTS_API_URL/products/\${id}\`|g" src/queries/products.ts
sed -i'.bak' "s|https.*/products|$PRODUCTS_API_URL/products|g" src/queries/products.ts
rm src/queries/products.ts.bak

# Replace path in apiPath.ts fresh api-gateway url
IMPORT_API_ID=$(awslocal apigateway get-rest-apis | jq '.items[] | select( .name | contains("ImportApi")) | .id' | sed 's/"//g')
IMPORT_API_URL="import: \"https:\/\/$IMPORT_API_ID.execute-api.localhost.localstack.cloud:4566\/prod\","
API_PATH=$(sed 's/import.*$/'"$IMPORT_API_URL"'/' ./src/constants/apiPaths.ts)
echo "$API_PATH" > ./src/constants/apiPaths.ts

npm run lint
