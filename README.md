# Plexus

Plexus is a flexible AI platform for orchestrating multi-agent LLM workflows. It provides a configurable framework for building complex AI-powered applications using specialized agents that can handle any LLM-based task.

## Overview

Plexus employs a multi-agent architecture where different AI agents can be configured to handle specific aspects of any LLM-based workflow. The platform is designed to be highly flexible, allowing you to define custom agents, data sources, and processing pipelines for your specific use case.
One of its key features is being able to ingest data from online resources - like Google Drive, Google Cloud Storage, or APIs - process it, and store it in a vector database or other processed state, which can then be used to power agents.
Additionally, it enforces a strict structure to help separate instructions from data, which aids in LLM performance and output quality, as well as helps protect against injection attacks.

## Getting Started

See [`config/example.json`](config/example.json) for a minimal working configuration that demonstrates the core features of Plexus. This example includes:

- **A two-agent pipeline**: a `researcher` agent that retrieves and compiles information, followed by a `summarizer` agent that creates a concise response
- **A data source** pointing to documents in Google Cloud Storage, processed as vector embeddings
- **A catalog** with an input field, a data field for RAG retrieval, and output fields that chain the agents together

To use this example:
1. Update the `uri` in the data source to point to your documents
2. Run `plexus ingest` to process and index the documents
3. Run `plexus invoke '{"prompt": "Your question here"}'` to query the assistant

See the [Usage Modes](#usage-modes) section for details on running Plexus as a service, SDK, or CLI, and the [Configuration](#configuration) section for the full list of options.

## How it Works

Plexus consists of 3 core entities: Agents, Data Sources, and the Catalog.

The Catalog is a definition of all data fields that exist in your system. These fields can function as context for agents, or as output of the process.

Catalog fields come in 3 types: input, output and data. Input fields are automatically populated by values passed into the workflow. Output fields are fields that are populated by agents. And data fields are populated by the content of data sources.

Agents consist of instructions (the system prompt), and a set of context fields. An agent's input consists of these instructions, and a JSON object containing the runtime values for all context fields, as populated by the Catalog. Agents can also have access to data sources via tool calling.

When a workflow is invoked, the Catalog will start to populate the fields defined by the workflow's `output` configuration. For output fields, this means an Agent will need to be invoked. This Agent will in turn require certain fields for its context, which causes the Catalog to start populating those fields, and so on.
This ensures that the workflow is constructed in a way that all necessary operations are executed in the right order, without unnecessary steps, and as soon as possible, ensuring optimal performance.
When a data type field value is requested, the corresponding data source is queried, as explained in the Data Sources section.

## Data Sources
Data sources point to a specific online resource. This can be a Google Drive file or folder, a Google Cloud Storage Bucket object or folder, or an API endpoint.

### Ingesting
Data sources can be ingested using the `/ingest` endpoint. This is necessary for `vector`-target data sources and recommended for all data sources that are not dynamic.

### Dynamic data sources
Dynamic data sources are data sources that can vary in exact URI on each invocation, based on input fields. These kind of data sources can not be ingested.
A data source becomes dynamic by using any amount of catalog field placeholders in its `uri` property, of the form `{fieldName}`. E.g. `gs://my-bucket/{folderName}/{fileName}.pdf`.

### Targets
Data sources can be processed in several ways, determined by their `target` property:
#### Raw (structured/unstructured): `raw`
The data source will be ingested as plain text or jsonl data, which can be fed as such directly into an agent.
#### Vector embeddings (unstructured): `vector`
Vector embeddings will be generated for distinct chunks of each document in the data source. These embeddings are then stored alongside their source text in a vector database, which can be queried as part of a catalog field's query configuration, or via a tool call. The catalog field represents the resulting set of text chunks which can then be used by an agent. This option requires ingestion prior to invocation.
#### Vector embeddings (structured): `vector`
The data will be converted to JSONL and vector embeddings will be generated for each record based on a specific set of fields in the data set, determined by the `vectorFields` property of the data source configuration. These embeddings are then stored alongside their source record in a vector database, which can be queried as part of a catalog field's query configuration, or via a tool call. The catalog field represents the resulting set of records which can then be used by an agent. This option requires ingestion prior to invocation.
#### Digest (unstructured only): `digest`
The combined text of the data source will be run through an LLM to generate a digest or summary. `instructions` can be provided as part of the data source configuration to instruct the LLM how to summarize. If omitted, a basic summarization prompt is used. The resulting digest can then be used by an agent.
#### File: `file`
The files in the data source will be converted to a mime type supported by the selected LLM, and when used by an agent, will be passed as-is to the LLM, including its original file name for context. If used for tool calling, the files will be indexed and summarized.

### Data Types
Most targets require you to specify whether the data source should be processed as unstructured data (text) or structured data (data).
This is specified in the `dataType` property of the data source configuration and determines how the data is interpreted and fed to the LLM, as well has how vector searches are performed.

### Supported File Types
When using an origin that contains files (Google Drive or Google Cloud Storage), certain file types are supported depending on the target and data type.
The following table shows which combinations of file type and target or data type are currently supported:

| File type       | dataType: text | dataType: data | target: file |
|-----------------|:---------------|:---------------|:-------------|
| PDF             | Yes            | No             | Yes          |
| TXT             | Yes            | No             | Yes          |
| JSON            | No             | No             | Yes          |
| JSONL           | No             | Yes\*          | No           |
| DOCX            | Yes            | No             | Yes          |
| XLSX            | No             | Yes\**         | Yes          |
| PPTX            | No             | No             | Yes          |
| Google Doc      | Yes\**         | No             | Yes\**       |
| Google Sheet    | No             | Yes\**         | Yes\**       | 
| Google Slides   | No             | No             | Yes\**       |
| PNG             | No             | No             | Yes          |
| JPEG            | No             | No             | Yes          |

\* Applies to `gcs` origin only.

\** Applies to `drive` origin only.

## Usage Modes
Plexus can be used in three different ways: as a service, as a CLI, or as an SDK.

### Plexus as a Service

#### API Reference

Plexus provides a REST API at `https://plexus-gateway-28etw3xg.ew.gateway.dev/api`.
Each request should be accompanied by an `X-Api-Key` header. Contact [Richard Heuser](mailto:richard.heuser@monks.com) for an API key. 
It has the following endpoints:

##### POST `/invoke`

Invokes an agent workflow.

**Request Payload:**
```json
{
  "threadId": "optional-thread-id",
  "fields": {
    // Input fields as defined in your catalog configuration
  },
  "config": {
    // Configuration
  }
}
```

**Payload Fields:**
- **`threadId`** (string, optional): ID of existing conversation thread to continue
- **`fields`** (object, optional): Any input fields defined in your catalog configuration
- **`config`** (object, optional): The configuration object

**Response:**
```json
{
  "result": {
    "output": {
      // Output field values as defined in your output configuration
    },
    "threadId": "uuid-string",
    "fields": {
      // Field values as provided in the request payload
    }
  },
  "debug": {
    // Debug information
  },
  "performance": {
    // Performance metrics
  },
  "error": null // Error message if applicable
}
```

**Response Fields:**
- **`output`** (object): Output field values as defined in your `output` configuration
- **`threadId`** (string): Unique identifier for the conversation thread
- **`fields`** (object): Field values as provided in the request payload

##### GET `/fields/{field}`

Retrieves available options for a specific input field.

**Path Parameters:**
- **`field`** (string): Name of the field to start options for

**Response:**
```json
{
  "result": [
    {
      "id": "option-id",
      "label": "Option Label",
      "description": "Option description"
    }
  ],
  "debug": {
    // Debug information
  },
  "performance": {
    // Performance metrics
  },
  "error": null // Error message if applicable
}
```

**Response Fields:**
- **`id`** (string): Unique identifier for the option
- **`label`** (string): Display label for the option
- **`description`** (string): Description of the option

##### GET `/thread/{threadId}`

Retrieves a conversation thread with its history and last interaction details.

**Path Parameters:**
- **`threadId`** (string): ID of the thread to retrieve

**Response:**
```json
{
  "result": {
    "history": [
      // Array of conversation history items
    ],
    "output": {
      // Generated output from last interaction
    }
  },
  "debug": {
    // Debug information
  },
  "performance": {
    // Performance metrics
  },
  "error": null // Error message if applicable
}
```

**Response Fields:**
- **`history`** (array): The conversation history
- **`output`** (object): Generated output from last interaction

##### POST `/ingest/{namespace}`

Ingests all static data sources for a given namespace.

**Path Parameters:**
- **`namespace`** (string, optional): Namespace for which to ingest data. If omitted, all data sources will be ingested.

**Request Payload:**
```json
{
  "config": {
    // Configuration
  }
}
```

**Payload Fields:**
- **`config`** (object, optional): Runtime configuration overrides

##### GET `/config`

Retrieves the default configuration for the service.

**Response:**
```json
{
  "result": {
    // Complete configuration object
  },
  "debug": {
    // Debug information
  },
  "performance": {
    // Performance metrics
  },
  "error": null // Error message if applicable
}
```

**Response Fields:**
- Returns the complete default configuration object as defined in the service

### Plexus SDK

Plexus can be used as an SDK in your Node.js application:

```javascript
const Plexus = require('plexus');
const config = require('./config.json');

const plexus = new Plexus(config);

// Invoke the pipeline
const result = await plexus.invoke({ userInput: 'Hello' });
console.log(result.output);

// Continue a conversation thread
const thread = plexus.thread(result.threadId);
const followUp = await thread.invoke({ userInput: 'Tell me more' });
console.log(followUp.output);
```

**Installation:**
```bash
npm install github:mediamonks/plexus
```

**API:**
- **`new Plexus(config)`** - Create a new Plexus instance with a configuration object.
- **`plexus.invoke(fields)`** - Invoke the pipeline with the given input fields. Returns `{ output, threadId, fields }`.
- **`plexus.ingest(namespace?)`** - Ingest data sources, optionally filtered by namespace.
- **`plexus.thread(threadId?)`** - Get or create a conversation thread.

### Plexus CLI

In order to use Plexus as a CLI, follow these steps:
- Install node.js v22 or higher and npm
- Install Plexus: `npm install -g github:mediamonks/plexus`
- Create a `config.json` configuration file. See the [Configuration](#configuration) section for more information.
- Run your configuration: `plexus [OPTIONS] <command> [arguments]`

Alternatively, run without global installation using `npx plexus` from a directory where Plexus is installed as a dependency.

## Configuration

The configuration object has the following top-level structure. When using Plexus as a service, all top-level fields are optional and will fall back to service defaults if not provided:

```json
{
  "projectId": "your-gcp-project",
  "location": "europe-west1",
  "tempPath": "./temp/",
  "instructionsPath": "gs://my-bucket/instructions",
  "profiling": true,
  "dataDumps": false,
  "debug": true,
  "waitForThreadUpdate": false,
  "output": ["field1", "field2"],
  "agents": { /* agent configurations */ },
  "catalog": { /* field definitions */ },
  "data-sources": { /* data source configurations */ },
  "input-fields": { /* input field options */ },
  "llm": { /* LLM settings */ },
  "azure": { /* Azure OpenAI settings */ },
  "genai": { /* Google GenAI settings */ },
  "openai": { /* OpenAI settings */ },
  "local-llm": { /* Local LLM settings */ },
  "drive": { /* Google Drive settings */ },
  "firestore": { /* Firestore settings */ },
  "lancedb": { /* LanceDB settings */ },
  "vectordb": { /* vector database settings */ },
  "storage": { /* internal file storage settings */ },
  "postback": { /* postback configuration */ }
}
```

## Global Settings

Top-level configuration options that apply across the entire platform:
- **`platform`** (string): Primary AI platform ("google", "azure", "openai", "local")
- **`embeddingPlatform`** (string): AI platform for text embeddings ("google", "azure", "openai")
- **`waitForThreadUpdate`** (boolean): Whether to wait for the conversation thread to be updated before returning a response. Enabling this will increase response time, but will guarantee conversation consistency in scenarios where the `invoke` endpoint is called in quick succession.
- **`instructionsPath`** (string): Root Google Cloud Storage path for agent and digest instruction files
- **`output`** (array): List of output fields to return
- **`profiling`** (boolean): Whether to output performance metrics
- **`debug`** (boolean): Whether to output debug information
- **`dataDumps`** (boolean): Whether to output data dumps for debugging

The following top-level configuration options are only relevant when using Plexus as a CLI or SDK:
- **`projectId`** (string): Google Cloud Project ID
- **`location`** (string): Default Google Cloud region
- **`tempPath`** (string): Path for temporary files

## Entities

These are the core entities within Plexus: **Agents**, **Data Sources**, and the **Catalog**. Their configuration determine the actual functionality of the implementation.

### `agents`

Defines behavior and context for each AI agent in your workflow. Each agent is identified by a unique key:

```json
{
  "agents": {
    "agent-id": {
      "instructions": "gs://my-bucket/instructions.txt",
      "context": ["field1", "field2"],
      "temperature": 0.7,
      "useHistory": true,
      "required": ["requiredField"],
      "outputTokens": 1024,
      "dataSources": ["data-source-id"],
      "serialize": ["collectionField", "itemField"]
    }
  }
}
```

**Agent Properties:**
- **`instructions`** (string): GOOGLE_CLOUD_STORAGE path to the file containing the instructions (system prompt) for the agent, or the literal instructions themselves. If omitted, the agent will attempt to read its instructions from a path constructed as follows: `{instructionsPath from global config}/{agent id}.txt`. **Note**: input and output format instructions are automatically added by Plexus, based on the Catalog configuration.
- **`context`** (array): List of catalog fields the agent should receive.
- **`temperature`** (number, optional): AI model temperature setting (0.0-1.0).
- **`useHistory`** (boolean, optional): Whether to provide the agent with the conversation history.
- **`required`** (array, optional): Required (typically `input`-type) context fields for the agent. If a required field is left empty, the agent will not run and will simply return an empty response object, but the workflow will continue as normal.
- **`outputTokens`** (number): Maximum output tokens for this agent
- **`dataSources`** (array, optional): List of data source IDs to make available to the agent via tool calling.
- **`serialize`** (array, optional): Enables serialized invocation over a collection. Expects a tuple of `[collectionFieldName, itemFieldName]`. The agent will be invoked once for each item in the collection field, with the item available as the specified item field name.

### `catalog`

Defines all fields that exist in the workflow and maps them to input parameters, agent output fields, or data sources.

```json
{
  "catalog": {
    "someInputField": {
      "type": "input",
      "field": "userInput",
      "required": true,
      "example": "the user's input"
    },
    "someOutputField": {
      "type": "output",
      "agent": "agent-name",
      "field": "result",
      "example": "the result of the operation"
    },
    "someDataField": {
      "type": "data",
      "source": "data-source-id",
      "example": [
        { "name": "John", "age": 30 }
      ],
      "query": {
        "input": "someInputField",
        "filter": { "age": "targetAge" },
        "limit": 5,
        "fields": ["name", "age"],
        "sort": "name"
      }
    }
  }
}
```

**Field Types:**
- **`input`**: User-provided input fields
- **`output`**: Agent-generated output fields
- **`data`**: Data source-backed fields

**Common Properties:**
- **`type`** (string): Field type ("input", "output", or "data")
- **`example`** (any): Example value used to provide instructions to the LLM about how to interpret and/or populate a field

**Input Fields:**
These take their value directly from the request payload.
- **`field`** (string): Name of the field in the request payload
- **`required`** (boolean, optional): Whether the field is required. If `true`, the workflow will return an error if the field is missing from the request payload.
- **`fileName`** (string, optional): If specified, the input value will be interpreted as the base64 contents of a file.
- **`mimeType`** (string, optional): Required if `fileName` is set. Specifies the mimeType of the file contents.

**Output Fields:**
These take their value from the output object of an agent.
- **`agent`** (string): Agent name
- **`field`** (string): Name of the field in the output object
- **`description`** (string, optional): Description of the field, used in the output schema provided to the agent.
- **`required`** (boolean, optional): Whether the field is required in the agent's output. If `true`, the workflow will error if the agent fails to produce this field.

**Data Fields:**
These take their value from a data source.
- **`source`** (string): Data source identifier, points to a data source defined in the `data-sources` section
- **`query`** (object, optional): Properties that determine if and how the data from the data source should be queried. If not specified, the source data will always be used in its entirety (after `target`-based processing applies).
  - **`input`** (string, optional): Performs a text search against an unstructured data source, using the value of the given catalog field as input.
  - **`filter`** (object, optional): Filter criteria for queries against a structured data source, should consist of key-value pairs, where the key is the field name in the source data set, and the value is the name of a catalog field, which value will be used as the filter value.
  - **`limit`** (number, optional): Maximum number of results for any type of query.
  - **`fields`** (array, optional): Specific fields to retrieve when querying a structured data source.
  - **`sort`** (string, optional): Which field to sort by when querying a structured data source.

### `data-sources`

Defines available data sources and their properties:

```json
{
  "data-sources": {
    "source-id": {
      "namespace": "my-namespace",
      "origin": "drive",
      "uri": "https://drive.google.com/drive/folders/someGoogleDriveFolderId",
      "dataType": "text",
      "target": "vector",
      "instructions": "processing-instructions"
    }
  }
}
```

**Data Source Properties:**
- **`uri`** (string): The URI pointing to the data source, can be a Google Drive URL, a Google Cloud Storage path, or an API endpoint. A URI can contain catalog field values, of the form `{fieldName}`, which will make the data source dynamic.
- **`target`** (string): Target for the data source: "raw" for raw text or data, "vector" for vector embeddings, "file" for unprocessed files (to feed as-is into an LLM, currently supported for Google GenAI only), "digest" for AI-generated summaries ("text" only).
- **`origin`** (string, optional): Data origin platform ("gcs", "drive", "api"), will be derived from the URI if not specified.
- **`dataType`** (string, optional): Type of data in the source: "text" for unstructured data, "data" for structured data. Required for `target` types: "raw" and "vector". Ignored for `digest` and `file`.
- **`namespace`** (string, optional): Logical grouping namespace, only used for batch ingestion.
- **`isFolder`** (boolean, optional): Whether the `gcs` or `drive` origin data source is a folder. Will be detected if not specified, at a slight performance hit. 
- **`allowCache`** (boolean, optional): Whether to allow caching of the data source, defaults to true. Set this to `false` for data sources of which the content can change between invocations.
- **`instructions`** (string, optional): Processing instructions for a `digest`-type data source.
- **`vectorFields`** (array, optional): List of field names to use for generating vector embeddings for a `data`-type, `vector`-target data source.
- **`incremental`** (boolean, optional): For `vector` and `file` targets, whether to append new records/files during ingestion instead of replacing all data.
- **`enableToolCalling`** (boolean, optional): For `file` target, whether to enable tool calling for this data source. When enabled, files will be indexed and summarized during ingestion.
- **`summaryPrompt`** (string, optional): For `file` target with `enableToolCalling`, custom prompt for generating file summaries during ingestion.

### `input-fields`

Defines available options for input fields. If these are defined for an input field, the input value will be mapped to the `id` of the selected option and the corresponding `label` will be used as the value for inference.
This also restricts allowed input values to the defined options.

```json
{
  "input-fields": {
    "fieldName": {
      "option1": {
        "id": "option1",
        "label": "Option 1"
      },
      "option2": {
        "id": "option2", 
        "label": "Option 2"
      }
    }
  }
}
```

**Option Properties:**
- **`id`** (string): Unique identifier
- **`label`** (string): Display label
- **`description`** (string, optional): Description of the option, used as the actual value for inference if provided.

## LLM

Configuration of the LLM and the various LLM services. 

### `llm`

Configuration for the LLM. Can also be set at the global level.

```json
{
  "llm": {
    "platform": "google",
    "model": "gemini-2.5-flash-lite",
    "embeddingPlatform": "google",
    "embeddingModel": "gemini-embedding-001",
    "temperature": 0.7,
    "outputTokens": 1024
  }
}
```

- **`platform`** (string): Primary AI platform ("google", "azure", "openai")
- **`model`** (string): Primary model name, can also be set at the platform level
- **`embeddingPlatform`** (string): AI platform for text embeddings ("google", "azure", "openai")
- **`embeddingModel`** (string): Default embedding model name
- **`temperature`** (number, optional): Default AI model temperature setting (0.0-1.0), defaults to 0
- **`outputTokens`** (number): Default maximum output tokens

### `azure`

Configuration for Azure OpenAI services:

```json
{
  "azure": {
    "model": "gpt-4o-mini",
    "embeddingModel": "text-embedding-ada-002",
    "baseUrl": "https://your-resource.openai.azure.com/",
    "apiVersion": "2025-01-01-preview",
    "embeddingApiVersion": "2023-05-15",
    "outputTokens": 1024
  }
}
```

- **`model`** (string): Name of the deployed model, can also be set at the `llm` level
- **`embeddingModel`** (string): Model name for text embeddings, defaults to the `embeddingModel` set at the `llm` level
- **`baseUrl`** (string): Azure OpenAI endpoint URL
- **`apiVersion`** (string): API version for chat completions
- **`embeddingApiVersion`** (string): API version for embeddings
- **`outputTokens`** (number): Default maximum output tokens when using this LLM platform

### `genai`

Google Generative AI (Gemini) configuration:

```json
{
  "genai": {
    "model": "gemini-2.5-flash-lite",
    "embeddingModel": "gemini-embedding-001",
    "quotaDelayMs": 500,
    "useVertexAi": true,
    "projectId": "your-project-id",
    "location": "your-location",
    "embeddingLocation": "europe-west1",
    "apiKey": "your-api-key",
    "outputTokens": 1024
  }
}
```

- **`model`** (string): Primary model name, can also be set at the `llm` level
- **`embeddingModel`** (string): Model name for text embeddings, defaults to the `embeddingModel` set at the `llm` level
- **`quotaDelayMs`** (number, optional): Delay between API calls for quota management
- **`useVertexAi`** (boolean, optional): Whether to use Vertex AI instead of the GenAI API
- **`projectId`** (string, optional): GCP project to use, defaults to the project associated with the API key, can also be set at the global level, only applies when `useVertexAi` is true
- **`location`** (string, optional): GCP location to use, defaults to the location associated with the API key, can also be set at the global level, only applies when `useVertexAi` is true
- **`embeddingLocation`** (string, optional): Region for embedding API, defaults to `genai.location`, only applies when `useVertexAi` is true
- **`apiKey`** (number, optional): Your custom Google AI Studio API key, Plexus will use its own if not provided, only applies when `useVertexAi` is false
- **`outputTokens`** (number): Default maximum output tokens when using this LLM platform

### `openai`

OpenAI API configuration:

```json
{
  "openai": {
    "model": "gpt-4o-mini",
    "embeddingModel": "text-embedding-3-small",
    "outputTokens": 1024
  }
}
```

- **`model`** (string): Primary model name, can also be set at the `llm` level
- **`embeddingModel`** (string): Model name for text embeddings, defaults to the `embeddingModel` set at the `llm` level
- **`outputTokens`** (number): Default maximum output tokens when using this LLM platform

### `local-llm`

Local LLM configuration. Will download a model from huggingface.com and run it in a local Docker container.
Requires Docker to be installed. Does not yet support generating embeddings.

```json
{
  "local-llm": {
    "model": "ggml-org/Qwen2-VL-2B-Instruct-GGUF",
    "image": "llamacpp",
    "contextSize": 65536
  }
}
```

- **`model`** (string): Primary model ID on huggingface.com, can also be set at the `llm` level
- **`image`** (tgi|llamacpp): Which Docker image to use, either TGI (ghcr.io/huggingface/text-generation-inference:2.4.0) or Llama.cpp (ghcr.io/ggml-org/llama.cpp:server-cuda)
- **`contextSize`** (number, optional): Context size for the model, defaults to 32768
- **`visionProjector`** (string, optional): Vision projector model ID for multimodal models (Llama.cpp only)

## Internal

Various internal settings.

### `drive`

Google Drive integration settings. Can also be set at the global level:

```json
{
  "drive": {
    "tempFolderId": "1GAohqXcRbIyu-Nk86GQxfRBAKAJtq_6y"
  }
}
```

- **`tempFolderId`** (string): Google Drive folder ID for temporary files

### `firestore`

Firestore database settings. Can also be set at the global level:

```json
{
  "firestore": {
    "databaseId": "your-database",
    "projectId": "your-project-id"
  }
}
```

- **`databaseId`** (string): Firestore database identifier
- **`projectId`** (string, optional): GCP project hosting the Firestore instance, defaults to the global `projectId`

### `lancedb`

LanceDB configuration:

```json
{
  "lancedb": {
    "databaseUri": "gs://your-bucket/lancedb",
    "rateLimitDelayMs": 1000
  }
}
```

- **`databaseUri`** (string, optional): Where LanceDB stores its files. If not set, `gs://<storage.bucket>/lancedb` is used.
- **`rateLimitDelayMs`** (number, optional): Delay between operations for quota management

### `storage`

Cloud storage settings:

```json
{
  "storage": {
    "bucket": "your-bucket"
  }
}
```

- **`bucket`** (string): Google Cloud Storage bucket used for storing generated files, e.g. ingested data.

### `vectordb`

Vector database engine selection:

```json
{
  "vectordb": {
    "engine": "lancedb"
  }
}
```

- **`engine`** (string, optional): Vector database engine to use. Options: `"lancedb"`, `"pgvector"`, `"cloudsql"`. Defaults to `"lancedb"`.

### `postback`

Configures a webhook for receiving real-time status updates during invocation.

```json
{
  "postback": {
    "url": "https://your-callback-url.com",
    "headers": {
      "Authorization": "Bearer token"
    }
  }
}
```

**Postback Properties:**
- **`url`** (string): The webhook URL to receive status updates
- **`headers`** (object): Additional HTTP headers, e.g. for authentication

**Payload format:**
```json
{
  "status": "Some operation",
  "isRunning": true
}
```
