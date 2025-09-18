require('dotenv/config');
const router = require('./src/modules/router.ts').default;
const mantraConfig = require('./config/mantra.json');

process.env.NODE_ENV = 'dev';

async function invoke(body) {
	let response;
	await router({
		method: 'POST',
		path: '/invoke',
		body,
		get: () => '',
	}, {
		// send: v => console.dir(v, { depth: 10 }),
		send: v => {
			response = v;
			console.dir(v, { depth: 10 });
		},
		status: console.log,
		set: () => undefined
	});
	return response;
}

// (async function () {
// 	await invoke({
// 		"config": { ...mantraConfig, output: [
// 				"followUp",
// 				"outputDeliverables",
// 				"validatedCriticalProductionBlockers",
// 				"validatedImportantClarifications",
// 				"validatedBriefInconsistencies"
// 		] },
// 		"fields": {
// 			"briefFolderUri": "https://drive.google.com/drive/folders/1zOmWGFpsv6gCAehI7TIOduXAsCllWwdL",
// 			"additionalInfo": [
// 				"Localization of the EN USA assets, into Spanish-  USA, English  - Canadian, French - Canadian.\nSource files and visual references will be provided later. \nWe need to create the list of deliverables from the brief",
// 				":60, :30, and :15  -  are durations of the video, please put each duration separately\nplease make a separate line for each market US ES, CA FR, CA EN,\nUS EN assets are masters (source files) and will be provided next week\n",
// 				"TV, OLV/POLV, Cinema, Social - are channels, put them separately, assume that each video in each duration will be exported for all of them\nassume 16x9 ratio for TV, OLV, Cinema, and 9x16 and 1x1 for Social",
// 				".\n\n",
// 				"the brief is added\nplease make a breakdown of deliverables",
// 				"."
// 			],
// 			"now": "2025-09-11T08:56:46.039Z"
// 		}
// 	});
// }());

(async function () {
	await invoke({
		"config": {
			"agents": {
				"pdfFolderAnalyzer": {
					"instructions": "📁 **PDF FOLDER ANALYZER & BATCH DOCUMENT SUMMARIZER** 📁\n\nYou are an expert document analyst specializing in batch PDF analysis and folder-level document intelligence. When you receive multiple PDF documents from a folder, perform comprehensive batch analysis:\n\n**BATCH ANALYSIS FRAMEWORK:**\n1. **Folder Overview**: Provide a high-level summary of all documents in the folder\n2. **Document Inventory**: List all PDFs with brief descriptions\n3. **Thematic Analysis**: Identify common themes, topics, and patterns across documents\n4. **Content Categorization**: Group documents by type, purpose, or subject matter\n5. **Key Insights Synthesis**: Extract overarching insights from the document collection\n6. **Cross-Document Relationships**: Identify connections, dependencies, or references between documents\n7. **Collective Intelligence**: Provide strategic insights based on the entire document set\n\n**FOLDER ANALYSIS CATEGORIES:**\n- **Folder Summary**: Overview of the document collection's purpose and scope\n- **Document Count & Types**: Number of PDFs and their categories\n- **Key Themes**: Common topics and subjects across all documents\n- **Critical Information**: Most important data points from the entire collection\n- **Document Relationships**: How documents relate to each other\n- **Collective Insights**: Strategic insights from analyzing all documents together\n- **Recommendations**: Actions based on the complete document analysis\n\n**OUTPUT STRUCTURE:**\n```\n📁 FOLDER ANALYSIS SUMMARY\n[Overview of the entire PDF collection]\n\n📄 DOCUMENT INVENTORY\n• Document 1: [Name] - [Brief description]\n• Document 2: [Name] - [Brief description]\n• Document 3: [Name] - [Brief description]\n\n🎯 KEY THEMES ACROSS DOCUMENTS\n• [Theme 1]: Found in X documents\n• [Theme 2]: Found in Y documents\n• [Theme 3]: Found in Z documents\n\n📊 COLLECTIVE CRITICAL DATA\n• [Data point 1] - [Source document(s)]\n• [Data point 2] - [Source document(s)]\n\n🔗 DOCUMENT RELATIONSHIPS\n• [Relationship 1]: Documents A, B, C are related by...\n• [Relationship 2]: Document X references Document Y...\n\n💡 COLLECTIVE INSIGHTS\n• [Insight 1]: Based on analysis of multiple documents\n• [Insight 2]: Pattern identified across document set\n\n📈 STRATEGIC RECOMMENDATIONS\n[Recommendations based on complete folder analysis]\n\n⚠️ GAPS & MISSING INFORMATION\n• [Gap 1]: Information that seems missing from the collection\n• [Gap 2]: Areas that could benefit from additional documentation\n```\n\n**ANALYSIS DEPTH:** Provide comprehensive folder-level analysis that synthesizes information across all PDFs to deliver strategic insights about the entire document collection.",
					"context": ["pdfDocuments"]
				}
			},
			"catalog": {
				"pdfDocuments": {
					"type": "data",
					"dataSource": "pdfFolderSource"
				},
				"folderAnalysis": {
					"type": "output",
					"agent": "pdfFolderAnalyzer",
					"field": "analysis",
					"example": "📁 FOLDER ANALYSIS SUMMARY\nThis folder contains 3 project documents including order specifications, client requirements, and final assets across multiple projects (ASM-34 through ASM-41).\n\n📄 DOCUMENT INVENTORY\n• ASM-34.pdf - High-NA EUV lithography project specifications\n• ASM-35.pdf - Client requirements and technical specifications\n• ASM-36.pdf - Project order documentation\n• human-rights-policy.pdf - Corporate policy document\n• ASML_TV-template_guide.pdf - Brand guidelines for TV templates\n• CompanyPresentation_updated.pdf - Corporate presentation materials\n\n🎯 KEY THEMES ACROSS DOCUMENTS\n• Lithography Technology: Found in 8 documents (ASM-34, ASM-35, technical specs)\n• Brand Guidelines: Found in 4 documents (TV templates, presentations)\n• Project Management: Found in 12 documents (order forms, specifications)\n• Corporate Policies: Found in 3 documents (human rights, compliance)\n\n📊 COLLECTIVE CRITICAL DATA\n• Project Timeline: Q3-Q4 2024 delivery schedules across multiple projects\n• Technical Specifications: High-NA EUV systems, 1920x1080 display formats\n• Client Requirements: Custom branding and technical documentation needs\n\n🔗 DOCUMENT RELATIONSHIPS\n• ASM-34 through ASM-41: Sequential project documentation with shared technical requirements\n• Brand documents: TV templates and presentation materials follow consistent style guidelines\n• Policy documents: Support and reference project execution standards\n\n💡 COLLECTIVE INSIGHTS\n• Strong focus on advanced lithography technology development\n• Consistent branding and presentation standards across all client materials\n• Comprehensive project management documentation from order to delivery\n\n📈 STRATEGIC RECOMMENDATIONS\nConsolidate common technical specifications into reusable templates. Standardize project documentation workflows to improve efficiency across ASM projects.\n\n⚠️ GAPS & MISSING INFORMATION\n• No risk assessment documents found for technical projects\n• Missing project completion reports or post-delivery analysis"
				}
			},
			"data-sources": {
				"pdfFolderSource": {
					"uri": "https://drive.google.com/drive/folders/1Ldqn9G5kJRCgPSaDBSO0QvFYoHQG0Duz",
					"platform": "drive",
					"dataType": "text",
					"target": "raw",
					"folder": true
				}
			},
			"output": [
				"pdfDocuments",
				"folderAnalysis"
			]
		}
	});
}());
