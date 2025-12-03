# TODO Items

## High Priority / Architecture

- **Create npm lib** 

## Data Source Improvements

### Backwards Compatibility
- **Remove backwards compatibility for DataSource.isDynamic** - Currently checking both uri and source formats (`src/entities/data-sources/DataSource.ts:84`)
- **Remove backwards compatibility for DataSource type parsing** - Currently splitting type string for dataType (`src/entities/data-sources/DataSource.ts:98`)
- **Remove backwards compatibility for DataSource target parsing** - Currently splitting type string for target (`src/entities/data-sources/DataSource.ts:167`)
- **Remove backwards compatibility for GoogleDriveDataSourceOrigin ID** - Currently falling back to source for ID (`src/entities/data-sources/platform/GoogleDriveDataSourceOrigin.ts:29`)
- **Remove backwards compatibility for GoogleCloudStorageDataSourceOrigin URI** - Currently falling back to source for URI (`src/entities/data-sources/platform/GoogleCloudStorageDataSourceOrigin.ts:26`)

### Target Behaviors
- **Support mixed/unknown data types** - Currently only handles specific data types (`src/entities/data-sources/DataSource.ts:109`)
- **Add search support for raw text targets** - Currently unclear what should happen for search queries (`src/entities/data-sources/target/RawTextTargetDataSourceBehavior.ts:21`)
- **Add spreadsheet support for raw data targets** - Currently missing spreadsheet handling (`src/entities/data-sources/target/RawTargetDataSource.ts:17`)
- **Implement random selection for unsorted data** - Consider random selection when not sorting results (`src/entities/data-sources/target/RawTargetDataSource.ts:54`)

## Service Improvements

### Azure Service
- **Dynamic deployment name construction** - Construct/retrieve deploymentName based on model selection instead of hardcoding (`src/services/azure.ts:97`)

## Utility Improvements

### PDF Processing
- **Add OCR capability for image-heavy PDFs** - Support PDFs with mostly text in images through OCR (`src/utils/pdf.ts:13`)

## Chris
- **Multimodal input/output** - base64
- **Local model support** - HuggingFace auto-download? Test with DeepSeek
- **Local execution** - Add CLI
- **UI**
