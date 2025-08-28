import google from './src/services/google.js';

async function testEmbeddings() {
    console.log('Testing Google GenAI embeddings with strings and records...\n');
    
    try {
        // Test with string input
        console.log('1. Testing with string input:');
        const stringInput = "This is a sample text for embedding generation.";
        const stringEmbedding = await google.generateDocumentEmbeddings(stringInput);
        console.log(`   String embedding dimensions: ${stringEmbedding.length}`);
        console.log(`   First 5 values: [${stringEmbedding.slice(0, 5).join(', ')}...]`);
        
        // Test with record input
        console.log('\n2. Testing with record input:');
        const recordInput = {
            title: "Sample Document",
            content: "This is the main content of the document.",
            author: "John Doe",
            tags: ["sample", "test", "embedding"],
            metadata: {
                created: "2024-01-01",
                category: "test"
            },
            empty_field: "",
            null_field: null
        };
        
        const recordEmbedding = await google.generateDocumentEmbeddings(recordInput);
        console.log(`   Record embedding dimensions: ${recordEmbedding.length}`);
        console.log(`   First 5 values: [${recordEmbedding.slice(0, 5).join(', ')}...]`);
        
        // Test with query embeddings
        console.log('\n3. Testing query embeddings with record:');
        const queryRecord = {
            query: "Find documents about embedding generation",
            filters: ["AI", "machine learning"]
        };
        
        const queryEmbedding = await google.generateQueryEmbeddings(queryRecord);
        console.log(`   Query embedding dimensions: ${queryEmbedding.length}`);
        console.log(`   First 5 values: [${queryEmbedding.slice(0, 5).join(', ')}...]`);
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
}

testEmbeddings();
