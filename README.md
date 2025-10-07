# Plexus

Plexus is a flexible AI platform for orchestrating multi-agent LLM workflows. It provides a configurable framework for building complex AI-powered applications using specialized agents that can handle any LLM-based task.

## Overview

Plexus employs a multi-agent architecture where different AI agents can be configured to handle specific aspects of any LLM-based workflow. The platform is designed to be completely configurable, allowing you to define custom agents, data sources, and processing pipelines for your specific use case.

## How it Works

Plexus consists of 3 core entities: Agents, Data Sources, and the Catalog.

The Catalog is a definition of all data fields that exist in your system. These fields can function as context for agents, or as output of the process.

Catalog fields come in 3 types: input, output and data. Input fields are automatically populated by values passed in the request payload. Output fields are fields that are populated by agents. And data fields are populated by the content of data sources.

Agents consists of instructions (the system prompt), and a set of context fields. An agent's input consists of these instructions, and a JSON object containing the runtime values for all context fields, as populated by the Catalog.


When a workflow is invoked, the Catalog will first start to populate the fields defined by the workflow's `output` configuration. For output fields, this means an Agent will need to be invoked. This Agent will in turn require certain fields for its context, which causes the Catalog to start populating those fields, and so on.
This means the workflow is essentially built backwards, at runtime.
When a data type field value is requested, the corresponding data source will be queried. More on this in the Data Sources section. 

## Data Sources

Data sources point to a specific online resource. This can be a Google Drive file or folder, or a Google Cloud Storage Bucket object or folder.
The following file types are currently supported:

- **PDF** (unstructured)
- **TXT** (unstructured)
- **Google Doc** (unstructured, Google Drive only)
- **DOCX** (unstructured, Google Drive only)
- **JSON** (structured)
- **Google Sheet** (structured, Google Drive only)
- **XLSX** (structured, Google Drive only)
- **PNG** (`file` target only)
- **JPEG** (`file` target only)

### Ingesting
Data sources can be ingested using the `/ingest` endpoint. This is necessary for `vector`-target data sources and recommended for all data sources that are not dynamic.

### Dynamic data sources
Dynamic data sources are data sources that can use a different location on each invocation, based on input fields. These kind of data sources can not be ingested.
A data source becomes dynamic by using any amount of catalog field placeholders in its `uri` property, of the form `{fieldName}`. E.g. `gs://my-bucket/{folderName}/{fileName}.pdf`.

### Targets
Data sources can be processed in several ways, determined by their `target` property:
#### Raw text/data: `raw`
The data source will be ingested as plain text or jsonl data, which can be fed as such directly into an agent.
#### Vector embeddings (text/unstructured): `vector`
Vector embeddings will be generated for distinct chunks of each document in the data source. These embeddings are then stored alongside their source text in a vector database, which can be queried as part of a catalog field's query configuration. The catalog field represents the resulting set of text chunks which can then be used by an agent. This option requires ingestion prior to invocation.
#### Vector embeddings (data/structured): `vector`
The data will be converted to JSONL and vector embeddings will be generated for each record based on a specific field in the data set, determined by the `searchField` property of the data source configuration. These embeddings are then stored alongside their source record in a vector database, which can be queried as part of a catalog field's query configuration. The catalog field represents the resulting set of records which can then be used by an agent. This option requires ingestion prior to invocation.
#### Digest (text only): `digest`
The combined text of the data source will be run through an LLM to generate a digest or summary. `instructions` can be provided as part of the data source configuration to instruct the LLM how to summarize. If omitted, a basic summarization prompt is used. The resulting digest can then be used by an agent.
#### File (Google GenAI only): `file`
The files in the data source will be converted to a mime type supported by the selected LLM if necessary, and when used by an agent, will be passed as-is to the LLM, including its original file name for context.

## API Reference

Plexus provides a REST API with the following endpoints:

### POST `/invoke`

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
  "error": null,
	"output": {
		// Output field values as defined in your output configuration
	},
	"threadId": "uuid-string",
	"fields": {
		// Field values as provided in the request payload
	},
	"performance": {
		// Performance metrics
	},
	"debug": {
		// Debug information
	}
}
```

**Response Fields:**
- **`error`** (string|null): Error message if applicable, otherwise null
- **`output`** (object): Output field values as defined in your `output` configuration
- **`threadId`** (string): Unique identifier for the conversation thread
- **`fields`** (object): Field values as provided in the request payload
- **`performance`** (object): Performance metrics
- **`debug`** (object): Debug information

### GET `/fields/{field}`

Retrieves available options for a specific input field.

**Path Parameters:**
- **`field`** (string): Name of the field to get options for

**Response:**
```json
[
  {
    "id": "option-id",
    "label": "Option Label",
    "description": "Option description"
  }
]
```

**Response Fields:**
- **`id`** (string): Unique identifier for the option
- **`label`** (string): Display label for the option
- **`description`** (string): Description of the option

### GET `/thread/{threadId}`

Retrieves a conversation thread with its history and last interaction details.

**Path Parameters:**
- **`threadId`** (string): ID of the thread to retrieve

**Response:**
```json
{
  "history": [
    // Array of conversation history items
  ],
  "output": {
    // Generated output from last interaction
  }
}
```

**Response Fields:**
- **`history`** (array): The conversation history
- **`output`** (object): Generated output from last interaction

### POST `/ingest/{namespace}`

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

### GET `/config`

Retrieves the default configuration for the service.

**Response:**
```json
{
  // Complete configuration object
}
```

**Response Fields:**
- Returns the complete default configuration object as defined in the service

## Configuration

Plexus uses a flexible, hierarchical configuration system that supports multiple deployment patterns:

- **Static Configuration**: JSON files in the `config/` directory for base configuration
- **Runtime Configuration**: Dynamic overrides passed as request parameters
- **Flexible Structure**: Configuration can be provided as one large object or divided across multiple files
- **Merge Strategy**: Static and runtime configurations are automatically merged to determine the final runtime configuration

**Note**: Plexus is currently available as a service. While it will be made available as a library in the near future, implementation-specific configuration currently can only be passed as part of the request payload.

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
  "postback": {
    "url": "https://your-callback-url.com",
    "headers": {
      "Authorization": "Bearer token"
    }
  },
  "agents": { /* agent configurations */ },
  "azure": { /* Azure OpenAI settings */ },
  "catalog": { /* field definitions */ },
  "data-sources": { /* data source configurations */ },
  "drive": { /* Google Drive settings */ },
  "firestore": { /* Firestore settings */ },
  "genai": { /* Google GenAI settings */ },
  "input-fields": { /* input field options */ },
  "lancedb": { /* vector database settings */ },
  "openai": { /* OpenAI settings */ },
  "routes": { /* API route definitions */ },
  "storage": { /* internal file storage settings */ }
}
```

## Global Settings

Top-level configuration options that apply across the entire platform:

- **`platform`** (string): Primary AI platform ("google", "azure", "openai")
- **`embeddingPlatform`** (string): AI platform for text embeddings ("google", "azure", "openai")
- **`waitForThreadUpdate`** (boolean): Whether to wait for the conversation thread to be updated before returning a response. Enabling this will increase response time, but will guarantee conversation consistency in scenarios where the `invoke` endpoint is called in quick succession.
- **`instructionsPath`** (string): Root GOOGLE_CLOUD_STORAGE path for agent and digest instruction files
- **`output`** (array): List of output fields to return
- **`postback`** (object): The webhook for receiving status messages during invocation. It will receive POST requests with a payload of the following format: `{ "status": "Some operation", "isRunning": true }`.
  - **`url`** (string): URL
  - **`headers`** (object): Additional HTTP headers, e.g. for authentication

The following top-level configuration options are internal and not relevant when consuming Plexus as a service:
- **`projectId`** (string): Google Cloud Project ID
- **`location`** (string): Default Google Cloud region
- **`tempPath`** (string): Path for temporary files

## Entities

These are the core entities within Plexus: Agents, Data Sources, and the Catalog. Their configuration determine the actual functionality of the implementation.

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
      "required": ["requiredField"]
    }
  }
}
```

**Agent Properties:**
- **`instructions`** (string): GOOGLE_CLOUD_STORAGE path to the file containing the instructions (system prompt) for the agent, or the literal instructions themselves. If omitted, the agent will attempt to read its instructions from a path constructed as follows: `{instructionsPath from global config}/{agent id}.txt`. **Note**: input and output format instructions are automatically added by Plexus, based on the Catalog configuration.
- **`context`** (array): List of context fields the agent should receive.
- **`temperature`** (number, optional): AI model temperature setting (0.0-1.0).
- **`useHistory`** (boolean, optional): Whether to provide the agent with the conversation history.
- **`required`** (array, optional): Required (typically `input`-type) context fields for the agent. If a required field is left empty, the agent will not run and will simply return an empty response object, but the workflow will continue as normal.

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
      "dataSource": "data-source-id",
      "example": [
        { "name": "John", "age": 30 }
      ],
      "query": {
        "filter": { "age": "targetAge" },
        "limit": 5,
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
- **`example`** (any, optional): Example value used to provide instructions to the LLM about how to interpret and/or populate a field

**Input Fields:**
These take their value directly from the request payload.
- **`field`** (string): Name of the field in the request payload
- **`required`** (boolean, optional): Whether the field is required. If `true`, the workflow will return an error if the field is missing from the request payload.

**Output Fields:**
These take their value from the output object of an agent.
- **`agent`** (string): Agent name
- **`field`** (string): Name of the field in the output object

**Data Fields:**
These take their value from a data source.
- **`dataSource`** (string): Data source identifier, points to a data source defined in the `data-sources` section
- **`query`** (object, optional): Properties that determine if and how the data from the data source should be queried. If not specified, the source data will always be used in its entirety (after `target`-based processing applies).
  - **`limit`** (number, optional): Maximum number of results for any type of query.
  - **`input`** (string, optional): Performs a text search against an unstructured data source, using the value of the given catalog field as input.
  - **`filter`** (object, optional): Filter criteria for queries against a structured data source, should consist of key-value pairs, where the key is the field name in the source data set, and the value is the name of a catalog field, which value will be used as the filter value.
  - **`fields`** (array, optional): Specific fields to retrieve when querying a structured data source.
  - **`sort`** (string, optional): Which field to sort by when querying a structured data source.

### `data-sources`

Defines available data sources and their properties:

```json
{
  "data-sources": {
    "source-id": {
      "namespace": "my-namespace",
      "platform": "drive",
      "uri": "https://drive.google.com/drive/folders/someGoogleDriveFolderId",
      "dataType": "text",
      "target": "vector",
      "instructions": "processing-instructions"
    }
  }
}
```

**Data Source Properties:**
- **`uri`** (string): The URI pointing to the data source, can be a Google Drive URL, or a GOOGLE_CLOUD_STORAGE path. A URI can contain catalog field values, of the form `{fielName}`, which makes the data source dynamic.
- **`target`** (string): Target for the data source: "raw" for raw text or data, "vector" for vector embeddings, "file" for unprocessed files (to feed as-is into an LLM, currently supported for Google GenAI only), "digest" for AI-generated summaries ("text" only).
- **`dataType`** (string, optional): Type of data in the source: "text" for unstructured data, "data" for structured data. Required for `target` types: "raw" and "vector". Ignored for `digest` and `file`.
- **`namespace`** (string, optional): Logical grouping namespace, only used for batch ingestion.
- **`platform`** (string, optional): Storage platform ("gcs", "drive", etc.), will be derived from the URI if not specified.
- **`folder`** (boolean, optional): Whether the data source is a folder. Detected if not specified.
- **`cache`** (boolean, optional): Whether to cache the data source, defaults to true. Set this to `false` for data sources of which the content can change between invocations.
- **`instructions`** (string, optional): Processing instructions for a `digest`-type data source.
- **`searchField`** (string, optional): Name of the field against which to perform vector searches for a `data`-type, `vector`-target data source.

### `input-fields`

Defines available options for input fields in your application:

```json
{
  "input-fields": {
    "fieldType": {
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

Field types and options can be customized to match your specific domain and use case requirements.

## Platforms

Configurations for the various AI platforms.

### `azure`

Configuration for Azure OpenAI services:

```json
{
  "azure": {
    "baseUrl": "https://your-resource.openai.azure.com/",
    "apiVersion": "2025-01-01-preview",
    "embeddingApiVersion": "2023-05-15",
    "deploymentName": "gpt-4o-mini",
    "embeddingModel": "text-embedding-ada-002"
  }
}
```

- **`baseUrl`** (string): Azure OpenAI endpoint URL
- **`apiVersion`** (string): API version for chat completions
- **`embeddingApiVersion`** (string): API version for embeddings
- **`deploymentName`** (string): Name of the deployed model
- **`embeddingModel`** (string): Model name for text embeddings

### `genai`

Google Generative AI (Gemini) configuration:

```json
{
  "genai": {
    "model": "gemini-2.5-flash-lite",
    "embeddingModel": "gemini-embedding-001",
    "embeddingLocation": "europe-west1",
    "quotaDelayMs": 500,
    "safetySettings": [
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  }
}
```

- **`model`** (string): Primary model name
- **`embeddingModel`** (string): Embedding model name
- **`embeddingLocation`** (string, optional): Region for embedding API
- **`quotaDelayMs`** (number, optional): Delay between API calls for quota management
- **`safetySettings`** (array): Contents safety configuration
	- **`category`** (string): Safety category
	- **`threshold`** (string): Blocking threshold

### `openai`

OpenAI API configuration:

```json
{
  "openai": {
    "model": "gpt-4o-mini",
    "apiVersion": "2024-11-20",
    "embeddingModel": "text-embedding-3-small"
  }
}
```

- **`model`** (string): Primary model name
- **`apiVersion`** (string): API version
- **`embeddingModel`** (string): Embedding model name

## Internal

Various internal settings which are only relevant when using Plexus as a library.

### `drive`

Google Drive integration settings:

```json
{
  "drive": {
    "tempFolderId": "1GAohqXcRbIyu-Nk86GQxfRBAKAJtq_6y"
  }
}
```

- **`tempFolderId`** (string): Google Drive folder ID for temporary files

### `firestore`

Firestore database settings:

```json
{
  "firestore": {
    "databaseId": "your-database",
    "ignoreUndefinedProperties": true
  }
}
```

- **`databaseId`** (string): Firestore database identifier
- **`ignoreUndefinedProperties`** (boolean): Whether to ignore undefined properties when writing

### `lancedb`

Vector database configuration:

```json
{
  "lancedb": {
    "databaseUri": "gs://your-bucket/lancedb",
    "rateLimitDelayMs": 1000
  }
}
```

- **`databaseUri`** (string): Database URI
- **`rateLimitDelayMs`** (number): Delay between operations for rate limiting

### `routes`

API endpoint definitions with OpenAPI-style specifications:

```json
{
  "routes": {
    "/endpoint": {
      "parameters": {
        "param": {
          "type": "string",
          "description": "Parameter description"
        }
      },
      "methods": {
        "post": {
          "summary": "Endpoint summary",
          "description": "Detailed description",
          "handler": "handlerFunction",
          "payload": {
            "field": {
              "type": "string"
            }
          },
          "response": {
            "type": "object"
          }
        }
      }
    }
  }
}
```

**Route Properties:**
- **`parameters`** (object, optional): URL path parameters
- **`methods`** (object): HTTP methods (get, post, etc.)
- **`hidden`** (boolean, optional): Whether to hide from API documentation

**Method Properties:**
- **`summary`** (string): Brief description
- **`description`** (string): Detailed description  
- **`handler`** (string): Handler function name
- **`payload`** (object, optional): Request payload schema
- **`response`** (object): Response schema

### `storage`

Cloud storage settings:

```json
{
  "storage": {
    "bucket": "your-gcs-bucket"
  }
}
```

- **`bucket`** (string): Google Cloud Storage bucket name

## Configuration Usage

### Runtime Configuration Overrides

Configuration can be overridden at runtime by including a `config` object in request payloads:

```json
{
  "config": {
    "genai": {
      "model": "gemini-2.0-flash-thinking-exp"
    },
    "agents": {
      "draft": {
        "temperature": 0.7
      }
    }
  }
}
```

### Configuration Hierarchy

The configuration system follows this precedence order (highest to lowest):
1. Runtime configuration from request payload
2. Static configuration from JSON files
3. Global configuration defaults
