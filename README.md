# Plexus

Plexus is a flexible AI platform for orchestrating multi-agent LLM workflows. It provides a configurable framework for building complex AI-powered applications using specialized agents that can handle any LLM-based task.

## Overview

Plexus employs a multi-agent architecture where different AI agents can be configured to handle specific aspects of any LLM-based workflow. The platform is designed to be completely configurable, allowing you to define custom agents, data sources, and processing pipelines for your specific use case.
One of its key features is being able to ingest data from online resources - like Google Drive, Google Cloud Storage, or APIs - process it, and store it in a vector database or other processed state, which can then be used to power agents.

## How it Works

Plexus consists of 3 core entities: Agents, Data Sources, and the Catalog.

The Catalog is a definition of all data fields that exist in your system. These fields can function as context for agents, or as output of the process.

Catalog fields come in 3 types: input, output and data. Input fields are automatically populated by values passed in the request payload. Output fields are fields that are populated by agents. And data fields are populated by the content of data sources.

Agents consists of instructions (the system prompt), and a set of context fields. An agent's input consists of these instructions, and a JSON object containing the runtime values for all context fields, as populated by the Catalog.

When a workflow is invoked, the Catalog will first start to populate the fields defined by the workflow's `output` configuration. For output fields, this means an Agent will need to be invoked. This Agent will in turn require certain fields for its context, which causes the Catalog to start populating those fields, and so on.
This means the workflow is essentially built backwards, at runtime.
When a data type field value is requested, the corresponding data source will be queried. More on this in the Data Sources section. 

## Data Sources
Data sources point to a specific online resource. This can be a Google Drive file or folder, a Google Cloud Storage Bucket object or folder, or an API.

### Ingesting
Data sources can be ingested using the `/ingest` endpoint. This is necessary for `vector`-target data sources and recommended for all data sources that are not dynamic.

### Dynamic data sources
Dynamic data sources are data sources that can use a different location on each invocation, based on input fields. These kind of data sources can not be ingested.
A data source becomes dynamic by using any amount of catalog field placeholders in its `uri` property, of the form `{fieldName}`. E.g. `gs://my-bucket/{folderName}/{fileName}.pdf`.

### Targets
Data sources can be processed in several ways, determined by their `target` property:
#### Raw (structured/unstructured): `raw`
The data source will be ingested as plain text or jsonl data, which can be fed as such directly into an agent.
#### Vector embeddings (unstructured): `vector`
Vector embeddings will be generated for distinct chunks of each document in the data source. These embeddings are then stored alongside their source text in a vector database, which can be queried as part of a catalog field's query configuration. The catalog field represents the resulting set of text chunks which can then be used by an agent. This option requires ingestion prior to invocation.
#### Vector embeddings (structured): `vector`
The data will be converted to JSONL and vector embeddings will be generated for each record based on a specific field in the data set, determined by the `searchField` property of the data source configuration. These embeddings are then stored alongside their source record in a vector database, which can be queried as part of a catalog field's query configuration. The catalog field represents the resulting set of records which can then be used by an agent. This option requires ingestion prior to invocation.
#### Digest (unstructured only): `digest`
The combined text of the data source will be run through an LLM to generate a digest or summary. `instructions` can be provided as part of the data source configuration to instruct the LLM how to summarize. If omitted, a basic summarization prompt is used. The resulting digest can then be used by an agent.
#### File (Google GenAI only): `file`
The files in the data source will be converted to a mime type supported by the selected LLM if necessary, and when used by an agent, will be passed as-is to the LLM, including its original file name for context.

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
| JSONL           | No             | Yes*           | No           |
| DOCX            | Yes            | No             | Yes          |
| XLSX            | No             | Yes**          | Yes          |
| PPTX            | No             | No             | Yes          |
| Google Doc      | Yes**          | No             | Yes**        |
| Google Sheet    | No             | Yes**          | Yes**        | 
| Google Slides   | No             | No             | Yes**        |
| PNG             | No             | No             | Yes          |
| JPEG            | No             | No             | Yes          |
*: `gcs` origin only

**: `drive` origin only

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
    // Runtime configuration overrides
  }
}
```

**Payload Fields:**
- **`threadId`** (string, optional): ID of existing conversation thread to continue
- **`fields`** (object, optional): Any input fields defined in your catalog configuration
- **`config`** (object, optional): Runtime configuration overrides

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
    // Runtime configuration overrides
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
  "result":  {
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

### Plexus CLI

In order to use Plexus as a CLI, follow these steps:
- Install node.js v20 or higher and npm
- Clone the [repository](https://bitbucket.org/mediamonks/s-4-capital-mediamonks-met-applied-250351484-plexus/src/master/)
- Install dependencies: `npm i`
- Build: `npm run build`
- Create a `.json` configuration file in the `config/` folder. See the [Configuration](#configuration) section for more information.
- Run your configuration: `./plexus <command> <config-file-name> <arguments> <options>`

## Configuration

Plexus uses a flexible, hierarchical configuration system that supports multiple deployment patterns:

- **Static Configuration**: JSON files in the `config/` directory for base configuration
- **Runtime Configuration**: Dynamic overrides passed as request parameters
- **Flexible Structure**: Configuration can be provided as one large object or divided across multiple files
- **Merge Strategy**: Static and runtime configurations are automatically merged to determine the final runtime configuration

### Configuration Structure

The configuration object has the following top-level structure. All fields are optional and will fall back to service defaults if not provided:

```json
{
  "projectId": "your-gcp-project",
  "location": "europe-west1",
  "platform": "google",
  "embeddingPlatform": "google",
  "waitForThreadUpdate": false,
  "tempPath": "./temp/",
	"instructionsPath": "gs://my-bucket/instructions",
  "output": ["field1", "field2"],
	"profiling": true,
	"dataDumps": false,
	"debug": true,
  "postback": {
    "url": "https://your-callback-url.com",
    "headers": {
      "Authorization": "Bearer token"
    }
  },
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
	"lancedb": { /* vector database settings */ },
  "storage": { /* internal file storage settings */ }
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
- **`postback`** (object): The webhook for receiving status messages during invocation. It will receive POST requests with a payload of the following format: `{ "status": "Some operation", "isRunning": true }`.
	- **`url`** (string): URL
	- **`headers`** (object): Additional HTTP headers, e.g. for authentication

The following top-level configuration options are only relevant when using Plexus as a CLI:
- **`tempPath`** (string): Path for temporary files

The following top-level configuration options are only relevant when using Plexus as an SDK:
- **`projectId`** (string): Google Cloud Project ID
- **`location`** (string): Default Google Cloud region

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
      "outputTokens": 1024
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
- **`searchField`** (string, optional): Name of the field against which to perform vector searches for a `data`-type, `vector`-target data source.

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
