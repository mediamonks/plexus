# TODO Items

## High Priority / Architecture

- **Move system instructions to calling app** 
- **Create npm lib** 
- **Refactor config utility function** - The main config.get() function needs refactoring based on all possible use-cases (`src/utils/config.ts:43`)
- **Add global config flag support** - Use flag to determine whether global config should be included in config retrieval (`src/utils/config.ts:41`)
- Convert remaining non-class files to classes

## Data Source Improvements

### Backwards Compatibility
- **Remove backwards compatibility for DataSource.isDynamic** - Currently checking both uri and source formats (`src/entities/data-sources/DataSource.ts:84`)
- **Remove backwards compatibility for DataSource type parsing** - Currently splitting type string for dataType (`src/entities/data-sources/DataSource.ts:98`)
- **Remove backwards compatibility for DataSource target parsing** - Currently splitting type string for target (`src/entities/data-sources/DataSource.ts:167`)
- **Remove backwards compatibility for DriveDataSourceBehavior ID** - Currently falling back to source for ID (`src/entities/data-sources/platform/DriveDataSourceBehavior.ts:29`)
- **Remove backwards compatibility for GcsDataSourceBehavior URI** - Currently falling back to source for URI (`src/entities/data-sources/platform/GcsDataSourceBehavior.ts:26`)

### Target Behaviors
- **Support mixed/unknown data types** - Currently only handles specific data types (`src/entities/data-sources/DataSource.ts:109`)
- **Add incremental ingesting support** - Vector target currently drops and recreates entire dataset (`src/entities/data-sources/target/VectorTargetDataSourceBehavior.ts:69`)
- **Implement file copying to GCS** - Files target should ingest by copying files to own GCS bucket (`src/entities/data-sources/target/FileTargetDataSourceBehavior.ts:14`)
- **Add search support for raw text targets** - Currently unclear what should happen for search queries (`src/entities/data-sources/target/RawTextTargetDataSourceBehavior.ts:21`)
- **Add spreadsheet support for raw data targets** - Currently missing spreadsheet handling (`src/entities/data-sources/target/RawDataTargetDataSourceBehavior.ts:17`)
- **Implement random selection for unsorted data** - Consider random selection when not sorting results (`src/entities/data-sources/target/RawDataTargetDataSourceBehavior.ts:54`)

## Service Improvements

### Azure Service
- **Dynamic deployment name construction** - Construct/retrieve deploymentName based on model selection instead of hardcoding (`src/services/azure.ts:97`)

### Drive Service
- **Rewrite mimeType shortcuts** - Current file type detection relies on mimeType shortcuts that should be rewritten (`src/services/drive.ts:139`)
- **Use fileContent.data directly** - Consider using fileContent.data directly instead of Buffer.concat (`src/services/drive.ts:216`)
- **Abstract common file cache logic** - Abstract file caching logic similar to gcs.js implementation (`src/services/drive.ts:338`)

## Utility Improvements

### PDF Processing
- **Add OCR capability for image-heavy PDFs** - Support PDFs with mostly text in images through OCR (`src/utils/pdf.ts:13`)

### History Management
- **Fix race condition in History class** - The _ready flag is not actually used, allowing race conditions (`src/utils/History.ts:25`)

## Type System
- **Improve RequestPayload type definition** - The RequestPayload type need more thinking about its structure (`src/types/common.ts:14`)

## Catalog System
- **Review value assignment in DataSourceCatalogField** - Unclear if assignment to this._value is needed (`src/entities/catalog/DataSourceCatalogField.ts:87`)
