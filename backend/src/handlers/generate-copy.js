const generate = require('../modules/generate');
const Profiler = require('../utils/Profiler');
const requestContext = require('../utils/request-context');
const presets = require('../../data/copy-generation-presets.json');
const inputFields = {
	brands: require('../../data/fields/brands.json'),
	countries: require('../../data/fields/countries.json'),
	languages: require('../../data/fields/languages.json'),
	offerTypes: require('../../data/fields/offer-types.json'),
	subTheme: require('../../data/fields/sub-theme.json'),
};
const VALID_CONFIG_KEYS = [
	'platform',
	'model',
	'embeddingPlatform',
	'embeddingModel',
	'strategy',
	'forceCopyBasedVectorSearch',
	'ignoreFixedAgentOrder',
	'examplesTopN',
	'brandContextTopN',
	'disableBrandContext',
	'waitForThreadUpdate',
];

module.exports = async function generateCopy(_, {
	prompt,
	brandId,
	campaignId,
	subThemeId,
	merchant,
	product,
	offerTypeId,
	offerAmount,
	isMemberExclusive,
	temperature = 0.5,
	countryId,
	languageId,
	presetId,
	threadId,
	config = {},
}) {
	const preset = presets[presetId];
	
	if (!preset) throw new Error('Invalid presetId');
	
	const context = {
		userRequest: prompt,
		brandId,
		brand: inputFields.brands[brandId].label,
		subTheme: inputFields.subTheme[subThemeId].label,
		merchant,
		product,
		offerType: inputFields.offerTypes[offerTypeId].label,
		offerAmount,
		country: inputFields.countries[countryId ?? 'us'].label,
		language: inputFields.languages[languageId ?? 'en-us'].label,
		temperature,
	};
	
	for (const key in config) if (!VALID_CONFIG_KEYS.includes(key) || config[key] === '') delete config[key];
	// for (const key in options) if (options[key] === '') delete options[key];
	
	let error, responseObject;
	await requestContext.run({ config: { ...config } }, async () => {
		try {
			responseObject = await Profiler.run(() => generate({
				threadId,
				context,
			}), 'total');
		} catch (err) {
			console.error(err);
			error = err;
		}
	});
	
	return {
		error,
		...(responseObject ?? {}),
		meta: {
			...(responseObject?.meta ?? {}),
			generationInfo: {
				...(responseObject?.meta?.generationInfo ?? {}),
				prompt,
				brandId,
				temperature,
				languageId,
				presetId,
				config,
			}
		}
	};
};
